import { DialogueSession } from '../dialogue/session';
import './conversation.css';

interface ConversationOptions {
  portrait?:string;
  textSpeed?:number;
  instant?:boolean;
  onClose:()=>void;
  onChange:()=>void;
  onTrade?:()=>void;
  onSound?:()=>void;
}
export class ConversationView {
  readonly element:HTMLDivElement;
  private textNode:HTMLElement;private choicesNode:HTMLElement;private timer=0;private index=0;private chars:string[]=[];private closed=false;private historyOpen=false;
  private keyHandler=(e:KeyboardEvent)=>{
    if(this.closed)return;
    if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();if(this.historyOpen){this.historyOpen=false;this.render();}else this.close();return;}
    if(['Space','Enter','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if(e.repeat||this.historyOpen)return;if(this.index<this.chars.length){this.complete();return;}if(e.code==='Enter'&&e.target instanceof HTMLButtonElement&&this.element.contains(e.target)){e.target.click();return;}const number=Number(e.key);if(number>=1&&number<=6)this.choose(number-1);}
  };
  constructor(public readonly session:DialogueSession,private options:ConversationOptions){
    this.element=document.createElement('div');this.element.className='conversation-overlay';this.element.setAttribute('role','dialog');this.element.setAttribute('aria-modal','true');this.element.setAttribute('aria-label',`Conversa com ${session.name}`);
    this.element.innerHTML=`<div class="conversation-vignette"></div><div class="conversation-top"><span>UM ENCONTRO EM VALE SERENO</span><button class="conversation-leave" aria-label="Encerrar conversa">Voltar à loja <kbd>Esc</kbd></button></div><section class="conversation-card"><aside class="conversation-person"><div class="conversation-portrait"></div><span class="conversation-role"></span><h2></h2><div class="conversation-relation"></div><div class="conversation-feedback" aria-live="polite"></div></aside><div class="conversation-body"><div class="conversation-heading"><span>CONVERSA</span><button class="conversation-history">Histórico</button></div><div class="conversation-speech" role="button" tabindex="0" aria-label="Revelar fala completa"></div><div class="conversation-choices"></div><div class="conversation-foot"><span>Espaço revela a fala · 1–6 escolhe a resposta</span><button class="conversation-reveal">Revelar fala ▸</button></div></div></section>`;
    this.element.querySelector('h2')!.textContent=session.name;this.element.querySelector('.conversation-role')!.textContent=session.role;
    const portrait=this.element.querySelector('.conversation-portrait')!;
    if(options.portrait){const img=document.createElement('img');img.src=options.portrait;img.alt=session.name;portrait.append(img);}else{const initial=document.createElement('span');initial.className='conversation-monogram';initial.textContent=session.name.split(' ').map(x=>x[0]).slice(0,2).join('');portrait.append(initial);}
    this.textNode=this.element.querySelector('.conversation-speech')!;this.choicesNode=this.element.querySelector('.conversation-choices')!;
    this.element.querySelector('.conversation-leave')!.addEventListener('click',()=>this.close());
    this.textNode.addEventListener('click',()=>this.complete());this.element.querySelector('.conversation-reveal')!.addEventListener('click',()=>this.complete());
    this.element.querySelector('.conversation-history')!.addEventListener('click',()=>{this.historyOpen=!this.historyOpen;this.render();});
    if(options.onTrade){const trade=document.createElement('button');trade.textContent='Atender pedido';trade.className='conversation-trade';trade.onclick=()=>{this.close();options.onTrade?.();};this.element.querySelector('.conversation-person')!.append(trade);}
    document.querySelector('#app')!.append(this.element);document.addEventListener('keydown',this.keyHandler,true);this.render();
  }
  private render(){
    window.clearTimeout(this.timer);this.element.classList.toggle('conversation-show-history',this.historyOpen);
    const relation=this.session.relationship;this.element.querySelector('.conversation-relation')!.textContent=`${relation.trust>=4?'Confiança estabelecida':relation.trust>0?'Laços se formando':relation.trust<0?'Uma certa distância':'Ainda se conhecendo'} · ${relation.trust}`;
    this.element.querySelector('.conversation-feedback')!.textContent=this.session.feedback;
    this.element.querySelector('.conversation-history')!.textContent=this.historyOpen?'Voltar à conversa':'Histórico';
    this.choicesNode.replaceChildren();
    if(this.historyOpen){this.textNode.replaceChildren();for(const entry of this.session.history){const p=document.createElement('p');const who=document.createElement('small');who.textContent=entry.speaker==='player'?'VOCÊ':this.session.name.toUpperCase();p.append(who,document.createTextNode(entry.text));this.textNode.append(p);}return;}
    this.chars=Array.from(this.session.text.normalize('NFC'));this.index=0;this.textNode.textContent='';
    for(const [i,c] of this.session.choices.entries()){const button=document.createElement('button');button.className='conversation-choice';const key=document.createElement('kbd');key.textContent=String(i+1);const text=document.createElement('span');text.textContent=c.text;button.append(key,text);button.onclick=()=>this.choose(i);this.choicesNode.append(button);}
    this.choicesNode.classList.add('conversation-waiting');
    if(this.options.instant)this.complete();else this.type();
  }
  private type(){if(this.closed||this.historyOpen)return;if(this.index>=this.chars.length){this.complete();return;}const char=this.chars[this.index++];this.textNode.textContent=this.chars.slice(0,this.index).join('');const delay=1000/(this.options.textSpeed||45)+(/[.!?]/.test(char)?150:char===','?80:0);this.timer=window.setTimeout(()=>this.type(),delay);}
  private complete(){if(this.closed||this.historyOpen)return;window.clearTimeout(this.timer);this.index=this.chars.length;this.textNode.textContent=this.chars.join('');this.choicesNode.classList.remove('conversation-waiting');this.element.querySelector('.conversation-reveal')!.classList.add('hidden');}
  private choose(index:number){if(this.index<this.chars.length){this.complete();return;}const choice=this.session.choices[index];if(!choice)return;this.options.onSound?.();this.session.choose(choice.index);this.options.onChange();if(this.session.ended){this.close();return;}this.element.querySelector('.conversation-reveal')!.classList.remove('hidden');this.render();}
  close(){if(this.closed)return;this.closed=true;window.clearTimeout(this.timer);document.removeEventListener('keydown',this.keyHandler,true);this.element.remove();this.options.onClose();}
}
