import Vector from '../geometry/vector';

// Type Definitions

export type KeyPressTypes = Record<string, boolean>;

export const MOUSE: Vector = new Vector(0, 0);

export const KEYPRESSED: KeyPressTypes = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  a: false,
  w: false,
  s: false,
  d: false,
  Sp: false,
} as const;

export const setKeyPressed = (key: string) => {
  KEYPRESSED[key] = true;
};

export const setKeyUp = (key: string) => {
  KEYPRESSED[key] = false;
};

export const onKeyDown = (e: KeyboardEvent) => {
  if (e.key != ' ') {
    setKeyPressed(e.key);
  } else {
    setKeyPressed('Sp');
  }
};

export const onKeyUp = (e: KeyboardEvent) => {
  if (e.key != ' ') {
    setKeyUp(e.key);
  } else {
    setKeyUp('Sp');
  }
};

export const setMouse = (x: number, y: number) => MOUSE.set(x, y);
