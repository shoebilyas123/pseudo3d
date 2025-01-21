import { CVS_BG } from '../constants/canvas';
import { setMouse } from '../lib/canvas';
import { createVector2D } from '../lib/physics';
import Vector from '../physics/vector';
import { DrawCircleOptions, DrawLineOptions } from '../types/canvas';

export class CavnasAPI {
  cvs: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ORIGIN: Vector;
  customWidth?: number;
  customHeight?: number;

  constructor(elemId?: string, w?: number, h?: number) {
    if (elemId) {
      this.cvs = document.getElementById(elemId) as HTMLCanvasElement;
    } else {
      this.cvs = document.querySelector('canvas') as HTMLCanvasElement;
    }

    this.ctx = this.cvs.getContext('2d') as CanvasRenderingContext2D;
    this.customWidth = w || undefined;
    this.customHeight = h || undefined;

    this.resize();
    window.onresize = this.resize.bind(this);

    this.ORIGIN = createVector2D(0, 0);
    // this.ORIGIN = createVector2D(window.innerWidth / 2, window.innerHeight / 2);

    this.cvs.addEventListener('mousemove', (e) => {
      e.preventDefault();
      setMouse(e.clientX, e.clientY);
    });
  }

  line(
    from_x: number,
    from_y: number,
    to_x: number,
    to_y: number,
    opts?: DrawLineOptions
  ) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.ORIGIN.x + from_x, this.ORIGIN.y + from_y);
    this.ctx.lineTo(this.ORIGIN.x + to_x, this.ORIGIN.y + to_y);
    this.ctx.strokeStyle = opts?.stroke || 'white';

    if (!!opts) {
      this.ctx.lineWidth = opts?.lineWidth || 1;
    }

    this.ctx.stroke();
    this.ctx.closePath();
  }

  lineVec(from: Vector, to: Vector, opts?: DrawLineOptions) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.ORIGIN.x + from.x, this.ORIGIN.y + from.y);
    this.ctx.lineTo(this.ORIGIN.x + to.x, this.ORIGIN.y + to.y);
    this.ctx.strokeStyle = opts?.stroke || 'white';

    if (!!opts) {
      this.ctx.lineWidth = opts?.lineWidth || 1;
    }

    this.ctx.stroke();
    this.ctx.closePath();
  }

  setOrigin(x: number, y: number) {
    this.ORIGIN = this.ORIGIN.set(x, y);
  }

  circle(x: number, y: number, r: number, opts?: DrawCircleOptions) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + this.ORIGIN.x, y + this.ORIGIN.y);
    this.ctx.arc(x + this.ORIGIN.x, y + this.ORIGIN.y, r, 0, 2 * Math.PI);

    this.ctx.strokeStyle = opts?.stroke || 'white';
    this.ctx.lineWidth = opts?.lineWidth || 1;
    this.ctx.fillStyle = opts?.fill || '';

    this.ctx.fill();
    this.ctx.stroke();
  }

  image(
    dx: number,
    dy: number,
    img: CanvasImageSource,
    opts?: { sx: number; sy: number; dWidth: number; dHeight: number }
  ) {
    this.ctx.beginPath();
    this.ctx.moveTo(dx + this.ORIGIN.x, dy + this.ORIGIN.y);

    if (!!opts) {
      const { sx, sy, dWidth, dHeight } = opts;
      this.ctx.drawImage(
        img,
        sx,
        sy,
        dWidth,
        dHeight,
        dx + this.ORIGIN.x,
        dy + this.ORIGIN.y,
        dWidth,
        dHeight
      );
    } else {
      this.ctx.drawImage(img, dx + this.ORIGIN.x, dy + this.ORIGIN.y);
    }
    this.ctx.closePath();
  }

  rect(x: number, y: number, w: number, h: number, opts?: DrawCircleOptions) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + this.ORIGIN.x - w / 2, y + this.ORIGIN.y - h / 2);
    this.ctx.rect(x + this.ORIGIN.x - w / 2, y + this.ORIGIN.y - h / 2, w, h);
    if (opts?.stroke !== 'nofill') {
      this.ctx.strokeStyle = opts?.stroke || 'white';
      this.ctx.lineWidth = opts?.lineWidth || 1;
      this.ctx.stroke();
    }
    this.ctx.fillStyle = opts?.fill || '';
    this.ctx.fill();
  }

  poly(pnts: Array<Vector>, stroke?: string, fill?: string | CanvasGradient) {
    this.ctx.beginPath();
    this.ctx.moveTo(pnts[0].x + this.ORIGIN.x, pnts[0].y + this.ORIGIN.y);

    for (let p = 1; p < pnts.length; p++) {
      this.ctx.lineTo(pnts[p].x + this.ORIGIN.y, pnts[p].y + this.ORIGIN.y);
    }
    this.ctx.closePath();

    this.ctx.strokeStyle = stroke || 'white';
    this.ctx.stroke();
    this.ctx.fillStyle = fill || 'gray';
    this.ctx.fill();
  }

  resize() {
    this.cvs.width = this.customWidth || window.innerWidth;
    this.cvs.height = this.customHeight || window.innerHeight;
    this.clearScrn();
  }

  clearScrn() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    this.ctx.rect(0, 0, this.cvs.width, this.cvs.height);
    this.ctx.fillStyle = CVS_BG;
    this.ctx.fill();
    this.ctx.lineWidth = 1;
  }
}
