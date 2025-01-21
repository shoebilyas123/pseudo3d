import { CavnasAPI } from '../canvas';
import { onKeyDown, onKeyUp } from '../lib/eventhandlers';
import { map } from '../lib/utils';
import { LineCollider } from '../physics/linecollider';
import Vector from '../physics/vector';
import { Player } from './player';

export class Game {
  cvs: CavnasAPI;
  cvs3D: CavnasAPI;
  player: Player;
  map: Array<Array<number>>;
  sceneW: number;
  sceneH: number;
  blockW: number;
  blockH: number;
  blockWCap: number;
  blockHCap: number;
  lineColliders: Array<LineCollider>;
  scene3D: Vector[];

  constructor() {
    this.cvs = new CavnasAPI('app', 600, 600);
    this.cvs3D = new CavnasAPI('cvs-3d', 600, 600);

    this.player = new Player(100, 100, 20, 10, '', 'white');
    // this.map = [
    //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
    //   [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    // ];

    this.map = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    this.sceneH = 600;
    this.sceneW = 600;
    this.blockHCap = this.map.length;
    this.blockWCap = this.map[0].length;
    this.blockW = this.sceneW / this.blockWCap;
    this.blockH = this.sceneH / this.blockHCap;
    this.lineColliders = [];
    this.scene3D = [];

    // Mouse and keyboard event handlers
    document.body.addEventListener('keydown', onKeyDown);
    document.body.addEventListener('keyup', onKeyUp);

    // Starts the animation loop
    this.render();
  }

  loadMap() {
    this.lineColliders = [];
    for (let i = 0; i < this.blockHCap; i++) {
      for (let j = 0; j < this.blockWCap; j++) {
        const x = i * this.blockW + this.blockW / 2;
        const y = j * this.blockH + this.blockH / 2;
        const color = map(this.map[i][j], 0, 1, 0, 255);
        this.cvs.rect(x, y, this.blockW, this.blockW, {
          fill: `rgb(${color},${color}, ${color})`,
          stroke: 'gray',
        });

        if (color > 0) {
          const lineBottom = new LineCollider(
            x - this.blockW / 2,
            y + this.blockH / 2,
            x + this.blockW / 2,
            y + this.blockH / 2
          );

          const lineTop = new LineCollider(
            x - this.blockW / 2,
            y - this.blockH / 2,
            x + this.blockW / 2,
            y - this.blockH / 2
          );

          const lineRight = new LineCollider(
            x + this.blockW / 2,
            y - this.blockH / 2,
            x + this.blockW / 2,
            y + this.blockH / 2
          );

          const lineLeft = new LineCollider(
            x - this.blockW / 2,
            y - this.blockH / 2,
            x - this.blockW / 2,
            y + this.blockH / 2
          );

          this.lineColliders.push(lineBottom, lineTop, lineRight, lineLeft);
        }
      }
    }
  }

  showColliders() {
    for (let coll of this.lineColliders) {
      this.cvs.line(coll.a.x, coll.a.y, coll.b.x, coll.b.y, {
        stroke: 'lightgreen',
      });
    }
  }
  showRaycasts() {
    for (let i = 0; i < this.scene3D.length; i++) {
      this.cvs.lineVec(this.player.pos, this.scene3D[i], {
        stroke: 'lightgreen',
      });
    }
  }

  load3DScene() {
    const renderCount = this.scene3D.length;
    const renderW = this.sceneW / renderCount;

    for (let i = 0; i < renderCount; i++) {
      const dist = this.scene3D[i].dist(this.player.pos);
      let renderHeight = (this.sceneH / dist) * 100;
      const wallColor = map(dist, 0, 480, 255, 0);

      if (renderHeight > this.sceneH) renderHeight = this.sceneH;
      this.cvs3D.rect(i * renderW, this.sceneH / 2, renderW + 1, renderHeight, {
        fill: `rgba(${wallColor}, ${wallColor},${wallColor})`,
        stroke: 'nofill',
      });
    }
  }

  update() {
    this.scene3D = this.player.getRayCasts(this.lineColliders);
    this.player.update();
  }

  render() {
    this.cvs.clearScrn();
    this.cvs3D.clearScrn();
    this.loadMap();
    this.update();

    this.load3DScene();
    this.player.draw(this.cvs);
    this.showRaycasts();

    requestAnimationFrame(this.render.bind(this));
  }
}
