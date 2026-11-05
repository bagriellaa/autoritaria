import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame } from '../src/game/model';
import { DialogueSession } from '../src/dialogue/session';
import { PEOPLE, type PersonId } from '../src/content';

test('Ink oferece pelo menos quatro tópicos ramificados para cada morador',()=>{
  for(const person of Object.keys(PEOPLE) as PersonId[]){const session=new DialogueSession(createGame('story','female'),person);assert.ok(session.text.length>40);assert.ok(session.choices.length>=5);session.choose(0);assert.equal(session.choices.length,3);assert.ok(session.text.length>30);session.choose(0);assert.ok(session.choices.length>=5);assert.ok(session.relationship.trust>0);assert.equal(session.ended,false);}
});
test('consequências persistem em JSON e não podem ser cultivadas ao reabrir ou mudar de resposta',()=>{
  const state=createGame('story','female');const session=new DialogueSession(state,'mira');session.choose(0);session.choose(0);assert.equal(state.relations.mira.trust,1);assert.equal(state.relations.mira.affinity,1);assert.equal(state.relations.mira.memories.length,1);
  const recovered=JSON.parse(JSON.stringify(state));const second=new DialogueSession(recovered,'mira');second.choose(0);second.choose(2);assert.equal(recovered.relations.mira.trust,1);assert.equal(recovered.relations.mira.memories.length,1);assert.ok(recovered.flags['dialogue.mira.bairro.warm']);assert.equal(recovered.flags['dialogue.mira.bairro.cold'],undefined);
});
test('Ink condiciona falas a dia, gênero e ajuda prévia',()=>{
  const state=createGame('story','male');assert.match(new DialogueSession(state,'mira').text,/Bem-vindo/);state.day=2;assert.match(new DialogueSession(state,'mira').text,/pensão/);state.flags.helped_mira=true;assert.match(new DialogueSession(state,'mira').text,/ajudou/);assert.match(new DialogueSession(state,'tomas').text,/fronteira/);
});
test('três conversas acolhedoras desbloqueiam o assunto íntimo de Elena na própria sessão',()=>{
  const state=createGame('story','female');const session=new DialogueSession(state,'elena');assert.equal(session.choices.some(c=>c.text.includes('preocupada')),false);
  for(const topic of [0,1,2]){session.choose(topic);session.choose(0);}
  assert.equal(state.relations.elena.trust,3);assert.ok(session.choices.some(c=>c.text.includes('preocupada')));
  const secret=session.choices.find(c=>c.text.includes('preocupada'))!;session.choose(secret.index);assert.match(session.text,/irmão/);
});
test('promessa de chá modifica saudação futura sem movimentar saldo ou estoque',()=>{
  const state=createGame('story','female'),money=state.money,stock={...state.stock};const session=new DialogueSession(state,'elena');session.choose(3);session.choose(0);assert.ok(state.flags['dialogue.elena.cha.warm']);assert.match(new DialogueSession(state,'elena').text,/convite/);assert.equal(state.money,money);assert.deepEqual(state.stock,stock);
});
test('resposta distante tem custo relacional e sair não inventa efeito',()=>{
  const state=createGame('story','female');const session=new DialogueSession(state,'tomas');session.choose(0);session.choose(2);assert.equal(state.relations.tomas.trust,-1);const before=JSON.stringify(state);assert.equal(session.choose(999),false);session.choose(session.choices.length-1);assert.equal(session.ended,true);assert.equal(JSON.stringify(state),before);
});
