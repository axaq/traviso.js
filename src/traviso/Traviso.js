/**
 * @author Hakan Karlidag - @axaq
 */

/**
 * The [traviso.js](http://www.travisojs.com/) module/namespace.
 *
 * @module TRAVISO
 */

/**
 * Namespace-class for [traviso.js](http://www.travisojs.com/).
 *
 * Contains all traviso related properties and enumerations.
 *
 * @class TRAVISO
 * @static
 */
var TRAVISO = TRAVISO || {};

/**
 * Version of traviso that is loaded.
 * @property {String} VERSION
 * @static
 */
TRAVISO.VERSION = "v1.0.1";

/**
 * The types of available path finding algorithms
 *
 * @property {Object} pfAlgorithms
 * @property {Number} pfAlgorithms.ASTAR_ORTHOGONAL=0
 * @property {Number} pfAlgorithms.ASTAR_DIAGONAL=1
 * @protected
 * @static
 */
TRAVISO.pfAlgorithms = {
	ASTAR_ORTHOGONAL: 0,
	ASTAR_DIAGONAL: 1
};

/**
 * Global configuration settings for traviso
 *
 * @property {Object} config
 * @property {Number} config.logEnabled=false enables logging to the browser console
 * @protected
 * @static
 */
TRAVISO.config = {
    logEnabled : false
};

/**
 * Writes logs to the browser console
 *
 * @method trace
 * @for TRAVISO
 * @static
 * @param s {String} text to log
 */
TRAVISO.trace = function(s) {
    if (TRAVISO.config.logEnabled) {
        console.log("TRAVISO: " + s);
    }
};

/**
 * Creates and returns an isometric engine instance with the provided configuration.
 * Also initialises traviso global settings if it hasn't been already.
 *
 * @method getEngineInstance
 * @for TRAVISO
 * @static
 * @param instanceConfig {Object} configuration object for the isometric instance
 * 
 * @param {String} instanceConfig.mapDataPath the path to the xml file that defines map data, required
 * @param {Array(String)} [instanceConfig.assetsToLoad=null] array of paths to the assets that are desired to be loaded by traviso, no need to use if assets are already loaded to PIXI cache, default null
 * 
 * @param {Number} [instanceConfig.minScale=0.5] mimimum scale that the PIXI.Container for the map can get, default 0.5
 * @param {Number} [instanceConfig.maxScale=1.5] maximum scale that the PIXI.Container for the map can get, default 1.5
 * @param {Number} [instanceConfig.numberOfZoomLevels=5] used to calculate zoom increment, default 5
 * @param {Number} [instanceConfig.initialZoomLevel=0] initial zoom level of the map, should be between -1 and 1, default 0
 * @param {Number} [instanceConfig.instantCameraZoom=false] specifies wheather to zoom instantly or with a tween animation, default false
 * 
 * @param {Number} [instanceConfig.tileHeight=74] height of a single isometric tile, default 74
 * @param {Number} [instanceConfig.isoAngle=30] the angle between the topleft edge and the horizontal diagonal of a isometric quad, default 30
 * 
 * @param {Object} [instanceConfig.initialPositionFrame] frame to position the engine, default { x : 0, y : 0, w : 800, h : 600 }
 * @param {Number} instanceConfig.initialPositionFrame.x x position of the engine, default 0
 * @param {Number} instanceConfig.initialPositionFrame.y y position of the engine, default 0
 * @param {Number} instanceConfig.initialPositionFrame.w width of the engine, default 800
 * @param {Number} instanceConfig.initialPositionFrame.h height of the engine, default 600
 * 
 * @param {Number} [instanceConfig.pathFindingType=TRAVISO.pfAlgorithms.ASTAR_ORTHOGONAL] the type of path finding algorithm two use, default TRAVISO.pfAlgorithms.ASTAR_ORTHOGONAL
 * @param {Boolean} [instanceConfig.pathFindingClosest=false] whether to return the path to the closest node if the target is unreachable, default false
 * 
 * @param {Boolean} [instanceConfig.followCharacter=true] defines if the camera will follow the current controllable or not, default true
 * @param {Boolean} [instanceConfig.instantCameraRelocation=false] specifies wheather the camera moves instantly or with a tween animation to the target location, default false
 * @param {Boolean} [instanceConfig.instantObjectRelocation=false] specifies wheather the map-objects will be moved to target location instantly or with an animation, default false
 * 
 * @param {Boolean} [instanceConfig.changeTransperancies=true] make objects transparent when the cotrollable is behind them, default true
 * 
 * @param {Boolean} [instanceConfig.highlightPath=true] highlight the path when the current controllable moves on the map, default true
 * @param {Boolean} [instanceConfig.highlightTargetTile=true] highlight the target tile when the current controllable moves on the map, default true
 * @param {Boolean} [instanceConfig.tileHighlightAnimated=true] animate the tile highlights, default true
 * @param {Number(Hexadecimal)} [instanceConfig.tileHighlightFillColor=0x80d7ff] color code for the tile highlight fill (this will be overridden if there is a highlight-image defined in the map data file), default 0x80d7ff
 * @param {Number} [instanceConfig.tileHighlightFillAlpha=0.5] apha value for the tile highlight fill (this will be overridden if there is a highlight-image defined in the map data file), default 0.5
 * @param {Number(Hexadecimal)} [instanceConfig.tileHighlightStrokeColor=0xFFFFFF] color code for the tile highlight stroke (this will be overridden if there is a highlight-image defined in the map data file), default 0xFFFFFF
 * @param {Number} [instanceConfig.tileHighlightStrokeAlpha=1.0] apha value for the tile highlight stroke (this will be overridden if a highlight-image is defined), default 1.0
 * @param {Boolean} [instanceConfig.dontAutoMoveToTile=false] when a tile selected don't move the controllable immediately but still call 'tileSelectCallback', default false
 * @param {Boolean} [instanceConfig.checkPathOnEachTile=true] engine looks for a path everytime an object moves to a new tile on the path (set to false if you don't have moving objects other then your controllable on your map), default true
 * 
 * @param {Boolean} [instanceConfig.mapDraggable=true] enable dragging the map with touch-and-touchmove or mousedown-and-mousemove on the map, default true
 * 
 * @param {Number(Hexadecimal)} [instanceConfig.backgroundColor=null] background color, if defined the engine will create a solid colored background for the map, default null
 * @param {Boolean} [instanceConfig.useMask=false] creates a mask using the position frame defined by 'initialPositionFrame' property or the 'posFrame' parameter that is passed to 'repositionContent' method, default false
 * 
 * @param {Function} [instanceConfig.engineInstanceReadyCallback=null] callback function that will be called once everything is loaded and engine instance is ready, default null
 * @param {Function} [instanceConfig.tileSelectCallback=null] callback function that will be called when a tile is selected (call params will be the row and column indexes of the tile selected), default null
 * @param {Function} [instanceConfig.objectSelectCallback=null] callback function that will be called when a tile with an interactive map-object on it is selected (call param will be the object selected), default null
 * @param {Function} [instanceConfig.objectReachedDestinationCallback=null] callback function that will be called when any moving object reaches its destination (call param will be the moving object itself), default null
 * @param {Function} [instanceConfig.otherObjectsOnTheNextTileCallback=null] callback function that will be called when any moving object is in move and there are other objects on the next tile (call params will be the moving object and an array of objects on the next tile), default null
 * @param {Function} [instanceConfig.objectUpdateCallback=null] callback function that will be called everytime an objects direction or position changed, default null
 * 
 * @param [globalConfig] {Object} configuration object for the traviso engine
 * @return {EngineView} a new instance of the isometric engine 
 */ 
TRAVISO.getEngineInstance = function(instanceConfig, globalConfig) {
    TRAVISO.init(globalConfig);
    return new TRAVISO.EngineView(instanceConfig);
};

/**
 * Initialises traviso global settings if it hasn't been already.
 *
 * @method init
 * @for TRAVISO
 * @static
 * @param [globalConfig] {Object} configuration object for the traviso engine
 */
TRAVISO.init = function(globalConfig) {
	// do necessary checks and assignments for global settings
	if (globalConfig) {
        TRAVISO.config.logEnabled = globalConfig.logEnabled;
    }
    
    if (TRAVISO.isReady) {
        return;
    }
    
    // Externally modifiable properties for EngineView
	var modifiables = [
        "instantCameraZoom",
        "followCharacter", 
        "instantCameraRelocation", 
        "instantObjectRelocation", 
        "changeTransperancies", 
        "highlightPath", 
        "highlightTargetTile", 
        "tileHighlightAnimated", 
        "dontAutoMoveToTile", 
        "checkPathOnEachTile", 
        "mapDraggable",
        "engineInstanceReadyCallback",
        "tileSelectCallback", 
        "objectSelectCallback", 
        "objectReachedDestinationCallback", 
        "otherObjectsOnTheNextTileCallback",
        "objectUpdateCallback"
    ];
	
	for (var i=0; i < modifiables.length; i++) {
		TRAVISO.defineProperty(modifiables[i]);
	}
	
	/**
	 * The direction IDs to be used in the engine
	 *
	 * @property {Object} directions
	 * @property {Number} directions.O=0 idle no direction
	 * @property {Number} directions.S=1 south
	 * @property {Number} directions.SW=2 south west
	 * @property {Number} directions.W=3 west
	 * @property {Number} directions.NW=4 north west
	 * @property {Number} directions.N=5 north
	 * @property {Number} directions.NE=6 north east
	 * @property {Number} directions.E=7 east
	 * @property {Number} directions.SE=8 south east
	 * @protected
	 * @static
	 */
	TRAVISO.directions = {
	    O:  0,
	    S:  1,
	    SW: 2,
	    W:  3,
	    NW: 4,
	    N:  5,
	    NE: 6,
	    E:  7,
	    SE: 8
	};
	
	
	
	/**
	 * @property {Array} RESERVED_TEXTURE_IDS
	 * @protected
	 * @static
	 */
    TRAVISO.RESERVED_TEXTURE_IDS = ["idle", "idle_s", "idle_sw", "idle_w", "idle_nw", "idle_n", "idle_ne", "idle_e", "idle_se", "move_s", "move_sw", "move_w", "move_nw", "move_n", "move_ne", "move_e", "move_se"];
    
    /**
	 * @property {Boolean} isReady
	 * @protected
	 * @static
	 */
    TRAVISO.isReady = true;

    TRAVISO.trace("Traviso initiated");
};

/**
 * Helper method to define property for the EngineView
 *
 * @method defineProperty
 * @for TRAVISO
 * @static
 * @param key {String} name of the property
 */
TRAVISO.defineProperty = function(key) {
    Object.defineProperty(TRAVISO.EngineView.prototype, key, {
	    get: function() {
	        return this.config[key];
	    },
	    set: function(value) {
	        this.config[key] = value;
	    }
	});
};
