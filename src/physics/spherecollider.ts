import { createVector2D } from '../lib/physics';
import { Sphere2D } from './sphere2D';
import Vector from './vector';

export class SphereCollider {
  size: number;
  userData: Sphere2D;

  constructor(size: number, userData: Sphere2D) {
    this.userData = userData;
    this.size = size;
  }

  checkWalls() {
    if (
      this.userData.pos.x - this.size <= 0 ||
      this.userData.pos.x + this.size >= innerWidth
    ) {
      this.userData.vel.set(-this.userData.vel.x, this.userData.vel.y);
    } else if (
      this.userData.pos.y - this.size <= 0 ||
      this.userData.pos.y + this.size >= innerHeight
    ) {
      this.userData.vel.set(this.userData.vel.x, -this.userData.vel.y);
    }
  }

  update() {
    this.checkWalls();
  }
}
