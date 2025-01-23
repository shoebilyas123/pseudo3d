import { ColliderUserData } from '../types/collision';

export default class Collider {
  userData: ColliderUserData;

  constructor(userData: ColliderUserData) {
    this.userData = userData;
  }
}
