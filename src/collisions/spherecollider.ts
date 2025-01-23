import CanvasAPI from '../canvas';
import Vector from '../geometry/vector';
import { ColliderUserData } from '../types/collision';
import Collider from './collider';

export default class SphereCollider extends Collider {
  size: number;
  fill: string;
  stroke: string;

  highlight: boolean;

  constructor(
    s: number,
    userData: ColliderUserData,
    f?: string,
    strk?: string
  ) {
    super(userData);

    this.size = s;
    this.fill = f || 'rgba(0,0,0,0)';
    this.stroke = strk || 'rgba(0,0,0,0)';

    this.highlight = false;
  }

  setHighlight(v: boolean) {
    this.highlight = v;
  }

  draw(cP: CanvasAPI) {
    cP.fill(this.fill);
    cP.stroke(this.stroke);
    cP.circle(
      (this.userData?.pos as Vector).x,
      (this.userData?.pos as Vector).y,
      this.size
    );
  }
}
