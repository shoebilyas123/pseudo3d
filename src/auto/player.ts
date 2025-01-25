import CavnasAPI from '../canvas';
import { PLAYER_VEL } from '../constants';
import { Vector } from '../geometry';
import { KEYPRESSED } from '../lib/events';
import { rotateAround } from '../lib/math';

export default class Player {
  pos: Vector;
  vel: Vector;
  rot: number;
  size: number;

  constructor(x: number, y: number) {
    this.pos = new Vector(x, y);
    this.rot = 0;

    // Velocity vector is also used as the direction vector
    this.vel = new Vector(PLAYER_VEL, 0);

    this.size = 5;
  }

  update() {
    // Runs every frame - handles the player mechanics

    // Rotate the player left/right
    if (KEYPRESSED.ArrowRight) {
      this.rot += 0.05;

      if (this.rot > 2 * Math.PI) {
        this.rot -= 2 * Math.PI;
      }
    }

    if (KEYPRESSED.ArrowLeft) {
      this.rot -= 0.05;

      if (this.rot < 0) {
        this.rot += 2 * Math.PI;
      }
    }
    this.vel.set(
      PLAYER_VEL * Math.cos(this.rot),
      PLAYER_VEL * Math.sin(this.rot)
    );

    if (KEYPRESSED.ArrowUp || KEYPRESSED.ArrowDown) {
      // Move the player up/down
      if (KEYPRESSED.ArrowUp) {
        this.pos.add(this.vel);
      } else if (KEYPRESSED.ArrowDown) {
        this.pos.sub(this.vel);
      }
    }
  }

  draw(c: CavnasAPI, showDir?: boolean) {
    c.fill('yellow');
    c.noStroke();
    c.circle(this.pos.x, this.pos.y, this.size);

    if (showDir) {
      c.stroke('red');
      const dV = this.vel.copy().setMag(25);

      c.line(this.pos, this.pos.copy().add(dV));
    }
  }
}
