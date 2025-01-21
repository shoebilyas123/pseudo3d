import { CavnasAPI } from '../canvas';
import { createVector2D } from '../lib/physics';
import { random } from '../lib/utils';
import Vector from './vector';

export class Sphere2D {
  pos: Vector;
  vel: Vector;

  size: number;
  fill: string;
  stroke: string;

  highlight: boolean;

  constructor(x: number, y: number, s: number, f?: string, strk?: string) {
    this.pos = createVector2D(x, y);
    this.vel = createVector2D(
      random(-innerWidth, innerWidth),
      random(-innerHeight, innerHeight)
    );
    this.vel.limit(2);

    this.size = s;
    this.fill = f || 'rgba(0,0,0,0)';
    this.stroke = strk || 'rgba(0,0,0,0)';

    this.highlight = false;
  }

  setHighlight(v: boolean) {
    this.highlight = v;
  }
  update() {
    // this.vel.set(random(innerWidth), random(innerHeight));
    // this.vel.limit(2);
    this.pos.add(this.vel);
  }

  draw(cP: CavnasAPI) {
    if (this.highlight === true) {
      cP.circle(this.pos.x, this.pos.y, this.size, {
        fill: 'white',
      });
    } else
      cP.circle(this.pos.x, this.pos.y, this.size, {
        fill: this.fill,
        stroke: this.fill,
      });
  }
}
