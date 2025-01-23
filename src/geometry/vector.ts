import { NOT_DEFINED } from '../constants';
import { random } from '../lib/math';

export default class Vector {
  x: number;
  y: number;

  constructor(x?: number | Vector, y?: number) {
    if (x instanceof Vector) {
      this.x = x.x || 0;
      this.y = x.y || 0;
    } else {
      this.x = x || 0;
      this.y = y || 0;
    }
  }
  // Static functions
  static add(v1: Vector, v2: Vector) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }
  static sub(v1: Vector, v2: Vector) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }
  static random2D() {
    return new Vector(random(-1, 1), random(-1, 1));
  }
  static div(v: Vector, k: number) {
    return new Vector(v.x / (k || 1), v.y / (k || 1));
  }
  static mult(v: Vector, k: number) {
    return new Vector(v.x * k, v.y * k);
  }
  static copy(v: Vector) {
    return new Vector(v.x, v.y);
  }
  static fromAngle(a: number) {
    return new Vector(Math.cos(a), Math.sin(a));
  }
  static dist(v1: Vector, v2: Vector) {
    return v1.dist(v2);
  }

  // Instance Functions
  getCoords() {
    return [this.x, this.y];
  }
  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;

    return this;
  }
  sub(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }
  mult(k: number) {
    this.x *= k;
    this.y *= k;

    return this;
  }
  div(k: number) {
    if (k !== 0) {
      this.x /= k;
      this.y /= k;
    }
  }
  mag() {
    // Returns the magnitude of a vector
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  normalize() {
    // Normalizes the vector to unit length
    const magn = this.mag();
    if (magn === 0) {
      return this;
    }

    this.x = this.x / magn;
    this.y = this.y / magn;

    return this;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  setMag(m: number) {
    // Sets the magnitude of this vector to the magnitude passed to the function
    this.normalize();
    this.x *= m;
    this.y *= m;

    return this;
  }
  dot(v: Vector) {
    // Returns the dot product of two vectors.
    return v.x * this.x + v.y * this.y;
  }

  angleBetween(v: Vector) {
    if (this.mag() === 0 || v.mag() === 0) {
      return NOT_DEFINED;
    }

    return Math.acos(this.dot(v) / (this.mag() * v.mag()));
  }

  dist(v: Vector) {
    // Returns the euclidian distance between two points.
    return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
  }

  limit(lim: number) {
    if (this.mag() > lim) {
      this.normalize().mult(lim);
    }

    return this;
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }
  copy() {
    return new Vector(this.x, this.y);
  }
}
