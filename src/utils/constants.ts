import { ObjectVisualKey } from './map';

export type TDirection = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
/** Type declaration for reserved direction IDs */
export type TDirections = {
    /** idle, no direction */
    readonly O: 0;
    /** south */
    readonly S: 1;
    /** south-west */
    readonly SW: 2;
    /** west */
    readonly W: 3;
    /** north-west */
    readonly NW: 4;
    /** north */
    readonly N: 5;
    /** north-east */
    readonly NE: 6;
    /** east */
    readonly E: 7;
    /** south-east */
    readonly SE: 8;
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
 * @property
 * @static
 * @public
 * @constant
 */
export const DIRECTIONS: Readonly<TDirections> = {
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
 * @private
 * @constant
 * @property
 * @internal
 */
export const RESERVED_TEXTURE_IDS: Readonly<TReservedTextureIDs> = [
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
    readonly ASTAR_ORTHOGONAL: TPathFindingAlgorithmID;
    readonly ASTAR_DIAGONAL: TPathFindingAlgorithmID;
};
/**
 * The types of available path finding algorithms
 *
 * @memberof TRAVISO
 * @for TRAVISO
 *
 * @property
 * @static
 * @public
 * @constant
 */
export const PF_ALGORITHMS: Readonly<TPathFindingAlgorithms> = {
    ASTAR_ORTHOGONAL: 0,
    ASTAR_DIAGONAL: 1,
};

export const KEY_EMPTY_TILE: string = '0';
export const KEY_NO_OBJECTS: string = '0';
