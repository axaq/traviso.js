import { Texture, Container, Graphics, InteractionData, InteractionEvent, Loader, Sprite } from 'pixi.js';
import { ObjectView } from './ObjectView';
import { TileView } from './TileView';
import { MoveEngine, IMovable, ITweenTarget } from './MoveEngine';
import { GridNode } from '../pathFinding/GridNode';
import { PathFinding } from '../pathFinding/PathFinding';
import { existy, getDist, isInPolygon, mathMap } from '../utils/calculations';
import { KEY_EMPTY_TILE, KEY_NO_OBJECTS, PF_ALGORITHMS } from '../utils/constants';
import { trace } from '../utils/trace';
import {
    ColumnRowPair,
    getDirBetween,
    MapData,
    IMapDataObject,
    MapDataObjectVisual,
    ObjectInfoInteractionOffsets,
    ObjectInfoTextureNames,
    ObjectVisualKey,
    PositionPair,
} from '../utils/map';

type PositionFrame = { x: number; y: number; w: number; h: number };
export type EngineConfiguration = {
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
 */
export class EngineView extends Container {
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
    private config: EngineConfiguration;

    /**
     * The default height of a single isometric tile
     * 
     * @default 74
     * @property
     * @private
     * @internal
     */
    private static DEFAULT_TILE_H: number = 74;
    // /**
    //  * width of a single isometric tile
    //  * @property {Number} TILE_W
    //  * @default 128
    //  * @private
    //  */
    // private TILE_W: number;
    /**
     * The default angle (in degrees) between the top-left edge and the horizontal diagonal of a isometric quad
     * 
     * @default 30
     * @property
     * @private
     * @internal
     */
    private static DEFAULT_ISO_ANGLE: number = 30;
    /**
     * half-height of a single isometric tile
     * @property {number} TILE_HALF_H
     * @default 37
     * @private
     * @internal
     */
    public TILE_HALF_H: number;
    /**
     * half-width of a single isometric tile
     * @property {Number} TILE_HALF_W
     * @default 64
     * @private
     */
    public TILE_HALF_W: number;

    public mapData: MapData;

    /**
     * MoveEngine instance to handle all animations and tweens
     * @property {MoveEngine} moveEngine
     * @private
     */
    public moveEngine: MoveEngine;
    /**
     * Current scale of the map's display object
     * @property {Number} currentScale
     * @private
     */
    private currentScale: number;
    /**
     * Current zoom amount of the map
     * @property {Number} currentZoom
     * @private
     */
    private currentZoom: number;

    private posFrame: PositionFrame = { x: 0, y: 0, w: 800, h: 600 };

    private externalCenter: PositionPair;

    /**
     * Solid colored background
     * @property {PIXI.Graphics} bg
     * @private
     */
    private bg: Graphics;
    /**
     * Mask graphics for the mask
     * @property {PIXI.Graphics} mapMask
     * @private
     */
    private mapMask: Graphics;
    /**
     * Display object for the map visuals
     * @property {PIXI.Container} mapContainer
     * @private
     */
    private mapContainer: Container;
    /**
     * Display object for the ground/terrain visuals
     * @property {PIXI.Container} groundContainer
     * @private
     */
    private groundContainer: Container;
    /**
     * Display object for the map-object visuals
     * @property {PIXI.Container} objContainer
     * @private
     */
    private objContainer: Container;
    /**
     * Number of rows in the isometric map
     * @property {Number} mapSizeR
     */
    private mapSizeR: number;
    /**
     * Number of columns in the isometric map
     * @property {Number} mapSizeC
     */
    private mapSizeC: number;
    /**
     * Array to hold map-tiles
     * @property {Array(Array(TileView))} tileArray
     * @private
     */
    private tileArray: TileView[][];
    /**
     * Array to hold map-objects
     * @property {Array(Array(ObjectView))} objArray
     * @private
     */
    private objArray: ObjectView[][][];
    /**
     * PathFinding instance to handle all path finding logic
     * @property {PathFinding} pathFinding
     * @private
     */
    private pathFinding: PathFinding;
    /**
     * Current controllable map-object that will be the default object to move in user interactions
     * @property {ObjectView} currentControllable
     * @private
     */
    private currentControllable: ObjectView;
    /**
     * Vertices of the map
     * @property {Array(Array(Number))} mapVertices
     * @private
     */
    private mapVertices: number[][];
    /**
     * Total width of all ground tiles
     * @property {Number} mapVisualWidthReal
     * @private
     */
    private mapVisualWidthReal: number;
    /**
     * Total height of all ground tiles
     * @property {Number} mapVisualHeightReal
     * @private
     */
    private mapVisualHeightReal: number;

    private currentFocusLocation: ColumnRowPair;

    private mapVisualWidthScaled: number;
    // private mapVisualHeightScaled: number;

    private dragging: boolean = false;
    private dragInitStartingX: number;
    private dragInitStartingY: number;
    private dragPrevStartingX: number;
    private dragPrevStartingY: number;

    private onMouseUp_binded: (event: InteractionEvent) => void;
    private onMouseDown_binded: (event: InteractionEvent) => void;
    private onMouseMove_binded: (event: InteractionEvent) => void;
    
    /**
     * Main display object container class to hold all views
     * within the engine and all map related logic
     *
     * @constructor
     * @param config {EngineConfiguration} configuration object for the isometric engine instance
     */
    constructor(config: EngineConfiguration) {
        super();

        this.onMouseUp_binded = this.onMouseUp.bind(this);
        this.onMouseDown_binded = this.onMouseDown.bind(this);
        this.onMouseMove_binded = this.onMouseMove.bind(this);

        this.config = config;

        // set the properties that are set by default when not defined by the user
        this.config.followCharacter = existy(this.config.followCharacter) ? this.config.followCharacter : true;
        this.config.changeTransparencies = existy(this.config.changeTransparencies)
            ? this.config.changeTransparencies
            : true;
        this.config.highlightPath = existy(this.config.highlightPath) ? this.config.highlightPath : true;
        this.config.highlightTargetTile = existy(this.config.highlightTargetTile)
            ? this.config.highlightTargetTile
            : true;
        this.config.tileHighlightAnimated = existy(this.config.tileHighlightAnimated)
            ? this.config.tileHighlightAnimated
            : true;
        this.config.tileHighlightFillColor = existy(this.config.tileHighlightFillColor)
            ? this.config.tileHighlightFillColor
            : 0x80d7ff;
        this.config.tileHighlightFillAlpha = existy(this.config.tileHighlightFillAlpha)
            ? this.config.tileHighlightFillAlpha
            : 0.5;
        this.config.tileHighlightStrokeColor = existy(this.config.tileHighlightStrokeColor)
            ? this.config.tileHighlightStrokeColor
            : 0xffffff;
        this.config.tileHighlightStrokeAlpha = existy(this.config.tileHighlightStrokeAlpha)
            ? this.config.tileHighlightStrokeAlpha
            : 1.0;
        this.config.dontAutoMoveToTile = existy(this.config.dontAutoMoveToTile)
            ? this.config.dontAutoMoveToTile
            : false;
        this.config.checkPathOnEachTile = existy(this.config.checkPathOnEachTile)
            ? this.config.checkPathOnEachTile
            : true;
        this.config.mapDraggable = existy(this.config.mapDraggable) ? this.config.mapDraggable : true;
        this.config.isoAngle = existy(this.config.isoAngle) ? this.config.isoAngle : EngineView.DEFAULT_ISO_ANGLE;
        this.config.tileHeight = existy(this.config.tileHeight) ? this.config.tileHeight : EngineView.DEFAULT_TILE_H;

        this.setZoomParameters(
            this.config.minScale,
            this.config.maxScale,
            this.config.numberOfZoomLevels,
            this.config.initialZoomLevel,
            this.config.instantCameraZoom
        );

        this.TILE_HALF_H = this.config.tileHeight / 2;
        this.TILE_HALF_W = this.TILE_HALF_H * Math.tan(((90 - this.config.isoAngle) * Math.PI) / 180);
        // this.TILE_W = this.TILE_HALF_W * 2;

        this.loadAssetsAndData();
    }

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
    private loadAssetsAndData(): void {
        if (!this.config.mapDataPath) {
            throw new Error(
                "TRAVISO: No JSON-file path defined for map data. Please check your configuration object that you pass to the 'getEngineInstance' method."
            );
        } else if (this.config.mapDataPath.split('.').pop() !== 'json') {
            throw new Error('TRAVISO: Invalid map-data file path. This file has to be a json file.');
        }

        const loader = new Loader();
        loader.add('mapData', this.config.mapDataPath);

        if (this.config.assetsToLoad && this.config.assetsToLoad.length > 0) {
            loader.add(this.config.assetsToLoad);
        }

        loader.load(this.assetsAndDataLoaded.bind(this));

        // TRAVISO.loadData();
    }

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
    private assetsAndDataLoaded(loader: Loader): void {
        // console.log('assetsAndDataLoaded', resources.mapData.data);

        const mapData: MapData = loader.resources.mapData.data as MapData;

        // initial controls

        if (!existy(mapData.initialControllableLocation)) {
            trace(
                "Map-data file warning: No 'initialControllableLocation' defined. Ignore this warning if you are adding it later manually."
            );
        } else if (
            !existy(mapData.initialControllableLocation.columnIndex) ||
            !existy(mapData.initialControllableLocation.rowIndex)
        ) {
            trace("Map-data file warning: 'initialControllableLocation' exists but it is not defined properly.");
            mapData.initialControllableLocation = null;
        }

        if (mapData.tileHighlightImage && !mapData.tileHighlightImage.path) {
            trace("Map-data file warning: 'tileHighlightImage' exists but its 'path' is not defined properly.");
            mapData.tileHighlightImage = null;
        }

        if (mapData.singleGroundImage && !mapData.singleGroundImage.path) {
            trace("Map-data file warning: 'singleGroundImage' exists but its 'path' is not defined properly.");
            mapData.singleGroundImage = null;
        }

        let i: number, j: number, arr: string[];
        let rows = mapData.groundMap;
        mapData.groundMapData = [];
        for (i = 0; i < rows.length; i++) {
            arr = String(rows[i].row).replace(/\s/g, '').split(',');
            // remove empty spaces in a row and cast to an array
            for (j = arr.length; j--; ) {
                arr[j] = arr[j] || KEY_EMPTY_TILE;
            }
            mapData.groundMapData[i] = arr;
        }

        rows = mapData.objectsMap;
        mapData.objectsMapData = [];
        for (i = 0; i < rows.length; i++) {
            arr = String(rows[i].row).replace(/\s/g, '').split(',');
            // remove empty spaces in a row and cast to an array
            for (j = arr.length; j--; ) {
                arr[j] = arr[j] || KEY_NO_OBJECTS;
            }
            mapData.objectsMapData[i] = arr;
        }

        if (!existy(mapData.tiles)) {
            trace("Map-data file warning: No 'tiles' defined.");
            mapData.tiles = {};
        }
        if (!existy(mapData.objects)) {
            trace("Map-data file warning: No 'objects' defined.");
            mapData.objects = {};
        }

        let obj: IMapDataObject,
            objId: string,
            visual: MapDataObjectVisual,
            visualId: ObjectVisualKey,
            interactionOffsets: ObjectInfoInteractionOffsets,
            oTextures: ObjectInfoTextureNames,
            m: number,
            n: number;
        for (objId in mapData.objects) {
            obj = mapData.objects[objId];
            if (!existy(obj.visuals)) {
                throw new Error('TRAVISO: No visuals defined in data-file for object type: ' + objId);
            }
            obj.id = objId;
            if (!existy(obj.rowSpan)) {
                obj.rowSpan = 1;
            }
            if (!existy(obj.columnSpan)) {
                obj.columnSpan = 1;
            }

            oTextures = {};
            interactionOffsets = {};

            for (visualId in obj.visuals) {
                visual = obj.visuals[visualId];

                if (existy(visual.ipor) && existy(visual.ipoc)) {
                    interactionOffsets[visualId] = {
                        c: Number(visual.ipoc),
                        r: Number(visual.ipor),
                    };
                }

                // visual = (visual  as MapDataObjectVisualType1);
                if (visual.frames && visual.frames.length > 0) {
                    oTextures[visualId] = [];
                    for (m = 0; m < visual.frames.length; m++) {
                        oTextures[visualId][m] = visual.frames[m].path;
                    }
                } else {
                    if (!visual.path || !visual.extension || !visual.numberOfFrames || visual.numberOfFrames < 1) {
                        throw new Error(
                            'TRAVISO: Invalid or missing visual attributes detected in data-file for visual with id: ' +
                                visualId
                        );
                    }

                    oTextures[visualId] = [];
                    if (visual.numberOfFrames === 1) {
                        oTextures[visualId][0] = visual.path + '.' + visual.extension;
                    } else {
                        n = 0;
                        for (m = visual.startIndex; m < visual.numberOfFrames; m++) {
                            oTextures[visualId][n++] = visual.path + String(m) + '.' + visual.extension;
                        }
                    }
                }
            }

            obj.textureNames = oTextures;
            obj.io = interactionOffsets;
            obj.f = !!obj.floor;
            obj.nt = !!obj.noTransparency;
            obj.m = !!obj.movable;
            obj.i = !!obj.interactive;
        }

        delete mapData.objectsMap;
        delete mapData.groundMap;

        this.mapData = mapData;

        this.onAllAssetsLoaded();
    }

    /**
     * This method is being called whenever all the assets are
     * loaded and engine is ready to initialize
     *
     * @method onAllAssetsLoaded
     * @private
     */
    private onAllAssetsLoaded(): void {
        trace('All assets loaded');

        this.moveEngine = new MoveEngine(this);

        this.currentScale = 1.0;
        this.currentZoom = 0;

        this.posFrame = this.config.initialPositionFrame || {
            x: 0,
            y: 0,
            w: 800,
            h: 600,
        };

        this.externalCenter = {
            x: this.posFrame.w >> 1,
            y: this.posFrame.h >> 1,
        };

        this.createMap();

        this.repositionContent(this.config.initialPositionFrame);

        this.enableInteraction();

        if (this.config.engineInstanceReadyCallback) {
            this.config.engineInstanceReadyCallback(this);
        }
    }

    /**
     * Creates the map and setups necessary parameters for future map calculations
     *
     * @method createMap
     * @private
     */
    private createMap(): void {
        // create background
        if (this.config.backgroundColor) {
            this.bg = new Graphics();
            this.addChild(this.bg);
        }

        // create mask
        if (this.config.useMask) {
            this.mapMask = new Graphics();
            this.addChild(this.mapMask);
        }

        // create containers for visual map elements
        this.mapContainer = new Container();
        this.addChild(this.mapContainer);

        // Define two layers of maps
        // One for the world and one for the objects (static/dynamic) over it
        // This enables us not to update the whole world in every move but instead just update the object depths over it

        this.groundContainer = new Container();
        this.mapContainer.addChild(this.groundContainer);

        this.objContainer = new Container();
        this.mapContainer.addChild(this.objContainer);

        const groundMapData = this.mapData.groundMapData;
        const objectsMapData = this.mapData.objectsMapData;

        const initialControllableLocation = this.mapData.initialControllableLocation;

        // set map size
        this.mapSizeR = groundMapData.length;
        this.mapSizeC = groundMapData[0].length;

        // add ground image first if it is defined
        let groundImageSprite: Sprite;
        if (this.mapData.singleGroundImage) {
            groundImageSprite = new Sprite(Texture.from(this.mapData.singleGroundImage.path));
            this.groundContainer.addChild(groundImageSprite);

            groundImageSprite.scale.set(this.mapData.singleGroundImage.scale || 1);
        }

        // create arrays to hold tiles and objects
        this.tileArray = [];
        this.objArray = [];
        let i, j;
        for (i = 0; i < this.mapSizeR; i++) {
            this.tileArray[i] = [];
            this.objArray[i] = [];
            for (j = 0; j < this.mapSizeC; j++) {
                this.tileArray[i][j] = null;
                this.objArray[i][j] = null;
            }
        }

        // Map data is being sent to path finding and after this point
        // its content will be different acc to the path-finding algorithm.
        // It is still being stored in engine.mapData but you must be aware
        // of the structure if you want to use it after this point.
        this.pathFinding = new PathFinding(this.mapSizeC, this.mapSizeR, {
            diagonal: this.config.pathFindingType === PF_ALGORITHMS.ASTAR_DIAGONAL,
            closest: this.config.pathFindingClosest,
        });

        let tile;
        for (i = 0; i < this.mapSizeR; i++) {
            for (j = this.mapSizeC - 1; j >= 0; j--) {
                this.tileArray[i][j] = null;
                if (groundMapData[i][j] && groundMapData[i][j] !== KEY_EMPTY_TILE) {
                    tile = new TileView(this, groundMapData[i][j]);
                    tile.position.x = this.getTilePosXFor(i, j);
                    tile.position.y = this.getTilePosYFor(i, j);
                    tile.mapPos = { c: j, r: i };
                    this.tileArray[i][j] = tile;
                    this.groundContainer.addChild(tile);

                    if (!tile.isMovableTo) {
                        this.pathFinding.setCell(j, i, 0);
                    }
                } else {
                    this.pathFinding.setCell(j, i, 0);
                }
            }
        }

        let obj,
            floorObjectFound = false;
        for (i = 0; i < this.mapSizeR; i++) {
            for (j = this.mapSizeC - 1; j >= 0; j--) {
                this.objArray[i][j] = null;
                if (objectsMapData[i][j] && objectsMapData[i][j] !== KEY_NO_OBJECTS) {
                    obj = new ObjectView(this, objectsMapData[i][j]);
                    obj.position.x = this.getTilePosXFor(i, j);
                    obj.position.y = this.getTilePosYFor(i, j) + this.TILE_HALF_H;
                    obj.mapPos = { c: j, r: i };

                    if (!floorObjectFound && obj.isFloorObject) {
                        floorObjectFound = true;
                    }

                    this.objContainer.addChild(obj);

                    this.addObjRefToLocation(obj, obj.mapPos);

                    // if (initialControllableLocation && initialControllableLocation.c === j && initialControllableLocation.r === i)
                    if (
                        initialControllableLocation &&
                        initialControllableLocation.columnIndex === j &&
                        initialControllableLocation.rowIndex === i
                    ) {
                        this.currentControllable = obj;
                    }
                }
            }
        }
        if (floorObjectFound) {
            // run the loop again to bring the other objects on top of the floor objects
            let a, k;
            for (i = 0; i < this.mapSizeR; i++) {
                for (j = this.mapSizeC - 1; j >= 0; j--) {
                    a = this.objArray[i][j];
                    if (a) {
                        for (k = 0; k < a.length; k++) {
                            if (!a[k].isFloorObject) {
                                this.objContainer.addChild(a[k]);
                            }
                        }
                    }
                }
            }
        }
        // cacheAsBitmap: for now this creates problem with tile highlights
        // this.groundContainer.cacheAsBitmap = true;

        this.mapVertices = [
            [this.getTilePosXFor(0, 0) - this.TILE_HALF_W, this.getTilePosYFor(0, 0)],
            [this.getTilePosXFor(0, this.mapSizeC - 1), this.getTilePosYFor(0, this.mapSizeC - 1) - this.TILE_HALF_H],
            [
                this.getTilePosXFor(this.mapSizeR - 1, this.mapSizeC - 1) + this.TILE_HALF_W,
                this.getTilePosYFor(this.mapSizeR - 1, this.mapSizeC - 1),
            ],
            [this.getTilePosXFor(this.mapSizeR - 1, 0), this.getTilePosYFor(this.mapSizeR - 1, 0) + this.TILE_HALF_H],
        ];

        this.mapVisualWidthReal = this.getTilePosXFor(this.mapSizeR - 1, this.mapSizeC - 1) - this.getTilePosXFor(0, 0);
        this.mapVisualHeightReal =
            this.getTilePosYFor(this.mapSizeR - 1, 0) - this.getTilePosYFor(0, this.mapSizeC - 1);

        if (groundImageSprite) {
            groundImageSprite.position.x =
                this.mapVertices[0][0] + this.TILE_HALF_W + (this.mapVisualWidthReal - groundImageSprite.width) / 2;
            groundImageSprite.position.y =
                this.mapVertices[1][1] + this.TILE_HALF_H + (this.mapVisualHeightReal - groundImageSprite.height) / 2;
        }

        this.zoomTo(this.config.initialZoomLevel, true);

        if (this.config.followCharacter && initialControllableLocation) {
            // this.centralizeToLocation(initialControllableLocation.c, initialControllableLocation.r, true);
            this.centralizeToLocation(
                initialControllableLocation.columnIndex,
                initialControllableLocation.rowIndex,
                true
            );
        } else {
            this.centralizeToCurrentExternalCenter(true);
        }
    }

    /**
     * Calculates 2d x position of a tile
     *
     * @method getTilePosXFor
     * @param r {Number} row index of the tile
     * @param c {Number} column index of the tile
     * @return {Number} 2d x position of a tile
     */
    public getTilePosXFor(r: number, c: number): number {
        return c * this.TILE_HALF_W + r * this.TILE_HALF_W;
    }

    /**
     * Calculates 2d y position of a tile
     *
     * @method getTilePosYFor
     * @param r {Number} row index of the tile
     * @param c {Number} column index of the tile
     * @return {Number} 2d y position of a tile
     */
    public getTilePosYFor(r: number, c: number): number {
        return r * this.TILE_HALF_H - c * this.TILE_HALF_H;
    }

    /**
     * Shows or hides the display object that includes the objects-layer
     *
     * @method showHideObjectLayer
     * @param show=false {Boolean}
     */
    public showHideObjectLayer(show: boolean = false): void {
        this.objContainer.visible = show;
    }
    /**
     * Shows or hides the display object that includes the ground/terrain layer
     *
     * @method showHideGroundLayer
     * @param show=false {Boolean}
     */
    public showHideGroundLayer(show: boolean = false): void {
        this.groundContainer.visible = show;
    }
    /**
     * Returns the TileView instance that sits in the location given
     *
     * @method getTileAtRowAndColumn
     * @param r {Number} row index of the tile
     * @param c {Number} column index of the tile
     * @return {TileView} the tile in the location given
     */
    public getTileAtRowAndColumn(r: number, c: number): TileView {
        return this.tileArray[r][c];
    }
    /**
     * Returns all the ObjectView instances referenced to the given location with the specified row and column indexes.
     *
     * @method getObjectsAtRowAndColumn
     * @param r {Number} the row index of the map location
     * @param c {Number} the column index of the map location
     * @return {Array(ObjectView)} an array of map-objects referenced to the given location
     */
    public getObjectsAtRowAndColumn(r: number, c: number): ObjectView[] {
        return this.objArray[r][c];
    }
    /**
     * Returns all the ObjectView instances referenced to the given location.
     *
     * @method getObjectsAtLocation
     * @param pos {Object} object including r and c coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     * @return {Array(ObjectView)} an array of map-objects referenced to the given location
     */
    private getObjectsAtLocation(pos: ColumnRowPair): ObjectView[] {
        return this.objArray[pos.r][pos.c];
    }

    /**
     * Creates and adds a predefined (in json file) map-object to the map using the specified object type-id.
     *
     * @method createAndAddObjectToLocation
     * @param type {Number} type-id of the object as defined in the json file
     * @param pos {Object} object including r and c coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     * @return {ObjectView} the newly created map-object
     */
    public createAndAddObjectToLocation(type: string, pos: ColumnRowPair): ObjectView {
        return this.addObjectToLocation(new ObjectView(this, type), pos);
    }
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
    public addObjectToLocation(obj: ObjectView, pos: ColumnRowPair): ObjectView {
        obj.position.x = this.getTilePosXFor(pos.r, pos.c);
        obj.position.y = this.getTilePosYFor(pos.r, pos.c) + this.TILE_HALF_H;
        obj.mapPos = { c: pos.c, r: pos.r };

        this.objContainer.addChild(obj);

        this.addObjRefToLocation(obj, obj.mapPos);
        this.arrangeDepthsFromLocation(obj.isFloorObject ? { c: this.mapSizeC - 1, r: 0 } : obj.mapPos);

        return obj;
    }

    /**
     * Enables adding external custom display objects to the specified location.
     * This method should be used for the objects that are not already defined in json file and don't have a type-id.
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
    public addCustomObjectToLocation(displayObject: ObjectView, pos: ColumnRowPair): ObjectView {
        displayObject.isMovableTo = existy(displayObject.isMovableTo) ? displayObject.isMovableTo : true;
        displayObject.columnSpan = displayObject.columnSpan || 1;
        displayObject.rowSpan = displayObject.rowSpan || 1;

        return this.addObjectToLocation(displayObject, pos);

        // this.removeObjRefFromLocation(displayObject, pos);
    }
    /**
     * Removes the object and its references from the map.
     *
     * @method removeObjectFromLocation
     * @param obj {Object} either an external display object or a map-object (ObjectView)
     * @param [pos=null] {Object} object including r and c coordinates, if not defined the engine will use 'obj.mapPos' to remove the map-object
     * @param [pos.r] {Number} the row index of the map location
     * @param [pos.c] {Number} the column index of the map location
     */
    public removeObjectFromLocation(obj: ObjectView, pos: ColumnRowPair): void {
        pos = pos || obj.mapPos;
        this.objContainer.removeChild(obj);
        this.removeObjRefFromLocation(obj, pos);
    }
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
    public focusMapToObject(obj: ObjectView): void {
        this.focusMapToLocation(obj.mapPos.c + (obj.columnSpan - 1) / 2, obj.mapPos.r - (obj.rowSpan - 1) / 2, 0);
    }
    /**
     * Centralizes and zooms the EngineView instance to the map location specified by row and column index.
     *
     * @method focusMapToLocation
     * @param c {Number} the column index of the map location
     * @param r {Number} the row index of the map location
     * @param zoomAmount {Number} targeted zoom level for focusing
     */
    public focusMapToLocation(c: number, r: number, zoomAmount: number): void {
        // NOTE: using zoomTo instead of setScale causes centralizeToPoint to be called twice (no visual problem)
        this.zoomTo(zoomAmount, false);
        this.centralizeToLocation(c, r, this.config.instantCameraRelocation);
    }
    /**
     * Centralizes the EngineView instance to the object specified.
     *
     * @method centralizeToObject
     * @param obj {ObjectView} the object that map will be centralized with respect to
     * @param obj.mapPos {Object} the object that holds the location of the map-object on the map
     * @param obj.mapPos.c {Number} the column index of the map location
     * @param obj.mapPos.r {Number} the row index of the map location
     */
    public centralizeToObject(obj: ObjectView): void {
        this.centralizeToLocation(obj.mapPos.c, obj.mapPos.r, this.config.instantCameraRelocation);
    }
    /**
     * Centralizes the EngineView instance to the map location specified by row and column index.
     *
     * @method centralizeToLocation
     * @param c {Number} the column index of the map location
     * @param r {Number} the row index of the map location
     * @param [instantRelocate=false] {Boolean} specifies if the camera move will be animated or instant
     */
    public centralizeToLocation(c: number, r: number, instantRelocate: boolean): void {
        this.currentFocusLocation = { c: c, r: r };
        const px =
            this.externalCenter.x + (this.mapVisualWidthScaled >> 1) - this.getTilePosXFor(r, c) * this.currentScale;
        const py = this.externalCenter.y - this.getTilePosYFor(r, c) * this.currentScale;
        this.centralizeToPoint(px, py, instantRelocate);
    }
    /**
     * Centralizes the EngineView instance to the current location of the attention/focus.
     *
     * @method centralizeToCurrentFocusLocation
     * @param [instantRelocate=false] {Boolean} specifies if the camera move will be animated or instant
     */
    public centralizeToCurrentFocusLocation(instantRelocate: boolean): void {
        this.centralizeToLocation(this.currentFocusLocation.c, this.currentFocusLocation.r, instantRelocate);
    }
    /**
     * External center is the central point of the frame defined by the user to be used as the visual size of the engine.
     * This method centralizes the EngineView instance with respect to this external center-point.
     *
     * @method centralizeToCurrentExternalCenter
     * @param [instantRelocate=false] {Boolean} specifies if the camera move will be animated or instant
     */
    public centralizeToCurrentExternalCenter(instantRelocate: boolean): void {
        if (this.externalCenter) {
            this.currentFocusLocation = {
                c: this.mapSizeC >> 1,
                r: this.mapSizeR >> 1,
            };
            this.centralizeToPoint(this.externalCenter.x, this.externalCenter.y, instantRelocate);
        }
    }
    /**
     * Centralizes the EngineView instance to the points specified.
     *
     * @method centralizeToPoint
     * @param px {Number} the x coordinate of the center point with respect to EngineView frame
     * @param py {Number} the y coordinate of the center point with respect to EngineView frame
     * @param [instantRelocate=false] {Boolean} specifies if the relocation will be animated or instant
     */
    public centralizeToPoint(px: number, py: number, instantRelocate: boolean): void {
        if (this.tileArray) {
            px = px - (this.mapVisualWidthScaled >> 1);
            if (
                (existy(instantRelocate) && instantRelocate) ||
                (!existy(instantRelocate) && this.config.instantCameraRelocation)
            ) {
                this.mapContainer.position.x = px;
                this.mapContainer.position.y = py;
            } else {
                this.moveEngine.addTween(
                    this.mapContainer.position as unknown as ITweenTarget,
                    0.5,
                    { x: px, y: py },
                    0,
                    'easeInOut',
                    true
                );
            }
        }
    }
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
    public setZoomParameters(
        minScale: number,
        maxScale: number,
        numberOfZoomLevels: number,
        initialZoomLevel: number,
        instantCameraZoom: boolean = false
    ): void {
        this.config.minScale = existy(minScale) ? minScale : 0.5;
        this.config.maxScale = existy(maxScale) ? maxScale : 1.5;
        this.config.minZoom = -1;
        this.config.maxZoom = 1;
        this.config.zoomIncrement = existy(numberOfZoomLevels)
            ? numberOfZoomLevels <= 1
                ? 0
                : 2 / (numberOfZoomLevels - 1)
            : 0.5;

        this.config.initialZoomLevel = existy(initialZoomLevel) ? initialZoomLevel : 0;
        this.config.instantCameraZoom = existy(instantCameraZoom) ? instantCameraZoom : false;
    }
    /**
     * Sets map's scale.
     *
     * @method setScale
     * @private
     * @param s {Number} scale amount for both x and y coordinates
     * @param [instantZoom=false] {Boolean} specifies if the scaling will be animated or instant
     */
    private setScale(s: number, instantZoom: boolean): void {
        if (s < this.config.minScale) {
            s = this.config.minScale;
        } else if (s > this.config.maxScale) {
            s = this.config.maxScale;
        }
        this.currentScale = s;
        this.mapVisualWidthScaled = this.mapVisualWidthReal * this.currentScale;
        // this.mapVisualHeightScaled = this.mapVisualHeightReal * this.currentScale;

        if ((existy(instantZoom) && instantZoom) || (!existy(instantZoom) && this.config.instantCameraZoom)) {
            this.mapContainer.scale.set(this.currentScale);
        } else {
            this.moveEngine.addTween(
                this.mapContainer.scale as unknown as ITweenTarget,
                0.5,
                { x: this.currentScale, y: this.currentScale },
                0,
                'easeInOut',
                true
            );
        }
    }
    /**
     * Zooms camera by to the amount given.
     *
     * @method zoomTo
     * @param zoomAmount {Number} specifies zoom amount (between -1 and 1). Use -1, -0.5, 0, 0,5, 1 for better results.
     * @param [instantZoom=false] {Boolean} specifies whether to zoom instantly or with a tween animation
     */
    public zoomTo(zoomAmount: number, instantZoom: boolean): void {
        zoomAmount = zoomAmount || 0;
        let s = mathMap(
            zoomAmount,
            this.config.minZoom,
            this.config.maxZoom,
            this.config.minScale,
            this.config.maxScale,
            true
        );
        s = Math.round(s * 10) / 10;

        this.currentZoom = mathMap(
            s,
            this.config.minScale,
            this.config.maxScale,
            this.config.minZoom,
            this.config.maxZoom,
            true
        );

        this.externalCenter = this.externalCenter ? this.externalCenter : { x: this.mapVisualWidthScaled >> 1, y: 0 };
        const diff = {
            x: this.mapContainer.position.x + (this.mapVisualWidthScaled >> 1) - this.externalCenter.x,
            y: this.mapContainer.position.y - this.externalCenter.y,
        };
        const oldScale = this.currentScale;

        this.setScale(s, instantZoom);

        const ratio = this.currentScale / oldScale;
        this.centralizeToPoint(
            this.externalCenter.x + diff.x * ratio,
            this.externalCenter.y + diff.y * ratio,
            (existy(instantZoom) && instantZoom) || (!existy(instantZoom) && this.config.instantCameraZoom)
        );

        // trace("scalingTo: " + this.currentScale);
        // trace("zoomingTo: " + this.currentZoom);
    }
    /**
     * Zooms the camera one level out.
     *
     * @method zoomOut
     * @param [instantZoom=false] {Boolean} specifies whether to zoom instantly or with a tween animation
     */
    public zoomOut(instantZoom: boolean): void {
        this.zoomTo(this.currentZoom - this.config.zoomIncrement, instantZoom);
    }
    /**
     * Zooms the camera one level in.
     *
     * @method zoomIn
     * @param [instantZoom=false] {Boolean} specifies whether to zoom instantly or with a tween animation
     */
    public zoomIn(instantZoom: boolean): void {
        this.zoomTo(this.currentZoom + this.config.zoomIncrement, instantZoom);
    }
    /**
     * Returns the current controllable map-object.
     *
     * @method getCurrentControllable
     * @return {ObjectView} current controllable map-object
     */
    public getCurrentControllable(): ObjectView {
        return this.currentControllable;
    }
    /**
     * Sets a map-object as the current controllable. This object will be moving in further relevant user interactions.
     *
     * @method setCurrentControllable
     * @param obj {ObjectView} object to be set as current controllable
     * @param obj.mapPos {Object} object including r and c coordinates
     * @param obj.mapPos.c {Number} the column index of the map location
     * @param obj.mapPos.r {Number} the row index of the map location
     */
    public setCurrentControllable(obj: ObjectView): void {
        this.currentControllable = obj;
    }
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
    private addObjRefToLocation(obj: ObjectView, pos: ColumnRowPair): void {
        let k, m;
        for (k = pos.c; k < pos.c + obj.columnSpan; k++) {
            for (m = pos.r; m > pos.r - obj.rowSpan; m--) {
                this.addObjRefToSingleLocation(obj, { c: k, r: m });
            }
        }
    }
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
    private addObjRefToSingleLocation(obj: ObjectView, pos: ColumnRowPair): void {
        if (!this.objArray[pos.r][pos.c]) {
            this.objArray[pos.r][pos.c] = [];
        }
        const index = this.objArray[pos.r][pos.c].indexOf(obj);
        if (index < 0) {
            this.objArray[pos.r][pos.c].push(obj);
        }

        if (!obj.isMovableTo) {
            this.pathFinding.setDynamicCell(pos.c, pos.r, 0);
        }
    }
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
    private removeObjRefFromLocation(obj: ObjectView, pos: ColumnRowPair): void {
        let k, m;
        for (k = pos.c; k < pos.c + obj.columnSpan; k++) {
            for (m = pos.r; m > pos.r - obj.rowSpan; m--) {
                this.removeObjRefFromSingleLocation(obj, { c: k, r: m });
            }
        }
    }
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
    private removeObjRefFromSingleLocation(obj: ObjectView, pos: ColumnRowPair): void {
        if (this.objArray[pos.r][pos.c]) {
            const index = this.objArray[pos.r][pos.c].indexOf(obj);
            if (index > -1) {
                this.objArray[pos.r][pos.c].splice(index, 1);
            }
            if (this.objArray[pos.r][pos.c].length === 0) {
                this.pathFinding.setDynamicCell(pos.c, pos.r, 1);
                this.objArray[pos.r][pos.c] = null;
            } else {
                const a = this.objArray[pos.r][pos.c];
                const l = a.length;
                for (let i = 0; i < l; i++) {
                    if (!a[i].isMovableTo) {
                        this.pathFinding.setDynamicCell(pos.c, pos.r, 0);
                        break;
                    } else if (i === l - 1) {
                        this.pathFinding.setDynamicCell(pos.c, pos.r, 1);
                    }
                }
            }
        }
    }
    // /**
    //  * Removes all map-object references from the given location in the object array.
    //  *
    //  * @private
    //  * @method removeAllObjectRefsFromLocation
    //  * @param {ColumnRowPair} pos object including r and c coordinates
    //  */
    // private removeAllObjectRefsFromLocation(pos: ColumnRowPair): void {
    //     if (this.objArray[pos.r][pos.c]) {
    //         this.pathFinding.setDynamicCell(pos.c, pos.r, 1);
    //         this.objArray[pos.r][pos.c] = null;
    //     }
    // }
    /**
     * Sets alphas of the map-objects referenced to the given location.
     *
     * @method changeObjAlphasInLocation
     * @param value {Number} alpha value, should be between 0 and 1
     * @param pos {ColumnRowPair} object including r and c coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     */
    public changeObjAlphasInLocation(value: number, pos: ColumnRowPair): void {
        const a = this.objArray[pos.r][pos.c];
        if (a) {
            const l = a.length;
            for (let i = 0; i < l; i++) {
                if (!a[i].isFloorObject && !a[i].noTransparency) {
                    a[i].alpha = value;
                }
            }
        }
    }
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
    private arrangeObjLocation(obj: ObjectView, pos: ColumnRowPair): void {
        this.removeObjRefFromLocation(obj, obj.mapPos);
        this.addObjRefToLocation(obj, pos);

        obj.mapPos = { c: pos.c, r: pos.r };
    }
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
    private arrangeObjTransparencies(obj: ObjectView, prevPos: ColumnRowPair, pos: ColumnRowPair): void {
        if (this.config.changeTransparencies) {
            if (this.currentControllable === obj) {
                if (prevPos.c > 0) {
                    this.changeObjAlphasInLocation(1, {
                        c: prevPos.c - 1,
                        r: prevPos.r,
                    });
                }
                if (prevPos.c > 0 && prevPos.r < this.mapSizeR - 1) {
                    this.changeObjAlphasInLocation(1, {
                        c: prevPos.c - 1,
                        r: prevPos.r + 1,
                    });
                }
                if (prevPos.r < this.mapSizeR - 1) {
                    this.changeObjAlphasInLocation(1, {
                        c: prevPos.c,
                        r: prevPos.r + 1,
                    });
                }

                if (pos.c > 0) {
                    this.changeObjAlphasInLocation(0.7, {
                        c: pos.c - 1,
                        r: pos.r,
                    });
                }
                if (pos.c > 0 && pos.r < this.mapSizeR - 1) {
                    this.changeObjAlphasInLocation(0.7, {
                        c: pos.c - 1,
                        r: pos.r + 1,
                    });
                }
                if (pos.r < this.mapSizeR - 1) {
                    this.changeObjAlphasInLocation(0.7, {
                        c: pos.c,
                        r: pos.r + 1,
                    });
                }
            }

            // TODO: check if there is a way not to update main character alpha each time
            obj.alpha = 1;
        }
    }
    /**
     * Arranges depths (z-index) of the map-objects starting from the given location.
     *
     * @private
     * @method arrangeDepthsFromLocation
     * @param pos {Object} location object including the map coordinates
     * @param pos.r {Number} the row index of the map location
     * @param pos.c {Number} the column index of the map location
     */
    private arrangeDepthsFromLocation(pos: ColumnRowPair): void {
        let a, i, j, k;
        for (i = pos.r; i < this.mapSizeR; i++) {
            for (j = pos.c; j >= 0; j--) {
                a = this.objArray[i][j];
                if (a) {
                    for (k = 0; k < a.length; k++) {
                        if (!a[k].isFloorObject) {
                            this.objContainer.addChild(a[k]);
                        }
                    }
                }
            }
        }
    }
    /**
     * Clears the highlight for the old path and highlights the new path on map.
     *
     * @method arrangePathHighlight
     * @private
     * @param [currentPath] {Array(Object)} the old path to clear the highlight from
     * @param newPath {Array(Object)} the new path to highlight
     */
    private arrangePathHighlight(currentPath: GridNode[], newPath: GridNode[]): void {
        let i: number, tile: TileView, pathItem: GridNode;
        if (currentPath) {
            for (i = 0; i < currentPath.length; i++) {
                pathItem = currentPath[i];
                if (!newPath || newPath.indexOf(pathItem) === -1) {
                    tile = this.tileArray[pathItem.mapPos.r][pathItem.mapPos.c];
                    tile.setHighlighted(false, !this.config.tileHighlightAnimated);
                }
            }
        }
        if (newPath) {
            for (i = 0; i < newPath.length; i++) {
                pathItem = newPath[i];
                if (!currentPath || currentPath.indexOf(pathItem) === -1) {
                    tile = this.tileArray[pathItem.mapPos.r][pathItem.mapPos.c];
                    tile.setHighlighted(true, !this.config.tileHighlightAnimated);
                }
            }
        }
    }
    /**
     * Stops a moving object.
     *
     * @method stopObject
     * @private
     * @param obj {ObjectView} map-object to be moved on path
     */
    private stopObject(obj: IMovable): void {
        obj.currentPath = null;
        obj.currentTarget = null;
        obj.currentTargetTile = null;
        this.moveEngine.removeMovable(obj);
    }
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
    private moveObjThrough(obj: IMovable, path: GridNode[], speed: number = null): void {
        if (this.config.instantObjectRelocation) {
            const tile = this.tileArray[path[0].mapPos.r][path[0].mapPos.c];
            obj.position.x = tile.position.x;
            obj.position.y = tile.position.y + this.TILE_HALF_H;
            this.arrangeObjTransparencies(obj, obj.mapPos, tile.mapPos);
            this.arrangeObjLocation(obj, tile.mapPos);
            this.arrangeDepthsFromLocation(tile.mapPos);
        } else {
            if (this.config.highlightPath && this.currentControllable === obj) {
                this.arrangePathHighlight(obj.currentPath, path);
            }

            if (obj.currentTarget) {
                // trace("Object has a target, update the path with the new one");
                // this.moveEngine.addNewPathToObject(obj, path, speed);
                this.stopObject(obj);
            }

            this.moveEngine.prepareForMove(obj, path, speed);

            obj.currentTargetTile = obj.currentPath[obj.currentPathStep];

            this.onObjMoveStepBegin(obj, obj.currentPath[obj.currentPathStep].mapPos);
        }
    }
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
    private onObjMoveStepBegin(obj: IMovable, pos: ColumnRowPair): boolean {
        // trace("onObjMoveStepBegin");
        // Note that mapPos is being updated prior to movement

        obj.currentDirection = getDirBetween(obj.mapPos.r, obj.mapPos.c, pos.r, pos.c);

        obj.changeVisualToDirection(obj.currentDirection, true);

        // check if the next target pos is still empty
        if (!this.pathFinding.isCellFilled(pos.c, pos.r)) {
            // pos is movable
            // this.arrangeObjTransparencies(obj, obj.mapPos, pos);
            // this.arrangeObjLocation(obj, pos);
            // this.arrangeDepthsFromLocation(obj.mapPos);

            // if there is other object(s) on the target tile, notify the game
            // const objects = this.getObjectsAtLocation(pos);
            // if (objects && objects.length > 1)
            // {
            // if (this.config.otherObjectsOnTheNextTileCallback) { this.config.otherObjectsOnTheNextTileCallback( obj, objects ); }
            // }

            this.moveEngine.setMoveParameters(obj, pos);

            this.moveEngine.addMovable(obj);

            return true;
        } else {
            // pos is NOT movable
            this.moveEngine.removeMovable(obj);
            this.checkAndMoveObjectToLocation(obj, obj.currentPath[0].mapPos);

            return false;
        }
    }
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
    public onObjMoveStepEnd(obj: IMovable): void {
        //trace("onObjMoveStepEnd");

        obj.currentPathStep--;
        obj.currentTarget = null;
        obj.currentTargetTile = null;
        const pathEnded = 0 > obj.currentPathStep;
        this.moveEngine.removeMovable(obj);

        if (!pathEnded) {
            if (this.config.checkPathOnEachTile) {
                this.checkAndMoveObjectToLocation(obj, obj.currentPath[0].mapPos);
            } else {
                obj.currentPath.splice(obj.currentPath.length - 1, 1);
                this.moveObjThrough(obj, obj.currentPath);
            }
        } else {
            // reached to the end of the path
            obj.changeVisualToDirection(obj.currentDirection, false);
        }

        if (this.currentControllable === obj) {
            const tile = this.tileArray[obj.mapPos.r][obj.mapPos.c];
            tile.setHighlighted(false, !this.config.tileHighlightAnimated);

            // if (this.config.followCharacter) { this.centralizeToLocation(obj.mapPos.c, obj.mapPos.r); }
        }

        if (pathEnded && this.config.objectReachedDestinationCallback) {
            this.config.objectReachedDestinationCallback(obj);
        }
    }

    public checkForFollowCharacter(obj: IMovable): void {
        if (this.config.followCharacter && this.currentControllable === obj) {
            this.currentFocusLocation = { c: obj.mapPos.c, r: obj.mapPos.r };
            const px = this.externalCenter.x - obj.position.x * this.currentScale;
            const py = this.externalCenter.y - obj.position.y * this.currentScale;
            // this.centralizeToPoint(px, py, true);
            this.moveEngine.addTween(
                this.mapContainer.position as unknown as ITweenTarget,
                0.1,
                { x: px, y: py },
                0,
                'easeOut',
                true
            );
        }
    }

    public checkForTileChange(obj: IMovable): void {
        if (this.config.objectUpdateCallback) {
            this.config.objectUpdateCallback(obj);
        }

        const pos = { x: obj.position.x, y: obj.position.y - this.TILE_HALF_H };
        // const tile = this.tileArray[obj.mapPos.r][obj.mapPos.c];
        const tile = this.tileArray[obj.currentTargetTile.mapPos.r][obj.currentTargetTile.mapPos.c];
        // move positions to parent scale
        const vertices = [];
        for (let i = 0; i < tile.vertices.length; i++) {
            vertices[i] = [tile.vertices[i][0] + tile.position.x, tile.vertices[i][1] + tile.position.y];
        }

        if (obj.currentTargetTile.mapPos.r !== obj.mapPos.r || obj.currentTargetTile.mapPos.c !== obj.mapPos.c) {
            if (isInPolygon(pos, vertices)) {
                this.arrangeObjTransparencies(obj, obj.mapPos, obj.currentTargetTile.mapPos);
                this.arrangeObjLocation(obj, obj.currentTargetTile.mapPos);
                this.arrangeDepthsFromLocation(obj.mapPos);

                // if there is other object(s) on the target tile, notify the game
                const objects = this.getObjectsAtLocation(obj.currentTargetTile.mapPos);
                if (objects && objects.length > 1) {
                    if (this.config.otherObjectsOnTheNextTileCallback) {
                        this.config.otherObjectsOnTheNextTileCallback(obj, objects);
                    }
                }
            }
        }
    }

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
    public getPath(from: ColumnRowPair, to: ColumnRowPair): GridNode[] {
        if (this.pathFinding) {
            return this.pathFinding.solve(from.c, from.r, to.c, to.r);
        } else {
            throw new Error("Path finding hasn't been initialized yet!");
        }
    }
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
    public checkAndMoveObjectToTile(obj: ObjectView, tile: TileView, speed: number = null): boolean {
        if (tile.isMovableTo) {
            return this.checkAndMoveObjectToLocation(obj, tile.mapPos, speed);
        }
        return false;
    }
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
    public checkAndMoveObjectToLocation(obj: ObjectView, pos: ColumnRowPair, speed: number = null): boolean {
        const path = this.getPath(obj.mapPos, pos);
        if (path) {
            // begin moving process
            this.moveObjThrough(obj as IMovable, path, speed);

            return path.length > 0;
        }
        return false;
    }
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
    public moveCurrentControllableToLocation(pos: ColumnRowPair, speed: number = null): boolean {
        if (!this.currentControllable) {
            throw new Error('TRAVISO: currentControllable is not defined!');
        }
        return this.checkAndMoveObjectToLocation(this.currentControllable, pos, speed);
    }
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
    public moveCurrentControllableToObj(obj: ObjectView, speed: number = null): boolean {
        if (!this.currentControllable) {
            throw new Error('TRAVISO: currentControllable is not defined!');
        }
        // check if there is a preferred interaction point
        if (obj.currentInteractionOffset) {
            const targetPos = {
                c: obj.mapPos.c + obj.currentInteractionOffset.c,
                r: obj.mapPos.r + obj.currentInteractionOffset.r,
            };
            if (this.checkAndMoveObjectToLocation(this.currentControllable, targetPos, speed)) {
                return true;
            }
        }
        const cellArray = this.pathFinding.getAdjacentOpenCells(
            obj.mapPos.c,
            obj.mapPos.r,
            obj.columnSpan,
            obj.rowSpan
        );
        let tile: TileView;
        let minLength = 3000;
        let path, minPath, tempFlagHolder;
        for (let i = 0; i < cellArray.length; i++) {
            tile = this.tileArray[cellArray[i].mapPos.r][cellArray[i].mapPos.c];
            if (tile) {
                if (
                    tile.mapPos.c === this.currentControllable.mapPos.c &&
                    tile.mapPos.r === this.currentControllable.mapPos.r
                ) {
                    // already next to the object, do nothing
                    this.arrangePathHighlight((this.currentControllable as IMovable).currentPath, null);
                    this.stopObject(this.currentControllable as IMovable);
                    tempFlagHolder = this.config.instantObjectRelocation;
                    this.config.instantObjectRelocation = true;
                    this.moveObjThrough(this.currentControllable as IMovable, [
                        new GridNode(tile.mapPos.c, tile.mapPos.r, 1),
                    ]);
                    this.config.instantObjectRelocation = tempFlagHolder;
                    this.currentControllable.changeVisualToDirection(this.currentControllable.currentDirection, false);
                    if (this.config.objectReachedDestinationCallback) {
                        this.config.objectReachedDestinationCallback(this.currentControllable);
                    }
                    return true;
                }
                path = this.getPath(this.currentControllable.mapPos, tile.mapPos);
                if (path && path.length < minLength) {
                    minLength = path.length;
                    minPath = path;
                }
            }
        }

        if (minPath) {
            this.moveObjThrough(this.currentControllable as IMovable, minPath, speed);
            return true;
        }
        return false;
    }
    /**
     * Finds the nearest tile to the point given in the map's local scope.
     *
     * @method getTileFromLocalPos
     * @param lp {Object} point to check
     * @param lp.x {Number} x component
     * @param lp.y {Number} y component
     * @return {TileView} the nearest map-tile if there is one
     */
    public getTileFromLocalPos(lp: PositionPair): TileView {
        let closestTile: TileView = null;
        if (isInPolygon(lp, this.mapVertices)) {
            // Using nearest point instead of checking polygon vertices for each tile. Should be faster...
            // NOTE: there is an ignored bug (for better performance) that tile is not selected when u click on the far corner
            const thresh = this.TILE_HALF_W / 2;
            let tile, i, j, dist;
            let closestDist = 3000;
            for (i = 0; i < this.mapSizeR; i++) {
                for (j = 0; j < this.mapSizeC; j++) {
                    tile = this.tileArray[i][j];
                    if (tile) {
                        dist = getDist(lp, tile.position);
                        if (dist < closestDist) {
                            closestDist = dist;
                            closestTile = tile;
                            if (dist < thresh) {
                                break;
                            }
                        }
                    }
                }
            }
        }
        return closestTile;
    }
    /**
     * Checks if an interaction occurs using the interaction data coming from PIXI.
     * If there is any interaction starts necessary movements or performs necessary callbacks.
     *
     * @method checkForTileClick
     * @private
     * @param interactionData {Object} interaction data coming from PIXI
     * @param interactionData.global {Object} global interaction point
     */
    private checkForTileClick(interactionData: InteractionData): void {
        const lp = this.mapContainer.toLocal(interactionData.global);
        const closestTile = this.getTileFromLocalPos(lp);
        if (closestTile) {
            const a = this.objArray[closestTile.mapPos.r][closestTile.mapPos.c];
            if (a) {
                for (let k = 0; k < a.length; k++) {
                    if (a[k].isInteractive) {
                        if (this.config.objectSelectCallback) {
                            this.config.objectSelectCallback(a[k]);
                        }
                        break;
                    }
                    // TODO CHECK: this might cause issues when there is one movable and one not movable object on the same tile
                    else if (a[k].isMovableTo) {
                        if (
                            this.config.dontAutoMoveToTile ||
                            !this.currentControllable ||
                            this.checkAndMoveObjectToTile(this.currentControllable, closestTile)
                        ) {
                            if (this.config.highlightTargetTile) {
                                closestTile.setHighlighted(true, !this.config.tileHighlightAnimated);
                            }
                            if (this.config.tileSelectCallback) {
                                this.config.tileSelectCallback(closestTile.mapPos.r, closestTile.mapPos.c);
                            }
                            break;
                        }
                    }
                }
            } else if (
                this.config.dontAutoMoveToTile ||
                !this.currentControllable ||
                this.checkAndMoveObjectToTile(this.currentControllable, closestTile)
            ) {
                if (this.config.highlightTargetTile) {
                    closestTile.setHighlighted(true, !this.config.tileHighlightAnimated);
                }
                if (this.config.tileSelectCallback) {
                    this.config.tileSelectCallback(closestTile.mapPos.r, closestTile.mapPos.c);
                }
            }
        }
    }
    /**
     * Enables mouse/touch interactions.
     *
     * @method enableInteraction
     */
    public enableInteraction(): void {
        // this.mousedown = this.touchstart = this.onMouseDown.bind(this);
        // this.mousemove = this.touchmove = this.onMouseMove.bind(this);
        // this.mouseup = this.mouseupout = this.touchend = this.onMouseUp.bind(this);
        this.on('pointerdown', this.onMouseDown_binded)
            .on('pointerup', this.onMouseUp_binded)
            // .on('pointerout', this.onMouseUp_binded)
            .on('pointerupoutside', this.onMouseUp_binded)
            .on('pointermove', this.onMouseMove_binded);
        this.interactive = true;
    }
    /**
     * Disables mouse/touch interactions.
     *
     * @method disableInteraction
     */
    public disableInteraction(): void {
        // this.mousedown = this.touchstart = null;
        // this.mousemove = this.touchmove = null;
        // this.mouseup = this.mouseupout = this.touchend = null;
        this.off('pointerdown', this.onMouseDown_binded)
            .off('pointerup', this.onMouseUp_binded)
            // .off('pointerout', this.onMouseUp_binded)
            .off('pointerupoutside', this.onMouseUp_binded)
            .off('pointermove', this.onMouseMove_binded);
        this.interactive = true;
        this.dragging = false;
    }
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
    private isInteractionInMask(p: PositionPair): boolean {
        if (this.config.useMask) {
            if (
                p.x < this.posFrame.x ||
                p.y < this.posFrame.y ||
                p.x > this.posFrame.x + this.posFrame.w ||
                p.y > this.posFrame.y + this.posFrame.h
            ) {
                return false;
            }
        }
        return true;
    }
    // ******************** START: MOUSE INTERACTIONS **************************** //
    private onMouseDown(event: InteractionEvent): void {
        const globalPos = event.data.global;
        if (!this.dragging && this.isInteractionInMask(globalPos)) {
            this.dragging = true;
            //this.mouseDownTime = new Date();
            this.dragInitStartingX = this.dragPrevStartingX = globalPos.x;
            this.dragInitStartingY = this.dragPrevStartingY = globalPos.y;
        }
    }
    private onMouseMove(event: InteractionEvent): void {
        if (this.dragging && this.config.mapDraggable) {
            const globalPos = event.data.global;
            this.mapContainer.position.x += globalPos.x - this.dragPrevStartingX;
            this.mapContainer.position.y += globalPos.y - this.dragPrevStartingY;
            this.dragPrevStartingX = globalPos.x;
            this.dragPrevStartingY = globalPos.y;
        }
    }
    private onMouseUp(event: InteractionEvent): void {
        if (this.dragging) {
            this.dragging = false;
            //const passedTime = (new Date()) - this.mouseDownTime;
            const distX = event.data.global.x - this.dragInitStartingX;
            const distY = event.data.global.y - this.dragInitStartingY;

            if (Math.abs(distX) < 5 && Math.abs(distY) < 5) {
                // NOT DRAGGING IT IS A CLICK
                this.checkForTileClick(event.data);
            }
        }
    }
    // ********************* END: MOUSE INTERACTIONS **************************** //
    /**
     * Repositions the content according to user settings. Call this method
     * whenever you want to change the size or position of the engine.
     *
     * @param {PositionFrame} [posFrame]  frame to position the engine, default is { x : 0, y : 0, w : 800, h : 600 }
     */
    public repositionContent(posFrame: PositionFrame = null): void {
        trace('EngineView repositionContent');

        posFrame = posFrame || this.posFrame || { x: 0, y: 0, w: 800, h: 600 };

        this.position.x = posFrame.x;
        this.position.y = posFrame.y;

        this.externalCenter = {
            x: posFrame.w >> 1,
            y: posFrame.h >> 1,
        };
        this.centralizeToCurrentFocusLocation(true);

        if (this.bg) {
            this.bg.clear();
            // this.bg.lineStyle(2, 0x000000, 1);
            this.bg.beginFill(this.config.backgroundColor, 1.0);
            this.bg.drawRect(0, 0, posFrame.w, posFrame.h);
            this.bg.endFill();
        }

        if (this.mapMask && this.mapContainer) {
            this.mapMask.clear();
            this.mapMask.beginFill(0x000000);
            this.mapMask.drawRect(0, 0, posFrame.w, posFrame.h);
            this.mapMask.endFill();

            this.mapContainer.mask = this.mapMask;
        }

        this.posFrame = posFrame;
    }
    /**
     * Clears all references and stops all animations inside the engine.
     * Call this method when you want to get rid of an engine instance.
     *
     * @method destroy
     */
    public destroy(): void {
        trace('EngineView destroy');

        this.disableInteraction();

        this.moveEngine.destroy();
        this.moveEngine = null;

        let item, i, j, k;
        for (i = 0; i < this.mapSizeR; i++) {
            for (j = this.mapSizeC - 1; j >= 0; j--) {
                item = this.tileArray[i][j];
                if (item) {
                    item.destroy();
                    // this.groundContainer.removeChild(item);
                }
                this.tileArray[i][j] = null;

                item = this.objArray[i][j];
                if (item) {
                    for (k = 0; k < item.length; k++) {
                        if (item[k]) {
                            item[k].destroy();
                            // this.objContainer.removeChild(item[k]);
                        }
                        item[k] = null;
                    }
                }
                this.objArray[i][j] = null;
            }
        }
        item = null;

        this.pathFinding.destroy();
        this.pathFinding = null;

        this.currentControllable = null;
        this.tileArray = null;
        this.objArray = null;
        this.bg = null;
        this.groundContainer = null;
        this.objContainer = null;

        if (this.mapContainer) {
            this.mapContainer.mask = null;
            this.removeChild(this.mapContainer);
            this.mapContainer = null;
        }
        if (this.mapMask) {
            this.removeChild(this.mapMask);
            this.mapMask = null;
        }

        this.config = null;
        this.mapData.groundMapData = null;
        this.mapData.objectsMapData = null;
        this.mapData.objects = null;
        this.mapData.tiles = null;
        this.mapData = null;
    }

    // Externally modifiable properties for EngineView
    /**
     * specifies whether to zoom instantly or with a tween animation
     * @property {Boolean} instantCameraZoom
     * @default false
     */
    public get instantCameraZoom(): boolean {
        return this.config.instantCameraZoom;
    }
    public set instantCameraZoom(value: boolean) {
        this.config.instantCameraZoom = value;
    }
    /**
     * defines if the camera will follow the current controllable or not
     * @property {Boolean} followCharacter
     * @default true
     */
    public get followCharacter(): boolean {
        return this.config.followCharacter;
    }
    public set followCharacter(value: boolean) {
        this.config.followCharacter = value;
    }
    /**
     * specifies whether the camera moves instantly or with a tween animation to the target location
     * @property {Boolean} instantCameraRelocation
     * @default false
     */
    public get instantCameraRelocation(): boolean {
        return this.config.instantCameraRelocation;
    }
    public set instantCameraRelocation(value: boolean) {
        this.config.instantCameraRelocation = value;
    }
    /**
     * specifies whether the map-objects will be moved to target location instantly or with an animation
     * @property {Boolean} instantObjectRelocation
     * @default false
     */
    public get instantObjectRelocation(): boolean {
        return this.config.instantObjectRelocation;
    }
    public set instantObjectRelocation(value: boolean) {
        this.config.instantObjectRelocation = value;
    }
    /**
     * make objects transparent when the controllable is behind them
     * @property {Boolean} changeTransparencies
     * @default true
     */
    public get changeTransparencies(): boolean {
        return this.config.changeTransparencies;
    }
    public set changeTransparencies(value: boolean) {
        this.config.changeTransparencies = value;
    }
    /**
     * highlight the path when the current controllable moves on the map
     * @property {Boolean} highlightPath
     * @default true
     */
    public get highlightPath(): boolean {
        return this.config.highlightPath;
    }
    public set highlightPath(value: boolean) {
        this.config.highlightPath = value;
    }
    /**
     * highlight the target tile when the current controllable moves on the map
     * @member {Boolean} highlightTargetTile
     * @default true
     */
    public get highlightTargetTile(): boolean {
        return this.config.highlightTargetTile;
    }
    public set highlightTargetTile(value: boolean) {
        this.config.highlightTargetTile = value;
    }
    /**
     * animate the tile highlights
     * @member {Boolean} tileHighlightAnimated
     * @default true
     */
    public get tileHighlightAnimated(): boolean {
        return this.config.tileHighlightAnimated;
    }
    public set tileHighlightAnimated(value: boolean) {
        this.config.tileHighlightAnimated = value;
    }
    /**
     * when a tile selected don't move the controllable immediately but still call 'tileSelectCallback'
     * @member {Boolean} dontAutoMoveToTile
     * @default false
     */
    public get dontAutoMoveToTile(): boolean {
        return this.config.dontAutoMoveToTile;
    }
    public set dontAutoMoveToTile(value: boolean) {
        this.config.dontAutoMoveToTile = value;
    }
    /**
     * engine looks for a path every time an object moves to a new tile on the path
     * (set to false if you don't have moving objects other then your controllable on your map)
     * @property {Boolean} checkPathOnEachTile
     * @default true
     */
    public get checkPathOnEachTile(): boolean {
        return this.config.checkPathOnEachTile;
    }
    public set checkPathOnEachTile(value: boolean) {
        this.config.checkPathOnEachTile = value;
    }
    /**
     * enable dragging the map with touch-and-touchmove or mousedown-and-mousemove on the map
     * @property {Boolean} mapDraggable
     * @default true
     */
    public get mapDraggable(): boolean {
        return this.config.mapDraggable;
    }
    public set mapDraggable(value: boolean) {
        this.config.mapDraggable = value;
    }
    /**
     * callback function that will be called once everything is loaded and engine instance is ready
     * @property {Function}
     * @default null
     */
    public get engineInstanceReadyCallback(): (engineInstance: EngineView) => unknown {
        return this.config.engineInstanceReadyCallback;
    }
    public set engineInstanceReadyCallback(value: (engineInstance: EngineView) => unknown) {
        this.config.engineInstanceReadyCallback = value;
    }
    /**
     * callback function that will be called when a tile is selected. Params will be the row and column indexes of the tile selected.
     * @property {Function} tileSelectCallback
     * @default null
     */
    public get tileSelectCallback(): (r: number, c: number) => unknown {
        return this.config.tileSelectCallback;
    }
    public set tileSelectCallback(value: (r: number, c: number) => unknown) {
        this.config.tileSelectCallback = value;
    }
    /**
     * callback function that will be called when a tile with an interactive map-object on it is selected. Call param will be the object selected.
     * @property {Function} objectSelectCallback
     * @default null
     */
    public get objectSelectCallback(): (objectView: ObjectView) => unknown {
        return this.config.objectSelectCallback;
    }
    public set objectSelectCallback(value: (objectView: ObjectView) => unknown) {
        this.config.objectSelectCallback = value;
    }
    /**
     * callback function that will be called when any moving object reaches its destination. Call param will be the moving object itself.
     * @property {Function} objectReachedDestinationCallback
     * @default null
     */
    public get objectReachedDestinationCallback(): (objectView: ObjectView) => unknown {
        return this.config.objectReachedDestinationCallback;
    }
    public set objectReachedDestinationCallback(value: (objectView: ObjectView) => unknown) {
        this.config.objectReachedDestinationCallback = value;
    }
    /**
     * callback function that will be called when any moving object is in move and there are other objects on the next tile. Call params will be the moving object and an array of objects on the next tile.
     * @property {Function} otherObjectsOnTheNextTileCallback
     * @default null
     */
    public get otherObjectsOnTheNextTileCallback(): (
        objectView: ObjectView,
        otherObjectViews: ObjectView[]
    ) => unknown {
        return this.config.otherObjectsOnTheNextTileCallback;
    }
    public set otherObjectsOnTheNextTileCallback(
        value: (objectView: ObjectView, otherObjectViews: ObjectView[]) => unknown
    ) {
        this.config.otherObjectsOnTheNextTileCallback = value;
    }
    /**
     * callback function that will be called every time an objects direction or position changed
     * @property {Function} objectUpdateCallback
     * @default null
     */
    public get objectUpdateCallback(): (objectView: ObjectView) => unknown {
        return this.config.objectUpdateCallback;
    }
    public set objectUpdateCallback(value: (objectView: ObjectView) => unknown) {
        this.config.objectUpdateCallback = value;
    }
    /**
     * alpha value for the tile highlight stroke (this will be overridden if a highlight-image is defined)
     * @property {number} tileHighlightStrokeAlpha
     * @default 1.0
     */
    public get tileHighlightStrokeAlpha(): number {
        return this.config.tileHighlightStrokeAlpha;
    }
    public set tileHighlightStrokeAlpha(value: number) {
        this.config.tileHighlightStrokeAlpha = value;
    }
    /**
     * color code for the tile highlight stroke (this will be overridden if a highlight-image is defined)
     * @property {number} tileHighlightStrokeColor
     * @default 0xFFFFFF
     */
    public get tileHighlightStrokeColor(): number {
        return this.config.tileHighlightStrokeColor;
    }
    public set tileHighlightStrokeColor(value: number) {
        this.config.tileHighlightStrokeColor = value;
    }
    /**
     * alpha value for the tile highlight fill (this will be overridden if a highlight-image is defined)
     * @property {number} tileHighlightFillAlpha
     * @default 1.0
     */
    public get tileHighlightFillAlpha(): number {
        return this.config.tileHighlightFillAlpha;
    }
    public set tileHighlightFillAlpha(value: number) {
        this.config.tileHighlightFillAlpha = value;
    }
    /**
     * color code for the tile highlight fill (this will be overridden if a highlight-image is defined)
     * @property {number} tileHighlightFillColor
     * @default 0x80d7ff
     */
    public get tileHighlightFillColor(): number {
        return this.config.tileHighlightFillColor;
    }
    public set tileHighlightFillColor(value: number) {
        this.config.tileHighlightFillColor = value;
    }
}
