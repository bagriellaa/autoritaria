import test from 'node:test';
import assert from 'node:assert/strict';
import { Simulation } from '../src/game/simulation';
import { createGame } from '../src/game/model';
import { PRODUCT_IDS } from '../src/content';

test('Yuka conduz cada pedido pela loja sem atravessar balcão ou prateleiras',()=>{
  for(const product of PRODUCT_IDS){
    const sim=new Simulation(createGame('endless','female'));sim.open();sim.spawn();sim.state.customer!.product=product;
    let served=false,steps=0;
    while(sim.state.customer&&steps++<2500){
      sim.tick(.05);const c=sim.state.customer;if(!c)break;
      assert.ok(!(c.x>.1&&c.x<4.1&&c.z>-.85&&c.z<.85),'colisão com balcão');
      assert.ok(c.x>-4.3,'colisão com prateleiras');
      if(c.phase==='queue'){served=true;sim.sell('refuse');}
    }
    assert.ok(served);assert.equal(sim.state.customer,null,'cliente deve concluir entrada e saída');
  }
});
