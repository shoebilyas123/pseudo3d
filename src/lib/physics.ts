import { SphereCollider } from '../physics/spherecollider';
import Vector from '../physics/vector';

export const createVector2D = (x?: number, y?: number) =>
  new Vector(x || 0, y || 0);

interface VectorParams {
  x: number;
  y: number;
}

export const pntInLineX = (p: Vector, p1: VectorParams, p2: VectorParams) =>
  ((p2.x - p1.x) / (p2.y - p1.y)) * (p.y - p1.y) + p1.x;

export const pntInLineY = (p: Vector, p1: VectorParams, p2: VectorParams) =>
  ((p2.y - p1.y) / (p2.x - p1.x)) * (p.x - p1.x) + p1.y;

export const cToCAabbCheck = (c1: SphereCollider, c2: SphereCollider) => {
  if (c1.userData.pos.dist(c2.userData.pos) <= c1.size + c2.size) return true;

  return false;
};
