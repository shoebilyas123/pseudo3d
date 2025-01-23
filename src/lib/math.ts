// Type Definitions
type RandomFunc = (_?: number | Array<number>, __?: number) => number;
type DistFunc = (x1: number, y1: number, x2: number, y2: number) => number;
type MapFunc = (
  v: number,
  min1: number,
  max1: number,
  min2: number,
  max2: number
) => number;
export type GetNumRetNumFunc = (_: number) => number;

// Type Implementations
export const random: RandomFunc = (min, max) => {
  const rand = Math.random();
  if (min) {
    if (typeof min === 'number' && !max) return rand * min;
    else if (typeof min === 'number' && max) {
      if (min > max) {
        const temp = max;
        max = min;
        min = temp;
      }

      return (max - min) * rand + min;
    } else if (Array.isArray(min)) {
      return min[Math.floor(rand * min.length)];
    }
  }

  return rand;
};

export const dist: DistFunc = (x1, y1, x2, y2) =>
  Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

export const map: MapFunc = (v, min1, max1, min2, max2) => {
  return min2 + (v - min1) * ((max2 - min2) / (max1 - min1));
};

export const toRadians: GetNumRetNumFunc = (angle) => {
  return (angle * Math.PI) / 180;
};
