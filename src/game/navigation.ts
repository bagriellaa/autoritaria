import { Vehicle, ArriveBehavior, Vector3 } from 'yuka';
import type { Customer } from './model';

/** Yuka computes steering. Saved velocity preserves mid-stride reloads. */
export class CustomerNavigator {
  private vehicle = new Vehicle();
  private arrive = new ArriveBehavior(new Vector3(), .22, .025);
  constructor() {
    this.vehicle.maxSpeed = 1.6;
    this.vehicle.maxForce = 12;
    this.vehicle.updateOrientation = false;
    this.vehicle.steering.add(this.arrive);
  }
  step(c: Customer, target: number[], dt: number) {
    const v=this.vehicle;
    v.position.set(c.x,0,c.z);v.velocity.set(c.vx||0,0,c.vz||0);
    this.arrive.target.set(target[0],0,target[1]);
    if(v.position.distanceTo(this.arrive.target)<.065){c.x=target[0];c.z=target[1];c.vx=0;c.vz=0;return true;}
    v.update(dt);c.x=v.position.x;c.z=v.position.z;c.vx=v.velocity.x;c.vz=v.velocity.z;
    return false;
  }
}
