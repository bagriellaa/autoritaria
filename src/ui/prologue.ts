import { PROLOGUE, sceneImage } from '../content';
import type { GameState } from '../game/model';
import type { Sound } from '../audio';
export interface ReadingSettings { textSpeed:number; instant:boolean; reducedMotion:boolean }
export class Prologue {
  el:HTMLDivElement; image:HTMLImageElement; line:HTMLElement; count:HTMLElement; heading:HTMLElement; next:HTMLButtonElement;
  visible=false; suspended=false; chars:string[]=[]; index=0; wait=0; private guard=0;private sceneKey=-1;private imageToken=0;
  onFinish:()=>void=()=>{};onSave:()=>void=()=>{};onHistory:()=>void=()=>{};onSettings:()=>void=()=>{};onSkip:()=>void=()=>{};
  constructor(public state:GameState,public settings:ReadingSettings,public sound:Sound){
    this.el=document.createElement('div');this.el.className='prologue hidden';this.el.innerHTML=`<div class="painting-well"><img alt="Pintura do prólogo" class="painting"/><div class="painting-shade"></div></div><div class="prologue-top"><span>UMA VIDA DO OUTRO LADO</span><nav><button data-action="history">Histórico</button><button data-action="settings">Configurações</button><button data-action="skip">Pular prólogo</button></nav></div><div class="scene-caption"></div><div class="novel-panel"><div class="novel-eyebrow"><span>MEMÓRIAS</span><span class="scene-count"></span></div><div class="novel-text"></div><button class="novel-next" aria-label="Avançar fala">Continuar <span>▸</span></button><small>Clique · Espaço · Enter</small></div><div class="asset-warning hidden">Pintura indisponível · recurso substituível</div>`;
    document.querySelector('#app')!.append(this.el);this.image=this.el.querySelector('img')!;this.line=this.el.querySelector('.novel-text')!;this.count=this.el.querySelector('.scene-count')!;this.heading=this.el.querySelector('.scene-caption')!;this.next=this.el.querySelector('.novel-next')!;
    this.el.addEventListener('click',e=>{if(this.suspended)return;const b=(e.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');if(b){({history:this.onHistory,settings:this.onSettings,skip:this.onSkip}[b.dataset.action!]||(()=>{}))();}else this.advance();});
    document.addEventListener('keydown',e=>{if(this.visible&&!this.suspended&&['Space','Enter'].includes(e.code)){e.preventDefault();if(!e.repeat)this.advance();}});
  }
  start(s:GameState){this.state=s;this.visible=true;this.suspended=false;this.sceneKey=-1;this.el.classList.remove('hidden');this.showLine();}
  hide(){this.visible=false;this.el.classList.add('hidden');}
  showLine(){const p=this.state.prologue,scene=PROLOGUE[p.scene];this.chars=Array.from(scene.texts[p.line].normalize('NFC'));this.index=0;this.wait=.5;this.guard=.18;this.line.textContent='';this.next.style.visibility='hidden';this.count.textContent=`${String(p.scene+1).padStart(2,'0')} / 09`;this.heading.textContent=scene.title;
    if(this.sceneKey!==p.scene){this.sceneKey=p.scene;const token=++this.imageToken;this.el.classList.add('transitioning');const incoming=new Image();incoming.onload=()=>{if(token!==this.imageToken)return;this.image.src=incoming.src;this.image.alt=scene.title;this.el.querySelector('.asset-warning')!.classList.add('hidden');this.el.classList.remove('transitioning');this.image.style.animation='none';void this.image.offsetWidth;this.image.style.animation=this.settings.reducedMotion?'none':'painting-drift 35s ease-out forwards';};incoming.onerror=()=>{if(token!==this.imageToken)return;this.image.removeAttribute('src');this.el.querySelector('.asset-warning')!.classList.remove('hidden');this.el.classList.remove('transitioning');};incoming.src=sceneImage(p.scene,this.state.gender);this.sound.setMood(scene.music);this.sound.ambience(scene.sound);
      if(scene.next!==null){const preload=new Image();preload.src=sceneImage(scene.next,this.state.gender);}
    }
    if(this.settings.instant)this.completeText();this.onSave();
  }
  completeText(){this.index=this.chars.length;this.line.textContent=this.chars.join('');this.next.style.visibility='visible';}
  advance(){if(this.guard>0||!this.visible||this.suspended)return;this.guard=.15;if(this.index<this.chars.length){this.completeText();return;}const p=this.state.prologue;const text=PROLOGUE[p.scene].texts[p.line];p.history.push(text);if(p.line<PROLOGUE[p.scene].texts.length-1)p.line++;else if(p.scene<8){p.scene++;p.line=0;}else{p.complete=true;this.hide();this.onSave();this.onFinish();return;}this.showLine();}
  update(dt:number){if(!this.visible||this.suspended)return;this.guard=Math.max(0,this.guard-dt);if(this.index>=this.chars.length)return;this.wait-=dt;if(this.wait>0)return;if(this.settings.instant){this.completeText();return;}const char=this.chars[this.index++];this.line.textContent=this.chars.slice(0,this.index).join('');this.wait=1/this.settings.textSpeed+(/[.,!?]/.test(char)?.14:0);if(this.index%3===0)this.sound.type();if(this.index===this.chars.length)this.next.style.visibility='visible';}
}
