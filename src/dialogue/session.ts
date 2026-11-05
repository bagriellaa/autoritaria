import { Story } from 'inkjs';
import compiled from './townspeople.json';
import { PEOPLE, type PersonId } from '../content';
import { runEvents } from '../game/narrative';
import type { GameState } from '../game/model';

export interface DialogueChoice { index: number; text: string }
export interface DialogueEntry { speaker: 'player' | 'npc'; text: string }
const TOPIC_NAMES:Record<string,string>={bairro:'a vida no bairro',loja:'a história da loja',memoria:'as pessoas que partiram',noticias:'as notícias',trabalho:'o trabalho na estação',entregas:'os fornecedores',rio:'a ponte do rio',fronteira:'a fronteira',cidade:'as janelas da cidade',origem:'as lembranças de Véspera',viagem:'os planos de viagem',cha:'um chá no fim do dia',segredo:'a preocupação com o irmão',cartas:'as cartas da fronteira',rua:'os moradores da rua',rotina:'o trabalho do correio',oficina:'os uniformes da escola',casaco:'um casaco antigo',negocio:'as dificuldades do comércio',descanso:'a horta de casa',oficio:'o aprendizado na oficina',tarde:'uma tarde livre',tomas:'Tomas'};

/** Ink owns text/conditions/branching; the adapter owns persisted game effects.
 * Existing boolean flags and NPC memories reconstruct context on reopening.
 * Every topic has one durable resolution, preventing relationship farming. */
export class DialogueSession {
  private story = new Story(compiled);
  text=''; choices:DialogueChoice[]=[]; ended=false; feedback='';
  history:DialogueEntry[]=[];
  constructor(public readonly state:GameState,public readonly person:PersonId){
    this.syncVariables();this.story.ChoosePathString(person);this.read();
  }
  get relationship(){return this.state.relations[this.person];}
  get name(){return PEOPLE[this.person].name;}
  get role(){return PEOPLE[this.person].role;}
  private syncVariables(){const s=this.state;for(const [key,value] of Object.entries({day:s.day,trust:this.relationship.trust,affinity:this.relationship.affinity,female:s.gender==='female',helped_mira:!!s.flags.helped_mira,refused_mira:!!s.flags.refused_mira,tea_promised:!!s.flags['dialogue.elena.cha.warm']}))this.story.variablesState.$(key,value);}
  private apply(tag:string){
    const match=tag.match(/^effect:\s*([a-z_]+):(warm|neutral|cold)$/);if(!match)return false;
    const [,topic,tone]=match,key=`dialogue.${this.person}.${topic}`;
    if(this.state.flags[key]){this.feedback='Uma lembrança que vocês já compartilharam.';return true;}
    this.state.flags[key]=true;this.state.flags[`${key}.${tone}`]=true;
    const r=this.relationship,trust=tone==='warm'?1:tone==='cold'?-1:0,affinity=tone==='warm'?1:0;
    r.trust+=trust;r.affinity+=affinity;
    const memory=`Conversou sobre ${TOPIC_NAMES[topic]||topic} com ${tone==='warm'?'acolhimento':tone==='cold'?'distância':'atenção'}.`;
    r.memories.push(memory);this.state.daily.notes.push(`${this.name}: ${memory}`);
    if(this.state.customer?.id===this.person)this.state.customer.talked=true;
    this.feedback=tone==='warm'?'Confiança +1 · Afinidade +1':tone==='cold'?'Confiança −1':'Uma nova lembrança compartilhada.';
    runEvents(this.state);this.syncVariables();return true;
  }
  private read(){
    const lines:string[]=[];let affected=false;
    while(this.story.canContinue){const line=this.story.Continue()?.trim();if(line)lines.push(line);for(const tag of this.story.currentTags||[])affected=this.apply(tag)||affected;}
    if(affected){this.syncVariables();this.story.ChoosePathString(`${this.person}_menu`);while(this.story.canContinue)this.story.Continue();}
    this.text=lines.join('\n\n');this.choices=this.story.currentChoices.map(c=>({index:c.index,text:c.text.trim()}));this.ended=this.choices.length===0&&!this.story.canContinue;
    if(this.text)this.history.push({speaker:'npc',text:this.text});
  }
  choose(index:number){if(!Number.isInteger(index)||!this.choices.some(c=>c.index===index)||this.ended)return false;const choice=this.choices.find(c=>c.index===index)!;this.history.push({speaker:'player',text:choice.text});this.feedback='';this.story.ChooseChoiceIndex(index);this.read();return true;}
}
