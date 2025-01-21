import { Sphere2D } from './sphere2D';

export class Collider {
  userData: Sphere2D;

  constructor(userData: Sphere2D) {
    this.userData = userData;
  }
}
