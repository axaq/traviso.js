import { Texture } from 'pixi.js';
import { EngineView } from '../map/EngineView';
import { Direction, DIRECTIONS, RESERVED_TEXTURE_IDS } from './constants';
import { trace } from './trace';

export type ObjectVisualKey =
    | 'idle'
    | 'idle_s'
    | 'idle_sw'
    | 'idle_w'
    | 'idle_nw'
    | 'idle_n'
    | 'idle_ne'
    | 'idle_e'
    | 'idle_se'
    | 'move_s'
    | 'move_sw'
    | 'move_w'
    | 'move_nw'
    | 'move_n'
    | 'move_ne'
    | 'move_e'
    | 'move_se'
    | string;
export type ColumnRowPair = { c: number; r: number };
export type PositionPair = { x: number; y: number };
export type ObjectInfoTextures = { [key in ObjectVisualKey]: Texture[] };
export type ObjectInfoTextureNames = { [key in ObjectVisualKey]: string[] };
export type ObjectInfoInteractionOffsets = {
    [key in ObjectVisualKey]: ColumnRowPair;
};

export type TileInfo = {
    m: boolean;
    t: Texture[];
};

export type MapDataObjectVisualFrame = { path: string };

export type MapDataObjectVisual = {
    frames: MapDataObjectVisualFrame[];
    path: string;
    extension: string;
    numberOfFrames: number;
    startIndex: number;
    ipoc: number;
    ipor: number;
};

export type MapDataObjectVisuals = {
    [key in ObjectVisualKey]: MapDataObjectVisual;
};

export type MapDataTile = { movable: boolean; path: string };
export type MapDataTiles = {
    [key: string]: MapDataTile;
};

export interface IObjectInfo {
    m: boolean;
    i: boolean;
    nt: boolean;
    f: boolean;
    s: unknown; // TODO: This is probably not being used any more
    t: ObjectInfoTextures;
    io: ObjectInfoInteractionOffsets;
    rowSpan: number;
    columnSpan: number;
}
export interface IMapDataObject extends IObjectInfo {
    movable: boolean;
    interactive: boolean;
    noTransparency: boolean;
    floor: boolean;
    visuals: MapDataObjectVisuals;
    // added by engine
    id: string;
    textureNames: ObjectInfoTextureNames;
}
export type MapDataObjects = {
    [key: string]: IMapDataObject;
};

export type MapData = {
    tiles: MapDataTiles;
    objects: MapDataObjects;
    initialControllableLocation: {
        columnIndex: number;
        rowIndex: number;
        controllableId: string;
    };
    tileHighlightImage: {
        path: string;
    };
    singleGroundImage: {
        path: string;
        scale: number;
    };
    groundMap: Array<{ row: string }>;
    objectsMap: Array<{ row: string }>;
    // added by engine
    groundMapData: string[][];
    objectsMapData: string[][];
};

/**
 * Returns an object with all properties of a map-object defined by object-type
 *
 * @function getObjectInfo
 * @static
 * @memberof TRAVISO
 * @private
 * @param engine {EngineView} engine instance
 * @param objectType {String} type/id of the related object tag defined in the xml file
 * @return {Object} an object with all properties of a map-object
 */
export const getObjectInfo = (engine: EngineView, objectType: string): IObjectInfo => {
    const objInfo: IMapDataObject = engine.mapData.objects[objectType];
    if (objInfo) {
        const textures: ObjectInfoTextures = {};
        for (const key in objInfo.textureNames) {
            if (Object.prototype.hasOwnProperty.call(objInfo.textureNames, key)) {
                textures[key] = getObjectTextures(engine, objectType, key);
            }
        }
        return {
            m: objInfo.m,
            i: objInfo.i,
            f: objInfo.f,
            nt: objInfo.nt,
            t: textures,
            io: objInfo.io,
            s: objInfo.s,
            rowSpan: objInfo.rowSpan,
            columnSpan: objInfo.columnSpan,
        };
    }

    throw new Error('TRAVISO: No info defined for object type: ' + objectType);
};
/**
 * Returns an array of textures {PIXI.Texture} belong to a map-object defined by object-type and sprite-id
 *
 * @function getObjectTextures
 * @memberof TRAVISO
 * @static
 * @private
 * @param engine {EngineView} engine instance
 * @param objectType {String} type/id of the related object tag defined in the xml file
 * @param visualId {String} id of the related v tag defined in the xml file
 * @return {Array(PIXI.Texture)} an array of textures
 */
export const getObjectTextures = (engine: EngineView, objectType: string, visualId: ObjectVisualKey): Texture[] => {
    const objInfo: IMapDataObject = engine.mapData.objects[objectType];
    if (objInfo) {
        let textures = null;
        const textureNames = objInfo.textureNames[visualId];
        if (textureNames && textureNames.length > 0) {
            textures = [];
            for (let j = 0; j < textureNames.length; j++) {
                textures[textures.length] = Texture.from(textureNames[j]);
            }
        } else {
            trace('No textures defined for object type: ' + objectType + ' and visualId: ' + visualId);
        }
        return textures;
    }

    throw new Error('TRAVISO: No info defined for object type: ' + objectType);
};

/**
 * Returns an object with all properties of a map-tile defined by tileType
 *
 * @function getTileInfo
 * @memberof TRAVISO
 * @static
 * @private
 * @param engine {EngineView} engine instance
 * @param tileType {String} type/id of the related tile tag defined in the xml file
 * @return {Object} an object with all properties of a map-tile
 */
export const getTileInfo = (engine: EngineView, tileType: string): TileInfo => {
    const tileInfo = engine.mapData.tiles[tileType];
    if (tileInfo) {
        return {
            // m : tileInfo.m,
            m: tileInfo.movable,
            // t : tileInfo.t ? [PIXI.Texture.fromFrame(tileInfo.t)] : []
            t: tileInfo.path ? [Texture.from(tileInfo.path)] : [],
        };
    } else if (engine.mapData.singleGroundImage) {
        return {
            m: parseInt(tileType) > 0,
            t: [],
        };
    } else {
        throw new Error('TRAVISO: No info defined for tile type: ' + tileType);
    }
};

/**
 * Returns the predefined moving texture id for the given direction
 *
 * @function getMovingDirVisualId
 * @memberof TRAVISO
 * @static
 * @private
 * @param dir {Number} index of the direction
 * @return {String} texture id for the given direction
 */
export const getMovingDirVisualId = (dir: Direction): ObjectVisualKey => {
    return RESERVED_TEXTURE_IDS[dir + 8];
};

/**
 * Returns the predefined stationary texture id for the given direction
 *
 * @function getStationaryDirVisualId
 * @memberof TRAVISO
 * @static
 * @private
 * @param dir {Number} index of the direction
 * @return {String} texture id for the given direction
 */
export const getStationaryDirVisualId = (dir: Direction): ObjectVisualKey => {
    return RESERVED_TEXTURE_IDS[dir];
};

/**
 * Returns the direction (id) between two locations
 *
 * @function getDirBetween
 * @memberof TRAVISO
 * @static
 * @private
 * @param r1 {Number} row index of the first location
 * @param c1 {Number} column index of the first location
 * @param r2 {Number} row index of the second location
 * @param c2 {Number} column index of the second location
 * @return {Number} direction id
 */
export const getDirBetween = (r1: number, c1: number, r2: number, c2: number): Direction => {
    let dir = DIRECTIONS.S;
    if (r1 === r2) {
        if (c1 === c2) {
            dir = DIRECTIONS.O;
        } else if (c1 < c2) {
            dir = DIRECTIONS.NE;
        } else {
            dir = DIRECTIONS.SW;
        }
    } else if (r1 < r2) {
        if (c1 === c2) {
            dir = DIRECTIONS.SE;
        } else if (c1 < c2) {
            dir = DIRECTIONS.E;
        } else {
            dir = DIRECTIONS.S;
        }
    } else if (r1 > r2) {
        if (c1 === c2) {
            dir = DIRECTIONS.NW;
        } else if (c1 < c2) {
            dir = DIRECTIONS.N;
        } else {
            dir = DIRECTIONS.W;
        }
    }
    return dir;
};
