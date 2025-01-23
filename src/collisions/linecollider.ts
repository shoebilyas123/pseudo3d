import CavnasAPI from '../canvas';
import { createVector2D } from '../lib/geometry';
import Vector from '../geometry/vector';
import Collider from './collider';
import { ColliderUserData } from '../types/collision';

export default class LineCollider extends Collider {
  a: Vector;
  b: Vector;
  w: number;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    w?: number,
    userData?: ColliderUserData
  ) {
    super(userData);
    this.a = createVector2D(x1, y1);
    this.b = createVector2D(x2, y2);
    this.w = w || 1;
  }

  update() {}

  draw(cP: CavnasAPI) {
    cP.stroke('white');
    cP.lineWidth(this.w);
    cP.line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}
