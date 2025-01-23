import { CavnasAPI } from '../canvas';
import { MAX_PLAYER_ACC, MAX_PLAYER_VEL } from '../constants';
import { KEYPRESSED } from '../lib/canvas';
import { toRadians } from '../lib/math';
import { Agent } from '../auto/agent';
import { LineCollider } from '../collisions/linecollider';
import { Ray } from '../geometry/ray';
import { Vector } from '../geometry';

export default class Player extends Agent {
  mass: number;
  size: number;
  stroke: string;
  fill: string;
  rays: Array<Ray>;
  fov: number;

  constructor(
    x: number,
    y: number,
    m: number,
    r: number,
    s?: string,
    f?: string
  ) {
    super(x, y);
    this.mass = m;
    this.size = r;
    this.stroke = s || 'white';
    this.fill = f || 'gray';
    this.fov = 30;
    this.rays = [];

    this.rotation = 180 / Math.PI;
    for (
      let a = this.rotation - this.fov;
      a <= this.rotation + this.fov;
      a += 1
    ) {
      this.rays.push(new Ray(this.pos, (a * Math.PI) / 180));
    }
  }

  updateAcc() {
    const accForce = new Vector(0, 0);
    Vector;

    if (!KEYPRESSED.ArrowDown && !KEYPRESSED.ArrowUp) {
      accForce.set(accForce.x, 0);
    }
    if (!KEYPRESSED.ArrowLeft && !KEYPRESSED.ArrowRight) {
      accForce.set(0, accForce.y);
    }
    if (KEYPRESSED.ArrowDown) {
      accForce.y = 1;
    }

    if (KEYPRESSED.ArrowUp) {
      accForce.y = -1;
    }

    accForce
      .set(
        accForce.x * Math.cos(this.rotation + toRadians(90)) -
          accForce.y * Math.sin(this.rotation + toRadians(90)),
        accForce.y * Math.cos(this.rotation + toRadians(90)) +
          accForce.x * Math.sin(this.rotation + toRadians(90))
      )
      .setMag(MAX_PLAYER_ACC);

    return accForce;
  }

  updateRotation(): void {
    if (KEYPRESSED.a) {
      this.rotation -= 0.05;
    } else if (KEYPRESSED.d) {
      this.rotation += 0.05;
    }
  }

  getRayCasts(walls: LineCollider[]): Vector[] {
    let points: Vector[] = [];
    for (let ray of this.rays) {
      let closest: Vector | undefined = undefined;
      let record = Infinity;
      for (let wall of walls) {
        const p = ray.cast(wall);
        if (p) {
          const d = p.dist(this.pos);
          if (d < record) {
            record = d;
            closest = p;
          }
        }
      }

      if (closest) {
        points.push(closest);
      }
    }

    return points;
  }

  update(): void {
    // this.ray.update();

    this.updateRotation();
    const accForce = this.updateAcc();

    if (KEYPRESSED.Spacebar) {
      this.acc.set(0, 0);
      this.vel.set(0, 0);
    } else {
      this.applyForce(accForce);
      this.vel.add(this.acc).limit(MAX_PLAYER_VEL);
    }

    this.pos.add(this.vel);

    this.vel.mult(0.98);
    this.acc.mult(0);

    this.rays = [];
    const rayAngle = (this.rotation * 180) / Math.PI;

    for (let a = rayAngle - this.fov; a <= rayAngle + this.fov; a += 1) {
      this.rays.push(new Ray(this.pos, (a * Math.PI) / 180));
    }
  }

  draw(cP: CavnasAPI, showDir?: boolean) {
    cP.fill(this.fill);
    cP.stroke(this.stroke);
    cP.circle(this.pos.x, this.pos.y, this.size);

    if (showDir) {
      const dirVector = this.pos.copy();

      dirVector.set(
        dirVector.x * Math.cos(this.rotation) -
          dirVector.y * Math.sin(this.rotation),
        dirVector.y * Math.cos(this.rotation) +
          dirVector.x * Math.sin(this.rotation)
      );

      dirVector.setMag(25);
      cP.stroke('red');
      cP.line(
        this.pos.x,
        this.pos.y,
        this.pos.x + dirVector.x,
        this.pos.y + dirVector.y
      );
    }
  }
}
