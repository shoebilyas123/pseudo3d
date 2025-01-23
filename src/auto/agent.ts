import { createVector2D } from '../lib/geometry';
import Vector from '../geometry/vector';

// An agent is a autonomous object that determines
// the various physical properties such as pos, vel, rotation and acceleration
// should be applied to the player, the enemies and other custom autonomous movable objects.
export default class Agent {
  pos: Vector;
  vel: Vector;
  acc: Vector;
  rotation: number;

  constructor(x: number, y: number) {
    this.pos = createVector2D(x, y);
    this.vel = createVector2D(0, 0);
    this.acc = createVector2D(0, 0);
    this.rotation = 0;
  }

  applyForce(force: Vector) {
    this.acc.add(force);
  }
}
