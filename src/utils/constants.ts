import { ObjectVisualKey } from './map';

export type TDirection = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
/** Type declaration for reserved direction IDs */
export type TDirections = {
    /** idle, no direction */
    O: 0;
    /** south */
    S: 1;
    /** south-west */
    SW: 2;
    /** west */
    W: 3;
    /** north-west */
    NW: 4;
    /** north */
    N: 5;
    /** north-east */
    NE: 6;
    /** east */
    E: 7;
    /** south-east */
    SE: 8;
};

// export type Traviso = {
//     DIRECTIONS: TDirections,

// }

/**
 * The direction IDs to be used in the engine
 *
 * @memberof TRAVISO
 * @for TRAVISO
 *
 * @static
 * @protected
 * @constant
 * @property
 *
 * @property {TDirection} DIRECTIONS.O=0 idle, no direction
 * @property {TDirection} DIRECTIONS.S=1 south
 * @property {TDirection} DIRECTIONS.SW=2 south west
 * @property {TDirection} DIRECTIONS.W=3 west
 * @property {TDirection} DIRECTIONS.NW=4 north west
 * @property {TDirection} DIRECTIONS.N=5 north
 * @property {TDirection} DIRECTIONS.NE=6 north east
 * @property {TDirection} DIRECTIONS.E=7 east
 * @property {TDirection} DIRECTIONS.SE=8 south east
 */
export const DIRECTIONS: TDirections = {
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

export type TReservedTextureIDs = ObjectVisualKey[];
/**
 * Texture IDs reserved for internal use
 *
 * @static
 * @protected
 * @constant
 * @property
 * @internal
 */
export const RESERVED_TEXTURE_IDS: TReservedTextureIDs = [
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

/** Type declaration for the IDs of available path finding algorithms */
export type TPathFindingAlgorithmID = 0 | 1;
/** Type declaration for available path finding algorithms */
export type TPathFindingAlgorithms = {
    ASTAR_ORTHOGONAL: TPathFindingAlgorithmID,
    ASTAR_DIAGONAL: TPathFindingAlgorithmID,
};
/**
 * The types of available path finding algorithms
 *
 * @static
 * @protected
 * @constant
 * @property
 * @public
 */
export const PF_ALGORITHMS: TPathFindingAlgorithms = {
    ASTAR_ORTHOGONAL: 0,
    ASTAR_DIAGONAL: 1,
};

export const KEY_EMPTY_TILE: string = '0';
export const KEY_NO_OBJECTS: string = '0';
