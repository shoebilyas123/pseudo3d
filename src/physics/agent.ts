import { MOUSE } from '../lib/canvas';
import { createVector2D } from '../lib/physics';
import Vector from './vector';

export class Agent {
  pos: Vector;
  vel: Vector;
  acc: Vector;
  angVel: number;
  rotation: number;

  constructor(x: number, y: number) {
    this.pos = createVector2D(x, y);
    this.vel = createVector2D(0, 0);
    this.acc = createVector2D(0, 0);
    this.angVel = 0;
    this.rotation = 0;
  }

  updateAngVel() {
    this.angVel = MOUSE.angle() - this.rotation;
    this.rotation += this.angVel;
  }

  applyForce(force: Vector) {
    this.acc.add(force);
  }
}
