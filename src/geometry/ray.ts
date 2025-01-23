import CavnasAPI from '../canvas';
import { MOUSE } from '../lib/canvas';
import { createVector2D } from '../lib/geometry';
import LineCollider from '../collisions/linecollider';
import Vector from './vector';

export default class Ray {
  pos: Vector;
  dir: Vector;

  constructor(pos: Vector, angle: number) {
    this.pos = pos;
    this.dir = Vector.fromAngle(angle);
  }

  update() {
    this.dir.x = MOUSE.x - this.pos.x;
    this.dir.y = MOUSE.y - this.pos.y;
    this.dir.normalize();
  }

  lookAtWall(wall: LineCollider) {
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (!den) return;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      const p1 = x1 + t * (x2 - x1);
      const p2 = y1 + t * (y2 - y1);
      return createVector2D(p1, p2);
    } else {
      return;
    }
  }

  draw(cP: CavnasAPI) {
    cP.stroke('gray');
    cP.line(
      this.pos.x,
      this.pos.y,
      this.pos.x + this.dir.x * 40,
      this.pos.y + this.dir.y * 40
    );
  }
}
