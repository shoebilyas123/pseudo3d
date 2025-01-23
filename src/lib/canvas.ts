import Vector from '../geometry/vector';

export const MOUSE: Vector = new Vector(0, 0);

export const KEYPRESSED: Record<string, boolean> = {
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

export const setKeyPressed = (key: string) => {
  KEYPRESSED[key] = true;
};

export const setKeyUp = (key: string) => {
  KEYPRESSED[key] = false;
};

export const onKeyDown = (e: KeyboardEvent) => {
  if (e.key == ' ') {
    setKeyPressed('Spacebar');
  } else {
    setKeyPressed(e.key);
  }
};

export const onKeyUp = (e: KeyboardEvent) => {
  if (e.key == ' ') {
    setKeyUp('Spacebar');
  } else {
    setKeyUp(e.key);
  }
};

export const setMouse = (x: number, y: number) => MOUSE.set(x, y);
