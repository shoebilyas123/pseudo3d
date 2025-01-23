import { SphereCollider } from '../collisions';
import Vector from '../geometry/vector';

export const createVector2D = (x?: number, y?: number) =>
  new Vector(x || 0, y || 0);

export const pntInLineX = (p: Vector, l1: Vector, l2: Vector) =>
  ((l2.x - l1.x) / (l2.y - l1.y)) * (p.y - l1.y) + l1.x;

export const pntInLineY = (p: Vector, l1: Vector, l2: Vector) =>
  ((l2.y - l1.y) / (l2.x - l1.x)) * (p.x - l1.x) + l1.y;

export const cTocCheck = (c1: SphereCollider, c2: SphereCollider) => {
  if (c1.userData.pos.dist(c2.userData.pos) <= c1.size + c2.size) return true;

  return false;
};
