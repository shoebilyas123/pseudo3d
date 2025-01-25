import { Player } from './auto';
import CanvasAPI from './canvas';
import { DOF, MAP_SIZEX, MAP_SIZEY, SPRITE_SRCS, TILESIZE } from './constants';
import { onKeyDown, onKeyUp } from './lib/events';
import { map, rotateAround } from './lib/math';
import { WorldTextures } from './types/canvas';

import './style.css';
import Ray from './geometry/ray';
import { Vector } from './geometry';
import { createVector2D } from './lib/geometry';
// Cleaned up the code and will implement pseudo 3d again tomorrow
// Currently the code doesn't include the backup folder that contains the actual code for pseudo-3d

const SPRITES: WorldTextures = {};

let assetLoader: Array<Promise<void>> = [];

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

    this.player = new Player(100, 224);

    this.cvs3D = new CanvasAPI('cvs-3d', MAP_SIZEX, MAP_SIZEY);

    document.body.addEventListener('keydown', onKeyDown);
    document.body.addEventListener('keyup', onKeyUp);
  }

  update() {
    this.player.update();
  }

  render() {
    //   Update  data before paiting
    this.update();

    // Clear screen before painting
    this.cvs.clearScrn();

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
    // rayCasting();
    requestAnimationFrame(this.render.bind(this));
  }
}

const game = new Engine();

// Run the main loop after all the required assets are loaded
Promise.all(assetLoader).then(() => {
  // Attach event listeneres
  game.render();
});
