/* Re-usables */
export const NOT_DEFINED = 'NOT_DEFINED' as const;

/* Canvas */
export const CANVAS_BG = '#09090b';

//----------------------
/* Physics */

// Coefficient of friction
export const FRICTION = 0.01 as const;

/* Mechanics */
export const PLAYER_VEL = 2 as const;
export const MAX_PLAYER_ACC = 0.5 as const;

//---------------------
/** Sprites and rendering constants*/
export const SPRITE_SRCS: Record<'floor', string> = {
  floor: '/sprites/wall.png',
};

// Size of each tile on the map
export const TILESIZE = 60;

// X and Y pixel count of map in the 2D plane
export const MAP_SIZEX = 600;
export const MAP_SIZEY = 600;

// Depth of field - How far the player
export const DOF = 10;
