import { Player } from './auto';
import CanvasAPI from './canvas';
import { DOF, MAP_SIZEX, MAP_SIZEY, SPRITE_SRCS, TILESIZE } from './constants';
import { onKeyDown, onKeyUp } from './lib/events';
import { map, rotateAround, toRadians } from './lib/math';
import { WorldTextures } from './types/canvas';

import './style.css';
import { Vector } from './geometry';
// Cleaned up the code and will implement pseudo 3d again tomorrow
// Currently the code doesn't include the backup folder that contains the actual code for pseudo-3d

const SPRITES: WorldTextures = {};

let assetLoader: Array<Promise<void>> = [];

const textureHeightMap = [
  'rgb(0,200,0)',
  'rgb(100,200,0)',
  'rgb(100,200,100)',
  'rgb(150,200,100)',
  'rgb(155,250,100)',
  'rgb(255,250,100)',
  'rgb(250,200,100)',
  'rgb(255,170,120)',
  'rgb(112, 83, 27)',
  'rgb(112, 83, 27)',
  'rgb(112, 83, 27)',
  'rgb(112, 83, 27)',
  'rgb(112, 83, 27)',
  'rgb(112, 83, 27)',
  'rgb(112, 83, 27)',
  'rgb(112, 83, 27)',
  'rgb(112, 83, 27)',
  'rgb(112, 83, 27)',
  'rgb(112, 83, 27)',
  'rgb(112, 83, 27)',
  'rgb(112, 83, 27)',
  'rgb(112, 83, 27)',
];

const textureHeightMapV = [
  'rgb(0,180,0)',
  'rgb(100,180,0)',
  'rgb(100,190,100)',
  'rgb(110,180,100)',
  'rgb(105,120,100)',
  'rgb(220,200,100)',
  'rgb(220,195,100)',
  'rgb(210,120,120)',
  'rgb(100, 50, 27)',
  'rgb(100, 50, 27)',
  'rgb(100, 50, 27)',
  'rgb(100, 50, 27)',
  'rgb(100, 50, 27)',
  'rgb(100, 50, 27)',
  'rgb(100, 50, 27)',
  'rgb(100, 50, 27)',
  'rgb(100, 50, 27)',
  'rgb(100, 50, 27)',
  'rgb(100, 50, 27)',
  'rgb(100, 50, 27)',
  'rgb(100, 50, 27)',
];

// Load images and push the function to the assetloader that resolves/rejects all promises
Object.entries(SPRITE_SRCS).forEach(async ([key, val]) => {
  assetLoader.push(
    new Promise((res) => {
      const img = new Image();
      img.src = val;

      img.decode();
      SPRITES[key] = img;
      res();
    })
  );
});

class Engine {
  cvs: CanvasAPI;
  cvs3D: CanvasAPI;
  WorldMapX: number;
  worldMap: Array<Array<number>>;
  player: Player;
  hIntersects: Vector[];
  vIntersects: Vector[];

  constructor() {
    this.cvs = new CanvasAPI('app', MAP_SIZEX, MAP_SIZEY);
    // Defines the number of blocks on the map
    this.WorldMapX = 10;
    this.worldMap = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    this.hIntersects = [];
    this.vIntersects = [];

    this.player = new Player(100, 224);

    this.cvs3D = new CanvasAPI('cvs-3d', MAP_SIZEX, MAP_SIZEY);

    document.body.addEventListener('keydown', onKeyDown);
    document.body.addEventListener('keyup', onKeyUp);
  }

  update() {
    this.player.update();
  }

  raycasting() {
    // Store the intersection point starting from the nearest intersection
    let N = new Vector();
    this.hIntersects = [];
    this.vIntersects = [];
    // Depth of field
    let dof;
    // Increment values for x and y to calculate the next intersection point
    let Ya = TILESIZE,
      Xa;
    // Store the cell that our ray collides with
    let mapX, mapY;
    // Store the individual vertical and horizontal intersections for comparison
    let iV: Vector, iH: Vector;
    for (let ray = -25; ray < 25; ray++) {
      dof = 0;
      N = new Vector();
      let rayRad = this.player.rot + toRadians(ray);

      // Ray gets inversed when less than 0 or greater than 2PI.
      // So, calculation keeps the ray angle between 0-2PI
      if (rayRad > 2 * Math.PI) {
        rayRad -= 2 * Math.PI;
      } else if (rayRad < 0) {
        rayRad += 2 * Math.PI;
      }

      let pTan = Math.tan(rayRad);

      // ------Check horizontal intersection
      if (rayRad > Math.PI) {
        // Looking up
        N.y = Math.floor(this.player.pos.y / TILESIZE) * TILESIZE;
        Ya = -TILESIZE;
      }
      if (rayRad > 0 && rayRad < Math.PI) {
        // Looking down
        N.y = Math.floor(this.player.pos.y / TILESIZE) * TILESIZE + TILESIZE;
        Ya = TILESIZE;
      }

      N.x = this.player.pos.x + (N.y - this.player.pos.y) / pTan;

      // Using the tan = perpendicular / base formula
      Xa = Ya / pTan;

      if (rayRad == 0 || rayRad == Math.PI) {
        dof = DOF;
        N.x = Infinity;
        N.y = Infinity;
      }

      while (dof < DOF) {
        mapX = Math.floor(N.x / TILESIZE);
        mapY = Math.floor(N.y / TILESIZE);

        if (rayRad > Math.PI) {
          mapY -= 1;
        }

        if (
          mapX >= 0 &&
          mapY >= 0 &&
          mapX < this.worldMap[0].length &&
          mapY < this.worldMap.length &&
          this.worldMap[mapX][mapY] > 0
        ) {
          // We hit a wall
          dof = DOF;
          break;
        } else {
          N.x += Xa;
          N.y += Ya;
        }
        dof++;
      }
      iH = N.copy();

      // ------Check horizontal intersection
      dof = 0;
      N = new Vector();
      if (rayRad < Math.PI / 2 || rayRad > (3 * Math.PI) / 2) {
        // Looking right
        N.x = Math.floor(this.player.pos.x / TILESIZE) * TILESIZE + TILESIZE;
        Xa = +TILESIZE;
      }
      if (rayRad > Math.PI / 2 && rayRad < (3 * Math.PI) / 2) {
        // Looking left
        N.x = Math.floor(this.player.pos.x / TILESIZE) * TILESIZE;
        Xa = -TILESIZE;
      }

      N.y = this.player.pos.y + (N.x - this.player.pos.x) * pTan;

      // Using the tan = perpendicular / base formula
      Ya = Xa * pTan;

      if (rayRad == (3 * Math.PI) / 2 || rayRad == Math.PI / 2) {
        dof = DOF;
        N.x = Infinity;
        N.y = Infinity;
      }

      while (dof < DOF) {
        mapX = Math.floor(N.x / TILESIZE);
        mapY = Math.floor(N.y / TILESIZE);

        if (rayRad > Math.PI / 2 && rayRad < (3 * Math.PI) / 2) {
          // If looking left
          mapX -= 1;
        }

        if (
          mapX >= 0 &&
          mapY >= 0 &&
          mapX < this.worldMap[0].length &&
          mapY < this.worldMap.length &&
          this.worldMap[mapX][mapY] > 0
        ) {
          // We hit a wall vertical
          dof = DOF;
          break;
        } else {
          N.x += Xa;
          N.y += Ya;
        }
        dof++;
      }
      iV = N.copy();

      if (iV.dist(this.player.pos) < iH.dist(this.player.pos)) {
        this.vIntersects.push(iV);
      } else {
        this.hIntersects.push(iH);
      }
    }
  }

  showRaycasts() {
    this.cvs.stroke('red');
    for (let i = 0; i < this.hIntersects.length; i++) {
      this.cvs.line(this.player.pos, this.hIntersects[i]);
    }

    this.cvs.stroke('darkred');

    for (let i = 0; i < this.vIntersects.length; i++) {
      this.cvs.line(this.player.pos, this.vIntersects[i]);
    }
  }

  render() {
    //   Update  data before paiting
    this.update();

    // Clear screen before painting
    this.cvs.clearScrn();
    this.cvs3D.clearScrn();
    /** 2D Paiting */
    // Load Terrain
    for (let i = 0; i < MAP_SIZEY; i += TILESIZE) {
      for (let j = 0; j < MAP_SIZEX; j += TILESIZE) {
        let color;
        if (this.worldMap[i / TILESIZE][j / TILESIZE] == 1) {
          color = 1;
        } else color = 0;

        if (color === 1) this.cvs.stroke('gray');
        else this.cvs.stroke('none');

        color = map(color, 0, 1, 0, 255);
        color = `rgb(${color},${color},${color})`;
        this.cvs.fill(color);
        this.cvs.rect(i, j, TILESIZE, TILESIZE);
      }
    }

    //   Player
    this.player.draw(this.cvs, true);
    /** 3D Painting */

    //   Raycasting algorithm
    this.raycasting();
    this.showRaycasts();
    this.load3DScene();
    requestAnimationFrame(this.render.bind(this));
  }
}

const game = new Engine();

// Run the main loop after all the required assets are loaded
Promise.all(assetLoader).then(() => {
  // Attach event listeneres
  game.render();
});
