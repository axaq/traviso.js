import { ObjectVisualKey } from './map';
export declare type Direction = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export declare type Directions = {
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
export declare const DIRECTIONS: Directions;
export declare type ReservedTextureIDs = ObjectVisualKey[];
/**
 * @property {Array} RESERVED_TEXTURE_IDS
 * @protected
 * @static
 */
export declare const RESERVED_TEXTURE_IDS: ReservedTextureIDs;
/**
 * The types of available path finding algorithms
 *
 * @property {Object} PF_ALGORITHMS
 * @property {Number} PF_ALGORITHMS.ASTAR_ORTHOGONAL=0
 * @property {Number} PF_ALGORITHMS.ASTAR_DIAGONAL=1
 * @protected
 * @static
 */
export declare const PF_ALGORITHMS: {
    ASTAR_ORTHOGONAL: number;
    ASTAR_DIAGONAL: number;
};
export declare const KEY_EMPTY_TILE: string;
export declare const KEY_NO_OBJECTS: string;
