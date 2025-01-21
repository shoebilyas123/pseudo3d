import { CavnasAPI } from '../canvas';
import { createVector2D } from '../lib/physics';
import Vector from './vector';

export class LineCollider {
  a: Vector;
  b: Vector;
  w: number;

  constructor(x1: number, y1: number, x2: number, y2: number, w?: number) {
    this.a = createVector2D(x1, y1);
    this.b = createVector2D(x2, y2);
    this.w = w || 1;
  }

  update() {}

  draw(cP: CavnasAPI) {
    cP.line(this.a.x, this.a.y, this.b.x, this.b.y, {
      stroke: 'white',
      lineWidth: this.w,
    });
  }
}
