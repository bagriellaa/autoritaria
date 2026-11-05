import { PEOPLE, PRODUCTS, PRODUCT_IDS, WORLD, type ProductId, type PersonId } from '../content';
import { type GameState, newDay, random } from './model';
import { effect, runEvents } from './narrative';
import { CustomerNavigator } from './navigation';
export class Simulation {
  private navigator = new CustomerNavigator();
  constructor(public state: GameState, public notify: (message: string) => void = ()=>{}) {}
  buy(id: ProductId, quantity = 4) {
    const s=this.state, unit=this.wholesale(id), total=unit*quantity;
    if(!Number.isSafeInteger(quantity) || quantity<1 || quantity>20 || !['preparation','open'].includes(s.phase)) return false;
    if(s.money<total) {this.notify('Saldo insuficiente para essa encomenda.');return false;}
    const existing=s.stock[id]+Number(s.held===id)+Number(s.tray===id);
    s.basis[id]=Math.round((s.basis[id]*existing+total)/(existing+quantity));
    s.stock[id]+=quantity;s.money-=total;s.daily.purchases+=total;
    s.transactions.push({day:s.day,time:s.time,kind:'purchase',amount:-total,cost:0,product:id,note:`Reposição: ${quantity} unidades`});
    this.notify(`${quantity} unidades de ${PRODUCTS[id].short} entregues à prateleira.`);return true;
  }
  wholesale(id: ProductId) { const s=this.state; return Math.round(PRODUCTS[id].cost*(1+(s.day-1)*(s.mode==='story'?.12:.035)+(s.mode==='endless'?(s.day%4)*.025:0))); }
  price(id: ProductId, delta: number) { this.state.prices[id]=Math.max(50, Math.min(2000,this.state.prices[id]+delta)); }
  take(id: ProductId) {
    const s=this.state;
    if(s.held) { if(s.held===id){s.stock[id]++;s.held=null;this.notify('Produto devolvido à prateleira.');return true;} this.notify('Deposite primeiro o produto que está segurando.');return false; }
    if(s.stock[id]<1){this.notify('Prateleira vazia. Encomende pelo livro de estoque.');return false;}
    s.stock[id]--;s.held=id;this.notify(`${PRODUCTS[id].short} em mãos. Leve à bandeja do balcão.`);return true;
  }
  transfer() { const s=this.state; [s.held,s.tray]=[s.tray,s.held];this.notify(s.tray?'Produto colocado no balcão.':'Produto retirado do balcão.'); }
  open() {const s=this.state;if(s.phase!=='preparation')return;s.phase='open';s.door=true;s.spawnIn=1;this.notify('A placa foi virada. A mercearia está aberta.');}
  spawn() {
    const s=this.state;const cast: PersonId[]=['mira','tomas','elena','ivo','ana','lucas'];
    const id=s.customerIndex<3?cast[s.customerIndex]:cast[3+Math.floor(random(s)*3)];
    const product:ProductId=s.customerIndex<3?(id==='elena'&&s.day<3?'tea':'bread'):PRODUCT_IDS[Math.floor(random(s)*PRODUCT_IDS.length)];
    const special=id==='mira'&&s.day===2?'need':id==='elena'&&s.rules.ration?'papers':s.mode==='endless'&&random(s)<.2?'need':'normal';
    s.customer={id,product,phase:'entering',x:0,z:9,waypoint:0,wait:0,inspected:false,talked:false,document:{name:PEOPLE[id].name,country:WORLD.country,validUntil:special==='papers'?s.day-1:s.day+30},special};
    s.relations[id].meetings++;s.customerIndex++;
  }
  tick(dt: number) {
    const s=this.state;if(s.phase!=='open')return;
    s.time=Math.min(1080,s.time+dt*1.3);
    if(!s.customer) {s.spawnIn-=dt;if(s.spawnIn<=0 && s.time<1060 && (s.mode==='endless'||s.customerIndex<6)) this.spawn();return;}
    const c=s.customer;
    // Authored route stays in the clear aisle; all phases and coordinates are saved.
    const shelfZ:Record<ProductId,number>={bread:-2.9,milk:-1.05,tin:0.85,tea:2.7};
    const route = c.phase==='leaving'?[[-.6,-1.65],[-.6,3.8],[0,7],[0,10]]:[[0,4.5],[-2.7,3.8],[-3.65,shelfZ[c.product]],[-2.65,shelfZ[c.product]],[0,-1.65],[1.1,-1.65]];
    if(c.phase==='entering'&&c.z>5||c.phase==='leaving'&&c.z>4)s.door=true;
    if(c.phase==='queue'){c.wait+=dt;if(c.wait>170){this.notify(`${PEOPLE[c.id].name} precisou ir embora.`);s.daily.notes.push(`${PEOPLE[c.id].name} desistiu após esperar.`);this.leave();}return;}
    if(c.phase==='browsing'){c.wait+=dt;if(c.wait<2.2)return;c.phase='entering';c.wait=0;}
    const target=route[c.waypoint];if(!target)return;
    if(this.navigator.step(c,target,dt)){c.waypoint++;
      if(c.phase==='leaving'&&c.waypoint===route.length){s.customer=null;s.spawnIn=4;return;}
      if(c.waypoint===3&&c.phase==='entering'){c.phase='browsing';c.wait=0;}
      if(c.waypoint===route.length){c.phase='queue';c.wait=0;this.notify(`${PEOPLE[c.id].name} está esperando no caixa.`);}
    }
  }
  leave() {const c=this.state.customer;if(c){c.phase='leaving';c.waypoint=0;c.wait=0;}}
  inspect() {const c=this.state.customer;if(c)c.inspected=true;}
  validDocument() {const s=this.state,c=s.customer;return !!c&&c.inspected&&c.document.name===PEOPLE[c.id].name&&c.document.country===WORLD.country&&c.document.validUntil>=s.day&&(s.daily.rationSales[c.id]||0)<1;}
  talk(kind: 'warm'|'reserved') {const s=this.state,c=s.customer;if(!c||c.talked)return;c.talked=true;effect(s,{trust:{person:c.id,amount:kind==='warm'?1:0},affinity:{person:c.id,amount:kind==='warm'?1:0}});s.relations[c.id].memories.push(kind==='warm'?'Recebeu uma conversa acolhedora.':'Conversou sobre as compras.');runEvents(s);}
  sell(choice: 'normal'|'discount'|'gift'|'illegal'|'refuse') {
    const s=this.state,c=s.customer;if(!c||c.phase!=='queue')return {ok:false,message:'O cliente ainda está escolhendo os produtos.'};
    if(choice==='refuse') {effect(s,{trust:{person:c.id,amount:-1},note:`Atendimento de ${PEOPLE[c.id].name} recusado.`});if(c.id==='mira'&&c.special==='need')s.flags.refused_mira=true;this.leave();return {ok:true,message:'O cliente compreendeu sua decisão e foi embora.'};}
    if(s.tray!==c.product)return {ok:false,message:`Coloque ${PRODUCTS[c.product].short.toLowerCase()} na bandeja antes de registrar.`};
    const restricted=s.rules.ration&&c.product==='bread';
    // Evaluate every document field and the daily limit before recording this sale.
    const violatedRule=restricted&&!this.validDocument();
    if(violatedRule&&choice!=='illegal')return {ok:false,message:'Confira o cartão. Esta venda exige um documento válido ou uma decisão explícita de desobedecer.'};
    if(c.special==='need'&&choice==='normal')return {ok:false,message:'Esta pessoa só consegue pagar metade. Ofereça desconto, doe ou recuse.'};
    if(choice==='normal'&&s.prices[c.product]>PRODUCTS[c.product].price*1.8)return {ok:false,message:'O cliente considera o preço alto demais. Ajuste o preço ou conceda desconto.'};
    const value=choice==='gift'?0:Math.round(s.prices[c.product]*(choice==='discount'?.5:1));
    s.money+=value;s.daily.revenue+=value;s.daily.cogs+=s.basis[c.product];s.daily.sold++;s.daily.served++;
    s.transactions.push({day:s.day,time:s.time,kind:choice==='gift'?'gift':'sale',amount:value,cost:s.basis[c.product],product:c.product,person:c.id,note:violatedRule?'Venda irregular':choice==='discount'?'Desconto de 50%':choice==='gift'?'Doação':'Venda'});
    if(restricted)s.daily.rationSales[c.id]=(s.daily.rationSales[c.id]||0)+1;
    if(violatedRule) {s.suspicion++;s.flags.broke_rule=true;effect(s,{trust:{person:c.id,amount:2},note:`Venda sem cartão válido para ${PEOPLE[c.id].name}.`});}
    if(choice==='gift'||choice==='discount'){effect(s,{trust:{person:c.id,amount:choice==='gift'?3:2},note:`Você ${choice==='gift'?'doou um produto':'concedeu desconto'} a ${PEOPLE[c.id].name}.`});if(c.id==='mira')s.flags.helped_mira=true;}
    s.tray=null;this.leave();runEvents(s);return {ok:true,message:value===0?'Um gesto pequeno. Para alguém, um dia inteiro.':'Venda registrada. Obrigado pela preferência!'};
  }
  close() {
    const s=this.state;if(s.phase!=='open')return;
    if(s.customer){s.daily.notes.push(`${PEOPLE[s.customer.id].name} saiu quando a loja fechou.`);s.customer=null;}
    s.phase='closed';s.door=false;
    const infractions=s.transactions.filter(t=>t.day===s.day&&t.note==='Venda irregular').length;
    const costs=650+infractions*800;s.money-=costs;s.daily.expenses=costs;
    s.transactions.push({day:s.day,time:s.time,kind:'expense',amount:-costs,cost:0,note:infractions?'Aluguel, luz e fiscalização':'Aluguel e luz'});
    if(infractions)s.daily.notes.push(`Fiscalização: ${infractions} irregularidade(s), multa de C$ 8,00 cada.`);
    if(s.money<0)s.daily.notes.push('O saldo está negativo. Você pode vender o estoque restante para se recuperar.');
  }
  nextDay() {
    const s=this.state;if(s.phase!=='closed')return;
    if(s.mode==='story'&&s.day>=3){s.phase='complete';return;}
    s.day++;s.time=480;s.phase='preparation';s.daily=newDay(s.money);s.customerIndex=0;s.spawnIn=2;s.rules.ration=s.day>=3;s.customer=null;s.door=false;runEvents(s);
    if(s.mode==='endless'){const extras=['A feira na praça deve trazer novos fregueses.','O fornecedor ajustou os preços de hoje.','Os moradores comentam a chegada do outono.'];s.daily.notes.push(extras[Math.floor(random(s)*extras.length)]);}
  }
}
