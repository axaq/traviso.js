import { ObjectVisualKey } from './map';

export type Direction = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Directions = {
    O: Direction;
    S: Direction;
    SW: Direction;
    W: Direction;
    NW: Direction;
    N: Direction;
    NE: Direction;
    E: Direction;
    SE: Direction;
};

// export type Traviso = {
//     DIRECTIONS: Directions,

// }

/**
 * The direction IDs to be used in the engine
 *
 * @property {Object} DIRECTIONS
 * @property {Number} DIRECTIONS.O=0 idle no direction
 * @property {Number} DIRECTIONS.S=1 south
 * @property {Number} DIRECTIONS.SW=2 south west
 * @property {Number} DIRECTIONS.W=3 west
 * @property {Number} DIRECTIONS.NW=4 north west
 * @property {Number} DIRECTIONS.N=5 north
 * @property {Number} DIRECTIONS.NE=6 north east
 * @property {Number} DIRECTIONS.E=7 east
 * @property {Number} DIRECTIONS.SE=8 south east
 * @protected
 * @static
 */
export const DIRECTIONS: Directions = {
    O: 0,
    S: 1,
    SW: 2,
    W: 3,
    NW: 4,
    N: 5,
    NE: 6,
    E: 7,
    SE: 8,
};

export type ReservedTextureIDs = ObjectVisualKey[];
/**
 * @property {Array} RESERVED_TEXTURE_IDS
 * @protected
 * @static
 */
export const RESERVED_TEXTURE_IDS: ReservedTextureIDs = [
    'idle',
    'idle_s',
    'idle_sw',
    'idle_w',
    'idle_nw',
    'idle_n',
    'idle_ne',
    'idle_e',
    'idle_se',
    'move_s',
    'move_sw',
    'move_w',
    'move_nw',
    'move_n',
    'move_ne',
    'move_e',
    'move_se',
];

/**
 * The types of available path finding algorithms
 *
 * @property {Object} PF_ALGORITHMS
 * @property {Number} PF_ALGORITHMS.ASTAR_ORTHOGONAL=0
 * @property {Number} PF_ALGORITHMS.ASTAR_DIAGONAL=1
 * @protected
 * @static
 */
export const PF_ALGORITHMS = {
    ASTAR_ORTHOGONAL: 0,
    ASTAR_DIAGONAL: 1,
};

export const KEY_EMPTY_TILE: string = '0';
export const KEY_NO_OBJECTS: string = '0';
