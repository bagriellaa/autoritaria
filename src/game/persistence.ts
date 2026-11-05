import { createGame, type GameState } from './model';
import { PEOPLE, PRODUCT_IDS, PROLOGUE } from '../content';
declare global { interface Window { desktop?: { readSave(): Promise<unknown>; writeSave(s:GameState):Promise<void>; fullscreen():Promise<void> } } }
const KEY='autoritaria.campaign.v1';
const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const isInteger = (value: unknown): value is number => Number.isSafeInteger(value);
const isNonnegative = (value: unknown): value is number => isInteger(value) && value >= 0;
const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const isStrings = (value: unknown): value is string[] => Array.isArray(value) && value.every(x => typeof x === 'string');
const isPerson = (value: unknown): boolean => typeof value === 'string' && Object.hasOwn(PEOPLE, value);
const isProduct = (value: unknown): boolean => typeof value === 'string' && PRODUCT_IDS.some(id => id === value);
export function validateSave(value: unknown): GameState | null {
  if(!isRecord(value))return null;
  const s=value as unknown as GameState;
  if(s.version!==1||!['story','endless'].includes(s.mode)||!['female','male'].includes(s.gender)||!['preparation','open','closed','complete'].includes(s.phase))return null;
  if(!isInteger(s.money)||!isInteger(s.day)||s.day<1||!isFiniteNumber(s.time)||s.time<480||s.time>1080)return null;
  if(!isRecord(s.stock)||!isRecord(s.prices)||!isRecord(s.basis))return null;
  for(const id of PRODUCT_IDS)if(!isNonnegative(s.stock[id])||!isInteger(s.prices[id])||s.prices[id]<50||s.prices[id]>2000||!isNonnegative(s.basis[id]))return null;
  if((s.held!==null&&!isProduct(s.held))||(s.tray!==null&&!isProduct(s.tray))||!isStrings(s.personal))return null;
  if(!isNonnegative(s.suspicion)||!isNonnegative(s.customerIndex)||!isFiniteNumber(s.spawnIn)||!isNonnegative(s.seed)||s.seed>0xffffffff)return null;
  if(![s.door,s.radio,s.lights,s.drawer].every(x=>typeof x==='boolean')||typeof s.weather!=='string'||typeof s.season!=='string')return null;
  if(!isRecord(s.flags)||!Object.values(s.flags).every(x=>typeof x==='boolean'))return null;
  if(!isRecord(s.rules)||typeof s.rules.ration!=='boolean'||!isRecord(s.player))return null;
  if(![s.player.x,s.player.z,s.player.yaw,s.player.pitch].every(isFiniteNumber))return null;

  const p=s.prologue;
  if(!isRecord(p)||typeof p.complete!=='boolean'||!isNonnegative(p.scene)||p.scene>=PROLOGUE.length||!isNonnegative(p.line)||p.line>=PROLOGUE[p.scene].texts.length||!isStrings(p.history))return null;
  if(!isRecord(s.relations))return null;
  for(const id of Object.keys(PEOPLE) as (keyof typeof PEOPLE)[]){
    const r=s.relations[id];
    if(!isRecord(r)||!isInteger(r.trust)||!isInteger(r.affinity)||!isNonnegative(r.meetings)||!isStrings(r.memories))return null;
  }
  const d=s.daily;
  if(!isRecord(d)||![d.revenue,d.purchases,d.cogs,d.expenses,d.sold,d.served].every(isNonnegative)||!isInteger(d.openingMoney)||!isStrings(d.notes)||!isRecord(d.rationSales))return null;
  if(!Object.entries(d.rationSales).every(([id,count])=>isPerson(id)&&isNonnegative(count)))return null;
  if(!Array.isArray(s.transactions)||!s.transactions.every(t=>isRecord(t)&&isInteger(t.day)&&t.day>=1&&isFiniteNumber(t.time)&&t.time>=480&&t.time<=1080&&['sale','purchase','expense','gift'].includes(t.kind)&&isInteger(t.amount)&&isNonnegative(t.cost)&&typeof t.note==='string'&&(t.product===undefined||isProduct(t.product))&&(t.person===undefined||isPerson(t.person))))return null;

  if(s.customer!==null){
    const c=s.customer;
    if((c.vx!==undefined&&!isFiniteNumber(c.vx))||(c.vz!==undefined&&!isFiniteNumber(c.vz)))return null;
    if(!isRecord(c)||!isPerson(c.id)||!isProduct(c.product)||!['entering','browsing','queue','leaving'].includes(c.phase)||!isFiniteNumber(c.x)||!isFiniteNumber(c.z)||!isNonnegative(c.waypoint)||c.waypoint>6||!isFiniteNumber(c.wait)||c.wait<0)return null;
    if(typeof c.inspected!=='boolean'||typeof c.talked!=='boolean'||!['need','papers','normal'].includes(c.special)||!isRecord(c.document))return null;
    if(typeof c.document.name!=='string'||typeof c.document.country!=='string'||!isInteger(c.document.validUntil))return null;
    // A route cursor outside its current phase would leave the customer stuck forever.
    if((c.phase==='entering'&&c.waypoint>=6)||(c.phase==='browsing'&&c.waypoint!==3)||(c.phase==='queue'&&c.waypoint!==6)||(c.phase==='leaving'&&c.waypoint>=4))return null;
  }
  return s;
}
export async function readSave() {try {const source=window.desktop?await window.desktop.readSave():JSON.parse(localStorage.getItem(KEY)||'null');return validateSave(source);}catch{return null;} }
export async function writeSave(s: GameState) { if(window.desktop)await window.desktop.writeSave(s);else localStorage.setItem(KEY,JSON.stringify(s)); }
export const fresh = createGame;
