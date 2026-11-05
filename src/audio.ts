export class Sound {
  ctx: AudioContext | null=null; master:GainNode|null=null; volume=.35; typing=true; music=true; private mood='hope';private timer=0;private step=0;
  start(){if(!this.ctx){this.ctx=new AudioContext();this.master=this.ctx.createGain();this.master.gain.value=this.volume;this.master.connect(this.ctx.destination);}void this.ctx.resume();}
  setVolume(v:number){this.volume=v;if(this.master)this.master.gain.setTargetAtTime(v,this.ctx!.currentTime,.1);}
  tone(f:number,duration=.12,volume=.08,type:OscillatorType='sine'){if(!this.ctx||!this.master)return;const t=this.ctx.currentTime;const osc=this.ctx.createOscillator(),g=this.ctx.createGain();osc.type=type;osc.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);osc.connect(g);g.connect(this.master);osc.start(t);osc.stop(t+duration+.02);}
  click(){this.tone(320,.045,.035,'triangle');}
  type(){if(this.typing)this.tone(180,.018,.011,'triangle');}
  bell(){this.tone(1174,.8,.13);setTimeout(()=>this.tone(1567,1,.08),100);}
  cash(){this.tone(740,.12,.12,'triangle');setTimeout(()=>this.tone(988,.24,.1,'triangle'),100);}
  setMood(m:string){this.mood=m;this.timer=1;this.step=0;}
  ambience(kind:string){if(kind==='bell')this.bell();else if(kind==='clock'){this.tone(800,.03,.025);setTimeout(()=>this.tone(600,.035,.02),650);}else if(kind==='birds'){this.tone(1800,.16,.03);setTimeout(()=>this.tone(2300,.12,.025),200);}else if(kind==='train'){for(let i=0;i<6;i++)setTimeout(()=>this.tone(70,.12,.04,'triangle'),i*240);}else this.tone(95,2,.018,'triangle');}
  update(dt:number,enabled=true){if(!enabled||!this.music)return;this.timer-=dt;if(this.timer<=0){this.timer=3.8;const notes=this.mood==='memory'?[146.83,174.61,220,130.81,164.81,196]:[130.81,164.81,196,146.83,174.61,220];const n=notes[this.step++%notes.length];this.tone(n,3.7,.035);this.tone(n*2,3.2,.012,'triangle');}}
}
