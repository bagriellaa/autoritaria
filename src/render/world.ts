import * as T from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { surface } from './materials';
import { AssetLibrary, ASSETS } from './assets';
import { PRODUCTS, PRODUCT_IDS, PEOPLE, type ProductId } from '../content';
import type { GameState } from '../game/model';

export type Action = 'door'|'sign'|'register'|'tray'|'radio'|'newspaper'|'ledger'|'switch'|'drawer'|'npc'|`product:${ProductId}`;
type Box = { x:number;z:number;w:number;d:number };
const mat=(c:number)=>new T.MeshStandardMaterial({color:c,roughness:.94,flatShading:true});
const wood=mat(0x976f48), darkWood=mat(0x70583f), cream=mat(0xd2bd91), green=mat(0x577969), metal=mat(0x444844);

export class World {
  private portraits=new Map<string,string>();
  assets=new AssetLibrary(); ready:Promise<void>; assetCharacters=new Map<string,string>();
  highlight=new T.BoxHelper(new T.Object3D(),0xe6cb88);
  scene=new T.Scene(); camera=new T.PerspectiveCamera(66,1,.06,100); renderer:T.WebGLRenderer; composer:EffectComposer;
  targets:T.Object3D[]=[]; walls:T.Object3D[]=[]; colliders:Box[]=[]; ray=new T.Raycaster(); keys=new Set<string>();
  products:Record<string,T.Group[]>={}; trayGroup=new T.Group(); heldGroup=new T.Group(); customer:T.Group|null=null; customerId='';
  door=new T.Group(); lamps:T.PointLight[]=[]; ceilingGlobes:T.Mesh[]=[]; sign!:T.Mesh; drawer!:T.Mesh; sun:T.DirectionalLight;
  onInteract:(a:Action)=>void=()=>{}; onEscape:()=>void=()=>{}; active=false; sensitivity=.0022; headBob=true; target:Action|null=null;
  yaw=0; pitch=0; walk=0; dragging=false; private lastHeld='';private lastTray='';private lowRes=960;private lampMat=new T.MeshStandardMaterial({color:0xf1d6a0,emissive:0xf6c17e,emissiveIntensity:.8});
  constructor(public canvas:HTMLCanvasElement) {
    this.renderer=new T.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});this.renderer.setPixelRatio(1);
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.outputColorSpace=T.SRGBColorSpace;
    this.renderer.setClearColor(0xb7b8a2);this.scene.fog=new T.Fog(0xb7b8a2,15,47);
    this.scene.add(new T.HemisphereLight(0xe7eee3,0x796952,1.7));
    this.scene.add(new T.AmbientLight(0xe4d8bd,.6));
    this.sun=new T.DirectionalLight(0xffd39b,2.5);this.sun.position.set(-7,10,9);this.sun.castShadow=true;this.sun.shadow.mapSize.set(1024,1024);this.sun.shadow.camera.left=-15;this.sun.shadow.camera.right=15;this.sun.shadow.camera.top=15;this.sun.shadow.camera.bottom=-15;this.sun.shadow.normalBias=.04;this.scene.add(this.sun);
    this.composer=new EffectComposer(this.renderer);this.composer.addPass(new RenderPass(this.scene,this.camera));
    this.composer.addPass(new OutputPass());
    this.composer.addPass(new ShaderPass({uniforms:{tDiffuse:{value:null}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform sampler2D tDiffuse;varying vec2 vUv;void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float b=mod(gl_FragCoord.x,2.)*2.+mod(gl_FragCoord.y,2.);c=floor(c*64.+b*.12)/64.;float vignette=1.-smoothstep(.25,.83,length(vUv-.5))*.15;gl_FragColor=vec4(c*vignette,1.);}`}));
    this.build();this.scene.add(this.camera);this.camera.add(this.heldGroup);this.heldGroup.position.set(.4,-.37,-.65);this.heldGroup.rotation.set(.2,-.25,-.12);this.scene.add(this.trayGroup);
    this.trayGroup.position.set(1.3,1.17,0);this.camera.rotation.order='YXZ';
    this.highlight.material.transparent=true;this.highlight.material.opacity=.35;this.highlight.visible=false;this.scene.add(this.highlight);
    this.ready=this.loadAssets();
    this.resize();window.addEventListener('resize',()=>this.resize());
    document.addEventListener('keydown',e=>{if(!this.active)return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyE','ShiftLeft'].includes(e.code))e.preventDefault();this.keys.add(e.code);if(e.code==='KeyE'&&!e.repeat&&this.target)this.onInteract(this.target);});
    document.addEventListener('keyup',e=>this.keys.delete(e.code));window.addEventListener('blur',()=>this.keys.clear());
    document.addEventListener('mousemove',e=>{if(!this.active)return;if(document.pointerLockElement===canvas||this.dragging){this.yaw-=e.movementX*this.sensitivity;this.pitch=Math.max(-1.2,Math.min(1.2,this.pitch-e.movementY*this.sensitivity));}});
    canvas.addEventListener('pointerdown',e=>{if(!this.active)return;if(e.button===0){this.dragging=true;try{const p=canvas.requestPointerLock();p?.catch(()=>{});}catch{}}});document.addEventListener('pointerup',()=>this.dragging=false);
  }
  resize(){const w=window.innerWidth,h=window.innerHeight;this.camera.aspect=w/h;this.camera.updateProjectionMatrix();const rw=Math.min(w,this.lowRes),rh=Math.round(rw*h/w);this.renderer.setSize(rw,rh,false);this.composer.setSize(rw,rh);}
  resolution(value:number){this.lowRes=value;this.resize();}
  mesh(w:number,h:number,d:number,m:T.Material,x:number,y:number,z:number,parent:T.Object3D=this.scene){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
  cylinder(rt:number,rb:number,h:number,m:T.Material,x:number,y:number,z:number,parent:T.Object3D=this.scene,n=8){const o=new T.Mesh(new T.CylinderGeometry(rt,rb,h,n),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
  label(text:string,width:number,height:number,bg='#e1d2a8',fg='#39483c',size=40){const c=document.createElement('canvas');c.width=512;c.height=Math.round(512*height/width);const ctx=c.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle=fg;ctx.lineWidth=4;ctx.strokeRect(9,9,c.width-18,c.height-18);ctx.fillStyle=fg;ctx.font=`bold ${size}px Georgia`;ctx.textAlign='center';ctx.textBaseline='middle';text.split('\n').forEach((line,i,a)=>ctx.fillText(line,256,c.height/2+(i-(a.length-1)/2)*(size+12),480));const tex=new T.CanvasTexture(c);tex.magFilter=T.NearestFilter;tex.colorSpace=T.SRGBColorSpace;return new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide}));}
  interact(o:T.Object3D,action:Action){o.userData.action=action;this.targets.push(o);return o;}
  block(x:number,z:number,w:number,d:number){this.colliders.push({x,z,w,d});}
  build(){
    surface(wood,'wood');surface(darkWood,'wood');surface(green,'wood');
    // Individual tiles and restrained wear form an intentionally low resolution interior.
    const floor=surface(mat(0xe3d5b1),'tiles',3);this.mesh(12,.08,12,floor,0,-.06,0);
    const wallMat=surface(mat(0xddd4b7),'plaster',4);this.walls.push(this.mesh(.2,3.6,12,wallMat,-6,1.8,0),this.mesh(.2,3.6,12,wallMat,6,1.8,0),this.mesh(12,3.6,.2,wallMat,0,1.8,-6));
    this.mesh(.22,1.05,12,green,-5.98,.48,0);this.mesh(.22,1.05,12,green,5.98,.48,0);this.mesh(12,1.05,.22,green,0,.48,-5.98);
    for(const x of [-5.8,5.8]){this.mesh(.07,.1,12,wood,x,1.05,0);this.mesh(.08,.16,12,wood,x,.1,0);}
    this.mesh(12,.1,.09,wood,0,1.05,-5.83);this.mesh(12,.15,.1,wood,0,.1,-5.8);
    this.mesh(12,.18,12,mat(0xb3a37e),0,3.7,0);for(const z of [-5,-1,3])this.mesh(12,.25,.24,darkWood,0,3.48,z);
    for(const x of [-3.6,3.6]){const sunbeam=new T.SpotLight(0xffe4ad,24,16,.6,.7,1.5);sunbeam.position.set(x,2.8,5.55);sunbeam.target.position.set(x*.3,0,-2.8);sunbeam.castShadow=true;sunbeam.shadow.mapSize.set(512,512);sunbeam.shadow.bias=-.001;this.scene.add(sunbeam,sunbeam.target);}
    // Shopfront: two actual openings with transoms and a hinged entrance.
    for(const x of [-3.6,3.6]){this.mesh(4.5,.85,.25,green,x,.4,6);this.mesh(4.5,.6,.25,wallMat,x,3.35,6);for(const dx of [-2.1,0,2.1])this.mesh(.09,2.25,.18,wood,x+dx,1.96,6);for(const y of [.85,2.85])this.mesh(4.3,.1,.18,wood,x,y,6);this.mesh(4.3,.06,.12,wood,x,1.85,6);}
    for(const x of [-1.25,1.25])this.mesh(.3,3.5,.3,wood,x,1.75,6);
    this.mesh(2.4,.6,.3,green,0,3.25,6);this.door.position.set(-1.08,0,6);this.scene.add(this.door);
    this.mesh(2.1,.8,.13,green,1.05,.4,0,this.door);this.mesh(2.1,.13,.13,wood,1.05,2.95,0,this.door);for(const x of [.06,2.04])this.mesh(.12,3,.14,wood,x,1.5,0,this.door);
    this.mesh(.1,.3,.12,metal,1.85,1.35,-.14,this.door);this.interact(this.door,'door');
    const glass=new T.Mesh(new T.PlaneGeometry(1.88,2.05),new T.MeshBasicMaterial({color:0xa9c6bd,transparent:true,opacity:.09,side:T.DoubleSide}));glass.position.set(1.05,1.85,0);this.door.add(glass);
    this.sign=this.label('FECHADO',1.25,.42);this.sign.position.set(3.5,1.65,5.9);this.sign.rotation.y=Math.PI;this.scene.add(this.sign);this.interact(this.sign,'sign');
    const storeLabel=this.label('MERCEARIA\nVALE SERENO',4.5,.9,'#36574d','#e5d4a3',44);storeLabel.position.set(0,3.85,6.2);this.scene.add(storeLabel);
    // Counter leaves a walkable passage on both ends.
    this.mesh(3.7,1.02,1.22,green,2.1,.51,0);this.mesh(3.95,.15,1.4,wood,2.1,1.1,0);this.mesh(3.6,.07,.04,cream,2.1,.84,.63);this.block(2.1,0,3.9,1.35);
    for(const x of [.65,1.7,2.75,3.6])this.mesh(.06,.75,.04,wood,x,.48,.65);
    const reg=new T.Group();reg.position.set(3.05,1.2,.1);this.scene.add(reg);this.mesh(.65,.22,.5,metal,0,.1,0,reg);this.mesh(.54,.38,.32,mat(0x62766b),0,.35,-.07,reg);const display=this.label('000.00',.4,.14,'#24342b','#e2dab5',60);display.position.set(0,.45,.1);reg.add(display);for(let x=0;x<4;x++)for(let z=0;z<2;z++)this.cylinder(.035,.04,.03,cream,-.19+x*.125,.23,.12+z*.07,reg);this.interact(reg,'register');
    this.drawer=this.mesh(.56,.1,.36,darkWood,3.05,1.23,.26);this.interact(this.drawer,'drawer');
    const tray=this.mesh(.8,.035,.55,mat(0xb7aa89),1.3,1.2,.02);this.interact(tray,'tray');
    // Four shelf bays with individual movable product representations.
    PRODUCT_IDS.forEach((id,index)=>{const z=-2.9+index*1.85;const rack=new T.Group();rack.position.set(-5.15,0,z);this.scene.add(rack);this.mesh(.85,2.65,1.68,darkWood,-.25,1.32,0,rack);for(const y of [.3,.95,1.6,2.25])this.mesh(1.15,.095,1.75,wood,0,y,0,rack);for(const dz of [-.83,.83])this.mesh(.1,2.7,.08,wood,.5,1.35,dz,rack);const plate=this.label(PRODUCTS[id].short.toUpperCase(),1.3,.25);plate.position.set(.59,2.5,0);plate.rotation.y=Math.PI/2;rack.add(plate);this.interact(rack,`product:${id}`);this.block(-5.15,z,1.15,1.8);this.products[id]=[];
      for(let i=0;i<12;i++){const p=this.product(id);p.position.set(.15,.4+Math.floor(i/4)*.65,-.58+(i%4)*.38);rack.add(p);this.products[id].push(p);}
    });
    // Back-of-shop writing desk, newspaper, supply book and a valve radio.
    this.mesh(3,.11,.8,wood,2.8,.95,-5.2);for(const x of [1.45,4.1])this.mesh(.12,.95,.65,darkWood,x,.45,-5.2);this.block(2.8,-5.2,3,.8);
    const paper=this.label('LE COURRIER\nNOTÍCIAS DA CIDADE',.8,.6,'#d5c6a1','#3d4336',31);paper.rotation.x=-Math.PI/2;paper.position.set(2,.976,-5.2);this.scene.add(paper);this.interact(paper,'newspaper');
    const ledger=this.mesh(.56,.065,.7,mat(0x783c30),3.2,1.02,-5.2);this.interact(ledger,'ledger');const bookLabel=this.label('ESTOQUE',.48,.23,'#783c30','#e4c58f',48);bookLabel.rotation.x=-Math.PI/2;bookLabel.position.set(3.2,1.06,-5.2);this.scene.add(bookLabel);this.interact(bookLabel,'ledger');
    const radio=new T.Group();radio.position.set(4,1,-5.18);this.scene.add(radio);this.mesh(.75,.45,.34,darkWood,0,.22,0,radio);for(let i=0;i<8;i++)this.mesh(.034,.26,.018,mat(0x9b8259),-.24+i*.045,.23,.18,radio);this.cylinder(.07,.07,.04,metal,.22,.18,.21,radio).rotation.x=Math.PI/2;const dial=this.label('FM  88  92  106',.55,.07,'#aa965e','#272c22',34);dial.position.set(0,.39,.18);radio.add(dial);this.interact(radio,'radio');
    const cal=this.label('OUTUBRO\n1986\nSEG  TER  QUA  QUI  SEX',1.2,1.35,'#e2d4b1','#68584b',40);cal.position.set(3.4,2.15,-5.85);this.scene.add(cal);
    const poster=this.label('COMPRE NO BAIRRO\n\nO cotidiano\nse faz perto.',2,1.5,'#667957','#ede0b5',37);poster.position.set(-2,2.1,-5.87);this.scene.add(poster);
    const clockFace=this.label('12\n9     •     3\n6',.65,.65,'#ddd6b6','#3b4038',47);clockFace.position.set(.1,2.8,-5.84);this.scene.add(clockFace);
    const sw=this.mesh(.13,.22,.08,cream,5.85,1.45,4.7);this.interact(sw,'switch');
    for(const z of [-2.8,2.5]){this.cylinder(.025,.025,.5,metal,0,3.32,z);this.cylinder(.35,.11,.19,green,0,3.04,z);const globe=this.cylinder(.17,.17,.12,this.lampMat,0,2.92,z);this.ceilingGlobes.push(globe);const light=new T.PointLight(0xffce86,16,8,2);light.position.set(0,2.8,z);this.scene.add(light);this.lamps.push(light);}
    // Flour sacks and delivery crates, each outside circulation routes.
    for(let i=0;i<3;i++){this.cylinder(.32,.4,.7,mat(0xa9996e),5.25,.35+i*.04,-3.6+i*.75,this.scene,7);this.block(5.25,-3.6+i*.75,.8,.8);}
    for(let i=0;i<2;i++){this.mesh(.9,.6,.8,wood,5.25,.3,2+i);for(let n=0;n<3;n++)this.mesh(.92,.07,.84,cream,5.25,.13+n*.17,2+i);this.block(5.25,2+i,.95,.9);}
    // A quiet, ordinary town beyond the shop windows.
    this.mesh(70,.12,35,mat(0x777d70),0,-.14,16);this.mesh(70,.12,3,mat(0xb1aa91),0,-.04,7.8);this.mesh(70,.1,3,mat(0xb1aa91),0,-.04,17);
    for(let x=-28;x<=28;x+=6){const h=5.5+(Math.abs(x)%3);const m=mat([0xb2a486,0x989e8b,0x9a7f6b,0x788a80][Math.abs(x/6)%4|0]);this.mesh(5.8,h,5,m,x,h/2,21);this.mesh(6.1,.25,5.3,darkWood,x,h,21);for(let dx of [-1.5,1.5])for(let y=1.6;y<h;y+=2){this.mesh(.95,1.1,.06,mat(0x485c58),x+dx,y,18.46);this.mesh(1.13,.08,.11,cream,x+dx,y-.6,18.4);this.mesh(.06,1.1,.09,wood,x+dx,y,18.39);}this.mesh(1.1,2,.08,green,x,.95,18.43);}
    for(const x of [-7,8]){this.cylinder(.18,.28,4,wood,x,2,8.5);for(let i=0;i<5;i++){const crown=new T.Mesh(new T.IcosahedronGeometry(1.2,0),mat(i%2?0xa29248:0x727b43));crown.position.set(x+Math.sin(i*2)*.65,3.8+Math.cos(i)*.5,8.5+Math.cos(i*2)*.6);this.scene.add(crown);}}
    for(let i=0;i<22;i++){const leaf=this.mesh(.14,.01,.1,mat(i%2?0x95743f:0x877941),Math.sin(i*19)*10,.05,7+(i%4)*.6);leaf.rotation.y=i;}
    const bench=this.mesh(2.3,.12,.6,wood,-4,.53,8);for(const x of [-4.9,-3.1])this.mesh(.1,.5,.55,metal,x,.25,8);this.mesh(2.3,.7,.1,wood,-4,.98,8.25);
    const bicycle=new T.Group();for(const x of [-.6,.6]){const wheel=new T.Mesh(new T.TorusGeometry(.32,.035,5,12),metal);wheel.position.set(x,.36,0);bicycle.add(wheel);}this.mesh(1,.06,.06,green,0,.65,0,bicycle);this.mesh(.06,.65,.06,green,.35,.65,0,bicycle);bicycle.position.set(5,0,7.1);bicycle.rotation.y=.4;this.scene.add(bicycle);
    // Subtle projection quantization on lit geometry, preserving world-space shadows.
    const snapped=new Set<T.Material>();
    this.scene.traverse(o=>{if(o instanceof T.Mesh&&o.material instanceof T.MeshStandardMaterial&&!snapped.has(o.material)){snapped.add(o.material);const previous=o.material.onBeforeCompile;o.material.onBeforeCompile=(shader,renderer)=>{previous.call(o.material,shader,renderer);shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\n vec2 snapGrid = vec2(900.0, 650.0); gl_Position.xy = floor(gl_Position.xy / gl_Position.w * snapGrid + 0.5) / snapGrid * gl_Position.w;');};}});
  }
  product(id:ProductId){const name={bread:'food-kit-loaf',milk:'food-kit-carton',tin:'food-kit-can',tea:'food-kit-bag'}[id];const imported=this.assets.create(name,id==='bread'?.36:.34);if(imported)return imported;const g=new T.Group(),p=PRODUCTS[id],m=mat(p.color);if(p.shape==='bread'){const b=new T.Mesh(new T.SphereGeometry(.16,7,4),m);b.scale.set(1,.65,1.45);b.position.y=.11;g.add(b);for(let i=0;i<3;i++)this.mesh(.18,.012,.025,cream,0,.2,-.1+i*.09,g);}
    else if(p.shape==='bottle'){this.cylinder(.095,.1,.3,m,0,.15,0,g);this.cylinder(.045,.09,.09,m,0,.345,0,g);this.cylinder(.05,.05,.03,mat(0x904f3d),0,.4,0,g);this.mesh(.15,.12,.01,green,0,.19,.097,g);}
    else if(p.shape==='can'){this.cylinder(.115,.115,.28,m,0,.14,0,g);this.cylinder(.12,.12,.02,metal,0,.29,0,g);this.mesh(.16,.12,.01,cream,0,.16,.115,g);}
    else{this.mesh(.22,.34,.18,m,0,.17,0,g);this.mesh(.16,.19,.012,cream,0,.19,.096,g);this.mesh(.07,.08,.014,green,0,.19,.105,g);}return g;}
  avatar(id:keyof typeof PEOPLE){const asset=this.assetCharacters.get(id)||(['mira','elena','ana'].includes(id)?'blocky-characters-character-e':'blocky-characters-character-a');const imported=this.assets.create(asset,id==='mira'?1.62:1.79,true);if(imported){this.stylePerson(imported,id);this.interact(imported,'npc');this.scene.add(imported);return imported;}const p=PEOPLE[id],g=new T.Group(),coat=mat(p.color),skin=mat(p.skin),hair=mat(p.hair),trousers=mat(0x393d38);this.mesh(.44,.62,.27,coat,0,1.05,0,g);this.mesh(.37,.18,.28,coat,0,.71,0,g);const head=new T.Mesh(new T.IcosahedronGeometry(.2,1),skin);head.scale.set(.84,1.13,.88);head.position.y=1.61;g.add(head);this.cylinder(.065,.07,.14,skin,0,1.4,0,g);this.mesh(.31,.14,.29,hair,0,1.78,-.025,g);this.mesh(.32,.2,.09,hair,0,1.64,-.15,g);for(const x of [-.075,.075])this.mesh(.029,.024,.015,mat(0x34372f),x,1.65,.16,g);this.mesh(.05,.06,.05,skin,0,1.58,.18,g);this.mesh(.07,.012,.01,mat(0x8a5a45),0,1.52,.17,g);
    for(const x of [-.13,.13]){const leg=new T.Group();leg.position.set(x,.7,0);this.mesh(.13,.56,.15,trousers,0,-.28,0,leg);this.mesh(.16,.1,.26,darkWood,0,-.64,.04,leg);g.add(leg);g.userData[x<0?'leftLeg':'rightLeg']=leg;}
    for(const x of [-.28,.28]){const arm=new T.Group();arm.position.set(x,1.3,0);this.mesh(.13,.5,.17,coat,0,-.23,0,arm);this.mesh(.12,.15,.13,skin,0,-.53,0,arm);g.add(arm);g.userData[x<0?'leftArm':'rightArm']=arm;}
    if(id==='mira'){this.cylinder(.23,.31,.5,coat,0,.64,0,g);this.mesh(.34,.08,.04,cream,0,1.36,.15,g);const bun=new T.Mesh(new T.IcosahedronGeometry(.12,0),hair);bun.position.set(0,1.75,-.2);g.add(bun);}
    if(id==='tomas'||id==='ivo'){this.cylinder(.21,.21,.08,coat,0,1.86,0,g);this.mesh(.33,.03,.2,coat,0,1.82,.14,g);}
    if(id==='elena'){this.mesh(.08,.3,.25,hair,-.16,1.58,-.04,g);this.mesh(.08,.3,.25,hair,.16,1.58,-.04,g);this.mesh(.18,.3,.03,cream,0,1.22,.15,g);}
    this.interact(g,'npc');this.scene.add(g);return g;
  }
  async loadAssets(){
    await this.assets.load(ASSETS);
    Object.entries({mira:'e',elena:'e',ana:'f',tomas:'a',lucas:'k',ivo:'q'}).forEach(([id,variant])=>this.assetCharacters.set(id,'blocky-characters-character-'+variant));
    PRODUCT_IDS.forEach(id=>this.products[id]=this.products[id].map(old=>{const replacement=this.product(id);replacement.position.copy(old.position);old.parent?.add(replacement);old.removeFromParent();this.clearGroup(old);return replacement;}));
    this.lastHeld='reload';this.lastTray='reload';
    const prop=(name:string,size:number,x:number,y:number,z:number,rotation=0)=>{const g=this.assets.create(name,size);if(g){g.position.set(x,y,z);g.rotation.y=rotation;this.scene.add(g);}return g;};
    prop('furniture-kit-kitchenfridge',1.65,5.1,0,-4.65,-Math.PI/2);this.block(5.1,-4.65,.9,1.05);
    prop('furniture-kit-plantsmall1',.65,4.8,.9,5.35);this.mesh(.9,.1,.7,wood,4.8,.85,5.35);this.block(4.8,5.35,.9,.7);
    prop('furniture-kit-chair',.9,1.15,0,-4.7,Math.PI);this.block(1.15,-4.7,.7,.7);
    prop('furniture-kit-televisionvintage',.72,-3.5,1.3,-5.4,.2);this.mesh(1.2,1.2,.7,wood,-3.5,.6,-5.4);this.block(-3.5,-5.4,1.2,.7);
    prop('food-kit-mug',.16,2.8,1.06,-5.2);prop('food-kit-honey',.27,4,1.2,0);
    for(let i=0;i<9;i++){prop(i%2?'food-kit-apple':'food-kit-pear',.16,4.98+(i%3)*.22,.65,1.8+Math.floor(i/3)*.2);}
    for(let i=0;i<6;i++)prop('food-kit-carrot',.3,5+(i%3)*.18,.65,2.8+Math.floor(i/3)*.2,Math.PI/2);
    prop('food-kit-barrel',.8,-5,0,4.85);this.block(-5,4.85,.8,.8);
    for(let i=0;i<3;i++)prop('food-kit-bottle-oil',.35,1.6+i*.3,1.05,-5.1);
    const radio=this.targets.find(t=>t.userData.action==='radio');if(radio){const model=this.assets.create('furniture-kit-radio',.72);if(model){this.clearGroup(radio as T.Group);radio.add(model);}}
  }
  stylePerson(group:T.Group,id:keyof typeof PEOPLE){
    if(id!=='mira')return;
    group.traverse(o=>{if(!(o instanceof T.Mesh))return;const material=o.material as T.MeshStandardMaterial;
      const head=o.name==='head';
      if(!head&&!['torso','arm-left','arm-right'].includes(o.name))return;
      material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
        ${head?`if(diffuseColor.r>.025 && diffuseColor.r<.14 && diffuseColor.r>diffuseColor.g*1.3 && diffuseColor.g<.08){diffuseColor.rgb=mix(vec3(.38,.40,.36),vec3(.72,.70,.60),diffuseColor.r*2.);}`:`if(diffuseColor.b>diffuseColor.g*1.15 && diffuseColor.r>diffuseColor.g*1.05){diffuseColor.rgb=vec3(.23,.32,.21)*(diffuseColor.r+1.);}`}`);};
      material.customProgramCacheKey=()=>head?'mira-hair':'mira-coat';
    });
  }
  portrait(id:keyof typeof PEOPLE):string {
    const cached=this.portraits.get(id);if(cached)return cached;
    const asset=this.assetCharacters.get(id)||(['mira','elena','ana'].includes(id)?'blocky-characters-character-e':'blocky-characters-character-a');
    const g=this.assets.create(asset,1.75,true);if(!g)return '';
    this.stylePerson(g,id);const scene=new T.Scene();scene.background=new T.Color(0x2f493e);scene.add(g);scene.add(new T.HemisphereLight(0xffead0,0x52654b,1.4));const light=new T.DirectionalLight(0xffe5c1,1.8);light.position.set(-2,4,5);scene.add(light);this.assets.animate(g,false,.1);
    const camera=new T.PerspectiveCamera(32,1,.01,10);camera.position.set(.7,1.48,2.55);camera.lookAt(0,1.24,0);
    const renderer=new T.WebGLRenderer({antialias:false});renderer.setSize(256,256);renderer.render(scene,camera);const url=renderer.domElement.toDataURL();this.clearGroup(g);renderer.dispose();renderer.forceContextLoss();this.portraits.set(id,url);return url;
  }
  load(s:GameState){this.camera.position.set(s.player.x,1.65,s.player.z);this.yaw=s.player.yaw;this.pitch=s.player.pitch;this.sync(s,0);}
  release(){this.keys.clear();this.dragging=false;if(document.pointerLockElement)document.exitPointerLock();}
  canMove(x:number,z:number){if(x<-5.55||x>5.55||z<-5.55||z>5.5)return false;return !this.colliders.some(b=>Math.abs(x-b.x)<b.w/2+.24&&Math.abs(z-b.z)<b.d/2+.24);}
  sync(s:GameState,dt:number){
    this.door.rotation.y=T.MathUtils.damp(this.door.rotation.y,s.door?-1.55:0,8,dt||1);
    this.drawer.position.z=T.MathUtils.damp(this.drawer.position.z,s.drawer?.55:.26,8,dt||1);
    this.lamps.forEach(l=>l.intensity=s.lights?8:0);this.lampMat.emissiveIntensity=s.lights?.8:0;
    this.sun.intensity=2.4-Math.max(0,(s.time-720)/360)*1.5;this.sun.color.set(s.time>900?0xf2ac76:0xffd39b);
    PRODUCT_IDS.forEach(id=>this.products[id].forEach((p,i)=>p.visible=i<s.stock[id]));
    if(this.sign.userData.open!==(s.phase==='open')){this.sign.userData.open=s.phase==='open';const replacement=this.label(s.phase==='open'?'ABERTO':'FECHADO',1.25,.42);(this.sign.material as T.MeshBasicMaterial).map?.dispose();(this.sign.material as T.Material).dispose();this.sign.material=replacement.material;replacement.geometry.dispose();}
    if(this.lastHeld!==(s.held||'')){this.clearGroup(this.heldGroup);if(s.held)this.heldGroup.add(this.product(s.held));this.lastHeld=s.held||'';}
    if(this.lastTray!==(s.tray||'')){this.clearGroup(this.trayGroup);if(s.tray)this.trayGroup.add(this.product(s.tray));this.lastTray=s.tray||'';}
    if(!s.customer&&this.customer){this.scene.remove(this.customer);this.targets=this.targets.filter(t=>t!==this.customer);this.clearGroup(this.customer);this.customer=null;this.customerId='';}
    if(s.customer){const c=s.customer;if(!this.customer||this.customerId!==c.id){if(this.customer){this.scene.remove(this.customer);this.targets=this.targets.filter(t=>t!==this.customer);this.clearGroup(this.customer);}this.customer=this.avatar(c.id);this.customerId=c.id;}
      const npc=this.customer!;const dx=c.x-npc.position.x,dz=c.z-npc.position.z;if(Math.hypot(dx,dz)>.002)npc.rotation.y=Math.atan2(dx,dz);if(c.phase==='queue')npc.rotation.y=0;npc.position.set(c.x,0,c.z);const moving=c.phase==='entering'||c.phase==='leaving';const wave=moving?Math.sin(performance.now()*.008)*.33:0;if(npc.userData.mixer){this.assets.animate(npc,moving,dt);}else{npc.userData.leftLeg.rotation.x=wave;npc.userData.rightLeg.rotation.x=-wave;npc.userData.leftArm.rotation.x=-wave;npc.userData.rightArm.rotation.x=wave;}}
  }
  clearGroup(g:T.Group){g.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();}});g.clear();}
  update(dt:number,s:GameState,menu=false){
    if(menu){this.camera.position.set(4.5,2.05,4.7);this.camera.lookAt(-1.6,1.3,-2);this.composer.render();return;}
    if(this.active){let forward=Number(this.keys.has('KeyW')||this.keys.has('ArrowUp'))-Number(this.keys.has('KeyS')||this.keys.has('ArrowDown'));let side=Number(this.keys.has('KeyD'))-Number(this.keys.has('KeyA'));if(this.keys.has('ArrowLeft'))this.yaw+=dt*1.5;if(this.keys.has('ArrowRight'))this.yaw-=dt*1.5;const norm=Math.hypot(forward,side)||1;forward/=norm;side/=norm;const speed=dt*(this.keys.has('ShiftLeft')?3.6:2.4);const dx=(-Math.sin(this.yaw)*forward+Math.cos(this.yaw)*side)*speed,dz=(-Math.cos(this.yaw)*forward-Math.sin(this.yaw)*side)*speed;const p=this.camera.position;if(this.canMove(p.x+dx,p.z))p.x+=dx;if(this.canMove(p.x,p.z+dz))p.z+=dz;if(dx||dz)this.walk+=dt*9;p.y=1.65+(this.headBob&&(dx||dz)?Math.sin(this.walk)*.022:0);this.camera.rotation.set(this.pitch,this.yaw,0);s.player={x:p.x,z:p.z,yaw:this.yaw,pitch:this.pitch};}
    this.sync(s,dt);this.camera.updateMatrixWorld();this.scene.updateMatrixWorld(true);this.ray.setFromCamera(new T.Vector2(0,0),this.camera);this.ray.far=3.3;
    this.highlight.visible=false;const hits=this.ray.intersectObjects([...this.targets,...this.walls],true);this.target=null;
    if(hits.length){let obj:T.Object3D|null=hits[0].object;while(obj&&!obj.userData.action)obj=obj.parent;if(obj?.userData.action){this.target=obj.userData.action;if(obj.userData.action!=='npc'){this.highlight.setFromObject(obj);this.highlight.visible=this.active;}}}
    this.composer.render();
  }
}
