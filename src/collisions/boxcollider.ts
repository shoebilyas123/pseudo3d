import CavnasAPI from '../canvas';
import Collider from './collider';
import { ColliderUserData } from '../types/collision';

export default class BoxCollider extends Collider {
  width: number;
  height: number;

  constructor(w: number, ht: number, uData: ColliderUserData) {
    super(uData);
    this.width = w;
    this.height = ht;
  }

  update() {}

  draw(cP: CavnasAPI) {
    if (this.userData?.pos) {
      cP.fill('gray');
      cP.stroke('white');
      cP.lineWidth(3);
      cP.rect(
        this.userData.pos.x,
        this.userData.pos.y,
        this.width,
        this.height
      );
    }
  }
}
