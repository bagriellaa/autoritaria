// Real renderer interaction test. Fixtures place the player near a prop; E is
// dispatched to the actual raycast/controller and the resulting file save is read.
const {app,BrowserWindow}=require('electron');
const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),profile=path.join(root,'.preview','trade-profile'),file=path.join(profile,'campaign-v1.json');
app.setPath('userData',profile);
const errors=[];app.on('web-contents-created',(_,contents)=>contents.on('console-message',(_,level,message)=>{if(level>=3)errors.push(message);}));
const delay=ms=>new Promise(r=>setTimeout(r,ms));
app.whenReady().then(async()=>{
 try{
  const seed=JSON.parse(await fs.readFile(path.join(root,'.preview','qa-profile','campaign-v1.json'),'utf8'));
  seed.prologue.complete=true;seed.phase='open';seed.customer={id:'mira',product:'bread',phase:'queue',x:1.1,z:-1.65,waypoint:6,wait:0,inspected:false,talked:false,document:{name:'Dona Mira',country:'Ardênia',validUntil:31},special:'normal'};
  seed.player={x:-3.5,z:-2.9,yaw:Math.PI/2,pitch:0};seed.stock.bread=8;seed.held=null;seed.tray=null;seed.money=8500;
  await fs.mkdir(profile,{recursive:true});await fs.writeFile(file,JSON.stringify(seed));
  require('../desktop/main.cjs');await delay(3000);
  const win=BrowserWindow.getAllWindows()[0];win.webContents.setBackgroundThrottling(false);const run=js=>win.webContents.executeJavaScript(js,true);
  async function start(){for(let i=0;i<100 && await run("!document.querySelector('#continue') || document.querySelector('#continue').disabled");i++)await delay(200);await run("document.querySelector('#continue').click()");await delay(500);}
  async function e(){await run("document.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyE',bubbles:true}))");await delay(400);await run("document.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyE',bubbles:true}))");}
  async function snapshot(){return JSON.parse(await fs.readFile(file,'utf8'));}
  async function place(player){await run("document.dispatchEvent(new KeyboardEvent('keydown',{code:'Escape',bubbles:true}))");await run("[...document.querySelectorAll('button')].find(b=>b.textContent==='Salvar e voltar ao início').click()");await delay(500);let s=await snapshot();s.player=player;await fs.writeFile(file,JSON.stringify(s));win.webContents.reload();await delay(1800);await start();}
  await start();await fs.writeFile(path.join(root,'.preview','trade-before.png'),(await win.webContents.capturePage()).toPNG());await fs.writeFile(path.join(root,'.preview','trade-before.txt'),await run('document.body.innerText'));await e();let s=await snapshot();assert.equal(s.held,'bread','raycast shelf pickup');assert.equal(s.stock.bread,7);
  await place({x:1.3,z:1.8,yaw:0,pitch:-.25});await e();s=await snapshot();assert.equal(s.tray,'bread','raycast counter deposit');assert.equal(s.held,null);
  await place({x:3.05,z:1.8,yaw:0,pitch:0});await e();assert.match(await run('document.body.innerText'),/Uma compra de cada vez/);
  await run("[...document.querySelectorAll('button')].find(b=>b.textContent==='Conversar com Dona Mira').click()");await delay(500);
  await run("document.querySelector('.conversation-reveal').click()");
  assert.ok(await run("document.querySelectorAll('.conversation-choice').length")>=5);
  await delay(200);await fs.writeFile(path.join(root,'.preview','conversation.png'),(await win.webContents.capturePage()).toPNG());
  await run("document.querySelector('.conversation-choice').click()");await run("document.querySelector('.conversation-reveal').click()");
  assert.equal(await run("document.querySelectorAll('.conversation-choice').length"),3);
  await run("document.querySelector('.conversation-choice').click()");await delay(500);s=await snapshot();assert.equal(s.relations.mira.trust,1);
  await run("document.querySelector('.conversation-trade').click()");
  await delay(200);await fs.writeFile(path.join(root,'.preview','checkout.png'),(await win.webContents.capturePage()).toPNG());
  await run("[...document.querySelectorAll('button')].find(b=>b.textContent.startsWith('Cobrar C$')).click()");await delay(500);s=await snapshot();assert.equal(s.money,8750);assert.equal(s.tray,null);assert.equal(s.daily.sold,1);assert.equal(s.customer.phase,'leaving');
  assert.deepEqual(errors,[]);await fs.writeFile(path.join(root,'.preview','trade-result.json'),JSON.stringify({passed:true,checks:['shelf raycast','take physical product','save and reload held item','counter raycast and deposit','cash register UI','Ink topics and response effects','3D portrait conversation UI','real sale and leaving NPC'],money:s.money},null,2));app.exit(0);
 }catch(error){await fs.writeFile(path.join(root,'.preview','trade-result.json'),JSON.stringify({passed:false,error:String(error),errors},null,2));app.exit(1);}
});
