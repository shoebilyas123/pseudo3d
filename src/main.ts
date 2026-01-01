import { Player } from './auto';
import CanvasAPI from './canvas';
import { DOF, MAP_SIZEX, MAP_SIZEY, SPRITE_SRCS, TILESIZE } from './constants';
import { onKeyDown, onKeyUp } from './lib/events';
import { map, rotateAround, toRadians } from './lib/math';
import { WorldTextures } from './types/canvas';

interface SceneData {
  dist: number;
  type: number;
  horizontal: boolean;
  angle: number;
}

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
  scene: SceneData[];

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
    this.scene = [];

    this.player = new Player(100, 224);

    this.cvs3D = new CanvasAPI('cvs-3d', MAP_SIZEX, MAP_SIZEY);

    document.body.addEventListener('keydown', onKeyDown);
    document.body.addEventListener('keyup', onKeyUp);
  }

  update() {
    this.player.update();
  }

  raycasting() {
    this.scene = [];
    let dist, color, h;
    let N = new Vector();
    this.hIntersects = [];
    this.vIntersects = [];
    let dof;
    let Ya = TILESIZE, Xa;
    let mapX = 0, mapY = 0;
    let iV = new Vector(), iH = new Vector();

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
        N.y = Math.floor(this.player.pos.y / TILESIZE) * TILESIZE - 0.0001; // Subtract small amount to handle boundary correctly
        Ya = -TILESIZE;
      }
      if (rayRad < Math.PI && rayRad > 0) {
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

        if (
          mapX >= 0 &&
          mapY >= 0 &&
          mapX < this.worldMap[0].length &&
          mapY < this.worldMap.length &&
          this.worldMap[mapY][mapX] > 0
        ) {
          // We hit a wall
          dof = DOF; // Stop loop
        } else {
          N.x += Xa;
          N.y += Ya;
          dof++;
        }
      }
      iH = N.copy();

      // ------Check vertical intersection
      dof = 0;
      N = new Vector();
      // NOTE: Fixed logic for looking left/right
      if (rayRad > 3 * Math.PI / 2 || rayRad < Math.PI / 2) {
        // Looking right
        N.x = Math.floor(this.player.pos.x / TILESIZE) * TILESIZE + TILESIZE;
        Xa = TILESIZE;
      }
      else if (rayRad > Math.PI / 2 && rayRad < 3 * Math.PI / 2) {
        // Looking left
        N.x = Math.floor(this.player.pos.x / TILESIZE) * TILESIZE - 0.0001;
        Xa = -TILESIZE;
      }

      // N.y calculation: tan(angle) = opposite/adjacent -> y = x * tan
      // dy/dx = tan(angle) -> dy = dx * tan(angle)
      N.y = this.player.pos.y + (N.x - this.player.pos.x) * pTan;

      // Using the tan = perpendicular / base formula
      Ya = Xa * pTan;

      if (rayRad == 3 * Math.PI / 2 || rayRad == Math.PI / 2) {
        dof = DOF;
        N.x = Infinity;
        N.y = Infinity;
      }

      while (dof < DOF) {
        mapX = Math.floor(N.x / TILESIZE);
        mapY = Math.floor(N.y / TILESIZE);

        if (
          mapX >= 0 &&
          mapY >= 0 &&
          mapX < this.worldMap[0].length &&
          mapY < this.worldMap.length &&
          this.worldMap[mapY][mapX] > 0
        ) {
          // We hit a wall vertical
          dof = DOF;
        } else {
          N.x += Xa;
          N.y += Ya;
          dof++;
        }
      }
      iV = N.copy();

      let hDist = iH.dist(this.player.pos);
      let vDist = iV.dist(this.player.pos);

      // Determine which ray is shorter
      if (vDist < hDist) {
        this.vIntersects.push(iV);
        dist = vDist;
        h = false;
        // Fix fisheye
        let ca = this.player.rot - rayRad;
        if (ca < 0) ca += 2 * Math.PI;
        if (ca > 2 * Math.PI) ca -= 2 * Math.PI;
        dist = dist * Math.cos(ca);

        this.scene.push({
          dist: dist,
          type: 1, // Default to 1 for now as map only has 1s
          horizontal: false,
          angle: rayRad
        });
      } else {
        this.hIntersects.push(iH);
        dist = hDist;
        h = true;
        // Fix fisheye
        let ca = this.player.rot - rayRad;
        if (ca < 0) ca += 2 * Math.PI;
        if (ca > 2 * Math.PI) ca -= 2 * Math.PI;
        dist = dist * Math.cos(ca);

        this.scene.push({
          dist: dist,
          type: 1,
          horizontal: true,
          angle: rayRad
        });
      }
    }
  }

  load3DScene() {
    // Width of each strip to fill the screen
    // 50 rays = 50 strips. 600 width / 50 = 12px per strip.
    const w = MAP_SIZEX / 50;

    for (let i = 0; i < this.scene.length; i++) {
      const data = this.scene[i];
      // Calculate height
      // h = (tileSize * distToProjPlane) / dist
      // distToProjPlane = (MAP_SIZEX / 2) / tan(FOV / 2)
      // FOV is approx 50 degrees? (loop -25 to 25)
      // Actually let's just tune the scalar.
      // Standard: projectedHeight = (realHeight / distance) * distanceToProjectionPlane

      let lineH = (TILESIZE * MAP_SIZEX) / data.dist;

      // Cap height to avoid drawing massive rectangles when inside a wall
      if (lineH > MAP_SIZEY) lineH = MAP_SIZEY;

      // Center the line
      const lineOff = (MAP_SIZEY / 2) - (lineH / 2);

      // Select color
      let color;
      // Use different color maps for horizontal/vertical to give depth perception
      // Assuming map value is index, here we just use the constant arrays
      if (data.horizontal) {
        // Use map value if we had it, for now pick one based on array index or constant
        // Since we pushed type: 1, let's use index 0 or something.
        // Or maybe index i helps differentiate strips? No, same wall should be same color.
        // Inspecting textureHeightMap... it's just colors.
        color = textureHeightMap[1]; // Greenish
      } else {
        color = textureHeightMapV[1]; // Darker Greenish
      }

      // Distance shading (fog)
      // Simple darkening: not implemented yet, using flat colors.

      this.cvs3D.fill(color);
      this.cvs3D.noStroke(); // No outline for strips
      // Draw the strip
      // i * w is the x position
      this.cvs3D.rect(i * w, lineOff, w + 1, lineH); // +1 width to fix gaps
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
    this.showRaycasts(); // Still show 2D rays
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
