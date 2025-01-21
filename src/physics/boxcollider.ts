import { CavnasAPI } from '../canvas';
import { createVector2D } from '../lib/physics';
import Vector from './vector';

export class BoxCollider {
  pos: Vector;
  width: number;
  height: number;

  constructor(x: number, y: number, w: number, ht: number) {
    this.pos = createVector2D(x, y);
    this.width = w;
    this.height = ht;
  }

  update() {}

  draw(cP: CavnasAPI) {
    cP.rect(this.pos.x, this.pos.y, this.width, this.height, {
      fill: 'gray',
      stroke: 'white',
      lineWidth: 3,
    });
  }
}
