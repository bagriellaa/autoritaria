import type { GameState } from './model';
import type { PersonId } from '../content';
type Condition = { dayAtLeast?: number; flag?: string; trust?: { person: PersonId; min: number } };
type Effect = { flag?: string; note?: string; trust?: { person: PersonId; amount: number }; affinity?: { person: PersonId; amount: number } };
export function matches(s: GameState, c: Condition) { return (!c.dayAtLeast || s.day >= c.dayAtLeast) && (!c.flag || !!s.flags[c.flag]) && (!c.trust || s.relations[c.trust.person].trust >= c.trust.min); }
export function effect(s: GameState, e: Effect) { if(e.flag) s.flags[e.flag] = true; if(e.note && !s.daily.notes.includes(e.note)) s.daily.notes.push(e.note); if(e.trust) s.relations[e.trust.person].trust += e.trust.amount; if(e.affinity) s.relations[e.affinity.person].affinity += e.affinity.amount; }
const EVENTS: { id: string; when: Condition; effects: Effect[] }[] = [
  { id: 'mira_returns', when: { dayAtLeast: 3, flag: 'helped_mira' }, effects: [{ note: 'Mira contou aos vizinhos que você a ajudou.' }, { trust: { person: 'tomas', amount: 1 } }] },
  { id: 'elena_friend', when: { trust: { person: 'elena', min: 3 } }, effects: [{ note: 'Elena passou a considerar você uma amizade de confiança.' }] }
];
export function runEvents(s: GameState) { for (const e of EVENTS) if (!s.flags[e.id] && matches(s,e.when)) { s.flags[e.id] = true; e.effects.forEach(x=>effect(s,x)); } }
export function greeting(s: GameState, id: PersonId) {
  const welcome = s.gender === 'female' ? 'Bem-vinda' : 'Bem-vindo';
  if (id === 'mira') {
    if(s.day === 2) return 'O remédio ficou mais caro este mês. Hoje só tenho metade do valor do pão. Poderia me ajudar?';
    if(s.flags.helped_mira) return 'Não esqueci o que fez por mim. Falei da sua loja para Tomas. Ainda há gente boa nesta rua.';
    if(s.flags.refused_mira) return 'Bom dia. Hoje trouxe o dinheiro contado. Não quero incomodar.';
    return `${welcome} à rua das tílias. Moro na casa verde. Uma loja não vive só de mercadorias, sabe? Vive de quem volta.`;
  }
  if(id === 'tomas') return s.day === 1 ? 'Trabalho na estação. Um pão quentinho torna qualquer turno melhor. Se precisar de alguém para carregar as caixas, pode contar comigo.' : 'O trem de Véspera atrasou outra vez. Dizem que estão revistando tudo na fronteira. Por aqui, ainda seguimos trabalhando.';
  if(id === 'elena') {
    if(s.day >= 3 && s.rules.ration) return 'Meu cartão venceu ontem e a repartição estava fechada. É só um pão. Você me conhece... mas entendo o risco.';
    return s.relations.elena.affinity > 0 ? 'Lembrei da nossa conversa. Um dia quero conhecer os lugares de onde você veio. Podemos tomar um chá quando fechar?' : 'Você veio de Véspera? Minha avó nasceu lá. Talvez tenhamos mais coisas em comum do que parece. Como está se adaptando?';
  }
  return { ivo: 'Passei a manhã entregando cartas. Um chá ao fim do turno é tudo de que preciso.', ana: 'A oficina está cheia de encomendas. Gosto de comprar perto de casa.', lucas: 'Estou aprendendo o ofício na estação. Hoje consegui sair um pouco mais cedo.' }[id];
}
