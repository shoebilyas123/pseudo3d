import { CANVAS_BG } from '../constants';
import { setMouse } from '../lib/canvas';
import { createVector2D } from '../lib/geometry';
import Vector from '../geometry/vector';

export default class CavnasAPI {
  cvs: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ORIGIN: Vector;
  cW?: number;
  cH?: number;
  rectMode: 'CENTER' | 'VERTICES';

  constructor(elemId?: string, w?: number, h?: number) {
    if (elemId) {
      this.cvs = document.getElementById(elemId) as HTMLCanvasElement;
    } else {
      this.cvs = document.querySelector('canvas') as HTMLCanvasElement;
    }

    this.ctx = this.cvs.getContext('2d') as CanvasRenderingContext2D;
    this.cW = w || undefined;
    this.cH = h || undefined;
    this.rectMode = 'VERTICES';
    this.ORIGIN = createVector2D(0, 0);

    this.resize();
    window.onresize = this.resize.bind(this);

    this.cvs.addEventListener('mousemove', (e) => {
      e.preventDefault();
      setMouse(e.clientX, e.clientY);
    });
  }

  setOrigin(x: number, y: number) {
    this.ORIGIN = this.ORIGIN.set(x, y);
  }

  stroke(s: string | CanvasGradient | CanvasPattern) {
    this.ctx.strokeStyle = s;
  }
  fill(f: string | CanvasGradient | CanvasPattern) {
    this.ctx.fillStyle = f;
  }
  noFill() {
    this.ctx.fillStyle = 'none';
  }
  noStroke() {
    this.ctx.strokeStyle = 'none';
  }
  lineWidth(lw: number) {
    this.ctx.lineWidth = lw;
  }

  line(v1: Vector | number, v2: Vector | number, v3?: number, v4?: number) {
    this.ctx.beginPath();
    if (typeof v1 === 'object' && typeof v2 === 'object') {
      this.ctx.moveTo(this.ORIGIN.x + v1.x, this.ORIGIN.y + v1.y);
      this.ctx.lineTo(this.ORIGIN.x + v2.x, this.ORIGIN.y + v2.y);
    } else if (typeof v1 === 'number' && typeof v2 === 'number' && v4 && v3) {
      this.ctx.moveTo(this.ORIGIN.x + v1, this.ORIGIN.y + v2);
      this.ctx.lineTo(this.ORIGIN.x + v3, this.ORIGIN.y + v4);
    }

    this.ctx.stroke();
  }

  circle(x: number, y: number, r: number, deg?: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + this.ORIGIN.x, y + this.ORIGIN.y);
    this.ctx.arc(
      x + this.ORIGIN.x,
      y + this.ORIGIN.y,
      r,
      0,
      deg ? (deg * Math.PI) / 180 : 2 * Math.PI
    );

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
  }

  rect(x: number, y: number, w: number, h: number) {
    this.ctx.beginPath();
    if (this.rectMode === 'CENTER') {
      this.ctx.moveTo(x + this.ORIGIN.x - w / 2, y + this.ORIGIN.y - h / 2);
      this.ctx.rect(x + this.ORIGIN.x - w / 2, y + this.ORIGIN.y - h / 2, w, h);
    } else {
      this.ctx.moveTo(x + this.ORIGIN.x, y + this.ORIGIN.y);
      this.ctx.rect(x + this.ORIGIN.x, y + this.ORIGIN.y, w, h);
    }
    this.ctx.fill();
    this.ctx.closePath();
  }

  poly(pnts: Array<Vector>) {
    this.ctx.beginPath();
    this.ctx.moveTo(pnts[0].x + this.ORIGIN.x, pnts[0].y + this.ORIGIN.y);

    for (let p = 1; p < pnts.length; p++) {
      this.ctx.lineTo(pnts[p].x + this.ORIGIN.y, pnts[p].y + this.ORIGIN.y);
    }
    this.ctx.closePath();

    this.ctx.stroke();
  }

  resize() {
    this.cvs.width = this.cW || window.innerWidth;
    this.cvs.height = this.cH || window.innerHeight;
    this.clearScrn();
  }

  clearScrn() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    this.ctx.rect(0, 0, this.cvs.width, this.cvs.height);
    this.ctx.fillStyle = CANVAS_BG;
    this.ctx.fill();
    this.ctx.lineWidth = 1;
  }
}
