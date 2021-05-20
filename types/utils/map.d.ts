import { Texture } from 'pixi.js';
import { EngineView } from '../map/EngineView';
import { Direction } from './constants';
export declare type ObjectVisualKey = 'idle' | 'idle_s' | 'idle_sw' | 'idle_w' | 'idle_nw' | 'idle_n' | 'idle_ne' | 'idle_e' | 'idle_se' | 'move_s' | 'move_sw' | 'move_w' | 'move_nw' | 'move_n' | 'move_ne' | 'move_e' | 'move_se' | string;
export declare type ColumnRowPair = {
    c: number;
    r: number;
};
export declare type PositionPair = {
    x: number;
    y: number;
};
export declare type ObjectInfoTextures = {
    [key in ObjectVisualKey]: Texture[];
};
export declare type ObjectInfoTextureNames = {
    [key in ObjectVisualKey]: string[];
};
export declare type ObjectInfoInteractionOffsets = {
    [key in ObjectVisualKey]: ColumnRowPair;
};
export declare type TileInfo = {
    m: boolean;
    t: Texture[];
};
export declare type MapDataObjectVisualFrame = {
    path: string;
};
export declare type MapDataObjectVisual = {
    frames: MapDataObjectVisualFrame[];
    path: string;
    extension: string;
    numberOfFrames: number;
    startIndex: number;
    ipoc: number;
    ipor: number;
};
export declare type MapDataObjectVisuals = {
    [key in ObjectVisualKey]: MapDataObjectVisual;
};
export declare type MapDataTile = {
    movable: boolean;
    path: string;
};
export declare type MapDataTiles = {
    [key: string]: MapDataTile;
};
export interface IObjectInfo {
    m: boolean;
    i: boolean;
    nt: boolean;
    f: boolean;
    s: unknown;
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
    id: string;
    textureNames: ObjectInfoTextureNames;
}
export declare type MapDataObjects = {
    [key: string]: IMapDataObject;
};
export declare type MapData = {
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
    groundMap: Array<{
        row: string;
    }>;
    objectsMap: Array<{
        row: string;
    }>;
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
export declare const getObjectInfo: (engine: EngineView, objectType: string) => IObjectInfo;
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
export declare const getObjectTextures: (engine: EngineView, objectType: string, visualId: ObjectVisualKey) => Texture[];
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
export declare const getTileInfo: (engine: EngineView, tileType: string) => TileInfo;
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
export declare const getMovingDirVisualId: (dir: Direction) => ObjectVisualKey;
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
export declare const getStationaryDirVisualId: (dir: Direction) => ObjectVisualKey;
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
export declare const getDirBetween: (r1: number, c1: number, r2: number, c2: number) => Direction;
