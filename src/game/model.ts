import { PEOPLE, PRODUCTS, PRODUCT_IDS, type PersonId, type ProductId } from '../content';
export type Mode = 'story' | 'endless';
export type Gender = 'female' | 'male';
export type Phase = 'preparation' | 'open' | 'closed' | 'complete';
export interface Relationship { trust: number; affinity: number; meetings: number; memories: string[] }
export interface Customer { vx?: number; vz?: number; id: PersonId; product: ProductId; phase: 'entering' | 'browsing' | 'queue' | 'leaving'; x: number; z: number; waypoint: number; wait: number; inspected: boolean; talked: boolean; document: { name: string; country: string; validUntil: number }; special: 'need' | 'papers' | 'normal' }
export interface Transaction { day: number; time: number; kind: 'sale' | 'purchase' | 'expense' | 'gift'; amount: number; cost: number; product?: ProductId; person?: PersonId; note: string }
export interface GameState {
  version: 1; mode: Mode; gender: Gender; day: number; time: number; phase: Phase; money: number;
  stock: Record<ProductId, number>; prices: Record<ProductId, number>; basis: Record<ProductId, number>;
  held: ProductId | null; tray: ProductId | null; personal: string[];
  relations: Record<PersonId, Relationship>; flags: Record<string, boolean>; suspicion: number;
  transactions: Transaction[]; daily: { revenue: number; purchases: number; cogs: number; expenses: number; sold: number; served: number; notes: string[]; openingMoney: number; rationSales: Record<string, number> };
  customer: Customer | null; customerIndex: number; spawnIn: number; door: boolean; radio: boolean; lights: boolean; drawer: boolean;
  prologue: { complete: boolean; scene: number; line: number; history: string[] }; seed: number;
  player: { x: number; z: number; yaw: number; pitch: number }; rules: { ration: boolean }; weather: string; season: string;
}
export const money = (n: number) => `C$ ${(n / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const clock = (n: number) => `${String(Math.floor(n / 60)).padStart(2,'0')}:${String(Math.floor(n % 60)).padStart(2,'0')}`;
export function newDay(m: number): GameState['daily'] { return { revenue: 0, purchases: 0, cogs: 0, expenses: 0, sold: 0, served: 0, notes: [], openingMoney: m, rationSales: {} }; }
export function createGame(mode: Mode, gender: Gender): GameState {
  return { version: 1, mode, gender, day: 1, time: 480, phase: 'preparation', money: 8500,
    stock: { bread: 8, milk: 6, tin: 6, tea: 5 }, prices: Object.fromEntries(PRODUCT_IDS.map(id => [id, PRODUCTS[id].price])) as GameState['prices'], basis: Object.fromEntries(PRODUCT_IDS.map(id=>[id, PRODUCTS[id].cost])) as GameState['basis'],
    held: null, tray: null, personal: ['Chave da mercearia', 'Fotografia da mãe', 'Passaporte de Véspera'],
    relations: Object.fromEntries(Object.keys(PEOPLE).map(id => [id, { trust: 0, affinity: 0, meetings: 0, memories: [] }])) as unknown as GameState['relations'], flags: {}, suspicion: 0,
    transactions: [], daily: newDay(8500), customer: null, customerIndex: 0, spawnIn: 3, door: false, radio: true, lights: true, drawer: false,
    prologue: { complete: mode === 'endless', scene: 0, line: 0, history: [] }, seed: 1986,
    player: { x: 0, z: 3.5, yaw: 0, pitch: 0 }, rules: { ration: false }, weather: 'Céu aberto', season: 'Outono' };
}
export function random(s: GameState) { s.seed = (Math.imul(s.seed, 1664525) + 1013904223) >>> 0; return s.seed / 4294967296; }
