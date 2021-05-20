import { Container } from 'pixi.js';
import { ObjectView } from './ObjectView';
import { TileView } from './TileView';
import { MoveEngine, IMovable } from './MoveEngine';
import { GridNode } from '../pathFinding/GridNode';
import { ColumnRowPair, MapData, PositionPair } from '../utils/map';
declare type PositionFrame = {
    x: number;
    y: number;
    w: number;
    h: number;
};
export declare type EngineConfiguration = {
    minScale?: number;
    maxScale?: number;
    minZoom?: number;
    maxZoom?: number;
    zoomIncrement?: number;
    numberOfZoomLevels?: number;
    initialZoomLevel?: number;
    instantCameraZoom?: boolean;
    tileHeight?: number;
    isoAngle?: number;
    initialPositionFrame?: PositionFrame;
    pathFindingType?: number;
    pathFindingClosest?: boolean;
    followCharacter?: boolean;
    instantCameraRelocation?: boolean;
    instantObjectRelocation?: boolean;
    changeTransparencies?: boolean;
    highlightPath?: boolean;
    highlightTargetTile?: boolean;
    tileHighlightAnimated?: boolean;
    tileHighlightFillColor?: number;
    tileHighlightFillAlpha?: number;
    tileHighlightStrokeColor?: number;
    tileHighlightStrokeAlpha?: number;
    dontAutoMoveToTile?: boolean;
    checkPathOnEachTile?: boolean;
    mapDraggable?: boolean;
    backgroundColor?: number;
    useMask?: boolean;
    mapDataPath: string;
    assetsToLoad?: string[];
    engineInstanceReadyCallback?: (engineInstance: EngineView) => unknown;
    tileSelectCallback?: (r: number, c: number) => unknown;
    objectSelectCallback?: (objectView: ObjectView) => unknown;
    objectReachedDestinationCallback?: (objectView: ObjectView) => unknown;
    otherObjectsOnTheNextTileCallback?: (objectView: ObjectView, otherObjectViews: ObjectView[]) => unknown;
    objectUpdateCallback?: (objectView: ObjectView) => unknown;
};
/**
 * Main display object container class to hold all views
 * within the engine and all map related logic
 *
 * @class EngineView
 * @extends PIXI.Container
 * @constructor
 * @param config {Object} configuration object for the isometric engine instance
 * @param config.mapDataPath {String} the path to the xml file that defines map data, required
 */
export declare class EngineView extends Container {
    /**
     * Configuration object for the isometric engine instance
     *
     * @property {Object} config
     * @property {Number} config.minScale=0.5 minimum scale that the PIXI.Container for the map can get, default 0.5
     * @property {Number} config.maxScale=1.5 maximum scale that the PIXI.Container for the map can get, default 1.5
     * @property {Number} config.minZoom=-1 minimum zoom level, engine defined
     * @property {Number} config.maxZoom=1 maximum zoom level, engine defined
     * @property {Number} config.zoomIncrement=0.5 zoom increment amount calculated by the engine according to user settings, default 0.5
     * @property {Number} config.numberOfZoomLevels=5 used to calculate zoom increment, defined by user, default 5
     * @property {Number} config.initialZoomLevel=0 initial zoom level of the map, default 0
     * @property {Number} config.instantCameraZoom=false specifies whether to zoom instantly or with a tween animation, default false
     *
     * @property {Number} config.tileHeight=74 height of a single isometric tile, default 74
     * @property {Number} config.isoAngle=30 the angle between the top-left edge and the horizontal diagonal of a isometric quad, default 30
     *
     * @property {Object} config.initialPositionFrame frame to position the engine, default { x : 0, y : 0, w : 800, h : 600 }
     * @property {Number} config.initialPositionFrame.x x position of the engine, default 0
     * @property {Number} config.initialPositionFrame.y y position of the engine, default 0
     * @property {Number} config.initialPositionFrame.w width of the engine, default 800
     * @property {Number} config.initialPositionFrame.h height of the engine, default 600
     *
     * @property {Number} config.pathFindingType=TRAVISO.PF_ALGORITHMS.ASTAR_ORTHOGONAL the type of path finding algorithm two use, default TRAVISO.PF_ALGORITHMS.ASTAR_ORTHOGONAL
     * @property {Boolean} config.pathFindingClosest=false whether to return the path to the closest node if the target is unreachable, default false
     *
     * @property {Boolean} config.followCharacter=true defines if the camera will follow the current controllable or not, default true
     * @property {Boolean} config.instantCameraRelocation=false specifies whether the camera moves instantly or with a tween animation to the target location, default false
     * @property {Boolean} config.instantObjectRelocation=false specifies whether the map-objects will be moved to target location instantly or with an animation, default false
     *
     * @property {Boolean} config.changeTransparencies=true make objects transparent when the controllable is behind them, default true
     *
     * @property {Boolean} config.highlightPath=true highlight the path when the current controllable moves on the map, default true
     * @property {Boolean} config.highlightTargetTile=true highlight the target tile when the current controllable moves on the map, default true
     * @property {Boolean} config.tileHighlightAnimated=true animate the tile highlights, default true
     * @property {Number(Hexadecimal)} [config.tileHighlightFillColor=0x80d7ff] color code for the tile highlight fill (this will be overridden if a highlight-image is defined), default 0x80d7ff
     * @property {Number} [config.tileHighlightFillAlpha=0.5] alpha value for the tile highlight fill (this will be overridden if a highlight-image is defined), default 0.5
     * @property {Number(Hexadecimal)} [config.tileHighlightStrokeColor=0xFFFFFF] color code for the tile highlight stroke (this will be overridden if a highlight-image is defined), default 0xFFFFFF
     * @property {Number} [config.tileHighlightStrokeAlpha=1.0] alpha value for the tile highlight stroke (this will be overridden if a highlight-image is defined), default 1.0
     * @property {Boolean} config.dontAutoMoveToTile=false when a tile selected don't move the controllable immediately but still call 'tileSelectCallback', default false
     * @property {Boolean} config.checkPathOnEachTile=true looks for a path every time an object moves to a new tile (set to false if you don't have other moving objects on your map), default true
     *
     * @property {Boolean} config.mapDraggable=true enable dragging the map with touch-and-touchmove or mousedown-and-mousemove on the map, default true
     *
     * @property {Number(Hexadecimal)} config.backgroundColor=null background color, if defined the engine will create a solid colored background for the map, default null
     * @property {Boolean} config.useMask=false creates a mask using the position frame defined by 'initialPositionFrame' property or the 'posFrame' parameter that is passed to 'repositionContent' method, default false
     *
     * @property {String} config.mapDataPath the path to the json file that defines map data, required
     * @property {Array(String)} config.assetsToLoad=null array of paths to the assets that are desired to be loaded by traviso, no need to use if assets are already loaded to PIXI cache, default null
     *
     * @property {Function} config.engineInstanceReadyCallback=null callback function that will be called once everything is loaded and engine instance is ready, default null
     * @property {Function} config.tileSelectCallback=null callback function that will be called when a tile is selected (call params will be the row and column indexes of the tile selected), default null
     * @property {Function} config.objectSelectCallback=null callback function that will be called when a tile with an interactive map-object on it is selected (call param will be the object selected), default null
     * @property {Function} config.objectReachedDestinationCallback=null callback function that will be called when any moving object reaches its destination (call param will be the moving object itself), default null
     * @property {Function} config.otherObjectsOnTheNextTileCallback=null callback function that will be called when any moving object is in move and there are other objects on the next tile, default null
     * @property {Function} config.objectUpdateCallback=null callback function that will be called every time an objects direction or position changed, default null
     *
     * @private
     */
    private config;
    /**
     * height of a single isometric tile
     * @property {Number} TILE_H
     * @default 74
     * @private
     */
    private TILE_H;
    /**
     * the angle between the top-left edge and the horizontal diagonal of a isometric quad
     * @property {Number} ISO_ANGLE
     * @default 30
     * @private
     */
    private ISO_ANGLE;
    /**
     * half-height of a single isometric tile
     * @property {Number} TILE_HALF_H
     * @default 37
     * @private
     */
    TILE_HALF_H: number;
    /**
     * half-width of a single isometric tile
     * @property {Number} TILE_HALF_W
     * @default 64
     * @private
     */
    TILE_HALF_W: number;
    mapData: MapData;
    /**
     * MoveEngine instance to handle all animations and tweens
     * @property {MoveEngine} moveEngine
     * @private
     */
    moveEngine: MoveEngine;
    /**
     * Current scale of the map's display object
     * @property {Number} currentScale
     * @private
     */
    private currentScale;
    /**
     * Current zoom amount of the map
     * @property {Number} currentZoom
     * @private
     */
    private currentZoom;
    private posFrame;
    private externalCenter;
    /**
     * Solid colored background
     * @property {PIXI.Graphics} bg
     * @private
     */
    private bg;
    /**
     * Mask graphics for the mask
     * @property {PIXI.Graphics} mapMask
     * @private
     */
    private mapMask;
    /**
     * Display object for the map visuals
     * @property {PIXI.Container} mapContainer
     * @private
     */
    private mapContainer;
    /**
     * Display object for the ground/terrain visuals
     * @property {PIXI.Container} groundContainer
     * @private
     */
    private groundContainer;
    /**
     * Display object for the map-object visuals
     * @property {PIXI.Container} objContainer
     * @private
     */
    private objContainer;
    /**
     * Number of rows in the isometric map
     * @property {Number} mapSizeR
     */
    private mapSizeR;
    /**
     * Number of columns in the isometric map
     * @property {Number} mapSizeC
     */
    private mapSizeC;
    /**
     * Array to hold map-tiles
     * @property {Array(Array(TileView))} tileArray
     * @private
     */
    private tileArray;
    /**
     * Array to hold map-objects
     * @property {Array(Array(ObjectView))} objArray
     * @private
     */
    private objArray;
    /**
     * PathFinding instance to handle all path finding logic
     * @property {PathFinding} pathFinding
     * @private
     */
    private pathFinding;
    /**
     * Current controllable map-object that will be the default object to move in user interactions
     * @property {ObjectView} currentControllable
     * @private
     */
    private currentControllable;
    /**
     * Vertices of the map
     * @property {Array(Array(Number))} mapVertices
     * @private
     */
    private mapVertices;
    /**
     * Total width of all ground tiles
     * @property {Number} mapVisualWidthReal
     * @private
     */
    private mapVisualWidthReal;
    /**
     * Total height of all ground tiles
     * @property {Number} mapVisualHeightReal
     * @private
     */
    private mapVisualHeightReal;
    private currentFocusLocation;
    private mapVisualWidthScaled;
    private dragging;
    private dragInitStartingX;
    private dragInitStartingY;
    private dragPrevStartingX;
    private dragPrevStartingY;
    private onMouseUp_binded;
    private onMouseDown_binded;
    private onMouseMove_binded;
    constructor(config: EngineConfiguration);
    /**
     * Handles loading of necessary assets and map data for the given engine instance
     *
     * @method loadAssetsAndData
     * @for TRAVISO
     * @static
     * @private
     * @param engine {EngineView} engine instance
     * @param engine.config {Object} configuration object for the engine instance
     * @param [engine.config.assetsToLoad=null] {Array(String)} array of paths to the assets that are desired to be loaded by traviso, no need to use if assets are already loaded to PIXI cache, default null
     * @param [loadedCallback=null] {Function} Callback function
     */
    private loadAssetsAndData;
    /**
     * Handles loading of map data for the given engine instance
     *
     * @method assetsAndDataLoaded
     * @for TRAVISO
     * @static
     * @private
     * @param {Loader} loader engine instance
     * @param {Object} resources object holding the resources loaded
     * @param {MapData} resources.mapData.data the object that holds the json map data
     */
    private assetsAndDataLoaded;
    /**
     * This method is being called whenever all the assets are
     * loaded and engine is ready to initialize
     *
     * @method onAllAssetsLoaded
     * @private
     */
    private onAllAssetsLoaded;
    /**
     * Creates the map and setups necessary parameters for future map calculations
     *
     * @method createMap
     * @private
     */
    private createMap;
    /**
     * Calculates 2d x position of a tile
     *
     * @method getTilePosXFor
     * @param r {Number} row index of the tile
     * @param c {Number} column index of the tile
     * @return {Number} 2d x position of a tile
     */
    getTilePosXFor(r: number, c: number): number;
    /**
     * Calculates 2d y position of a tile
     *
     * @method getTilePosYFor
     * @param r {Number} row index of the tile
     * @param c {Number} column index of the tile
     * @return {Number} 2d y position of a tile
     */
    getTilePosYFor(r: number, c: number): number;
    /**
     * Shows or hides the display object that includes the objects-layer
     *
     * @method showHideObjectLayer
     * @param show=false {Boolean}
     */
    showHideObjectLayer(show?: boolean): void;
    /**
     * Shows or hides the display object that includes the ground/terrain layer
     *
     * @method showHideGroundLayer
     * @param show=false {Boolean}
     */
    showHideGroundLayer(show?: boolean): void;
    /**
     * Returns the TileView instance that sits in the location given
     *
     * @method getTileAtRowAndColumn
     * @param r {Number} row index of the tile
     * @param c {Number} column index of the tile
     * @return {TileView} the tile in the location given
     */
    getTileAtRowAndColumn(r: number, c: number): TileView;
    /**
     * Returns all the ObjectView instances referenced to the given location with the specified row and column indexes.
     *
     * @method getObjectsAtRowAndColumn
     * @param r {Number} the row index of the map location
     * @param c {Number} the column index of the map location
     * @return {Array(ObjectView)} an array of map-objects referenced to the given location
     */
    getObjectsAtRowAndColumn(r: number, c: number): ObjectView[];
    /**
     * Returns all the ObjectView instances referenced to the given location.
     *
     * @method getObjectsAtLocation
     * @param pos {Object} object including r and c coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     * @return {Array(ObjectView)} an array of map-objects referenced to the given location
     */
    private getObjectsAtLocation;
    /**
     * Creates and adds a predefined (in XML file) map-object to the map using the specified object type-id.
     *
     * @method createAndAddObjectToLocation
     * @param type {Number} type-id of the object as defined in the XML file
     * @param pos {Object} object including r and c coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     * @return {ObjectView} the newly created map-object
     */
    createAndAddObjectToLocation(type: string, pos: ColumnRowPair): ObjectView;
    /**
     * Adds an already-created object to the map.
     *
     * @method addObjectToLocation
     * @param obj {Object} either an external display object or a map-object (ObjectView)
     * @param obj.isMovableTo {Boolean} if the object can be moved onto by other map-objects
     * @param obj.columnSpan {Number} number of tiles that map-object covers horizontally on the isometric map
     * @param obj.rowSpan {Number} number of tiles that map-object covers vertically on the isometric map
     * @param pos {Object} object including r and c coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     * @return {Object} the newly added object
     */
    addObjectToLocation(obj: ObjectView, pos: ColumnRowPair): ObjectView;
    /**
     * Enables adding external custom display objects to the specified location.
     * This method should be used for the objects that are not already defined in XML file and don't have a type-id.
     * The resulting object will be independent of engine mechanics apart from depth controls.
     *
     * @method addCustomObjectToLocation
     * @param displayObject {PIXI.DisplayObject} object to be added to location
     * @param [displayObject.isMovableTo=true] {Boolean} if the object can be moved onto by other map-objects, default true
     * @param [displayObject.columnSpan] {Number} number of tiles that map-object covers horizontally on the isometric map
     * @param [displayObject.rowSpan] {Number} number of tiles that map-object covers vertically on the isometric map
     * @param pos {Object} object including r and c coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     * @return {Object} the newly added object
     */
    addCustomObjectToLocation(displayObject: ObjectView, pos: ColumnRowPair): ObjectView;
    /**
     * Removes the object and its references from the map.
     *
     * @method removeObjectFromLocation
     * @param obj {Object} either an external display object or a map-object (ObjectView)
     * @param [pos=null] {Object} object including r and c coordinates, if not defined the engine will use 'obj.mapPos' to remove the map-object
     * @param [pos.r] {Number} the row index of the map location
     * @param [pos.c] {Number} the column index of the map location
     */
    removeObjectFromLocation(obj: ObjectView, pos: ColumnRowPair): void;
    /**
     * Centralizes and zooms the EngineView instance to the object specified.
     *
     * @method focusMapToObject
     * @param obj {ObjectView} the object that map will be focused with respect to
     * @param obj.mapPos {Object} the object that holds the location of the map-object on the map
     * @param obj.mapPos.c {Number} the column index of the map location
     * @param obj.mapPos.r {Number} the row index of the map location
     * @param obj.columnSpan {Number} number of tiles that map-object covers horizontally on the isometric map
     * @param obj.rowSpan {Number} number of tiles that map-object covers vertically on the isometric map
     */
    focusMapToObject(obj: ObjectView): void;
    /**
     * Centralizes and zooms the EngineView instance to the map location specified by row and column index.
     *
     * @method focusMapToLocation
     * @param c {Number} the column index of the map location
     * @param r {Number} the row index of the map location
     * @param zoomAmount {Number} targeted zoom level for focusing
     */
    focusMapToLocation(c: number, r: number, zoomAmount: number): void;
    /**
     * Centralizes the EngineView instance to the object specified.
     *
     * @method centralizeToObject
     * @param obj {ObjectView} the object that map will be centralized with respect to
     * @param obj.mapPos {Object} the object that holds the location of the map-object on the map
     * @param obj.mapPos.c {Number} the column index of the map location
     * @param obj.mapPos.r {Number} the row index of the map location
     */
    centralizeToObject(obj: ObjectView): void;
    /**
     * Centralizes the EngineView instance to the map location specified by row and column index.
     *
     * @method centralizeToLocation
     * @param c {Number} the column index of the map location
     * @param r {Number} the row index of the map location
     * @param [instantRelocate=false] {Boolean} specifies if the camera move will be animated or instant
     */
    centralizeToLocation(c: number, r: number, instantRelocate: boolean): void;
    /**
     * Centralizes the EngineView instance to the current location of the attention/focus.
     *
     * @method centralizeToCurrentFocusLocation
     * @param [instantRelocate=false] {Boolean} specifies if the camera move will be animated or instant
     */
    centralizeToCurrentFocusLocation(instantRelocate: boolean): void;
    /**
     * External center is the central point of the frame defined by the user to be used as the visual size of the engine.
     * This method centralizes the EngineView instance with respect to this external center-point.
     *
     * @method centralizeToCurrentExternalCenter
     * @param [instantRelocate=false] {Boolean} specifies if the camera move will be animated or instant
     */
    centralizeToCurrentExternalCenter(instantRelocate: boolean): void;
    /**
     * Centralizes the EngineView instance to the points specified.
     *
     * @method centralizeToPoint
     * @param px {Number} the x coordinate of the center point with respect to EngineView frame
     * @param py {Number} the y coordinate of the center point with respect to EngineView frame
     * @param [instantRelocate=false] {Boolean} specifies if the relocation will be animated or instant
     */
    centralizeToPoint(px: number, py: number, instantRelocate: boolean): void;
    /**
     * Sets all the parameters related to zooming in and out.
     *
     * @method setZoomParameters
     * @param [minScale=0.5] {Number} minimum scale that the PIXI.Container for the map can get, default 0.5
     * @param [maxScale=1.5] {Number} maximum scale that the PIXI.Container for the map can get, default 1.5
     * @param [numberOfZoomLevels=5] {Number} used to calculate zoom increment, defined by user, default 5
     * @param [initialZoomLevel=0] {Number} initial zoom level of the map, default 0
     * @param [instantCameraZoom=false] {Boolean} specifies whether to zoom instantly or with a tween animation, default false
     */
    setZoomParameters(minScale: number, maxScale: number, numberOfZoomLevels: number, initialZoomLevel: number, instantCameraZoom?: boolean): void;
    /**
     * Sets map's scale.
     *
     * @method setScale
     * @private
     * @param s {Number} scale amount for both x and y coordinates
     * @param [instantZoom=false] {Boolean} specifies if the scaling will be animated or instant
     */
    private setScale;
    /**
     * Zooms camera by to the amount given.
     *
     * @method zoomTo
     * @param zoomAmount {Number} specifies zoom amount (between -1 and 1). Use -1, -0.5, 0, 0,5, 1 for better results.
     * @param [instantZoom=false] {Boolean} specifies whether to zoom instantly or with a tween animation
     */
    zoomTo(zoomAmount: number, instantZoom: boolean): void;
    /**
     * Zooms the camera one level out.
     *
     * @method zoomOut
     * @param [instantZoom=false] {Boolean} specifies whether to zoom instantly or with a tween animation
     */
    zoomOut(instantZoom: boolean): void;
    /**
     * Zooms the camera one level in.
     *
     * @method zoomIn
     * @param [instantZoom=false] {Boolean} specifies whether to zoom instantly or with a tween animation
     */
    zoomIn(instantZoom: boolean): void;
    /**
     * Returns the current controllable map-object.
     *
     * @method getCurrentControllable
     * @return {ObjectView} current controllable map-object
     */
    getCurrentControllable(): ObjectView;
    /**
     * Sets a map-object as the current controllable. This object will be moving in further relevant user interactions.
     *
     * @method setCurrentControllable
     * @param obj {ObjectView} object to be set as current controllable
     * @param obj.mapPos {Object} object including r and c coordinates
     * @param obj.mapPos.c {Number} the column index of the map location
     * @param obj.mapPos.r {Number} the row index of the map location
     */
    setCurrentControllable(obj: ObjectView): void;
    /**
     * Adds a reference of the given map-object to the given location in the object array.
     * This should be called when an object moved or transferred to the corresponding location.
     * Uses objects size property to add its reference to all relevant cells.
     *
     * @private
     * @method addObjRefToLocation
     * @param obj {ObjectView} object to be bind to location
     * @param obj.columnSpan {Number} number of tiles that map-object covers horizontally on the isometric map
     * @param obj.rowSpan {Number} number of tiles that map-object covers vertically on the isometric map
     * @param pos {Object} object including r and c coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     */
    private addObjRefToLocation;
    /**
     * Adds a reference of the given map-object to the given location in the object array.
     * Updates the cell as movable or not according to the object being movable onto or not.
     *
     * @private
     * @method addObjRefToSingleLocation
     * @param obj {ObjectView} object to be bind to location
     * @param obj.isMovableTo {Boolean} is the object is movable onto by the other objects or not
     * @param pos {Object} object including r and c coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     */
    private addObjRefToSingleLocation;
    /**
     * Removes references of the given map-object from the given location in the object array.
     * This should be called when an object moved or transferred from the corresponding location.
     * Uses objects size property to remove its references from all relevant cells.
     *
     * @private
     * @method removeObjRefFromLocation
     * @param obj {ObjectView} object to be bind to location
     * @param obj.columnSpan {Number} number of tiles that map-object covers horizontally on the isometric map
     * @param obj.rowSpan {Number} number of tiles that map-object covers vertically on the isometric map
     * @param pos {Object} object including r and c coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     */
    private removeObjRefFromLocation;
    /**
     * Removes a reference of the given map-object from the given location in the object array.
     * Updates the cell as movable or not according to the other object references in the same cell.
     *
     * @private
     * @method removeObjRefFromSingleLocation
     * @param obj {ObjectView} object to be bind to location
     * @param pos {Object} object including r and c coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     */
    private removeObjRefFromSingleLocation;
    /**
     * Sets alphas of the map-objects referenced to the given location.
     *
     * @method changeObjAlphasInLocation
     * @param value {Number} alpha value, should be between 0 and 1
     * @param pos {ColumnRowPair} object including r and c coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     */
    changeObjAlphasInLocation(value: number, pos: ColumnRowPair): void;
    /**
     * Sets a map-object's location and logically moves it to the new location.
     *
     * @private
     * @method arrangeObjLocation
     * @param obj {ObjectView} map-object to be moved
     * @param obj.mapPos {Object} object including r and c coordinates
     * @param obj.mapPos.c {Number} the column index of the map location
     * @param obj.mapPos.r {Number} the row index of the map location
     * @param pos {ColumnRowPair} object including r and c coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     */
    private arrangeObjLocation;
    /**
     * Sets occlusion transparencies according to given map-object's location.
     * This method only works for user-controllable object.
     *
     * @private
     * @method arrangeObjTransparencies
     * @param obj {ObjectView} current controllable map-object
     * @param prevPos {Object} previous location of the map-object
     * @param prevPos.r {Number} the row index of the map location
     * @param prevPos.c {Number} the column index of the map location
     * @param pos {Object} new location of the map-object
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     */
    private arrangeObjTransparencies;
    /**
     * Arranges depths (z-index) of the map-objects starting from the given location.
     *
     * @private
     * @method arrangeDepthsFromLocation
     * @param pos {Object} location object including the map coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     */
    private arrangeDepthsFromLocation;
    /**
     * Clears the highlight for the old path and highlights the new path on map.
     *
     * @method arrangePathHighlight
     * @private
     * @param [currentPath] {Array(Object)} the old path to clear the highlight from
     * @param newPath {Array(Object)} the new path to highlight
     */
    private arrangePathHighlight;
    /**
     * Stops a moving object.
     *
     * @method stopObject
     * @private
     * @param obj {ObjectView} map-object to be moved on path
     */
    private stopObject;
    /**
     * Moves the specified map-object through a path.
     *
     * @method moveObjThrough
     * @private
     * @param obj {ObjectView} map-object to be moved on path
     * @param obj.mapPos {Object} object including r and c coordinates of the map-object
     * @param obj.mapPos.c {Number} the column index of the map location
     * @param obj.mapPos.r {Number} the row index of the map location
     * @param path {Array(Object)} path to move object on
     * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
     */
    private moveObjThrough;
    /**
     * Sets up the engine at the beginning of each tile change move for the specified object
     *
     * @method onObjMoveStepBegin
     * @private
     * @param obj {ObjectView} map-object that is being moved
     * @param obj.mapPos {Object} object including r and c coordinates of the map-object
     * @param obj.mapPos.c {Number} the column index of the map location
     * @param obj.mapPos.r {Number} the row index of the map location
     * @param [obj.currentDirection="idle"] {Number} current direction id of the map-object
     * @param pos {Object} object including r and c coordinates for the target location
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     * @return {Boolean} if the target tile was available and map-object has moved
     */
    private onObjMoveStepBegin;
    /**
     * Sets up the engine at the end of each tile change move for the specified object
     *
     * @method onObjMoveStepEnd
     * @private
     * @param obj {ObjectView} map-object that is being moved
     * @param obj.mapPos {Object} object including r and c coordinates of the map-object
     * @param obj.mapPos.c {Number} the column index of the map location
     * @param obj.mapPos.r {Number} the row index of the map location
     * @param obj.currentPath {Array(Object)} current path assigned to the map-object
     * @param obj.currentPathStep {Number} current step on the path
     * @param [obj.currentDirection="idle"] {String} current direction id of the map-object
     */
    onObjMoveStepEnd(obj: IMovable): void;
    checkForFollowCharacter(obj: IMovable): void;
    checkForTileChange(obj: IMovable): void;
    /**
     * Searches and returns a path between two locations if there is one.
     *
     * @method getPath
     * @param from {Object} object including r and c coordinates of the source location
     * @param from.c {Number} the column index of the map location
     * @param from.r {Number} the row index of the map location
     * @param to {Object} object including r and c coordinates of the target location
     * @param to.c {Number} the column index of the map location
     * @param to.r {Number} the row index of the map location
     * @return {Array(Object)} an array of path items defining the path
     */
    getPath(from: ColumnRowPair, to: ColumnRowPair): GridNode[];
    /**
     * Checks for a path and moves the map-object on map if there is an available path
     *
     * @method checkAndMoveObjectToTile
     * @param obj {ObjectView} map-object that is being moved
     * @param obj.mapPos {Object} object including r and c coordinates of the map-object
     * @param obj.mapPos.c {Number} the column index of the map location
     * @param obj.mapPos.r {Number} the row index of the map location
     * @param tile {TileView} target map-tile or any custom object that has 'mapPos' and 'isMovableTo' defined
     * @param tile.isMovableTo {Boolean} if the target tile is movable onto
     * @param tile.mapPos {Object} object including r and c coordinates of the map-tile
     * @param tile.mapPos.c {Number} the column index of the map location
     * @param tile.mapPos.r {Number} the row index of the map location
     * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
     * @return {Boolean} if there is an available path to move to the target tile
     */
    checkAndMoveObjectToTile(obj: ObjectView, tile: TileView, speed?: number): boolean;
    /**
     * Checks for a path and moves the map-object on map if there is an available path
     *
     * @method checkAndMoveObjectToLocation
     * @param obj {ObjectView} map-object that is being moved
     * @param obj.mapPos {Object} object including r and c coordinates of the map-object
     * @param obj.mapPos.c {Number} the column index of the map location
     * @param obj.mapPos.r {Number} the row index of the map location
     * @param pos {Object} object including r and c coordinates for the target location
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
     * @return {Boolean} if there is an available path to move to the target tile
     */
    checkAndMoveObjectToLocation(obj: ObjectView, pos: ColumnRowPair, speed?: number): boolean;
    /**
     * Moves the current controllable map-object to a location if available.
     *
     * @method moveCurrentControllableToLocation
     * @param pos {Object} object including r and c coordinates for the target location
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
     * @return {Boolean} if there is an available path to move to the target tile
     */
    moveCurrentControllableToLocation(pos: ColumnRowPair, speed?: number): boolean;
    /**
     * Moves the current controllable map-object to one of the adjacent available tiles of the map-object specified.
     *
     * @method moveCurrentControllableToObj
     * @param obj {ObjectView} target map-object
     * @param obj.mapPos {Object} object including r and c coordinates
     * @param obj.mapPos.c {Number} the column index of the map location
     * @param obj.mapPos.r {Number} the row index of the map location
     * @param obj.columnSpan {Number} number of tiles that map-object covers horizontally on the isometric map
     * @param obj.rowSpan {Number} number of tiles that map-object covers vertically on the isometric map
     * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
     * @return {Boolean} if there is an available path to move to the target map-object
     */
    moveCurrentControllableToObj(obj: ObjectView, speed?: number): boolean;
    /**
     * Finds the nearest tile to the point given in the map's local scope.
     *
     * @method getTileFromLocalPos
     * @param lp {Object} point to check
     * @param lp.x {Number} x component
     * @param lp.y {Number} y component
     * @return {TileView} the nearest map-tile if there is one
     */
    getTileFromLocalPos(lp: PositionPair): TileView;
    /**
     * Checks if an interaction occurs using the interaction data coming from PIXI.
     * If there is any interaction starts necessary movements or performs necessary callbacks.
     *
     * @method checkForTileClick
     * @private
     * @param interactionData {Object} interaction data coming from PIXI
     * @param interactionData.global {Object} global interaction point
     */
    private checkForTileClick;
    /**
     * Enables mouse/touch interactions.
     *
     * @method enableInteraction
     */
    enableInteraction(): void;
    /**
     * Disables mouse/touch interactions.
     *
     * @method disableInteraction
     */
    disableInteraction(): void;
    /**
     * Checks if the given point is inside the masked area if there is a mask defined.
     *
     * @method isInteractionInMask
     * @private
     * @param p {Object} point to check
     * @param p.x {Number} x component
     * @param p.y {Number} y component
     * @return {Boolean} if the point is inside the masked area
     */
    private isInteractionInMask;
    private onMouseDown;
    private onMouseMove;
    private onMouseUp;
    /**
     * Repositions the content according to user settings. Call this method
     * whenever you want to change the size or position of the engine.
     *
     * @param {PositionFrame} [posFrame]  frame to position the engine, default is { x : 0, y : 0, w : 800, h : 600 }
     */
    repositionContent(posFrame?: PositionFrame): void;
    /**
     * Clears all references and stops all animations inside the engine.
     * Call this method when you want to get rid of an engine instance.
     *
     * @method destroy
     */
    destroy(): void;
    /**
     * specifies whether to zoom instantly or with a tween animation
     * @property {Boolean} instantCameraZoom
     * @default false
     */
    get instantCameraZoom(): boolean;
    set instantCameraZoom(value: boolean);
    /**
     * defines if the camera will follow the current controllable or not
     * @property {Boolean} followCharacter
     * @default true
     */
    get followCharacter(): boolean;
    set followCharacter(value: boolean);
    /**
     * specifies whether the camera moves instantly or with a tween animation to the target location
     * @property {Boolean} instantCameraRelocation
     * @default false
     */
    get instantCameraRelocation(): boolean;
    set instantCameraRelocation(value: boolean);
    /**
     * specifies whether the map-objects will be moved to target location instantly or with an animation
     * @property {Boolean} instantObjectRelocation
     * @default false
     */
    get instantObjectRelocation(): boolean;
    set instantObjectRelocation(value: boolean);
    /**
     * make objects transparent when the controllable is behind them
     * @property {Boolean} changeTransparencies
     * @default true
     */
    get changeTransparencies(): boolean;
    set changeTransparencies(value: boolean);
    /**
     * highlight the path when the current controllable moves on the map
     * @property {Boolean} highlightPath
     * @default true
     */
    get highlightPath(): boolean;
    set highlightPath(value: boolean);
    /**
     * highlight the target tile when the current controllable moves on the map
     * @member {Boolean} highlightTargetTile
     * @default true
     */
    get highlightTargetTile(): boolean;
    set highlightTargetTile(value: boolean);
    /**
     * animate the tile highlights
     * @member {Boolean} tileHighlightAnimated
     * @default true
     */
    get tileHighlightAnimated(): boolean;
    set tileHighlightAnimated(value: boolean);
    /**
     * when a tile selected don't move the controllable immediately but still call 'tileSelectCallback'
     * @member {Boolean} dontAutoMoveToTile
     * @default false
     */
    get dontAutoMoveToTile(): boolean;
    set dontAutoMoveToTile(value: boolean);
    /**
     * engine looks for a path every time an object moves to a new tile on the path
     * (set to false if you don't have moving objects other then your controllable on your map)
     * @property {Boolean} checkPathOnEachTile
     * @default true
     */
    get checkPathOnEachTile(): boolean;
    set checkPathOnEachTile(value: boolean);
    /**
     * enable dragging the map with touch-and-touchmove or mousedown-and-mousemove on the map
     * @property {Boolean} mapDraggable
     * @default true
     */
    get mapDraggable(): boolean;
    set mapDraggable(value: boolean);
    /**
     * callback function that will be called once everything is loaded and engine instance is ready
     * @property {Function}
     * @default null
     */
    get engineInstanceReadyCallback(): (engineInstance: EngineView) => unknown;
    set engineInstanceReadyCallback(value: (engineInstance: EngineView) => unknown);
    /**
     * callback function that will be called when a tile is selected. Params will be the row and column indexes of the tile selected.
     * @property {Function} tileSelectCallback
     * @default null
     */
    get tileSelectCallback(): (r: number, c: number) => unknown;
    set tileSelectCallback(value: (r: number, c: number) => unknown);
    /**
     * callback function that will be called when a tile with an interactive map-object on it is selected. Call param will be the object selected.
     * @property {Function} objectSelectCallback
     * @default null
     */
    get objectSelectCallback(): (objectView: ObjectView) => unknown;
    set objectSelectCallback(value: (objectView: ObjectView) => unknown);
    /**
     * callback function that will be called when any moving object reaches its destination. Call param will be the moving object itself.
     * @property {Function} objectReachedDestinationCallback
     * @default null
     */
    get objectReachedDestinationCallback(): (objectView: ObjectView) => unknown;
    set objectReachedDestinationCallback(value: (objectView: ObjectView) => unknown);
    /**
     * callback function that will be called when any moving object is in move and there are other objects on the next tile. Call params will be the moving object and an array of objects on the next tile.
     * @property {Function} otherObjectsOnTheNextTileCallback
     * @default null
     */
    get otherObjectsOnTheNextTileCallback(): (objectView: ObjectView, otherObjectViews: ObjectView[]) => unknown;
    set otherObjectsOnTheNextTileCallback(value: (objectView: ObjectView, otherObjectViews: ObjectView[]) => unknown);
    /**
     * callback function that will be called every time an objects direction or position changed
     * @property {Function} objectUpdateCallback
     * @default null
     */
    get objectUpdateCallback(): (objectView: ObjectView) => unknown;
    set objectUpdateCallback(value: (objectView: ObjectView) => unknown);
    /**
     * alpha value for the tile highlight stroke (this will be overridden if a highlight-image is defined)
     * @property {number} tileHighlightStrokeAlpha
     * @default 1.0
     */
    get tileHighlightStrokeAlpha(): number;
    set tileHighlightStrokeAlpha(value: number);
    /**
     * color code for the tile highlight stroke (this will be overridden if a highlight-image is defined)
     * @property {number} tileHighlightStrokeColor
     * @default 0xFFFFFF
     */
    get tileHighlightStrokeColor(): number;
    set tileHighlightStrokeColor(value: number);
    /**
     * alpha value for the tile highlight fill (this will be overridden if a highlight-image is defined)
     * @property {number} tileHighlightFillAlpha
     * @default 1.0
     */
    get tileHighlightFillAlpha(): number;
    set tileHighlightFillAlpha(value: number);
    /**
     * color code for the tile highlight fill (this will be overridden if a highlight-image is defined)
     * @property {number} tileHighlightFillColor
     * @default 0x80d7ff
     */
    get tileHighlightFillColor(): number;
    set tileHighlightFillColor(value: number);
}
export {};
