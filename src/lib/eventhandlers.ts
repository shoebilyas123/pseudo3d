import { setKeyPressed, setKeyUp } from './canvas';

export const onKeyDown = (e: KeyboardEvent) => {
  if (e.key == ' ') {
    setKeyPressed('Spacebar');
  }

  if (
    e.key === 'ArrowUp' ||
    e.key === 'ArrowLeft' ||
    e.key === 'ArrowRight' ||
    e.key === 'ArrowDown' ||
    e.key === 'a' ||
    e.key === 'w' ||
    e.key === 's' ||
    e.key === 'd'
  ) {
    setKeyPressed(e.key);
  }
};

export const onKeyUp = (e: KeyboardEvent) => {
  if (
    e.key === 'ArrowUp' ||
    e.key === 'ArrowLeft' ||
    e.key === 'ArrowRight' ||
    e.key === 'ArrowDown' ||
    e.key === 'a' ||
    e.key === 'w' ||
    e.key === 's' ||
    e.key === 'd'
  ) {
    setKeyUp(e.key);
  }

  if (e.key == ' ') {
    setKeyUp('Spacebar');
  }
};
