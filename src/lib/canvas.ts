import { createVector2D } from '../lib/physics';
import Vector from '../physics/vector';

export const MOUSE: Vector = createVector2D(0, 0);

export const KEYPRESSED = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  a: false,
  w: false,
  s: false,
  d: false,
  Spacebar: false,
};

export const setKeyPressed = (key: keyof typeof KEYPRESSED) => {
  KEYPRESSED[key] = true;
};

export const setKeyUp = (key: keyof typeof KEYPRESSED) => {
  KEYPRESSED[key] = false;
};

export const setMouse = (x: number, y: number) => MOUSE.set(x, y);
