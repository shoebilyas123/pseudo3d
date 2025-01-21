import { CavnasAPI } from '../canvas';
import { createVector2D } from '../lib/physics';
import { SphereCollider } from '../physics/spherecollider';
import Vector from '../physics/vector';

export class Boundary {
  pos: Vector;
  width: number;
  height: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.pos = createVector2D(x, y);
    this.width = w;
    this.height = h;
  }

  contains(point: Vector) {
    return (
      point.x >= this.pos.x - this.width &&
      point.x <= this.pos.x + this.width &&
      point.y >= this.pos.y - this.height &&
      point.y <= this.pos.y + this.height
    );
  }

  intersects(range: Boundary): boolean {
    return (
      range.pos.x - range.width < this.pos.x + this.width &&
      range.pos.x + range.width > this.pos.x - this.width &&
      range.pos.y + range.height > this.pos.y - this.height &&
      range.pos.y - range.height < this.pos.y + this.height
    );
  }
}

export class QTree {
  bound: Boundary;
  points: SphereCollider[];
  isSubdivided: boolean;
  tr: QTree | undefined;
  tl: QTree | undefined;
  br: QTree | undefined;
  bl: QTree | undefined;
  n: number;

  constructor(bound: Boundary, cap: number) {
    this.bound = bound;
    this.n = cap;
    this.tl = undefined;
    this.tr = undefined;
    this.bl = undefined;
    this.br = undefined;
    this.isSubdivided = false;
    this.points = [];
  }

  subdivide(): void {
    const x = this.bound.pos.x;
    const y = this.bound.pos.y;
    const w = this.bound.width;
    const h = this.bound.height;

    const ne = new Boundary(x + w / 2, y - h / 2, w / 2, h / 2);
    const nw = new Boundary(x - w / 2, y - h / 2, w / 2, h / 2);
    const sw = new Boundary(x - w / 2, y + h / 2, w / 2, h / 2);
    const se = new Boundary(x + w / 2, y + h / 2, w / 2, h / 2);

    this.tr = new QTree(ne, this.n);
    this.tl = new QTree(nw, this.n);
    this.bl = new QTree(sw, this.n);
    this.br = new QTree(se, this.n);

    this.isSubdivided = true;
  }

  insert(point: SphereCollider): void {
    if (!this.bound.contains(point.userData.pos)) {
      return;
    }

    if (this.points.length < this.n) {
      this.points.push(point);
    } else {
      if (!this.isSubdivided) {
        this.subdivide();
      }

      this.tl?.insert(point);
      this.tr?.insert(point);
      this.bl?.insert(point);
      this.br?.insert(point);
    }
  }

  draw(cP: CavnasAPI) {
    cP.rect(
      this.bound.pos.x,
      this.bound.pos.y,
      this.bound.width * 2,
      this.bound.height * 2,
      {
        fill: 'rgba(0,0,0,0)',
        stroke: 'white',
      }
    );
    if (this.isSubdivided) {
      this.bl?.draw(cP);
      this.br?.draw(cP);
      this.tl?.draw(cP);
      this.tr?.draw(cP);
    }
  }

  query(range: Boundary, found: SphereCollider[]) {
    if (this.bound.intersects(range)) {
      for (let p of this.points) {
        if (range.contains(p.userData.pos)) {
          found.push(p);
        }
      }

      if (this.isSubdivided) {
        this.tl?.query(range, found);
        this.tr?.query(range, found);
        this.bl?.query(range, found);
        this.br?.query(range, found);
      }
    }
  }
}
