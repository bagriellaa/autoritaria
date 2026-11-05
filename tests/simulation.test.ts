import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS, PRODUCT_IDS, PEOPLE, WORLD, PROLOGUE, sceneImage, type PersonId, type ProductId } from '../src/content';
import { createGame, money, random, type GameState, type Mode } from '../src/game/model';
import { Simulation } from '../src/game/simulation';
import { effect, greeting, matches, runEvents } from '../src/game/narrative';
import { validateSave, readSave, writeSave } from '../src/game/persistence';

function game(mode: Mode = 'story') { return new Simulation(createGame(mode, 'female')); }
function owned(s: GameState, id: ProductId) { return s.stock[id] + Number(s.held === id) + Number(s.tray === id); }
function queue(sim: Simulation, id: PersonId = 'mira', product: ProductId = 'bread') {
  sim.open();
  sim.state.customer = { id, product, phase: 'queue', x: 1.1, z: -1.65, waypoint: 6, wait: 0, inspected: false, talked: false,
    document: { name: PEOPLE[id].name, country: WORLD.country, validUntil: sim.state.day + 30 }, special: 'normal' };
  return sim.state.customer;
}
function prepareSale(sim: Simulation, id: PersonId = 'mira', product: ProductId = 'bread') {
  const customer = queue(sim, id, product);
  assert.equal(sim.take(product), true);
  sim.transfer();
  return customer;
}

test('manipular, trocar e devolver produtos conserva as unidades e não mistura o inventário pessoal', () => {
  const sim = game(), s = sim.state, initial = Object.fromEntries(PRODUCT_IDS.map(id => [id, owned(s, id)]));
  const personal = [...s.personal];
  sim.take('bread'); sim.transfer(); sim.take('milk'); sim.transfer();
  assert.equal(s.held, 'bread'); assert.equal(s.tray, 'milk');
  assert.equal(sim.take('tea'), false);
  sim.take('bread'); sim.transfer(); sim.take('milk');
  for (const id of PRODUCT_IDS) assert.equal(owned(s, id), initial[id]);
  assert.equal(s.held, null); assert.equal(s.tray, null); assert.deepEqual(s.personal, personal);
});

test('prateleira vazia e compra sem saldo não geram estoque, transação ou débito', () => {
  const sim = game(); sim.state.stock.bread = 0; sim.state.money = 119;
  const before = structuredClone(sim.state);
  assert.equal(sim.take('bread'), false); assert.equal(sim.buy('bread', 1), false);
  assert.deepEqual(sim.state, before);
});

test('reposição contabiliza custo inteiro, incluindo mercadoria em mãos e na bandeja', () => {
  const sim = game(), s = sim.state;
  sim.take('bread'); sim.transfer(); sim.take('bread');
  const count = owned(s, 'bread'), balance = s.money, oldBasis = s.basis.bread;
  s.day = 2;
  const unit = sim.wholesale('bread');
  assert.equal(sim.buy('bread', 4), true);
  assert.equal(owned(s, 'bread'), count + 4); assert.equal(s.money, balance - unit * 4);
  assert.equal(s.daily.purchases, unit * 4);
  assert.equal(s.basis.bread, Math.round((oldBasis * count + unit * 4) / (count + 4)));
  assert.equal(s.transactions.length, 1); assert.equal(s.transactions[0].amount, -unit * 4);
});

test('quantidades inválidas e compras após fechamento não alteram o estado', () => {
  const sim = game();
  for (const qty of [0, -1, 1.5, 21, NaN, Infinity]) {
    const before = structuredClone(sim.state); assert.equal(sim.buy('milk', qty), false); assert.deepEqual(sim.state, before);
  }
  sim.open(); sim.close(); const closed = structuredClone(sim.state);
  assert.equal(sim.buy('milk', 4), false); assert.deepEqual(sim.state, closed);
});

test('venda exige produto correto no balcão e é aplicada uma única vez', () => {
  const sim = game(), s = sim.state; queue(sim);
  const initialMoney = s.money, initialBread = owned(s, 'bread');
  assert.equal(sim.sell('normal').ok, false);
  sim.take('milk'); sim.transfer(); assert.equal(sim.sell('normal').ok, false);
  sim.transfer(); sim.take('milk'); sim.take('bread'); sim.transfer();
  assert.equal(sim.sell('normal').ok, true);
  assert.equal(owned(s, 'bread'), initialBread - 1); assert.equal(s.money, initialMoney + PRODUCTS.bread.price);
  assert.equal(s.daily.revenue, PRODUCTS.bread.price); assert.equal(s.daily.cogs, PRODUCTS.bread.cost);
  const after = structuredClone(s);
  assert.equal(sim.sell('normal').ok, false); assert.deepEqual(s, after);
});

test('desconto de preço ímpar usa centavos inteiros e altera confiança', () => {
  const sim = game(), s = sim.state; s.day = 2; s.prices.bread = 251;
  const c = prepareSale(sim); c.special = 'need';
  assert.equal(sim.sell('normal').ok, false);
  const before = s.money;
  assert.equal(sim.sell('discount').ok, true);
  assert.equal(s.money - before, 126); assert.equal(s.daily.revenue, 126);
  assert.equal(s.relations.mira.trust, 2); assert.equal(s.flags.helped_mira, true);
  assert.equal(money(126), 'C$ 1,26'); assert.equal(Number.isSafeInteger(s.money), true);
});

test('doação consome produto, registra custo e não inventa receita', () => {
  const sim = game(), s = sim.state, initialMoney = s.money, initialBread = owned(s, 'bread');
  prepareSale(sim); assert.equal(sim.sell('gift').ok, true);
  assert.equal(s.money, initialMoney); assert.equal(owned(s, 'bread'), initialBread - 1);
  assert.equal(s.daily.revenue, 0); assert.equal(s.daily.cogs, PRODUCTS.bread.cost);
  assert.equal(s.relations.mira.trust, 3); assert.equal(s.transactions[0].kind, 'gift');
});

test('racionamento exige inspeção, nome, país, validade e limite diário', () => {
  const sim = game(), s = sim.state; s.day = 3; s.rules.ration = true;
  const c = prepareSale(sim, 'tomas');
  assert.equal(sim.sell('normal').ok, false); sim.inspect();
  c.document.name = 'Outra pessoa'; assert.equal(sim.validDocument(), false);
  c.document.name = PEOPLE.tomas.name; c.document.country = WORLD.origin; assert.equal(sim.validDocument(), false);
  c.document.country = WORLD.country; c.document.validUntil = 2; assert.equal(sim.validDocument(), false);
  c.document.validUntil = 3; assert.equal(sim.validDocument(), true); assert.equal(sim.sell('normal').ok, true);
  prepareSale(sim, 'tomas'); sim.inspect(); assert.equal(sim.validDocument(), false);
  assert.equal(sim.sell('normal').ok, false); assert.equal(s.daily.rationSales.tomas, 1);
});

test('venda irregular de cartão vencido persiste suspeita, confiança e multa sem duplicar fechamento', () => {
  const sim = game(), s = sim.state; s.day = 3; s.rules.ration = true;
  const c = prepareSale(sim, 'elena'); c.document.validUntil = 2; sim.inspect();
  const before = s.money; assert.equal(sim.sell('illegal').ok, true);
  assert.equal(s.suspicion, 1); assert.equal(s.flags.broke_rule, true); assert.equal(s.relations.elena.trust, 2);
  sim.close(); assert.equal(s.money, before + PRODUCTS.bread.price - 650 - 800);
  const closed = structuredClone(s); sim.close(); assert.deepEqual(s, closed);
});

test('venda irregular por nome ou país incorretos também aumenta suspeita', () => {
  for (const field of ['name', 'country'] as const) {
    const sim = game(); sim.state.day = 3; sim.state.rules.ration = true;
    const c = prepareSale(sim, 'elena'); c.document[field] = 'Inválido'; sim.inspect();
    assert.equal(sim.validDocument(), false); assert.equal(sim.sell('illegal').ok, true);
    assert.equal(sim.state.suspicion, 1, `Documento com ${field} incorreto deve contar como infração`);
    assert.equal(sim.state.flags.broke_rule, true);
  }
});

test('recusa preserva mercadoria e saldo, reduz confiança e não pode ser repetida', () => {
  const sim = game(), s = sim.state; s.day = 2;
  const c = prepareSale(sim); c.special = 'need'; const balance = s.money, count = owned(s, 'bread');
  assert.equal(sim.sell('refuse').ok, true); assert.equal(s.money, balance); assert.equal(owned(s, 'bread'), count);
  assert.equal(s.relations.mira.trust, -1); assert.equal(s.flags.refused_mira, true);
  assert.equal(s.customer?.phase, 'leaving'); const after = structuredClone(s);
  assert.equal(sim.sell('refuse').ok, false); assert.deepEqual(s, after);
});

test('campanha percorre três dias, aplica inflação e termina preservando consequências', () => {
  const sim = game(), s = sim.state;
  s.flags.helped_mira = true; const day1Cost = sim.wholesale('bread');
  sim.open(); sim.close(); sim.nextDay();
  assert.equal(s.day, 2); assert.equal(s.phase, 'preparation'); assert.equal(s.rules.ration, false);
  assert.ok(sim.wholesale('bread') > day1Cost);
  sim.open(); sim.close(); sim.nextDay();
  assert.equal(s.day, 3); assert.equal(s.rules.ration, true); assert.equal(s.flags.mira_returns, true);
  assert.equal(s.relations.tomas.trust, 1);
  sim.open(); sim.close(); sim.nextDay();
  assert.equal(s.phase, 'complete'); assert.equal(s.day, 3);
  const done = structuredClone(s); sim.nextDay(); assert.deepEqual(s, done);
});

test('modo infinito ultrapassa o dia três usando os mesmos sistemas', () => {
  const sim = game('endless'), s = sim.state;
  for (let day = 1; day <= 7; day++) { assert.equal(s.day, day); sim.open(); sim.close(); sim.nextDay(); }
  assert.equal(s.day, 8); assert.equal(s.phase, 'preparation'); assert.equal(s.prologue.complete, true);
  assert.equal(s.transactions.filter(t => t.kind === 'expense').length, 7);
  assert.equal(s.money, 8500 - 7 * 650);
});

test('eventos condicionais e conversas não reaplicam efeitos a cada atualização', () => {
  const sim = game(), s = sim.state; queue(sim, 'elena'); sim.talk('warm'); sim.talk('warm');
  assert.equal(s.relations.elena.trust, 1); assert.equal(s.relations.elena.affinity, 1);
  effect(s, { flag: 'helped_mira' }); s.day = 3;
  assert.equal(matches(s, { dayAtLeast: 3, flag: 'helped_mira' }), true);
  runEvents(s); runEvents(s); assert.equal(s.relations.tomas.trust, 1);
  assert.equal(s.daily.notes.filter(n => n.includes('Mira contou')).length, 1);
  assert.match(greeting(s, 'mira'), /Não esqueci/);
});

test('NPC percorre entrada, prateleira, espera e saída, retomando o percurso após serialização', () => {
  const sim = game(); sim.open(); sim.tick(1.1);
  assert.ok(sim.state.customer); assert.equal(sim.state.customer.phase, 'entering');
  for (let i = 0; i < 60; i++) sim.tick(0.1);
  const saved = validateSave(JSON.parse(JSON.stringify(sim.state)));
  assert.ok(saved); const restored = new Simulation(saved);
  let sawBrowsing = false;
  for (let i = 0; i < 600 && String(sim.state.customer?.phase) !== 'queue'; i++) {
    sim.tick(0.1); restored.tick(0.1); sawBrowsing ||= String(sim.state.customer?.phase) === 'browsing';
  }
  assert.equal(sawBrowsing, true); assert.equal(sim.state.customer?.phase, 'queue'); assert.deepEqual(restored.state, sim.state);
  sim.sell('refuse');
  for (let i = 0; i < 300 && sim.state.customer; i++) sim.tick(0.1);
  assert.equal(sim.state.customer, null);
});

test('espera excessiva faz o cliente desistir sem alterar saldo ou estoque', () => {
  const sim = game(); queue(sim); const balance = sim.state.money, stock = { ...sim.state.stock };
  sim.tick(171); assert.equal(sim.state.customer?.phase, 'leaving'); assert.equal(sim.state.money, balance);
  assert.deepEqual(sim.state.stock, stock); assert.ok(sim.state.daily.notes.some(n => n.includes('desistiu')));
});

test('geração aleatória permanece determinística ao salvar e restaurar a semente', () => {
  const first = createGame('endless', 'male'); random(first); random(first);
  const restored = JSON.parse(JSON.stringify(first)) as GameState;
  assert.deepEqual(Array.from({ length: 20 }, () => random(first)), Array.from({ length: 20 }, () => random(restored)));
});

test('manifesto narrativo possui nove cenas e quinze caminhos individuais coerentes', () => {
  assert.equal(PROLOGUE.length, 9); const paths = new Set<string>();
  PROLOGUE.forEach((scene, i) => {
    assert.ok(scene.texts.length > 0); assert.equal(scene.next, i === 8 ? null : i + 1);
    paths.add(sceneImage(i, 'female')); paths.add(sceneImage(i, 'male'));
    if ([0, 2, 3].includes(i)) assert.equal(sceneImage(i, 'female'), sceneImage(i, 'male'));
    else assert.notEqual(sceneImage(i, 'female'), sceneImage(i, 'male'));
  });
  assert.equal(paths.size, 15);
});

test('save JSON conserva gênero, prólogo, bandeja, NPC, escolhas e transações', () => {
  const sim = game(), s = sim.state; s.gender = 'male'; s.prologue = { complete: false, scene: 4, line: 2, history: ['Então fiz as malas.'] };
  sim.buy('milk', 2); sim.take('tea'); sim.transfer(); queue(sim, 'tomas', 'tea'); sim.talk('warm');
  s.flags.helped_mira = true; s.player = { x: 1, z: 2, yaw: 0.3, pitch: -0.2 };
  assert.deepEqual(validateSave(JSON.parse(JSON.stringify(s))), s);
});

test('validação rejeita formatos incompatíveis, saldo fracionário e produto negativo', () => {
  for (const value of [null, {}, { ...createGame('story', 'female'), version: 2 }, { ...createGame('story', 'female'), money: 1.1 }]) assert.equal(validateSave(value), null);
  const s = createGame('story', 'female'); s.stock.bread = -1; assert.equal(validateSave(s), null);
});

test('validação rejeita dados internos corrompidos antes que quebrem a simulação', () => {
  const bad: Array<[string, (s: any) => void]> = [
    ['cliente desconhecido', s => { s.customer = { id: 'inexistente', phase: 'queue' }; }],
    ['notas ausentes', s => { delete s.daily.notes; }],
    ['receita não numérica', s => { s.daily.revenue = 'inválida'; }],
    ['linha de prólogo negativa', s => { s.prologue.line = -1; }],
    ['histórico com objeto', s => { s.prologue.history = [{}]; }],
    ['confiança não numérica', s => { s.relations.mira.trust = null; }],
    ['transação sem campos', s => { s.transactions = [{}]; }],
    ['custo negativo', s => { s.basis.bread = -5; }],
  ];
  for (const [label, mutate] of bad) { const s = createGame('story', 'female'); mutate(s); assert.equal(validateSave(s), null, label); }
});

test('persistência do navegador salva, recupera e tolera JSON inválido', async () => {
  const values = new Map<string, string>();
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {} });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); }
  } });
  try {
    const s = createGame('endless', 'male'); await writeSave(s); assert.deepEqual(await readSave(), s);
    for (const key of values.keys()) values.set(key, '{not json');
    assert.equal(await readSave(), null);
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow); else Reflect.deleteProperty(globalThis, 'window');
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage); else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});
