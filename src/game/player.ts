import { CavnasAPI } from '../canvas';
import { P_ACC, P_VEL } from '../constants/physics';
import { KEYPRESSED } from '../lib/canvas';
import { toRadians } from '../lib/utils';
import { Agent } from '../physics/agent';
import { LineCollider } from '../physics/linecollider';
import { Ray } from '../physics/ray';
import Vector from '../physics/vector';

export class Player extends Agent {
  mass: number;
  size: number;
  stroke: string;
  fill: string;
  rays: Array<Ray>;

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

    this.rays = [];

    this.rotation = 180 / Math.PI;
    for (let a = this.rotation - 45; a <= this.rotation + 45; a += 1) {
      this.rays.push(new Ray(this.pos, (a * Math.PI) / 180));
    }
  }

  getMovement(): Vector {
    const accForce = new Vector(0, 0);
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

    if (KEYPRESSED.ArrowRight) {
      accForce.x = 1;
    }

    if (KEYPRESSED.ArrowLeft) {
      accForce.x = -1;
    }

    return accForce;
  }

  updateAngVel(): void {
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

    this.updateAngVel();
    const accForce = this.getMovement();
    accForce
      .set(
        accForce.x * Math.cos(this.rotation + toRadians(90)) -
          accForce.y * Math.sin(this.rotation + toRadians(90)),
        accForce.y * Math.cos(this.rotation + toRadians(90)) +
          accForce.x * Math.sin(this.rotation + toRadians(90))
      )
      .setMag(P_ACC);

    if (KEYPRESSED.Spacebar) {
      this.acc.set(0, 0);
      this.vel.set(0, 0);
    } else {
      this.applyForce(accForce);
      this.vel.add(this.acc).limit(P_VEL);
    }

    this.pos.add(this.vel);

    this.vel.mult(0.98);
    this.acc.mult(0);

    this.rays = [];
    const rayAngle = (this.rotation * 180) / Math.PI;

    for (let a = rayAngle - 45; a <= rayAngle + 45; a += 1) {
      this.rays.push(new Ray(this.pos, (a * Math.PI) / 180));
    }
  }

  draw(cP: CavnasAPI) {
    cP.circle(this.pos.x, this.pos.y, this.size, {
      fill: this.fill,
      stroke: this.stroke,
    });

    const dirVector = this.pos.copy();

    dirVector.set(
      dirVector.x * Math.cos(this.rotation) -
        dirVector.y * Math.sin(this.rotation),
      dirVector.y * Math.cos(this.rotation) +
        dirVector.x * Math.sin(this.rotation)
    );

    dirVector.setMag(25);
    // cP.line(
    //   this.pos.x,
    //   this.pos.y,
    //   this.pos.x + dirVector.x,
    //   this.pos.y + dirVector.y,

    //   {
    //     stroke: 'red',
    //   }
    // );
  }
}
