/**
 * @license
 * traviso.js - v0.0.2
 * Copyright (c) 2015, Hakan Karlidag - @axaq
 * www.travisojs.com
 *
 * Compiled: 2015-04-15
 *
 * traviso.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */
/**
 * @author Hakan Karlidag - @axaq
 */

(function(){

    var root = this;

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
TRAVISO.VERSION = "v0.0.1";

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
TRAVISO.trace = function(s)
{
    if (TRAVISO.config.logEnabled)
    {
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
 * @param {Number} [instanceConfig.minScale=0.5] mimimum scale that the DisplayObjectContainer for the map can get, default 0.5
 * @param {Number} [instanceConfig.maxScale=1.5] maximum scale that the DisplayObjectContainer for the map can get, default 1.5
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
 * 
 * @param {Boolean} [instanceConfig.followCharacter=true] defines if the camera will follow the current controllable or not, default true
 * @param {Boolean} [instanceConfig.instantCameraRelocation=false] specifies wheather the camera moves instantly or with a tween animation to the target location, default false
 * @param {Boolean} [instanceConfig.instantObjectRelocation=false] specifies wheather the map-objects will be moved to target location instantly or with an animation, default false
 * 
 * @param {Boolean} [instanceConfig.highlightPath=true] highlight the path when the current controllable moves on the map, default true
 * @param {Boolean} [instanceConfig.highlightTargetTile=true] highlight the target tile when the current controllable moves on the map, default true
 * @param {Boolean} [instanceConfig.tileHighlightAnimated=true] animate the tile highlights, default true
 * 
 * @param {Boolean} [instanceConfig.mapDraggable=true] enable dragging the map with touch-and-touchmove or mousedown-and-mousemove on the map, default true
 * 
 * @param {Number(Hexadecimal)} [instanceConfig.backgroundColor=null] background color, if defined the engine will create a solid colored background for the map, default null
 * @param {Boolean} [instanceConfig.useMask=false] creates a mask using the position frame defined by 'initialPositionFrame' property or the 'posFrame' parameter that is passed to 'repositionContent' method, default false
 * 
 * @param {Object} [instanceConfig.callbackScope=null] the scope to apply when calling callback functions, default null
 * @param {Function} [instanceConfig.engineInstanceReadyCallback=null] callback function that will be called once everything is loaded and engine instance is ready, needs 'callbackScope' property, default null
 * @param {Function} [instanceConfig.tileSelectCallback=null] callback function that will be called when a tile is selected, needs 'callbackScope' property, default null
 * @param {Function} [instanceConfig.objectSelectCallback=null] callback function that will be called when a tile with an interactive map-object on it is selected, needs 'callbackScope' property, default null
 * @param {Function} [instanceConfig.objectReachedDestinationCallback=null] callback function that will be called when any moving object reaches its destination, needs 'callbackScope' property, default null
 * @param {Function} [instanceConfig.otherObjectsOnTheNextTileCallback=null] callback function that will be called when any moving object is in move and there are other objects on the next tile, needs 'callbackScope' property, default null
 * 
 * @param [globalConfig] {Object} configuration object for the traviso engine
 * @return {EngineView} a new instance of the isometric engine 
 */ 
TRAVISO.getEngineInstance = function(instanceConfig, globalConfig)
{
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
TRAVISO.init = function(globalConfig)
{
	// do necessary checks and assignments for global settings
	if (globalConfig)
    {
        TRAVISO.config.logEnabled = globalConfig.logEnabled;
    }
    
    if (TRAVISO.isReady)
    {
        return;
    }
    
    // Externally modifiable properties for EngineView
	var modifiables = [	"instantCameraZoom",
						"followCharacter", 
						"instantCameraRelocation", 
						"instantObjectRelocation", 
						"highlightPath", 
						"highlightTargetTile", 
						"tileHighlightAnimated", 
						"mapDraggable", 
						"callbackScope", 
						"engineInstanceReadyCallback", 
						"tileSelectCallback", 
						"objectSelectCallback", 
						"objectReachedDestinationCallback", 
						"otherObjectsOnTheNextTileCallback"
					  ];
	
	for (var i=0; i < modifiables.length; i++)
	{
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
	    O: 0,
	    S: 1,
	    SW: 2,
	    W: 3,
	    NW: 4,
	    N: 5,
	    NE: 6,
	    E: 7,
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
TRAVISO.defineProperty = function(key)
{
    Object.defineProperty(TRAVISO.EngineView.prototype, key, {
	    get: function() {
	        return this.config[key];
	    },
	    set: function(value) {
	        this.config[key] = value;
	    }
	});
};

/**
 * @author Hakan Karlidag - @axaq
 */

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
TRAVISO.loadAssetsAndData = function(engine, loadedCallback)
{
    if (engine.config.assetsToLoad && engine.config.assetsToLoad !== "" && engine.config.assetsToLoad.length > 0)
    {
        var loader = new PIXI.AssetLoader(engine.config.assetsToLoad, false);
        loader.onComplete = function () { TRAVISO.loadData(engine, loadedCallback); };
        loader.load();
    }
    else
    {
        TRAVISO.loadData(engine, loadedCallback);
    }
};

/**
 * Handles loading of map data for the given engine instance 
 *
 * @method loadData
 * @for TRAVISO
 * @static
 * @private
 * @param engine {EngineView} engine instance
 * @param engine.config {Object} configuration object for the engine instance
 * @param engine.config.mapDataPath {String} the path to the xml file that defines map data
 * @param [loadedCallback=null] {Function} Callback function
 */
TRAVISO.loadData = function(engine, loadedCallback)
{
    engine.mapData = {};
    
    if (!engine.config.mapDataPath)
    {
        throw new Error("TRAVISO: No XML path defined for map data. Plese check your configuration object that you pass to the 'getEngineInstance' method.");
    }
    else
    {
        this.ajaxRequest = new XMLHttpRequest();
        this.ajaxRequest.onreadystatechange = function()
        {
            if (this.readyState === 4)
            {
                if (this.status === 200 || window.location.href.indexOf("http") === -1)
                {
                    var arr, i, j, data, rows;
                    
                    // check if single_ground_image is defined or not 
                    var singleGroundImageData = this.responseXML.getElementsByTagName("single_ground_image");
                    if (singleGroundImageData && singleGroundImageData.length > 0)
                    {
                    	var singleGroundImagePathData = singleGroundImageData[0].getElementsByTagName("path");
                    	if (singleGroundImagePathData && singleGroundImagePathData.length > 0)
                    	{
                    		engine.mapData.singleGroundImagePath = String(singleGroundImagePathData[0].firstChild.nodeValue);
                    		
                    		var attScale = singleGroundImageData[0].attributes.getNamedItem("scale");
	                    	attScale = (attScale) ? parseInt(attScale.nodeValue, 10) : 1;
	                    	if (attScale <= 0) { attScale = 1; }
                    		engine.mapData.singleGroundImageScale = attScale;
                    	}
                    	else
                    	{
                    		TRAVISO.trace("Path is NOT defined for single_ground_image");
                    	}
                    }
                    
                    data = this.responseXML.getElementsByTagName("ground_map")[0];
                    rows = data.getElementsByTagName("row");
                    engine.mapData.groundMapData = [];
                    for (i = 0; i < rows.length; i++)
                    {
                        arr = String(rows[i].firstChild.nodeValue).split(",");
                        // remove empty spaces in a row and cast to an array
                        for (j = arr.length; j--; ) { arr[j] = arr[j] | 0; }
                        engine.mapData.groundMapData[i] = arr;
                    }
					
                    data = this.responseXML.getElementsByTagName("object_map")[0];
                    rows = data.getElementsByTagName("row");
                    engine.mapData.objectsMapData = [];
                    for (i = 0; i < rows.length; i++)
                    {
                        arr = String(rows[i].firstChild.nodeValue).split(",");
                        // remove empty spaces in a row and cast to an array
                        for (j = arr.length; j--; ) { arr[j] = arr[j] | 0; }
                        engine.mapData.objectsMapData[i] = arr;
                    }

                    var initialControllableLocationData = this.responseXML.getElementsByTagName("initial_controllable_location");
                    
                    if (initialControllableLocationData && initialControllableLocationData.length > 0)
                    {
                        var initialControllableLocation = initialControllableLocationData[0];
                        engine.mapData.initialControllableLocation =
                        {
                            c : parseInt(initialControllableLocation.attributes.getNamedItem("c").nodeValue, 10),
                            r : parseInt(initialControllableLocation.attributes.getNamedItem("r").nodeValue, 10)
                        };
                    }
                    else
                    {
                        TRAVISO.trace("No initial_controllable_location defined in the XML file.");
                    }
                                        
                    engine.mapData.textures = {};
                    engine.mapData.textures.tiles = [];
                    engine.mapData.textures.objects = [];
                    
                    // set tile properties
                    arr = this.responseXML.getElementsByTagName("tile");
                    
                    for (i = 0; i < arr.length; i++)
                    {
                        engine.mapData.textures.tiles[arr[i].attributes.getNamedItem("id").nodeValue] =
                        {
                            t : (arr[i].firstChild && arr[i].firstChild.nodeValue) ? String(arr[i].firstChild.nodeValue) : null,
                            m : parseInt(arr[i].attributes.getNamedItem("movable").nodeValue, 10)
                        };
                    }

					var tileHighlightData = this.responseXML.getElementsByTagName("tile_highlight_image");
					if (tileHighlightData && tileHighlightData.length > 0 && tileHighlightData[0].firstChild)
                    {
                    	engine.mapData.textures.tileHighlight = String(tileHighlightData[0].firstChild.nodeValue);
                    }

                    // set object properties
                    arr = this.responseXML.getElementsByTagName("object");
                    
                    var oTextures;
                    for (i = 0; i < arr.length; i++)
                    {
                        oTextures = { };

                        ///////////////////////////////////////////////////////////////////////////

                        var objectVisuals = arr[i].getElementsByTagName("v");

                        if (!objectVisuals || objectVisuals.length < 1)
                        {
                            throw new Error("TRAVISO: No visuals defined in XML for object type: " + arr[i].attributes.getNamedItem("id").nodeValue);
                        }
                        else
                        {
                        	var m, k;
                            for (k = 0; k < objectVisuals.length; k++)
                            {
                                var v = objectVisuals[k];
                                var vId = v.attributes.getNamedItem("id").nodeValue;
                                if (!vId || vId === "" || vId.length < 1)
                                {
                                    throw new Error("TRAVISO: A v tag without an id is detected in the XML file.");
                                }

                                var vFrames = v.getElementsByTagName("f");
                                if (vFrames && vFrames.length > 0)
                                {
                                    oTextures[vId] = [];
                                    for (m = 0; m < vFrames.length; m++)
                                    {
                                        oTextures[vId][m] = String(vFrames[m].firstChild.nodeValue);
                                    }
                                }
                                else
                                {
                                    var vPath = String(v.attributes.getNamedItem("path").nodeValue);
                                    var vExtension = String(v.attributes.getNamedItem("ext").nodeValue);
                                    var vNumberOfFrames = parseInt(v.attributes.getNamedItem("number_of_frames").nodeValue, 10);
                                    var vStartNumber = parseInt(v.attributes.getNamedItem("start_number").nodeValue, 10);

                                    if (!vPath || !vExtension || !vNumberOfFrames || vNumberOfFrames < 1)
                                    {
                                        throw new Error("TRAVISO: Misdefined v tag attributes detected in XML file for v id: " + vId);
                                    }

                                    oTextures[vId] = [];
                                    if (vNumberOfFrames === 1)
                                    {
                                        oTextures[vId][0] = vPath + "." + vExtension;
                                    }
                                    else
                                    {
                                        var n = 0;
                                        for (m = vStartNumber; m < vNumberOfFrames; m++)
                                        {
                                            oTextures[vId][n++] = vPath + String(m) + "." + vExtension;
                                        }
                                    }
                                }

                            }
                        }

                        engine.mapData.textures.objects[arr[i].attributes.getNamedItem("id").nodeValue] =
                        {
                            t : oTextures,
                            s : arr[i].attributes.getNamedItem("s").nodeValue,
                            m : parseInt(arr[i].attributes.getNamedItem("movable").nodeValue, 10),
                            i : parseInt(arr[i].attributes.getNamedItem("interactive").nodeValue, 10)
                        };
                    }

                    if (loadedCallback)
                    {
                        loadedCallback();
                    }
                }
            }
        };

        this.ajaxRequest.open("GET", engine.config.mapDataPath, true);
        if (this.ajaxRequest.overrideMimeType) { this.ajaxRequest.overrideMimeType("application/xml"); }
        this.ajaxRequest.send(null);
    }
};

/**
 * Returns an object with all properties of a map-object defined by object-type
 *
 * @method getObjectInfo
 * @for TRAVISO
 * @static
 * @private
 * @param engine {EngineView} engine instance
 * @param objectType {String} type/id of the related object tag defined in the xml file
 * @return {Object} an object with all properties of a map-object
 */
TRAVISO.getObjectInfo = function(engine, objectType)
{
    var objInfo = engine.mapData.textures.objects[objectType];
    if (objInfo)
    {
        var textures = {};
        for (var key in objInfo.t)
        {
            textures[key] = TRAVISO.getObjectTextures(engine, objectType, key);
        }
        return {
            m : objInfo.m,
            i : objInfo.i,
            t : textures,
            s : objInfo.s
        };
    }
    else
    {
        throw new Error("TRAVISO: No info defined for object type: " + objectType);
    }
};

/**
 * Returns an array of textures {PIXI.Texture} belong to a map-object defined by object-type and sprite-id
 *
 * @method getObjectTextures
 * @for TRAVISO
 * @static
 * @private
 * @param engine {EngineView} engine instance
 * @param objectType {String} type/id of the related object tag defined in the xml file
 * @param visualId {String} id of the related v tag defined in the xml file
 * @return {Array(PIXI.Texture)} an array of textures
 */
TRAVISO.getObjectTextures = function(engine, objectType, visualId)
{
    var objInfo = engine.mapData.textures.objects[objectType];
    if (objInfo)
    {
        var textures = null;
        var textureNames = objInfo.t[visualId];
        if (textureNames)
        {   
            textures = [];
            for (var j = 0; j < textureNames.length; j++)
            {
                textures[textures.length] = PIXI.Texture.fromFrame(textureNames[j]);
            }
        }
        else
        {
            TRAVISO.trace("No textures defined for object type: " + objectType + " and visualId: " + visualId);
        }
        return textures;
    }
    else
    {
        throw new Error("TRAVISO: No info defined for object type: " + objectType);
    }
};

/**
 * Returns an object with all properties of a map-tile defined by tileType
 *
 * @method getTileInfo
 * @for TRAVISO
 * @static
 * @private
 * @param engine {EngineView} engine instance
 * @param tileType {String} type/id of the related tile tag defined in the xml file
 * @return {Object} an object with all properties of a map-tile
 */
TRAVISO.getTileInfo = function(engine, tileType)
{
    var tileInfo = engine.mapData.textures.tiles[tileType];
    if (tileInfo)
    {
        return {
            m : tileInfo.m,
            t : tileInfo.t ? [PIXI.Texture.fromFrame(tileInfo.t)] : []
        };
    }
    else if (engine.mapData.singleGroundImagePath)
    {
        return {
            m : parseInt(tileType) > 0 ? 1 : 0,
            t : []
        };
    }
    else
    {
        throw new Error("TRAVISO: No info defined for tile type: " + tileType);
    }
};

/**
 * Returns the predefined stationary texture id for the given direction
 *
 * @method getStationaryDirVisualId
 * @for TRAVISO
 * @static
 * @private
 * @param dir {Number} index of the direction
 * @return {String} texture id for the given direction
 */
TRAVISO.getStationaryDirVisualId = function(dir)
{
    return TRAVISO.RESERVED_TEXTURE_IDS[dir];
};

/**
 * Returns the predefined moving texture id for the given direction
 *
 * @method getMovingDirVisualId
 * @for TRAVISO
 * @static
 * @private
 * @param dir {Number} index of the direction
 * @return {String} texture id for the given direction
 */
TRAVISO.getMovingDirVisualId = function(dir)
{
    return TRAVISO.RESERVED_TEXTURE_IDS[dir + 8];
};

/**
 * Returns the direction (id) between two locations
 *
 * @method getDirBetween
 * @for TRAVISO
 * @static
 * @private
 * @param r1 {Number} row index of the first location
 * @param c1 {Number} column index of the first location
 * @param r2 {Number} row index of the second location
 * @param c2 {Number} column index of the second location
 * @return {Number} direction id
 */
TRAVISO.getDirBetween = function(r1, c1, r2, c2)
{
    var dir = TRAVISO.directions.S;
    if (r1 === r2)
    {
        if (c1 === c2) 		{ dir = TRAVISO.directions.O; }
        else if (c1 < c2) 	{ dir = TRAVISO.directions.NE; }
        else 				{ dir = TRAVISO.directions.SW; }
    }
    else if (r1 < r2)
    {
        if (c1 === c2)		{ dir = TRAVISO.directions.SE; }
        else if (c1 < c2)	{ dir = TRAVISO.directions.W; }
        else				{ dir = TRAVISO.directions.S; }
    }
    else if (r1 > r2)
    {
        if (c1 === c2)		{ dir = TRAVISO.directions.NW; }
        else if (c1 < c2)	{ dir = TRAVISO.directions.N; }
        else				{ dir = TRAVISO.directions.E; }
    }
    return dir;
};

/**
 * @author Hakan Karlidag - @axaq
 */

/**
 * Linear maps a given number in a source range to a target range 
 *
 * @method mathMap
 * @for TRAVISO
 * @static
 * @param v {Number} value to map
 * @param min1 {Number} minimum value of the source range
 * @param max1 {Number} maximum value of the source range
 * @param min2 {Number} minimum value of the target range
 * @param max2 {Number} maximum value of the target range
 * @param [noOutliers=false] {Boolean} If the outlier values won't be processed, default false
 * @return {Number} mapped value according to target range
 */
TRAVISO.mathMap = function(v, min1, max1, min2, max2, noOutliers)
{
    if (noOutliers)
    {
        if (v < min1) { return min2; }
        else if (v > max1) { return max2; }
    }
    return min2 + (max2 - min2) * (v - min1) / (max1 - min1);
};

/**
 * Produces dot product of two vectors.
 *
 * @method dotProduct
 * @for TRAVISO
 * @static
 * @param v1 {Object} first vector
 * @param v1.x {Number} x component
 * @param v1.y {Number} y component
 * @param v2 {Object} second vector
 * @param v2.x {Number} x component
 * @param v2.y {Number} y component
 * @return {Number} dot product of two vectors
 */
TRAVISO.dotProduct = function(v1, v2)
{
    return v1.x * v2.x + v1.y * v2.y;
};

/**
 * Produces unit vector of a given vector.
 *
 * @method getUnit
 * @for TRAVISO
 * @static
 * @param v {Object} source vector
 * @param v.x {Number} x component
 * @param v.y {Number} y component
 * @return {Object} unit vector
 */
TRAVISO.getUnit = function(v)
{
    var m = Math.sqrt(v.x * v.x + v.y * v.y);
    return { x: v.x / m, y: v.y / m };
};

/**
 * Checks if the given point is the polygon defined by the vertices.
 *
 * @method isInPolygon
 * @for TRAVISO
 * @static
 * @param gp {Object} point to check
 * @param gp.x {Number} x component
 * @param gp.y {Number} y component
 * @param vertices {Array(Array(Number))} array containing the vertices of the polygon
 * @return {Boolean} if the point is inside the polygon
 */
TRAVISO.isInPolygon = function(gp, vertices) 
{
	var testy = gp.y;
	var testx = gp.x;
	var nvert = vertices.length;
	var i, j, c = false;
	for ( i = 0, j = nvert - 1; i < nvert; j = i++)
	{
		if ( ((vertices[i][1] > testy) !== (vertices[j][1] > testy)) && 
			(testx < (vertices[j][0] - vertices[i][0]) * (testy - vertices[i][1]) / (vertices[j][1] - vertices[i][1]) + vertices[i][0]) )
		{
			c = !c;
		}
	}
	return c;
};

/**
 * Calculates the distance between two points.
 *
 * @method getDist
 * @for TRAVISO
 * @static
 * @param p1 {Object} first point
 * @param p1.x {Number} x component
 * @param p1.y {Number} y component
 * @param p2 {Object} second point
 * @param p2.x {Number} x component
 * @param p2.y {Number} y component
 * @return {Boolean} the distance between two points
 */
TRAVISO.getDist = function(p1, p2)
{
	return Math.sqrt((p2.x-p1.x) * (p2.x-p1.x) + (p2.y-p1.y) * (p2.y-p1.y));
};

/**
 * Calculates the global point with respect to given local point and scope.
 *
 * @method localToGlobal
 * @for TRAVISO
 * @static
 * @param lp {Object} local point
 * @param lp.x {Number} x component
 * @param lp.y {Number} y component
 * @param scope {Object} local scope
 * @return {Boolean} global point
 */
TRAVISO.localToGlobal = function(lp, scope) 
{
	var sX = scope.position.x + lp.x;
	var sY = scope.position.y + lp.y;
	
	var p = scope.parent;
	while(p)
	{
		sX += p.position.x;
		sY += p.position.y;
		p = p.parent;
	}
	
    return {
      x: sX,
      y: sY
    };
};

/**
 * Calculates the local point with respect to given global point and local scope.
 *
 * @method globalToLocal
 * @for TRAVISO
 * @static
 * @param gp {Object} global point
 * @param gp.x {Number} x component
 * @param gp.y {Number} y component
 * @param scope {Object} local scope
 * @return {Boolean} local point
 */
TRAVISO.globalToLocal = function(gp, scope) 
{
	var sX = scope.position.x;
	var sY = scope.position.y;
	
	var p = scope.parent;
	while(p)
	{
		sX += p.position.x;
		sY += p.position.y;
		p = p.parent;
	}
	
    return {
      x: gp.x - sX,
      y: gp.y - sY
    };
};

/**
 * Checks if the value existy.
 *
 * @method existy
 * @for TRAVISO
 * @static
 * @param value {Object} value to check
 * @return {Boolean} if the value existy
 */
TRAVISO.existy = function(value)
{
    return value !== null && value !== undefined;
};

/**
 * @author Hakan Karlidag - @axaq
 */

/**
 * Holds and manages all the logic for tween animations and map-object movement on the map.
 * This is created and used by EngineView instances.
 *
 * @class MoveEngine
 * @constructor
 * @param engine {EngineView} the engine instance that the animations will perform on
 * @param [defaultSpeed=3] {Number} default speed for the map-objects to be used when they move on map
 */
TRAVISO.MoveEngine = function(engine, defaultSpeed)
{
	/**
	 * A reference to the engine view that uses this move engine.
	 * @property {EngineView} engine
	 * @protected
	 */
    this.engine = engine;
    
    /**
	 * The speed value to be used for object movements if not defined specifically.
	 * @property {Number} DEFAULT_SPEED
	 * @protected
	 * @default 3
	 */
    this.DEFAULT_SPEED = defaultSpeed || 3;
    
    /**
	 * Specifies if the move-engine will process the object movements.
	 * @property {Boolean} activeForMovables
	 * @protected
	 */
    /**
	 * Specifies if the move-engine will process the tweens.
	 * @property {Boolean} activeForTweens
	 * @protected
	 */
	/**
	 * Specifies if the move-engine will process the tweens and object movements.
	 * @property {Boolean} processFrame
	 * @protected
	 */
    this.activeForMovables = false;
    this.activeForTweens = false;
    this.processFrame = true;
    
    /**
	 * The list to store current map-objects in move.
	 * @property {Array(ObjectView)} movables
	 * @protected
	 */
	/**
	 * The list to store targets for the current tweens.
	 * @property {Array(Object)} tweenTargets
	 * @protected
	 */
    this.movables = [];
    this.tweenTargets = [];
    
    /**
	 * Used to calculate how many frames a tween will take to process.
	 * @property {Number} fps
	 * @protected
	 */
    this.fps = 60;
    
    var scope = this;
	requestAnimFrame(function() { scope.run(); });
};

// constructor
TRAVISO.MoveEngine.constructor = TRAVISO.MoveEngine;

/**
 * Adds a single tween for the given object.
 *
 * @method addTween
 * @param o {Object} the object to add tween animation to
 * @param duration {Number} the duration of the tween animation in seconds
 * @param vars {Object} the object defining which properties of the target object will be animated
 * @param [delay=0] {Number} the amount of waiting before the tween animation starts, in seconds
 * @param [easing="linear"] {String} type of the easing
 * @param [overwrite=false] {Boolean} if the other tween animations assigned to the same object are going to be killed
 * @param [onComplete=null] {Function} callback function to be called after the tween animation finished
 */
TRAVISO.MoveEngine.prototype.addTween = function(o, duration, vars, delay, easing, overwrite, onComplete)
{
	var v = null;
	for (var prop in vars)
	{
		if (o[prop] !== vars[prop])
		{
			if (!v) { v = {}; }
			v[prop] = { b: o[prop], c: vars[prop] - o[prop] };
		}
	}
	
	if (v)
	{
		var t = {
			target : 		o,
			duration : 		duration,
			delay : 		Number(delay) || 0,
			easingFunc : 	this.getEasingFunc(easing),
			overwrite : 	overwrite || false,
			onComplete : 	onComplete || null,
			totalFrames : 	duration * this.fps,
			currentFrame : 	0,
			vars : 			v
		};
				
	    var idx = this.tweenTargets.indexOf(o); 
	    if (idx >= 0)
	    {
	    	var tweens = o.tweens;
	    	if (!tweens)
	    	{
	    		tweens = [];
	    	}
	        if (t.overwrite)
	        {
	        	for (var i=0; i < tweens.length; i++)
	        	{
					tweens[i] = null;
				}
				tweens = [];
	        }
	        
	        tweens[tweens.length] = t;
	        o.tweens = tweens;
	    }
	    else
	    {
	    	o.tweens = [t];
	    	this.tweenTargets[this.tweenTargets.length] = o;
	    }
	    
	    if (this.tweenTargets.length > 0 && !this.activeForTweens)
	    {
	        this.activeForTweens = true;
	    }
    }
};

/**
 * Removes a single tween from the given object.
 *
 * @method removeTween
 * @param o {Object} the object to remove the tween animation from
 * @param t {Object} the tween to be removed from the object
 * @return {Boolean} if the tween is found and removed
 */
TRAVISO.MoveEngine.prototype.removeTween = function(o, t)
{
	var targetRemoved = false;
	
	if (o && t)
	{
	    var idx = this.tweenTargets.indexOf(o); 
	    if (idx >= 0)
	    {
	    	if (this.tweenTargets[idx].tweens && this.tweenTargets[idx].tweens.length > 0)
	    	{
	    		var tweens = this.tweenTargets[idx].tweens;
	    		var idx2 = tweens.indexOf(t);
	    		if (idx2 >= 0)
	    		{
			    	t.onComplete = null;
					t.easingFunc = null;
					t.target = null;
					
	    			tweens.splice(idx2, 1);
	    			if (tweens.length === 0)
				    {
				        this.tweenTargets.splice(idx, 1);
				        targetRemoved = true;
				    }
	    		}
	    		else
	    		{
	    			throw new Error("No tween defined for this object");
	    		}
	    	}
	    	else
	    	{
	    		throw new Error("No tween defined for this object");
	    	}
	    }
	    else
	    {
	    	throw new Error("No tween target defined for this object");
	    }
	    
	    if (this.tweenTargets.length === 0)
	    {
	        this.activeForTweens = false;
	    }
	}
	
	return targetRemoved;
};

/**
 * Removes and kills all tweens assigned to the given object.
 *
 * @method killTweensOf
 * @param o {Object} the object to remove the tween animations from
 * @return {Boolean} if any tween is found and removed from the object specified
 */
TRAVISO.MoveEngine.prototype.killTweensOf = function(o)
{
	var targetRemoved = false;
	
	var idx = this.tweenTargets.indexOf(o); 
    if (idx >= 0)
    {
    	if (this.tweenTargets[idx].tweens && this.tweenTargets[idx].tweens.length > 0)
    	{
    		var tweens = this.tweenTargets[idx].tweens;
    		for (var j=0; j < tweens.length; j++)
	    	{
				tweens[j].onComplete = null;
				tweens[j].easingFunc = null;
				tweens[j].target = null;
				tweens[j] = null;
			}
	    	this.tweenTargets[idx].tweens = null;
	    }
    	
    	this.tweenTargets.splice(idx, 1);
    	
    	targetRemoved = true;
    }
    
    if (this.tweenTargets.length === 0)
    {
        this.activeForTweens = false;
    }
    
    return targetRemoved;
};

/**
 * Removes and kills all the tweens in operation currently.
 *
 * @method removeAllTweens
 */
TRAVISO.MoveEngine.prototype.removeAllTweens = function()
{
	this.activeForTweens = false;
	
    var tweens, i, j, len = this.tweenTargets.length; 
    for (i=0; i < len; i++)
    {
    	tweens = this.tweenTargets[i].tweens;
    	for (j=0; j < tweens.length; j++)
    	{
			tweens[j].onComplete = null;
			tweens[j].easingFunc = null;
			tweens[j].target = null;
			tweens[j] = null;
		}
    	this.tweenTargets[i].tweens = null;
    	this.tweenTargets[i] = null;
    }
    
    this.tweenTargets = [];
};

/**
 * Adds a map-object as movable to the engine.
 *
 * @method addMovable
 * @param o {ObjectView} the map-object to add as movable
 */
TRAVISO.MoveEngine.prototype.addMovable = function(o)
{
	if (this.movables.indexOf(o) >= 0)
    {
        return;
    }
    
    this.movables[this.movables.length] = o;
    
    if (this.movables.length > 0 && !this.activeForMovables)
    {
        this.activeForMovables = true;
    }
    
    // all movables needs to have the following variables:
    // speedMagnitude, speedUnit (more to come...) 
    
    // NOTE: might be a good idea to add all necessary parameters to the object here
};

/**
 * Removes a map-object from the current movables list.
 *
 * @method removeMovable
 * @param o {ObjectView} the map-object to remove
 * @return {Boolean} if the map-object is removed
 */
TRAVISO.MoveEngine.prototype.removeMovable = function(o)
{
	var idx = this.movables.indexOf(o); 
    if (idx !== -1)
    {
        o.speedUnit = { x: 0, y: 0 };
        this.movables.splice(idx, 1);
    }
    
    if (this.movables.length === 0)
    {
        this.activeForMovables = false;
    }
    
    // TODO: might be a good idea to remove/reset all related parameters from the object here
    
    return (idx !== -1);
};

/**
 * Removes all movables.
 *
 * @method removeAllMovables
 */
TRAVISO.MoveEngine.prototype.removeAllMovables = function()
{
	this.activeForMovables = false;
	
    var len = this.movables.length; 
    for (var i=0; i < len; i++)
    {
    	this.movables[i] = null;
    }
    
    this.movables = [];
};

/**
 * Changes the current path of a map-object.
 *
 * @method addNewPathToObject
 * @param o {ObjectView} the map-object to add the path to
 * @param path {Array(Object)} the new path
 * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null 
 */
TRAVISO.MoveEngine.prototype.addNewPathToObject = function(o, path, speed)
{
	if (o.currentPath && o.currentTarget)
	{
		path[path.length] = o.currentPath[o.currentPathStep];
	}
	o.currentPath = path;
    o.currentPathStep = o.currentPath.length - 1;
    o.speedMagnitude = speed || o.speedMagnitude || this.DEFAULT_SPEED;
};

/**
 * Prepares a map-object for movement.
 *
 * @method prepareForMove
 * @param o {ObjectView} the movable map-object
 * @param path {Array(Object)} the path for the object
 * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null 
 */
TRAVISO.MoveEngine.prototype.prepareForMove = function(o, path, speed)
{
    o.currentPath = path;
    o.currentPathStep = o.currentPath.length - 1;
    o.speedMagnitude = speed || o.speedMagnitude || this.DEFAULT_SPEED;
};

/**
 * Sets movement specific parameters for the map-object according to target location.
 *
 * @method setMoveParameters
 * @param o {ObjectView} the movable map-object
 * @param pos {Object} target location
 * @param pos.r {Object} the row index of the map location
 * @param pos.c {Object} the column index of the map location
 */
TRAVISO.MoveEngine.prototype.setMoveParameters = function(o, pos)
{
    var px = this.engine.getTilePosXFor(pos.r, pos.c);
    var py = this.engine.getTilePosYFor(pos.r, pos.c) + this.engine.TILE_HALF_H;
    
    o.speedUnit = TRAVISO.getUnit({ x: (px - o.position.x), y: (py - o.position.y) });
    
    o.currentTarget = { x: px, y: py };
    o.currentReachThresh = Math.ceil(Math.sqrt(o.speedUnit.x * o.speedUnit.x + o.speedUnit.y * o.speedUnit.y) * o.speedMagnitude);
};

/**
 * Returns the proper easing method to use depending on the easing id specified.
 *
 * @method getEasingFunc
 * @private
 * @param e {String} the easing id
 * @return {Function} the easing method to use
 */
TRAVISO.MoveEngine.prototype.getEasingFunc = function (e)
{
	if (e === "easeInOut" || e === "easeInOutQuad" || e === "Quad.easeInOut")
	{
		return this.easeInOutQuad;
	}
	else if (e === "easeIn" || e === "easeInQuad" || e === "Quad.easeIn")
	{
		return this.easeInQuad;
	}
	else if (e === "easeOut" || e === "easeOutQuad" || e === "Quad.easeOut")
	{
		return this.easeOutQuad;
	}
	else
	{
		return this.linearTween;
	}
};
/**
 * Linear tween calculation.
 *
 * @method linearTween
 * @private
 * @param t {Number} current time
 * @param b {Number} initial value
 * @param c {Number} differance with the target value
 * @param d {Number} total time
 * @return {Number} result of the calculation
 */
TRAVISO.MoveEngine.prototype.linearTween = function (t, b, c, d) {
	return c*t/d + b;
};
/**
 * Quadratic ease-in tween calculation.
 *
 * @method easeInQuad
 * @private
 * @param t {Number} current time
 * @param b {Number} initial value
 * @param c {Number} differance with the target value
 * @param d {Number} total time
 * @return {Number} result of the calculation
 */
TRAVISO.MoveEngine.prototype.easeInQuad = function (t, b, c, d) {
	t /= d;
	return c*t*t + b;
};
/**
 * Quadratic ease-out tween calculation.
 *
 * @method easeOutQuad
 * @private
 * @param t {Number} current time
 * @param b {Number} initial value
 * @param c {Number} differance with the target value
 * @param d {Number} total time
 * @return {Number} result of the calculation
 */
TRAVISO.MoveEngine.prototype.easeOutQuad = function (t, b, c, d) {
	t /= d;
	return -c * t*(t-2) + b;
};
/**
 * Quadratic ease-in-out tween calculation.
 *
 * @method easeInOutQuad
 * @private
 * @param t {Number} current time
 * @param b {Number} initial value
 * @param c {Number} differance with the target value
 * @param d {Number} total time
 * @return {Number} result of the calculation
 */
TRAVISO.MoveEngine.prototype.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) { return c/2*t*t + b; }
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

/**
 * Methid that precesses a single frame.
 *
 * @method run
 * @private
 */
TRAVISO.MoveEngine.prototype.run = function()
{
    // NOTE: Write an alternative with a real time driven animator 
    
    if (this.processFrame)
    {
    	var len, o, i;
        if (this.activeForMovables)
        {
            len = this.movables.length;
    	    
    	    var dist; 
    	    for (i=0; i < len; i++)
    	    {
    	        o = this.movables[i];
    	        
    	        // move object
    	        
    	        // speed vector (magnitude and direction)
    	        
    	        o.prevPosition = { x: o.position.x, y: o.position.y };
    	        
    	        // check for target reach
    	        if (o.currentTarget)
    	        {
    	            dist = TRAVISO.getDist(o.position, o.currentTarget);
    	            if (dist <= o.currentReachThresh)
    	            {
    	                // reached to the target
    	                o.position.x = o.currentTarget.x;
    	                o.position.y = o.currentTarget.y;
    	                
    	                this.engine.onObjMoveStepEnd(o);
    	                i--; len--;
    	                continue; 
    	            }
    	        }
    	        
    	        o.position.x += o.speedMagnitude * o.speedUnit.x;
    	        o.position.y += o.speedMagnitude * o.speedUnit.y;
    	        
    	        // check for tile change
    	        this.engine.checkForTileChange(o);
    	        
    	        // check for direction change
    	        
    	    }
    	    
    	    // will need a different loop to process crashes 
    	    // for (i=0; i < len; i++)
    	    // {
    	        // o = this.movables[i];
    	    // }
    	}
    	
    	if (this.activeForTweens)
        {   
        	// and a loop for tween animations
    	    len = this.tweenTargets.length;
    	    var t, tweens, j, vars;
    	    for (i=0; i < len; i++)
    	    {
    	        o = this.tweenTargets[i];
    	        tweens = o.tweens;
    	        for (j=0; j < tweens.length; j++)
    	        {
					t = tweens[j];
					t.currentFrame++;
					vars = t.vars;
					for (var prop in vars)
					{
					    o[prop] = t.easingFunc(t.currentFrame, vars[prop].b, vars[prop].c, t.totalFrames);
					}
					
					if (t.currentFrame >= t.totalFrames)
					{
						if (t.onComplete) { t.onComplete(); }
						if (this.removeTween(o, t)) 
						{
							i--; len--;
						}
						j--;
					}
				}
    	        
    	    }
        }
        
        var scope = this;
        requestAnimFrame(function() { scope.run(); });
    }
};

/**
 * Clears all references and stops all animations and tweens.
 *
 * @method destroy
 */
TRAVISO.MoveEngine.prototype.destroy = function() 
{
    TRAVISO.trace("MoveEngine destroy");
    
    this.processFrame = false;
    
	this.removeAllMovables();
	this.removeAllTweens();
	this.movables = null;
	this.tweenTargets = null;
	this.engine = null;
};

/**
 * @author Hakan Karlidag - @axaq
 */

// Based on http://github.com/bgrins/javascript-astar v0.4.0

/**
 * Includes all path finding logic.
 *
 * @class PathFinding
 * @constructor
 * @param mapSizeC {Number} number of columns
 * @param mapSizeR {Number} number of rows
 * @param {Object} [options] settings for the search algorithm
 * @param {Boolean} [options.diagonal] Specifies whether to use diagonal tiles
 */
TRAVISO.PathFinding = function(mapSizeC, mapSizeR, options)
{
	/**
	 * @property {Array(Array(TRAVISO.PathFinding.GridNode))} grid
	 * @protected
	 */
    /**
	 * @property {Boolean} diagonal
	 * @protected
	 */
	/**
	 * @property {Function} heuristic
	 * @protected
	 */
	
    var c = 0;
	var r = 0;
	
	//define map
	options = options || {};
    this.nodes = [];
    this.diagonal = !!options.diagonal;
    this.heuristic = this.diagonal ? this.heuristics.diagonal : this.heuristics.manhattan;
    this.grid = [];
    for (c = 0; c < mapSizeC; c++)
    {
        this.grid[c] = [];

        for (r = 0; r < mapSizeR; r++)
        {
            var node = new TRAVISO.PathFinding.GridNode(c, r, 1);
            this.grid[c][r] = node;
            this.nodes.push(node);
        }
    }
    this.init();
};

// constructor
TRAVISO.PathFinding.constructor = TRAVISO.PathFinding;

/**
 * Cleans/resets all nodes.
 *
 * @method init
 * @private
 */
TRAVISO.PathFinding.prototype.init = function()
{
    this.dirtyNodes = [];
    for (var i = 0; i < this.nodes.length; i++)
    {
        this.cleanNode(this.nodes[i]);
    }
};

/**
 * Cleans only dirty nodes.
 *
 * @method cleanDirty
 * @private
 */
TRAVISO.PathFinding.prototype.cleanDirty = function()
{
    for (var i = 0; i < this.dirtyNodes.length; i++)
    {
    	this.cleanNode(this.dirtyNodes[i]);
    }
    this.dirtyNodes = [];
};

/**
 * Marks a node as dirty.
 *
 * @method cleanDirty
 * @private
 * @param node {TRAVISO.PathFinding.GridNode} node to be marked
 */
TRAVISO.PathFinding.prototype.markDirty = function(node)
{
    this.dirtyNodes.push(node);
};

TRAVISO.PathFinding.prototype.neighbors = function(node)
{
    var ret = [],
        x = node.x,
        y = node.y,
        grid = this.grid;

    // West
    if(grid[x-1] && grid[x-1][y]) {
        ret.push(grid[x-1][y]);
    }

    // East
    if(grid[x+1] && grid[x+1][y]) {
        ret.push(grid[x+1][y]);
    }

    // South
    if(grid[x] && grid[x][y-1]) {
        ret.push(grid[x][y-1]);
    }

    // North
    if(grid[x] && grid[x][y+1]) {
        ret.push(grid[x][y+1]);
    }

    if (this.diagonal) {
        // Southwest
        if(grid[x-1] && grid[x-1][y-1]) {
            ret.push(grid[x-1][y-1]);
        }

        // Southeast
        if(grid[x+1] && grid[x+1][y-1]) {
            ret.push(grid[x+1][y-1]);
        }

        // Northwest
        if(grid[x-1] && grid[x-1][y+1]) {
            ret.push(grid[x-1][y+1]);
        }

        // Northeast
        if(grid[x+1] && grid[x+1][y+1]) {
            ret.push(grid[x+1][y+1]);
        }
    }

    return ret;
};

TRAVISO.PathFinding.prototype.toString = function()
{
    var graphString = [],
        nodes = this.grid, // when using grid
        rowDebug, row, y, l;
    for (var x = 0, len = nodes.length; x < len; x++)
    {
        rowDebug = [];
        row = nodes[x];
        for (y = 0, l = row.length; y < l; y++) {
            rowDebug.push(row[y].weight);
        }
        graphString.push(rowDebug.join(' '));
    }
    return graphString.join('\n');
};

TRAVISO.PathFinding.GridNode = function(c, r, weight)
{
    this.x = c;
    this.y = r;
    this.weight = weight;
    this.mapPos = { c: c, r: r };
};

// constructor
TRAVISO.PathFinding.GridNode.constructor = TRAVISO.PathFinding.GridNode;

TRAVISO.PathFinding.GridNode.prototype.toString = function()
{
    return '[' + this.x + ' ' + this.y + ']';
};

TRAVISO.PathFinding.GridNode.prototype.getCost = function(fromNeighbor)
{
    // Take diagonal weight into consideration.
    if (fromNeighbor && fromNeighbor.x !== this.x && fromNeighbor.y !== this.y)
    {
        return this.weight * 1.41421;
    }
    return this.weight;
};

TRAVISO.PathFinding.GridNode.prototype.isWall = function()
{
    return this.weight === 0;
};

/**
 * Solves path finding for the given source and destination locations.
 *
 * @method solve
 * @private
 * @param originC {Number} column index of the source location
 * @param originR {Number} row index of the source location
 * @param destC {Number} column index of the destination location
 * @param destR {Number} row index of the destination location
 * @return {Array(Object)} solution path
 */
TRAVISO.PathFinding.prototype.solve = function(originC, originR, destC, destR)
{
	var start = this.grid[originC][originR];
	var end = this.grid[destC][destR];
	var result = this.search(start, end, { heuristic: this.heuristic });
	return result && result.length > 0 ? result : null;
};

/**
 * Finds available adjacent cells of an area defined by location and size.
 *
 * @method getAdjacentOpenCells
 * @param cellC {Number} column index of the location
 * @param cellR {Number} row index of the location
 * @param sizeC {Number} column size of the area
 * @param sizeR {Number} row size of the area
 * @return {Array(Object)} an array of available cells
 */
TRAVISO.PathFinding.prototype.getAdjacentOpenCells = function(cellC, cellR, sizeC, sizeR)
{
	var r, c, cellArray = [];
	
	for (r = cellR; r > cellR-sizeR; r--)
    {
    	for (c = cellC; c < cellC + sizeC; c++)
    	{
			// NOTE: concat is browser dependent. It is fastest for Chrome. Might be a good idea to use for loop or "a.push.apply(a, b);" for other browsers
			cellArray = cellArray.concat(this.neighbors(this.grid[c][r]));
		}
	}
	
	return cellArray;
};

TRAVISO.PathFinding.prototype.pathTo = function(node)
{
    var curr = node,
        path = [];
    while(curr.parent) {
        path.push(curr);
        curr = curr.parent;
    }
    // return path.reverse();
    return path;
};

TRAVISO.PathFinding.prototype.getHeap = function()
{
    return new TRAVISO.PathFinding.BinaryHeap(function(node) {
        return node.f;
    });
};

/**
 * Perform an A* Search on a graph given a start and end node.
 * @param {GridNode} start
 * @param {GridNode} end
 * @param {Object} [options]
 * @param {bool} [options.closest] Specifies whether to return the
            path to the closest node if the target is unreachable.
 * @param {Function} [options.heuristic] Heuristic function.
 */
TRAVISO.PathFinding.prototype.search = function(start, end, options)
{
	this.init();
    options = options || {};
    var heuristic = options.heuristic || this.heuristics.manhattan,
        closest = options.closest || false;

    var openHeap = this.getHeap(),
        closestNode = start; // set the start node to be the closest if required

    start.h = heuristic(start, end);

    openHeap.push(start);
    
    while(openHeap.size() > 0) {

        // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
        var currentNode = openHeap.pop();

        // End case -- result has been found, return the traced path.
        if(currentNode === end) {
            return this.pathTo(currentNode);
        }

        // Normal case -- move currentNode from open to closed, process each of its neighbors.
        currentNode.closed = true;

        // Find all neighbors for the current node.
        var neighbors = this.neighbors(currentNode);

        for (var i = 0, il = neighbors.length; i < il; ++i) {
            var neighbor = neighbors[i];

            if (neighbor.closed || neighbor.isWall()) {
                // Not a valid node to process, skip to next neighbor.
                continue;
            }

            // The g score is the shortest distance from start to current node.
            // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
            var gScore = currentNode.g + neighbor.getCost(currentNode),
                beenVisited = neighbor.visited;

            if (!beenVisited || gScore < neighbor.g) {

                // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                neighbor.visited = true;
                neighbor.parent = currentNode;
                neighbor.h = neighbor.h || heuristic(neighbor, end);
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;
                this.markDirty(neighbor);
                if (closest) {
                    // If the neighbour is closer than the current closestNode or if it's equally close but has
                    // a cheaper path than the current closest node then it becomes the closest node
                    if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                        closestNode = neighbor;
                    }
                }

                if (!beenVisited) {
                    // Pushing to heap will put it in proper place based on the 'f' value.
                    openHeap.push(neighbor);
                }
                else {
                    // Already seen the node, but since it has been rescored we need to reorder it in the heap
                    openHeap.rescoreElement(neighbor);
                }
            }
        }
    }

    if (closest) {
        return this.pathTo(closestNode);
    }

    // No result was found - empty array signifies failure to find path.
	return [];
};

// See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
TRAVISO.PathFinding.prototype.heuristics = {
    manhattan: function(pos0, pos1) {
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    },
    diagonal: function(pos0, pos1) {
        var D = 1;
        var D2 = Math.sqrt(2);
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
    }
};

TRAVISO.PathFinding.prototype.cleanNode = function(node) {
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.visited = false;
        node.closed = false;
        node.parent = null;
};

TRAVISO.PathFinding.BinaryHeap = function(scoreFunction)
{
	this.content = [];
    this.scoreFunction = scoreFunction;
};

TRAVISO.PathFinding.BinaryHeap.prototype = {
    push: function(element) {
        // Add the new element to the end of the array.
        this.content.push(element);

        // Allow it to sink down.
        this.sinkDown(this.content.length - 1);
    },
    pop: function() {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    },
    remove: function(node) {
        var i = this.content.indexOf(node);

        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();

        if (i !== this.content.length - 1) {
            this.content[i] = end;

            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(i);
            }
            else {
                this.bubbleUp(i);
            }
        }
    },
    size: function() {
        return this.content.length;
    },
    rescoreElement: function(node) {
        this.sinkDown(this.content.indexOf(node));
    },
    sinkDown: function(n) {
        // Fetch the element that has to be sunk.
        var element = this.content[n];

        // When at 0, an element can not sink any further.
        while (n > 0) {

            // Compute the parent element's index, and fetch it.
            var parentN = ((n + 1) >> 1) - 1,
                parent = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            // Found a parent that is less, no need to sink any further.
            else {
                break;
            }
        }
    },
    bubbleUp: function(n) {
        // Look up the target element and its score.
        var length = this.content.length,
            element = this.content[n],
            elemScore = this.scoreFunction(element);

        while(true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) << 1,
                child1N = child2N - 1;
            // This is used to store the new position of the element, if any.
            var swap = null,
                child1Score;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);

                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore){
                    swap = child1N;
                }
            }

            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N],
                    child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
            // Otherwise, we are done.
            else {
                break;
            }
        }
    }
};

/**
 * Checks if the location is occupied/available or not.
 *
 * @method isCellFilled
 * @param c {Number} column index of the location
 * @param r {Number} row index of the location
 * @return {Array(Object)} if the location is not available
 */
TRAVISO.PathFinding.prototype.isCellFilled = function(c, r)
{
	if (this.grid[c][r].weight === 0) { return true; }
	
	return false;
};

/**
 * Sets individual cell state for ground layer.
 *
 * @method setCell
 * @param c {Number} column index of the location
 * @param r {Number} row index of the location
 * @param movable {Boolean} free to move or not
 */
TRAVISO.PathFinding.prototype.setCell = function(c, r, movable)
{
	this.grid[c][r].staticWeight = this.grid[c][r].weight = movable;
};

/**
 * Sets individual cell state for objects layer.
 *
 * @method setDynamicCell
 * @param c {Number} column index of the location
 * @param r {Number} row index of the location
 * @param movable {Boolean} free to move or not
 */
TRAVISO.PathFinding.prototype.setDynamicCell = function(c, r, movable)
{
	// if it is movable by static tile property
	if (this.grid[c][r].staticWeight !== 0)
	{
		this.grid[c][r].weight = movable;
	}
};



/**
 * Clears all references.
 *
 * @method destroy
 */
TRAVISO.PathFinding.prototype.destroy = function() 
{
    TRAVISO.trace('PathFinding destroy');
    
    this.grid = null;
    this.nodes = null;
    this.dirtyNodes = null;
};

/**
 * @author Hakan Karlidag - @axaq
 */

/**
 * Visual class for the map-objects.
 *
 * @class ObjectView
 * @extends DisplayObjectContainer
 * @constructor
 * @param engine {EngineView} the engine instance that the map-object sits in
 * @param [objectType=0] {Number} type-id of the object as defined in the XML file
 * @param [animSpeed=0.5] {Number} animation speed for the movieclips
 */
TRAVISO.ObjectView = function(engine, objectType, animSpeed)
{
    PIXI.DisplayObjectContainer.call(this);
    
    /**
	 * A reference to the engine view that the map-object sits in.
	 * @property {EngineView} engine
	 * @protected
	 */
	/**
	 * Type-id of the map-object as defined in the XML file.
	 * @property {Number} type
	 * @default 0
	 */
	this.engine = engine;
    this.type = objectType || 0;
    
    
    /**
	 * Defines if the map-object is movable onto by other map-objects.
	 * @property {Boolean} isMovableTo
	 */
	/**
	 * Defines if the map-object is interactive/selectable.
	 * @property {Boolean} isInteractive
	 */
	/**
	 * The size of the map-object in terms of rows and columns.
	 * @property {Object} size
	 * @property {Number} size.r
	 * @property {Number} size.c
	 */
    var info = TRAVISO.getObjectInfo(this.engine, this.type);
    this.isMovableTo = info.m;
    this.isInteractive = info.i;
    var arr = info.s.split("x");
    this.size =
    {
        r : parseInt(arr[0], 10),
        c : parseInt(arr[1], 10)
    };
    var xAnchor = this.size.r / (this.size.c + this.size.r);
	
	/**
	 * A dictionary for all the textures defined for the map-object.
	 * @property {Object} textures
	 * @protected
	 */
    this.textures = info.t;
	
    this.container = new PIXI.MovieClip(this.textures.idle);
    this.container.anchor.x = xAnchor;
    this.container.anchor.y = 1;
    this.addChild(this.container);
    this.animSpeed = animSpeed;
    this.container.gotoAndStop(0);
	
	/**
	 * The height of the object in the first frame of its idle textures.
	 * @property {Number} firstTextureHeight
	 * @protected
	 */
    this.firstTextureHeight = this.container.textures[0].height;
};

// constructor
TRAVISO.ObjectView.constructor = TRAVISO.ObjectView;
TRAVISO.ObjectView.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

/**
 * Animation speed for the movieclips included in the map-object visuals.
 * @property {Number} animSpeed
 * @default 0.5
 */
Object.defineProperty(TRAVISO.ObjectView.prototype, "animSpeed", {
    get: function() {
        return  this.container.animationSpeed;
    },
    set: function(value) {
        this.container.animationSpeed = TRAVISO.existy(value) && value > 0 ? value : 0.5;
    }
});

/**
 * Changes the map-objects's texture(s) according to the specified direction-id and the state of the map-object (moving or stationary).
 *
 * @method changeVisualToDirection
 * @param direction {Number} direction-id as defined in 'TRAVISO.directions'
 * @param [moving=false] {Boolean} if the requested visuals are for moving or stationary state  
 * @param [stopOnFirstFrame=false] {Boolean} if true stops on the first frame after changing the visuals
 * @param [noLoop=false] {Boolean} if true the movieclip animation will not loop after the first animation 
 * @param [onAnimComplete=null] {Function} Callback function to call if 'noLoop' is true after the first run of the animation, uses the engine's 'callbackScope'
 * @param [animSpeed=0.5] {Number} animation speed for the movieclips
 */
TRAVISO.ObjectView.prototype.changeVisualToDirection = function(direction, moving, stopOnFirstFrame, noLoop, onAnimComplete, animSpeed)
{
	if (!this.changeVisual((moving ? TRAVISO.getMovingDirVisualId(direction) : TRAVISO.getStationaryDirVisualId(direction)), stopOnFirstFrame, noLoop, onAnimComplete, animSpeed))
	{
        if (!this.changeVisual("idle", stopOnFirstFrame, noLoop, onAnimComplete, animSpeed))
        {
            throw new Error("no 'idle' visual defined as backup for object type " + this.type);
        }
	}
};
/**
 * Changes the map-objects's texture(s) according to the specified visual-id.
 *
 * @method changeVisual
 * @private
 * @param vId {String} visual-id
 * @param [stopOnFirstFrame=false] {Boolean} if true stops on the first frame after changing the visuals
 * @param [noLoop=false] {Boolean} if true the movieclip animation will not loop after the first animation 
 * @param [onAnimComplete=null] {Function} Callback function to call if 'noLoop' is true after the first run of the animation, uses the engine's 'callbackScope'
 * @param [animSpeed=null] {Number} animation speed for the movieclips, stays the same if not defined
 */
TRAVISO.ObjectView.prototype.changeVisual = function(vId, stopOnFirstFrame, noLoop, onAnimComplete, animSpeed)
{
    if (!this.textures[vId])
    {
        // TRAVISO.trace("!!! No textures defined for vId: " + vId);
        return false;
    }
    this.container.textures = this.textures[vId];
    
    if (!stopOnFirstFrame && this.textures[vId].length > 1)
    {
        this.container.loop = !noLoop;
        if (noLoop && onAnimComplete) 
        {
            var scope = this;
            this.container.onComplete = function () { setTimeout(function () { onAnimComplete.call( scope.engine.config.callbackScope, scope); }, 100); };
        }
        if (TRAVISO.existy(animSpeed) && animSpeed > 0) { this.animSpeed = animSpeed; }
        this.container.gotoAndPlay(0);
    }
    else
    {
        this.container.gotoAndStop(0);
    }
    return true;
};

/**
 * Clears all references.
 *
 * @method destroy
 */
TRAVISO.ObjectView.prototype.destroy = function()
{
	if (this.container)
	{
	    this.engine = null;
	    this.size = null;
	    this.textures = null;
	    // this.removeChild(this.container);
	    // this.container.textures = null;
	    this.container.onComplete = null;
	    this.container = null;
	}
};


/**
 * @author Hakan Karlidag - @axaq
 */

/**
 * Visual class for the map-tiles.
 *
 * @class TileView
 * @extends DisplayObjectContainer
 * @constructor
 * @param engine {EngineView} the engine instance that the map-tile sits in
 * @param [tileType="0"] {String} type-id of the tile as defined in the XML file
 */
TRAVISO.TileView = function(engine, tileType)
{
    PIXI.DisplayObjectContainer.call(this);

    /**
     * A reference to the engine view that the map-tile sits in.
     * @property {EngineView} engine
     * @protected
     */
    /**
     * Type-id of the map-tile as defined in the XML file.
     * @property {Number} type
     * @default 0
     */
    this.engine = engine;
    this.type = tileType || "0";

    var halfHeight = this.engine.TILE_HALF_H;
    var halfWidth = this.engine.TILE_HALF_W;

    /**
     * Defines the positions of the vertices of the tile in the local scope.
     * @property {Array(Array(Number))} vertices
     * @protected
     */
    // @formatter:off
	this.vertices = [
						[-halfWidth, 0],
						[0, -halfHeight],
						[halfWidth, 0],
						[0, halfHeight]
					];
	// @formatter:on

    /**
     * Defines if the map-tile is movable onto by map-objects.
     * @property {Boolean} isMovableTo
     */
    var tileInfo = TRAVISO.getTileInfo(this.engine, this.type);
    this.isMovableTo = tileInfo.m;

    if (tileInfo.t.length > 0)
    {
        this.tileGraphics = new PIXI.MovieClip(tileInfo.t);
        this.tileGraphics.anchor.x = 0.5;
        this.tileGraphics.anchor.y = 0.5;
        this.addChild(this.tileGraphics);
        this.tileGraphics.gotoAndStop(this.type);
    }

    // var colorsArray = [0x0106ff, 0x3b6d14, 0x8789ff, 0xb32bf9, 0xeb36d0, 0xfe0000, 0xeb3647, 0xf27e31, 0xffea01, 0x00ff18, 0x3b6d14, 0xfa9bbb, 0xf9c7bc, 0x8d6729, 0x633e07];
    // var c = colorsArray[ this.type < 2 ? this.type : 0 ];

    // this.tileGraphics = new PIXI.Graphics();
    // this.tileGraphics.clear();
    // this.tileGraphics.beginFill(c);
    // this.tileGraphics.moveTo(this.vertices[0][0], this.vertices[0][1]);
    // for (var i=1; i < this.vertices.length; i++)
    // {
    // this.tileGraphics.lineTo(this.vertices[i][0], this.vertices[i][1]);
    // };
    // this.tileGraphics.endFill();

    /**
     * The visual that will be used to highlight the tile.
     * @property {PIXI.DisplayObject} highlightedOverlay
     * @protected
     */
    if (this.engine.mapData.textures.tileHighlight)
    {
        this.highlightedOverlay = new PIXI.Sprite.fromFrame(this.engine.mapData.textures.tileHighlight);
        this.highlightedOverlay.anchor.x = 0.5;
        this.highlightedOverlay.anchor.y = 0.5;
        this.addChild(this.highlightedOverlay);
    }
    else
    {
        this.highlightedOverlay = new PIXI.Graphics();
        this.highlightedOverlay.clear();
        this.highlightedOverlay.lineStyle(2, 0xFFFFFF, 1);
        this.highlightedOverlay.beginFill(0x80d7ff, 0.5);
        this.highlightedOverlay.moveTo(this.vertices[0][0], this.vertices[0][1]);
        for (var i = 1; i < this.vertices.length; i++)
        {
            this.highlightedOverlay.lineTo(this.vertices[i][0], this.vertices[i][1]);
        }
        this.highlightedOverlay.lineTo(this.vertices[0][0], this.vertices[0][1]);
        this.highlightedOverlay.endFill();
        this.addChild(this.highlightedOverlay);
    }

    this.highlightedOverlay.scale.x = this.highlightedOverlay.scale.y = 0.1;
    this.highlightedOverlay.visible = false;

    this.highlightedOverlay.scale.scope = this.highlightedOverlay;
    this.highlightedOverlay.scale.isHighlighted = this.isHighlighted = false;
};

// constructor
TRAVISO.TileView.constructor = TRAVISO.TileView;
TRAVISO.TileView.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

/**
 * Changes the highlight state of the map-tile.
 *
 * @method setHighlighted
 * @param isHighlighted {Boolean} if the tile is being hightlighted or not
 * @param [instant=false] {Boolean} if the change will be instant or animated
 */
TRAVISO.TileView.prototype.setHighlighted = function(isHighlighted, instant)
{
    /**
     * The highlight state of the map-tile.
     * @property {Boolean} isHighlighted
     */
    if (this.isHighlighted !== isHighlighted)
    {
        if (instant)
        {
            this.highlightedOverlay.scale.x = this.highlightedOverlay.scale.y = isHighlighted ? 1 : 0.1;
            this.highlightedOverlay.visible = isHighlighted;
            this.highlightedOverlay.scale.isHighlighted = this.isHighlighted = isHighlighted;
            return;
        }

        if (isHighlighted)
        {
            this.highlightedOverlay.visible = isHighlighted;
        }

        this.highlightedOverlay.scale.isHighlighted = this.isHighlighted = isHighlighted;

        var ts = isHighlighted ? 1 : 0.1;
        if (this.highlightedOverlay.scale.x === ts)
        {
            this.highlightedOverlay.visible = isHighlighted;
        }
        else
        {
            this.highlightedOverlay.scale.x = this.highlightedOverlay.scale.y = isHighlighted ? 0.1 : 1;

            // @formatter:off
    	    this.engine.moveEngine.addTween(
    	    	this.highlightedOverlay.scale,
    	    	0.5, 
    	    	{ x: ts, y: ts },
    	    	0,
    	    	"linear", 
    	    	true, 
    	    	function()
                {
                    this.target.scope.visible = this.target.isHighlighted;
                }
            );
            // @formatter:on
        }
    }
};

/**
 * Clears all references.
 *
 * @method destroy
 */
TRAVISO.TileView.prototype.destroy = function()
{
    if (this.engine)
    {
        if (this.engine && this.engine.moveEngine)
        {
            this.engine.moveEngine.killTweensOf(this.highlightedOverlay.scale);
        }
        this.engine = null;
        this.highlightedOverlay.scale.scope = null;
        this.highlightedOverlay = null;
        this.tileGraphics = null;
    }
};


/**
 * @author Hakan Karlidag - @axaq
 */


/**
 * Main display object container class to hold all views
 * within the engine and all map related logic
 *
 * @class EngineView
 * @extends DisplayObjectContainer
 * @constructor
 * @param config {Object} configuration object for the isometric engine instance
 * @param config.mapDataPath {String} the path to the xml file that defines map data, required
 */
TRAVISO.EngineView = function(config)
{
    PIXI.DisplayObjectContainer.call(this);
    
    /**
     * Configuration object for the isometric engine instance
     * 
     * @property {Object} config
     * @property {Number} config.minScale=0.5 mimimum scale that the DisplayObjectContainer for the map can get, default 0.5
     * @property {Number} config.maxScale=1.5 maximum scale that the DisplayObjectContainer for the map can get, default 1.5
     * @property {Number} config.minZoom=-1 minimum zoom level, engine defined
     * @property {Number} config.maxZoom=1 maximum zoom level, engine defined
     * @property {Number} config.zoomIncrement=0.5 zoom increment amount calculated by the engine according to user settings, default 0.5
     * @property {Number} config.numberOfZoomLevels=5 used to calculate zoom increment, defined by user, default 5
     * @property {Number} config.initialZoomLevel=0 initial zoom level of the map, default 0
     * @property {Number} config.instantCameraZoom=false specifies wheather to zoom instantly or with a tween animation, default false
     * 
     * @property {Number} config.tileHeight=74 height of a single isometric tile, default 74
     * @property {Number} config.isoAngle=30 the angle between the topleft edge and the horizontal diagonal of a isometric quad, default 30
     * 
     * @property {Object} config.initialPositionFrame frame to position the engine, default { x : 0, y : 0, w : 800, h : 600 }
     * @property {Number} config.initialPositionFrame.x x position of the engine, default 0
     * @property {Number} config.initialPositionFrame.y y position of the engine, default 0
     * @property {Number} config.initialPositionFrame.w width of the engine, default 800
     * @property {Number} config.initialPositionFrame.h height of the engine, default 600
     * 
     * @property {Number} config.pathFindingType=TRAVISO.pfAlgorithms.ASTAR_ORTHOGONAL the type of path finding algorithm two use, default TRAVISO.pfAlgorithms.ASTAR_ORTHOGONAL
     * 
     * @property {Boolean} config.followCharacter=true defines if the camera will follow the current controllable or not, default true
     * @property {Boolean} config.instantCameraRelocation=false specifies wheather the camera moves instantly or with a tween animation to the target location, default false
     * @property {Boolean} config.instantObjectRelocation=false specifies wheather the map-objects will be moved to target location instantly or with an animation, default false
     * 
     * @property {Boolean} config.highlightPath=true highlight the path when the current controllable moves on the map, default true
     * @property {Boolean} config.highlightTargetTile=true highlight the target tile when the current controllable moves on the map, default true
     * @property {Boolean} config.tileHighlightAnimated=true animate the tile highlights, default true
     * 
     * @property {Boolean} config.mapDraggable=true enable dragging the map with touch-and-touchmove or mousedown-and-mousemove on the map, default true
     * 
     * @property {Number(Hexadecimal)} config.backgroundColor=null background color, if defined the engine will create a solid colored background for the map, default null
     * @property {Boolean} config.useMask=false creates a mask using the position frame defined by 'initialPositionFrame' property or the 'posFrame' parameter that is passed to 'repositionContent' method, default false
     * 
     * @property {String} config.mapDataPath the path to the xml file that defines map data, required
     * @property {Array(String)} config.assetsToLoad=null array of paths to the assets that are desired to be loaded by traviso, no need to use if assets are already loaded to PIXI cache, default null 
     * 
     * @property {Object} config.callbackScope=null the scope to apply when calling callback functions, default null
     * @property {Function} config.engineInstanceReadyCallback=null callback function that will be called once everything is loaded and engine instance is ready, default null
     * @property {Function} config.tileSelectCallback=null callback function that will be called when a tile is selected, default null
     * @property {Function} config.objectSelectCallback=null callback function that will be called when a tile with an interactive map-object on it is selected, default null
     * @property {Function} config.objectReachedDestinationCallback=null callback function that will be called when any moving object reaches its destination, default null
     * @property {Function} config.otherObjectsOnTheNextTileCallback=null callback function that will be called when any moving object is in move and there are other objects on the next tile, default null
     * 
     * @private
     */

    this.config = config || { };
    
    // set the properties that are true by default when not defined by the user
    this.config.followCharacter = TRAVISO.existy(this.config.followCharacter) ? this.config.followCharacter : true;
    this.config.highlightPath = TRAVISO.existy(this.config.highlightPath) ? this.config.highlightPath : true;
    this.config.highlightTargetTile = TRAVISO.existy(this.config.highlightTargetTile) ? this.config.highlightTargetTile : true;
    this.config.tileHighlightAnimated = TRAVISO.existy(this.config.tileHighlightAnimated) ? this.config.tileHighlightAnimated : true;
    this.config.mapDraggable = TRAVISO.existy(this.config.mapDraggable) ? this.config.mapDraggable : true;
    
    this.setZoomParameters(this.config.minScale, this.config.maxScale, this.config.numberOfZoomLevels, this.config.initialZoomLevel, this.config.instantCameraZoom);
    
    /**
     * height of a single isometric tile
     * @property {Number} TILE_H
     * @default 74
     * @private
     */
    /**
     * width of a single isometric tile
     * @property {Number} TILE_W
     * @default 128
     * @private
     */
    /**
     * the angle between the topleft edge and the horizontal diagonal of a isometric quad
     * @property {Number} ISO_ANGLE 
     * @default 30
     * @private
     */
    /**
     * half-height of a single isometric tile
     * @property {Number} TILE_HALF_H 
     * @default 37
     * @private
     */
    /**
     * half-width of a single isometric tile
     * @property {Number} TILE_HALF_W 
     * @default 64
     * @private
     */
    /**
     * length of a single isometric tile's edge
     * @property {Number} TILE_ISO_EDGE_L 
     * @default 74
     * @private
     */
    this.TILE_H = this.config.tileHeight || 74;
    this.ISO_ANGLE = this.config.isoAngle || 30;
    this.TILE_HALF_H = this.TILE_H / 2;
    this.TILE_HALF_W = this.TILE_HALF_H * Math.tan((90 - this.ISO_ANGLE) * Math.PI / 180);
    this.TILE_W = this.TILE_HALF_W * 2;
    this.TILE_ISO_EDGE_L = this.TILE_H;
    
    
    /** 
     * specifies wheather to zoom instantly or with a tween animation
     * @property {Boolean} instantCameraZoom 
     * @default false
     */
    /** 
     * defines if the camera will follow the current controllable or not
     * @property {Boolean} followCharacter 
     * @default true
     */
    /** 
     * specifies wheather the camera moves instantly or with a tween animation to the target location
     * @property {Boolean} instantCameraRelocation 
     * @default false
     */
    /** 
     * specifies wheather the map-objects will be moved to target location instantly or with an animation
     * @property {Boolean} instantObjectRelocation 
     * @default false
     */
    /** 
     * highlight the path when the current controllable moves on the map
     * @property {Boolean} highlightPath 
     * @default true
     */
    /** 
     * highlight the target tile when the current controllable moves on the map
     * @property {Boolean} highlightTargetTile 
     * @default true
     */
    /** 
     * animate the tile highlights
     * @property {Boolean} tileHighlightAnimated 
     * @default true
     */
    /** 
     * enable dragging the map with touch-and-touchmove or mousedown-and-mousemove on the map
     * @property {Boolean} mapDraggable 
     * @default true
     */
    /** 
     * the scope to apply when calling callback functions
     * @property {Object} callbackScope 
     * @default null
     */
    /** 
     * callback function that will be called once everything is loaded and engine instance is ready
     * @property {Function} engineInstanceReadyCallback 
     * @default null
     */
    /** 
     * callback function that will be called when a tile is selected
     * @property {Function} tileSelectCallback 
     * @default null
     */
    /** 
     * callback function that will be called when a tile with an interactive map-object on it is selected
     * @property {Function} objectSelectCallback 
     * @default null
     */
    /** 
     * callback function that will be called when any moving object reaches its destination
     * @property {Function} objectReachedDestinationCallback 
     * @default null
     */
    /** 
     * callback function that will be called when any moving object is in move and there are other objects on the next tile
     * @property {Function} otherObjectsOnTheNextTileCallback 
     * @default null
     */
    
    var scope = this;
    TRAVISO.loadAssetsAndData(this, function()
    {
        scope.onAllAssetsLoaded();
    });
};

// constructor
TRAVISO.EngineView.constructor = TRAVISO.EngineView;
TRAVISO.EngineView.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

TRAVISO.EngineView.prototype.config = this.config;



/**
 * This method is being called whenever all the assets are
 * loaded and engine is ready to initialize
 *
 * @method onAllAssetsLoaded
 * @private
 */
TRAVISO.EngineView.prototype.onAllAssetsLoaded = function()
{
    TRAVISO.trace("onAllAssetsLoaded");
    
    /**
     * MoveEngine instance to handle all animations and tweens
     * @property {MoveEngine} moveEngine
     * @private
     */
    
    this.moveEngine = new TRAVISO.MoveEngine(this);
    
    /**
     * Current scale of the map's display object
     * @property {Number} currentScale
     * @private
     */
    /**
     * Current zoom amount of the map
     * @property {Number} currentZoom
     * @private
     */
    
    this.currentScale = 1.0;
    this.currentZoom = 0;
    
    this.posFrame = this.config.initialPositionFrame || { x : 0, y : 0, w : 800, h : 600 };

    this.externalCenter =
    {
        x : this.posFrame.w >> 1,
        y : this.posFrame.h >> 1
    };
    
    
    this.createMap();

    this.repositionContent(this.config.initialPositionFrame);
    
    this.enableInteraction();
    
    if (this.config.engineInstanceReadyCallback) { this.config.engineInstanceReadyCallback.call(this.config.callbackScope, this); }
};

/**
 * Creates the map and setups necessary parameters for future map calculations 
 *
 * @method createMap
 * @private
 */
TRAVISO.EngineView.prototype.createMap = function()
{
    // create background
	if (this.config.backgroundColor)
    {
    	/**
	     * Solid colored background
	     * @property {PIXI.Graphics} bg
	     * @private
	     */
        this.bg = new PIXI.Graphics();
        this.addChild(this.bg);
    }
    
    // create mask
    if (this.config.useMask)
    {
    	/**
	     * Mask graphics for the mask
	     * @property {PIXI.Graphics} mapMask
	     * @private
	     */
        this.mapMask = new PIXI.Graphics();
        this.addChild(this.mapMask);
    }
    
    /**
     * Display object for the map visuals
     * @property {PIXI.DisplayObjectContainer} mapContainer
     * @private
     */
    /**
     * Display object for the ground/terrain visuals
     * @property {PIXI.DisplayObjectContainer} groundContainer
     * @private
     */
    /**
     * Display object for the map-object visuals
     * @property {PIXI.DisplayObjectContainer} objContainer
     * @private
     */
    // create containers for visual map elements
    this.mapContainer = new PIXI.DisplayObjectContainer();
	this.addChild(this.mapContainer);
    
    // Define two layers of maps
	// One for the world and one for the objects (static/dynamic) over it
	// This enables us not to update the whole world in every move but instead just update the object depths over it 
	
	this.groundContainer = new PIXI.DisplayObjectContainer();
	this.mapContainer.addChild(this.groundContainer);
	
	this.objContainer = new PIXI.DisplayObjectContainer();
	this.mapContainer.addChild(this.objContainer);
	
	var groundMapData = this.mapData.groundMapData;
    var objectsMapData = this.mapData.objectsMapData;
    
    var initialControllableLocation = this.mapData.initialControllableLocation;
    
    // set map size
    
    /**
     * Number of rows in the isometric map
     * @property {Number} mapSizeR 
     */
    this.mapSizeR = groundMapData.length;
    /**
     * Number of columns in the isometric map
     * @property {Number} mapSizeC 
     */
    this.mapSizeC = groundMapData[0].length;
	
	// add ground image first if it is defined
	var groundImageSprite;
	if (this.mapData.singleGroundImagePath)
	{
	    groundImageSprite = new PIXI.Sprite.fromFrame(this.mapData.singleGroundImagePath);
	    this.groundContainer.addChild(groundImageSprite);
	    
	    groundImageSprite.scale.set(this.mapData.singleGroundImageScale);
	}
	
	// create arrays to hold tiles and objects
	/**
     * Array to hold map-tiles
     * @property {Array(Array(TileView))} tileArray
     * @private
     */
	this.tileArray = [];
	/**
     * Array to hold map-objects
     * @property {Array(Array(ObjectView))} objArray
     * @private
     */
	this.objArray = [];
	var i, j;
	for (i = 0; i < this.mapSizeR; i++)
	{
		this.tileArray[i] = [];
		this.objArray[i] = [];
	    for (j = 0; j < this.mapSizeC; j++)
	    {
	    	this.tileArray[i][j] = null;
	    	this.objArray[i][j] = null;
	    }
	}
	
	
	// Map data is being sent to path finding and after this point 
	// its content will be different acc to the pathfinding algorithm.
	// It is still being stored in engine.mapData but you must be aware
	// of the structure if you want to use it after this point.
	/**
     * PathFinding instance to handle all path finding logic
     * @property {PathFinding} pathFinding
     * @private
     */
	this.pathFinding = new TRAVISO.PathFinding(this.mapSizeC, this.mapSizeR, { diagonal: this.config.pathFinding === TRAVISO.pfAlgorithms.ASTAR_DIAGONAL });
	
   
	
	var tile;
	for (i = 0; i < this.mapSizeR; i++)
	{
	    for (j = this.mapSizeC-1; j >= 0; j--)
	    {
	    	this.tileArray[i][j] = null;
	    	if (groundMapData[i][j])
	    	{
		    	tile = new TRAVISO.TileView(this, groundMapData[i][j]);
		    	tile.position.x = this.getTilePosXFor(i,j);
		    	tile.position.y = this.getTilePosYFor(i,j);
		    	tile.mapPos = { c:j, r:i };
		    	this.tileArray[i][j] = tile;
		    	this.groundContainer.addChild(tile);
		    	
		    	
		    	if (!tile.isMovableTo)
		    	{
		    		this.pathFinding.setCell(j,i,0);
		    	}
		    }
		    else
		    {
		    	this.pathFinding.setCell(j,i,0);
		    }
		}
	}
	
	/**
     * Current controllable map-object that will be the default object to move in user interactions 
     * @property {ObjectView} currentControllable
     * @private
     */
    
	var obj;
	for (i = 0; i < this.mapSizeR; i++)
	{
	    for (j = this.mapSizeC-1; j >= 0; j--)
	    {
	    	this.objArray[i][j] = null;
	    	if (objectsMapData[i][j])
	    	{
		    	obj = new TRAVISO.ObjectView(this, objectsMapData[i][j]);
		    	obj.position.x = this.getTilePosXFor(i,j);
		    	obj.position.y = this.getTilePosYFor(i,j) + this.TILE_HALF_H;
		    	obj.mapPos = { c:j, r:i };
		    	
		    	this.objContainer.addChild(obj);
		    	
		    	this.addObjRefToLocation(obj, obj.mapPos);
		    	
		    	if (initialControllableLocation && initialControllableLocation.c === j && initialControllableLocation.r === i)
		    	{
		    		this.currentControllable = obj;
		    	}
		    }
		}
	}
	
	// cacheAsBitmap: for now this creates problem with tile highlights
	// this.groundContainer.cacheAsBitmap = true;
	
	/**
     * Vertice points of the map
     * @property {Array(Array(Number))} mapVertices
     * @private
     */
	this.mapVertices = [
						[this.getTilePosXFor(0,0) - this.TILE_HALF_W, this.getTilePosYFor(0,0)],
						[this.getTilePosXFor(0,this.mapSizeC - 1), this.getTilePosYFor(0,this.mapSizeC - 1) - this.TILE_HALF_H],
						[this.getTilePosXFor(this.mapSizeR - 1,this.mapSizeC - 1) + this.TILE_HALF_W, this.getTilePosYFor(this.mapSizeR - 1,this.mapSizeC - 1)],
						[this.getTilePosXFor(this.mapSizeR - 1,0), this.getTilePosYFor(this.mapSizeR - 1,0) + this.TILE_HALF_H]
					];
	
	/**
     * Total width of all ground tiles  
     * @property {Number} mapVisualWidthReal
     * @private
     */
    /**
     * Total height of all ground tiles  
     * @property {Number} mapVisualHeightReal
     * @private
     */ 	
	this.mapVisualWidthReal = this.getTilePosXFor(this.mapSizeR - 1,this.mapSizeC - 1) - this.getTilePosXFor(0,0);
	this.mapVisualHeightReal = this.getTilePosYFor(this.mapSizeR - 1,0) - this.getTilePosYFor(0,this.mapSizeC - 1);
	
	if (groundImageSprite)
	{
	    groundImageSprite.position.x = this.mapVertices[0][0] + this.TILE_HALF_W + (this.mapVisualWidthReal -  groundImageSprite.width) / 2;
	    groundImageSprite.position.y = this.mapVertices[1][1] + this.TILE_HALF_H + (this.mapVisualHeightReal -  groundImageSprite.height) / 2;
	}
	
	this.zoomTo(this.config.initialZoomLevel, true);
	
	if (this.config.followCharacter && initialControllableLocation)
	{
		this.centralizeToLocation(initialControllableLocation.c, initialControllableLocation.r, true);
	}
	else
	{
		this.centralizeToCurrentExternalCenter(true);
	}
};

/**
 * Calculates 2d x position of a tile 
 *
 * @method getTilePosXFor
 * @param r {Number} row index of the tile
 * @param c {Number} column index of the tile
 * @return {Number} 2d x position of a tile
 */
TRAVISO.EngineView.prototype.getTilePosXFor = function(r,c)
{
    return (c * this.TILE_HALF_W) + (r * this.TILE_HALF_W);
};
/**
 * Calculates 2d y position of a tile 
 *
 * @method getTilePosYFor
 * @param r {Number} row index of the tile
 * @param c {Number} column index of the tile
 * @return {Number} 2d y position of a tile 
 */
TRAVISO.EngineView.prototype.getTilePosYFor = function(r,c)
{
    return (r * this.TILE_HALF_H) - (c * this.TILE_HALF_H);
};

/**
 * Shows or hides the display object that includes the objects-layer
 *
 * @method showHideObjectLayer
 * @param show=false {Boolean} 
 */
TRAVISO.EngineView.prototype.showHideObjectLayer = function(show)
{
    this.objContainer.visible = show;
};
/**
 * Shows or hides the display object that includes the ground/terrain layer
 *
 * @method showHideGroundLayer
 * @param show=false {Boolean} 
 */
TRAVISO.EngineView.prototype.showHideGroundLayer = function(show)
{
    this.groundContainer.visible = show;
};

/**
 * Returns the TileView instance that sits in the location given  
 *
 * @method getTileAtRowAndColumn
 * @param r {Number} row index of the tile
 * @param c {Number} column index of the tile
 * @return {TileView} the tile in the location given
 */
TRAVISO.EngineView.prototype.getTileAtRowAndColumn = function(r,c) 
{
    return this.tileArray[r][c];
};
/**
 * Returns all the ObjectView instances referenced to the given location with the specified row and column indexes.
 *
 * @method getObjectsAtRowAndColumn
 * @param r {Number} the row index of the map location
 * @param c {Number} the column index of the map location
 * @return {Array(ObjectView)} an array of map-objects referenced to the given location
 */
TRAVISO.EngineView.prototype.getObjectsAtRowAndColumn = function(r,c) 
{
    return this.objArray[r][c];
};
/**
 * Returns all the ObjectView instances referenced to the given location.
 *
 * @method getObjectsAtLocation
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 * @return {Array(ObjectView)} an array of map-objects referenced to the given location
 */
TRAVISO.EngineView.prototype.getObjectsAtLocation = function(pos) 
{
    return this.objArray[pos.r][pos.c];
};

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
TRAVISO.EngineView.prototype.createAndAddObjectToLocation = function(type, pos) 
{
	return this.addObjectToLocation(new TRAVISO.ObjectView(this, type), pos);
};

/**
 * Adds an already-created object to the map.
 *
 * @method addObjectToLocation
 * @param obj {Object} either an external display object or a map-object (ObjectView)
 * @param obj.isMovableTo {Boolean} if the object can be moved onto by other map-objects
 * @param obj.size {Object} object that includes the size in rows and columns
 * @param obj.size.r {Number} the size of the map-object in rows
 * @param obj.size.c {Number} the size of the map-object in columns
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 * @return {Object} the newly added object
 */
TRAVISO.EngineView.prototype.addObjectToLocation = function(obj, pos) 
{
	obj.position.x = this.getTilePosXFor(pos.r,pos.c);
	obj.position.y = this.getTilePosYFor(pos.r,pos.c) + this.TILE_HALF_H;
	obj.mapPos = { c:pos.c, r:pos.r };
	
	this.objContainer.addChild(obj);
	
	this.addObjRefToLocation(obj, obj.mapPos);
	this.arrangeDepthsFromLocation(obj.mapPos);
	
	return obj;
};

/**
 * Enables adding external custom display objects to the specified location.
 * This method should be used for the objects that are not already defined in XML file and don't have a type-id.
 * The resulting object will be independent of engine mechanics apart from depth controls.
 *
 * @method addCustomObjectToLocation
 * @param displayObject {PIXI.DisplayObject} object to be added to location
 * @param [displayObject.isMovableTo=true] {Boolean} if the object can be moved onto by other map-objects, default true
 * @param [displayObject.size] {Object} object that includes the size in rows and columns, default { c:1, r: 1 }
 * @param [displayObject.size.r=1] {Number} the size of the map-object in rows
 * @param [displayObject.size.c=1] {Number} the size of the map-object in columns
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 * @return {Object} the newly added object
 */
TRAVISO.EngineView.prototype.addCustomObjectToLocation = function(displayObject, pos) 
{
	displayObject.isMovableTo = TRAVISO.existy(displayObject.isMovableTo) ? displayObject.isMovableTo : true;
	displayObject.size = displayObject.size || { c:1, r: 1 };
	
	return this.addObjectToLocation(displayObject, pos);
	
	// this.removeObjRefFromLocation(displayObject, pos);
};

/**
 * Removes the object and its references from the map.
 *
 * @method removeObjectFromLocation
 * @param obj {Object} either an external display object or a map-object (ObjectView)
 * @param [pos=null] {Object} object including r and c coordinates, if not defined the engine will use 'obj.mapPos' to remove the map-object
 * @param [pos.r] {Number} the row index of the map location
 * @param [pos.c] {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.removeObjectFromLocation = function(obj, pos) 
{
	pos = pos || obj.mapPos;
	this.objContainer.removeChild(obj);
	this.removeObjRefFromLocation(obj, pos);
};

/**
 * Centralizes and zooms the EngineView instance to the object specified.
 *
 * @method focusMapToObject
 * @param obj {ObjectView} the object that map will be focused with respect to
 * @param obj.mapPos {Object} the object that holds the location of the map-object on the map
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 * @param obj.size {Object} the object that holds the size of the map-object on the map
 * @param obj.size.c {Number} the column index of the map location
 * @param obj.size.r {Number} the row index of the map location
 */
TRAVISO.EngineView.prototype.focusMapToObject = function(obj)
{
	this.focusMapToLocation(obj.mapPos.c + (obj.size.c - 1) / 2, obj.mapPos.r - (obj.size.r - 1) / 2, 0);
};

/**
 * Centralizes and zooms the EngineView instance to the map location specified by row and column index.
 *
 * @method focusMapToLocation
 * @param c {Number} the column index of the map location
 * @param r {Number} the row index of the map location
 * @param zoomAmount {Number} targeted zoom level for focusing
 */
TRAVISO.EngineView.prototype.focusMapToLocation = function(c, r, zoomAmount)
{
	// NOTE: using zoomTo instead of setScale causes centralizeToPoint to be called twice (no visual problem)
	this.zoomTo(zoomAmount, false);
	this.centralizeToLocation(c,r);
};

/**
 * Centralizes the EngineView instance to the object specified.
 *
 * @method centralizeToObject
 * @param obj {ObjectView} the object that map will be centralized with respect to
 * @param obj.mapPos {Object} the object that holds the location of the map-object on the map
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 */
TRAVISO.EngineView.prototype.centralizeToObject = function(obj)
{
	this.centralizeToLocation(obj.mapPos.c, obj.mapPos.r);
};

/**
 * Centralizes the EngineView instance to the map location specified by row and column index.
 *
 * @method centralizeToLocation
 * @param c {Number} the column index of the map location
 * @param r {Number} the row index of the map location
 * @param [instantRelocate=false] {Boolean} specifies if the camera move will be animated or instant
 */
TRAVISO.EngineView.prototype.centralizeToLocation = function(c, r, instantRelocate)
{
    this.currentFocusLocation = { c: c, r: r };
	var px = this.externalCenter.x + (this.mapVisualWidthScaled >> 1) - this.getTilePosXFor(r,c) * this.currentScale;
	var py = this.externalCenter.y - this.getTilePosYFor(r,c) * this.currentScale;
	this.centralizeToPoint(px, py, instantRelocate);
};

/**
 * Centralizes the EngineView instance to the current location of the attention/focus.
 *
 * @method centralizeToCurrentFocusLocation
 * @param [instantRelocate=false] {Boolean} specifies if the camera move will be animated or instant
 */
TRAVISO.EngineView.prototype.centralizeToCurrentFocusLocation = function(instantRelocate)
{
    this.centralizeToLocation(this.currentFocusLocation.c, this.currentFocusLocation.r, instantRelocate);
};


/**
 * External center is the central point of the frame defined by the user to be used as the visual size of the engine.
 * This method centralizes the EngineView instance with respect to this external center-point.
 *
 * @method centralizeToCurrentExternalCenter
 * @param [instantRelocate=false] {Boolean} specifies if the camera move will be animated or instant
 */
TRAVISO.EngineView.prototype.centralizeToCurrentExternalCenter = function(instantRelocate)
{
	if (this.externalCenter)
	{
		this.currentFocusLocation = { c: this.mapSizeC >> 1, r: this.mapSizeR >> 1 };
		this.centralizeToPoint(this.externalCenter.x, this.externalCenter.y, instantRelocate);
	}
};

/**
 * Centralizes the EngineView instance to the points specified.
 *
 * @method centralizeToPoint
 * @param px {Number} the x coordinate of the center point with respect to EngineView frame
 * @param py {Number} the y coordinate of the center point with respect to EngineView frame
 * @param [instantRelocate=false] {Boolean} specifies if the relocation will be animated or instant
 */
TRAVISO.EngineView.prototype.centralizeToPoint = function(px, py, instantRelocate)
{
	if (this.tileArray)
	{
		px = px - (this.mapVisualWidthScaled >> 1);
		if ((TRAVISO.existy(instantRelocate) && instantRelocate) || (!TRAVISO.existy(instantRelocate) && this.config.instantCameraRelocation))
		{
			this.mapContainer.position.x = px;
			this.mapContainer.position.y = py;
		}
		else
		{
			this.moveEngine.addTween(this.mapContainer.position, 0.5, { x: px, y: py }, 0, "easeInOut", true );
		}
	}
};

/**
 * Sets all the parameters related to zooming in and out.
 *
 * @method setZoomParameters
 * @param [minScale=0.5] {Number} mimimum scale that the DisplayObjectContainer for the map can get, default 0.5
 * @param [maxScale=1.5] {Number} maximum scale that the DisplayObjectContainer for the map can get, default 1.5
 * @param [numberOfZoomLevels=5] {Number} used to calculate zoom increment, defined by user, default 5
 * @param [initialZoomLevel=0] {Number} initial zoom level of the map, default 0
 * @param [instantCameraZoom=false] {Boolean} specifies wheather to zoom instantly or with a tween animation, default false
 */
TRAVISO.EngineView.prototype.setZoomParameters = function(minScale, maxScale, numberOfZoomLevels, initialZoomLevel, instantCameraZoom)
{
	this.config.minScale = TRAVISO.existy(minScale) ? minScale : 0.5;
	this.config.maxScale = TRAVISO.existy(maxScale) ? maxScale : 1.5;
    this.config.minZoom = -1;
    this.config.maxZoom = 1;
    this.config.zoomIncrement = TRAVISO.existy(numberOfZoomLevels) ? (numberOfZoomLevels <= 1 ? 0 : 2 / (numberOfZoomLevels - 1)) : 0.5;
	
	this.config.initialZoomLevel = TRAVISO.existy(initialZoomLevel) ? initialZoomLevel : 0;
	this.config.instantCameraZoom = TRAVISO.existy(instantCameraZoom) ? instantCameraZoom : false;
};

/**
 * Sets map's scale. 
 *
 * @method setScale
 * @private
 * @param s {Number} scale amount for both x and y coordinates
 * @param [instantZoom=false] {Boolean} specifies if the scaling will be animated or instant
 */
TRAVISO.EngineView.prototype.setScale = function(s, instantZoom)
{
	if (s < this.config.minScale) { s = this.config.minScale; }
	else if (s > this.config.maxScale) { s = this.config.maxScale; }
	this.currentScale = s;
	this.mapVisualWidthScaled = this.mapVisualWidthReal * this.currentScale;
	this.mapVisualHeightScaled = this.mapVisualHeightReal * this.currentScale;
	
	if ((TRAVISO.existy(instantZoom) && instantZoom) || (!TRAVISO.existy(instantZoom) && this.config.instantCameraZoom))
	{
		this.mapContainer.scale.set(this.currentScale);
	}
	else
	{
		this.moveEngine.addTween(this.mapContainer.scale, 0.5, { x: this.currentScale, y: this.currentScale }, 0, "easeInOut", true );
	}
};

/**
 * Zooms camera by to the amount given.
 *
 * @method zoomTo
 * @param zoomAmount {Number} specifies zoom amount (between -1 and 1). Use -1, -0.5, 0, 0,5, 1 for better results.
 * @param [instantZoom=false] {Boolean} specifies wheather to zoom instantly or with a tween animation
 */
TRAVISO.EngineView.prototype.zoomTo = function(zoomAmount, instantZoom)
{
    zoomAmount = zoomAmount || 0;
    var s = TRAVISO.mathMap(zoomAmount, this.config.minZoom, this.config.maxZoom, this.config.minScale, this.config.maxScale, true);
	s = Math.round(s * 10) / 10;
	
	this.currentZoom = TRAVISO.mathMap(s, this.config.minScale, this.config.maxScale, this.config.minZoom, this.config.maxZoom, true);
	
	this.externalCenter = this.externalCenter ? this.externalCenter : { x: (this.mapVisualWidthScaled >> 1), y: 0 };
	var diff = { x: this.mapContainer.position.x + (this.mapVisualWidthScaled >> 1) - this.externalCenter.x, y: this.mapContainer.position.y - this.externalCenter.y };
	var oldScale = this.currentScale;
	
	this.setScale(s, instantZoom);
	
	var ratio = this.currentScale / oldScale;
	this.centralizeToPoint(this.externalCenter.x + diff.x * ratio, this.externalCenter.y + diff.y * ratio, (TRAVISO.existy(instantZoom) && instantZoom) || (!TRAVISO.existy(instantZoom) && this.config.instantCameraZoom));
	
	// TRAVISO.trace("scalingTo: " + this.currentScale);
	// TRAVISO.trace("zoomingTo: " + this.currentZoom);
};

/**
 * Zooms the camera one level out.
 *
 * @method zoomOut
 * @param [instantZoom=false] {Boolean} specifies wheather to zoom instantly or with a tween animation
 */
TRAVISO.EngineView.prototype.zoomOut = function(instantZoom) 
{
	this.zoomTo(this.currentZoom - this.config.zoomIncrement, instantZoom);
};

/**
 * Zooms the camera one level in.
 *
 * @method zoomIn
 * @param [instantZoom=false] {Boolean} specifies wheather to zoom instantly or with a tween animation
 */
TRAVISO.EngineView.prototype.zoomIn = function(instantZoom) 
{
	this.zoomTo(this.currentZoom + this.config.zoomIncrement, instantZoom);
};

/**
 * Returns the current controllable map-object.  
 *
 * @method getCurrentControllable
 * @return {ObjectView} current controllable map-object
 */
TRAVISO.EngineView.prototype.getCurrentControllable = function()
{
    return this.currentControllable;
};

/**
 * Sets a map-object as the current controllable. This object will be moving in further relevant user interactions.  
 *
 * @method setCurrentControllable
 * @param obj {ObjectView} object to be set as current controllable
 * @param obj.mapPos {Object} object including r and c coordinates
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 */
TRAVISO.EngineView.prototype.setCurrentControllable = function(obj)
{
    this.currentControllable = obj;
};

/**
 * Adds a reference of the given map-object to the given location in the object array.
 * This should be called when an object moved or transfered to the corresponding location.
 * Uses objects size property to add its reference to all relevant cells.
 *
 * @private
 * @method addObjRefToLocation
 * @param obj {ObjectView} object to be bind to location
 * @param obj.size {Object} the object that defines the size of the map-object
 * @param obj.size.c {Number} number of tiles that map-object covers horizontally on the isometric map
 * @param obj.size.r {Number} number of tiles that map-object covers vertically on the isometric map
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.addObjRefToLocation = function(obj, pos)
{
	for (var k=pos.c; k < pos.c + obj.size.c; k++)
	{
		for (var m=pos.r; m > pos.r - obj.size.r; m--)
		{
			this.addObjRefToSingleLocation(obj, { c:k, r:m });
		}
	}
};
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
TRAVISO.EngineView.prototype.addObjRefToSingleLocation = function(obj, pos) 
{
    if (!this.objArray[pos.r][pos.c]) { this.objArray[pos.r][pos.c] = []; }
    var index = this.objArray[pos.r][pos.c].indexOf(obj);
    if (index < 0) { this.objArray[pos.r][pos.c].push(obj); }
    
    if (!obj.isMovableTo)
    {
    	this.pathFinding.setDynamicCell(pos.c,pos.r,0);
    }
};
/**
 * Removes references of the given map-object from the given location in the object array.
 * This should be called when an object moved or transfered from the corresponding location.
 * Uses objects size property to remove its references from all relevant cells.
 *
 * @private
 * @method removeObjRefFromLocation
 * @param obj {ObjectView} object to be bind to location
 * @param obj.size {Object} the object that defines the size of the map-object
 * @param obj.size.c {Number} number of tiles that map-object covers horizontally on the isometric map
 * @param obj.size.r {Number} number of tiles that map-object covers vertically on the isometric map
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.removeObjRefFromLocation = function(obj, pos) 
{
	for (var k=pos.c; k < pos.c + obj.size.c; k++)
	{
		for (var m=pos.r; m > pos.r - obj.size.r; m--)
		{
			this.removeObjRefFromSingleLocation(obj, { c:k, r:m });
		}
	}
};
/**
 * Removes a reference of the given map-object from the given location in the object array.
 * Updates the cell as movable or not according to the other object refences in the same cell.
 *
 * @private
 * @method removeObjRefFromSingleLocation
 * @param obj {ObjectView} object to be bind to location
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.removeObjRefFromSingleLocation = function(obj, pos) 
{
    if (this.objArray[pos.r][pos.c])
    {
        var index = this.objArray[pos.r][pos.c].indexOf(obj);
        if (index > -1) { this.objArray[pos.r][pos.c].splice(index, 1); }
        if (this.objArray[pos.r][pos.c].length === 0)
        {
        	this.pathFinding.setDynamicCell(pos.c,pos.r,1);
        	this.objArray[pos.r][pos.c] = null;
        }
        else
        {
        	var a = this.objArray[pos.r][pos.c];
		    var l = a.length;
	        for (var i=0; i < l; i++)
	        {
	            if (!a[i].isMovableTo)
	    		{	
		    		this.pathFinding.setDynamicCell(pos.c,pos.r,0);
		    		break;
		    	}
		    	else if (i === l-1)
		    	{
		    		this.pathFinding.setDynamicCell(pos.c,pos.r,1);
		    	}
	        }
        }
    }
};
/**
 * Removes all map-object references from the given location in the object array.
 *
 * @private
 * @method removeAllObjectRefsFromLocation
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.removeAllObjectRefsFromLocation = function(pos) 
{
    if (this.objArray[pos.r][pos.c])
    {
    	this.pathFinding.setDynamicCell(pos.c,pos.r,1);
        this.objArray[pos.r][pos.c] = null;
    }
};

/**
 * Sets alphas of the map-objects referenced to the given location.
 *
 * @method changeObjAlphasInLocation
 * @param value {Number} alpha value, should be between 0 and 1
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.changeObjAlphasInLocation = function(value, pos) 
{
    var a = this.objArray[pos.r][pos.c];
    if (a)
    {
        var l = a.length;
        for (var i=0; i < l; i++)
        {
            a[i].alpha = value;
        }
    }
};

/**
 * Sets a map-abjects' location and logically moves it to the new location.
 *
 * @private
 * @method arrangeObjLocation
 * @param obj {ObjectView} map-object to be moved
 * @param obj.mapPos {Object} object including r and c coordinates
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 * @param pos {Object} object including r and c coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.arrangeObjLocation = function(obj, pos) 
{
	this.removeObjRefFromLocation(obj, obj.mapPos);
	this.addObjRefToLocation(obj, pos);
	
	obj.mapPos = { c:pos.c, r:pos.r };
};

/**
 * Sets occlusion transperancies according to given map-object's location.
 * This method only works for user-controllable object. 
 *
 * @private
 * @method arrangeObjTransperancies
 * @param obj {ObjectView} current controllable map-object
 * @param prevPos {Object} previous location of the map-object
 * @param prevPos.r {Number} the row index of the map location
 * @param prevPos.c {Number} the column index of the map location
 * @param pos {Object} new location of the map-object
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.arrangeObjTransperancies = function(obj, prevPos, pos) 
{
    if (this.currentControllable === obj)
    {
    	if (prevPos.c > 0) { this.changeObjAlphasInLocation(1, { c: prevPos.c-1, r: prevPos.r }); }
        if (prevPos.c > 0 && prevPos.r < this.mapSizeR-1) { this.changeObjAlphasInLocation(1, { c: prevPos.c-1, r: prevPos.r+1 }); }
        if (prevPos.r < this.mapSizeR-1) { this.changeObjAlphasInLocation(1, { c: prevPos.c, r: prevPos.r+1 }); }
	
    	if (pos.c > 0) { this.changeObjAlphasInLocation(0.7, { c: pos.c-1, r: pos.r }); }
        if (pos.c > 0 && pos.r < this.mapSizeR-1) { this.changeObjAlphasInLocation(0.7, { c: pos.c-1, r: pos.r+1 }); }
        if (pos.r < this.mapSizeR-1) { this.changeObjAlphasInLocation(0.7, { c: pos.c, r: pos.r+1 }); }
    }
	
	// TODO: check if there is a way not to update main character alpha each time
	obj.alpha = 1;
};

/**
 * Arranges depths (z-index) of the map-objects starting from the given location.  
 *
 * @private
 * @method arrangeDepthsFromLocation
 * @param pos {Object} location object including the map coordinates
 * @param pos.r {Number} the row index of the map location
 * @param pos.c {Number} the column index of the map location
 */
TRAVISO.EngineView.prototype.arrangeDepthsFromLocation = function(pos) 
{
    var a, i, j, k;
	for (i = pos.r; i < this.mapSizeR; i++)
	{
	    for (j = pos.c; j >= 0; j--)
	    {
	        a = this.objArray[i][j];
	    	if (a)
	    	{
	    	    for (k=0; k < a.length; k++)
	    	    {
				    this.objContainer.addChild(a[k]);
				}
		    }
		}
	}
};

/**
 * Clears the highlight for the old path and highlights the new path on map.
 *
 * @method arrangePathHighlight
 * @private
 * @param [currentPath] {Array(Object)} the old path to clear the highlight from
 * @param newPath {Array(Object)} the new path to highlight
 */
TRAVISO.EngineView.prototype.arrangePathHighlight = function(currentPath, newPath) 
{
    var i, tile, pathItem;
    if (currentPath)
    {
        for (i=0; i < currentPath.length; i++)
        {
            pathItem = currentPath[i];
            if (newPath.indexOf(pathItem) === -1)
            {
                tile = this.tileArray[pathItem.mapPos.r][pathItem.mapPos.c];
                tile.setHighlighted(false, !this.config.tileHighlightAnimated);
            }
        }
    }
    
	for (i=0; i < newPath.length; i++)
    {
        pathItem = newPath[i];
        if (!currentPath || currentPath.indexOf(pathItem) === -1)
        {
            tile = this.tileArray[pathItem.mapPos.r][pathItem.mapPos.c];
            tile.setHighlighted(true, !this.config.tileHighlightAnimated);
        }
    }
};

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
TRAVISO.EngineView.prototype.moveObjThrough = function(obj, path, speed) 
{
	if (this.config.instantObjectRelocation)
	{
		var tile = this.tileArray[path[0].mapPos.r][path[0].mapPos.c];
		obj.position.x = tile.position.x;
		obj.position.y = tile.position.y + this.TILE_HALF_H;
		this.arrangeObjTransperancies(obj, obj.mapPos, tile.mapPos);
		this.arrangeObjLocation(obj, tile.mapPos);
		this.arrangeDepthsFromLocation(tile.mapPos);
	}
	else
	{
	    if (this.config.highlightPath && this.currentControllable === obj)
        {
            this.arrangePathHighlight(obj.currentPath, path);
		}
		
		if (obj.currentTarget)
		{
			// TRAVISO.trace("Object has a target, update the path with the new one");
			this.moveEngine.addNewPathToObject(obj, path, speed);
		}
		else
		{
			this.moveEngine.prepareForMove(obj, path, speed);
			
			obj.currentTargetTile = obj.currentPath[obj.currentPathStep];
			
			this.onObjMoveStepBegin(obj, obj.currentPath[obj.currentPathStep].mapPos);
		}
	}
};

/**
 * Sets up the engine at the begining of each tile change move for the specified object
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
TRAVISO.EngineView.prototype.onObjMoveStepBegin = function(obj, pos) 
{
	// TRAVISO.trace("onObjMoveStepBegin");
	// Note that mapPos is being updated prior to movement
	
	obj.currentDirection = TRAVISO.getDirBetween(obj.mapPos.r, obj.mapPos.c, pos.r, pos.c);
    
    obj.changeVisualToDirection(obj.currentDirection, true);
    
	// check if the next target pos is still empty
	if (!this.pathFinding.isCellFilled(pos.c,pos.r))
	{
		// pos is movable
	    // this.arrangeObjTransperancies(obj, obj.mapPos, pos);
	    // this.arrangeObjLocation(obj, pos);
    	// this.arrangeDepthsFromLocation(obj.mapPos);
    	
    	// if there is other object(s) on the target tile, notify the game
    	// var objects = this.getObjectsAtLocation(pos);
    	// if (objects && objects.length > 1)
    	// {
    		// if (this.config.otherObjectsOnTheNextTileCallback) { this.config.otherObjectsOnTheNextTileCallback.call(this.config.callbackScope, obj, objects); }
    	// }
    	
    	this.moveEngine.setMoveParameters(obj, pos);
    	
    	this.moveEngine.addMovable(obj);
    	
    	return true;
    }
    else
    {
    	// pos is NOT movable
        this.moveEngine.removeMovable(obj);
    	// this.checkAndMoveObjectToTile(obj, obj.currentPath[0]);
    	this.checkAndMoveObjectToLocation(obj, obj.currentPath[0].mapPos);
    	
        return false;
    }
};

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
TRAVISO.EngineView.prototype.onObjMoveStepEnd = function(obj) 
{
	//TRAVISO.trace("onObjMoveStepEnd");
	
	obj.currentPathStep--;
    obj.currentTarget = null;
    obj.currentTargetTile = null;
    var pathEnded = (0 > obj.currentPathStep);
    this.moveEngine.removeMovable(obj);
    
    if (!pathEnded)
    {
        // this.moveStep(o, o.currentPath[o.currentPathStep].mapPos);
        // this.checkAndMoveObjectToTile(obj, obj.currentPath[0]);
        this.checkAndMoveObjectToLocation(obj, obj.currentPath[0].mapPos);
    }
    else
    {
        // reached to the end of the path
        obj.changeVisualToDirection(obj.currentDirection, false);
    }
    
    if (this.currentControllable === obj)
	{
    	var tile = this.tileArray[obj.mapPos.r][obj.mapPos.c];
    	tile.setHighlighted(false, !this.config.tileHighlightAnimated);
    	
    	if (this.config.followCharacter) { this.centralizeToLocation(obj.mapPos.c, obj.mapPos.r); }
    }
	
	if (pathEnded && this.config.objectReachedDestinationCallback) { this.config.objectReachedDestinationCallback.call(this.config.callbackScope, obj); }
};

TRAVISO.EngineView.prototype.checkForTileChange = function(obj) 
{
	var pos = { x: obj.position.x, y: obj.position.y - this.TILE_HALF_H };
	// var tile = this.tileArray[obj.mapPos.r][obj.mapPos.c];
	var tile = this.tileArray[obj.currentTargetTile.mapPos.r][obj.currentTargetTile.mapPos.c];
	// move positions to parent scale
	var vertices = [];
	for (var i=0; i < tile.vertices.length; i++)
	{
		vertices[i] = [tile.vertices[i][0] + tile.position.x, tile.vertices[i][1] + tile.position.y];
	}
	
	if (obj.currentTargetTile.mapPos.r !== obj.mapPos.r || obj.currentTargetTile.mapPos.c !== obj.mapPos.c)
	{
		if (TRAVISO.isInPolygon(pos, vertices))
		{
			this.arrangeObjTransperancies(obj, obj.mapPos, obj.currentTargetTile.mapPos);
		    this.arrangeObjLocation(obj, obj.currentTargetTile.mapPos);
	    	this.arrangeDepthsFromLocation(obj.mapPos);
	    	
	    	// if there is other object(s) on the target tile, notify the game
	    	var objects = this.getObjectsAtLocation(obj.currentTargetTile.mapPos);
	    	if (objects && objects.length > 1)
	    	{
	    		if (this.config.otherObjectsOnTheNextTileCallback) { this.config.otherObjectsOnTheNextTileCallback.call(this.config.callbackScope, obj, objects); }
	    	}
		}
	}	
};

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
TRAVISO.EngineView.prototype.getPath = function(from, to) 
{
	if (this.pathFinding) { return this.pathFinding.solve(from.c, from.r, to.c, to.r); }
	else { throw new Error("Path finding hasn't been initialized yet!"); }
};

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
TRAVISO.EngineView.prototype.checkAndMoveObjectToTile = function(obj, tile, speed) 
{
	if (tile.isMovableTo)
	{
		return this.checkAndMoveObjectToLocation(obj, tile.mapPos, speed);
	}
	return false;
};

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
TRAVISO.EngineView.prototype.checkAndMoveObjectToLocation = function(obj, pos, speed) 
{
	var path = this.getPath(obj.mapPos, pos);
	if (path)
	{
		// begin moving process
		this.moveObjThrough(obj, path, speed);
		
		return path.length;
	}
	return false;
};

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
TRAVISO.EngineView.prototype.moveCurrentControllableToLocation = function(pos, speed) 
{
	if (!this.currentControllable)
    {
        throw new Error("TRAVISO: currentControllable is not defined!");
    }
    return this.checkAndMoveObjectToLocation(this.currentControllable, pos, speed);
};

/**
 * Moves the current controllable map-object to one of the adjacent available tiles of the map-object specified. 
 *
 * @method moveCurrentControllableToObj
 * @param obj {ObjectView} target map-object
 * @param obj.mapPos {Object} object including r and c coordinates
 * @param obj.mapPos.c {Number} the column index of the map location
 * @param obj.mapPos.r {Number} the row index of the map location
 * @param obj.size {Object} the object that defines the size of the target map-object
 * @param obj.size.c {Number} number of tiles that map-object covers horizontally on the isometric map
 * @param obj.size.r {Number} number of tiles that map-object covers vertically on the isometric map
 * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null 
 * @return {Boolean} if there is an available path to move to the target map-object
 */
TRAVISO.EngineView.prototype.moveCurrentControllableToObj = function(obj, speed)
{
    if (!this.currentControllable)
    {
        throw new Error("TRAVISO: currentControllable is not defined!");
    }
	var cellArray = this.pathFinding.getAdjacentOpenCells(obj.mapPos.c, obj.mapPos.r, obj.size.c, obj.size.r);
	var tile;
	var minLength = 3000;
	var path, minPath;
	for (var i=0; i < cellArray.length; i++)
	{
		tile = this.tileArray[cellArray[i].mapPos.r][cellArray[i].mapPos.c];
		if (tile)
		{
			if(tile.mapPos.c === this.currentControllable.mapPos.c && tile.mapPos.r === this.currentControllable.mapPos.r)
			{
				// already next to the object, do nothing
				if (this.config.objectReachedDestinationCallback) { this.config.objectReachedDestinationCallback.call(this.config.callbackScope, this.currentControllable); }
				return true;
			}
			path = this.getPath(this.currentControllable.mapPos, tile.mapPos);
			if (path && path.length < minLength)
			{
				minLength = path.length;
				minPath = path;
			}
		}
	}
	
	if (minPath) 
	{
		this.moveObjThrough(this.currentControllable, minPath, speed);
		return true;
	}
	else
	{
		return false;
	}
};

/**
 * Finds the nearest tile to the point given in the map's local scope. 
 *
 * @method getTileFromLocalPos
 * @param lp {Object} point to check
 * @param lp.x {Number} x component
 * @param lp.y {Number} y component
 * @return {TileView} the nearest map-tile if there is one
 */
TRAVISO.EngineView.prototype.getTileFromLocalPos = function(lp) 
{
	var closestTile = null;
	if(TRAVISO.isInPolygon(lp, this.mapVertices))
	{
		// Using nearest point instead of checking polygon vertices for each tile. Should be faster...
		// NOTE: there is an ignored bug (for better performance) that tile is not selected when u click on the far corner
		var thresh = this.TILE_HALF_W / 2;
		var tile, i, j, dist;
		var closestDist = 3000;
		for (i = 0; i < this.mapSizeR; i++)
		{
		    for (j = 0; j < this.mapSizeC; j++)
		    {
		    	tile = this.tileArray[i][j];
		    	if (tile)
		    	{
		    	    dist = TRAVISO.getDist(lp, tile.position);
			    	if (dist < closestDist)
			    	{
			    		closestDist = dist;
			    		closestTile = tile;
			    		if (dist < thresh) { break; }
			    	}
			    }
		    }
		}
	}
	return closestTile;
};

/**
 * Checks if an interaction occurs using the interaction data coming from PIXI.
 * If there is any interaction starts necessary movements or performs necessary callbacks.
 *
 * @method checkForTileClick
 * @private
 * @param mdata {Object} interaction data coming from PIXI
 * @param mdata.global {Object} global interaction point
 */
TRAVISO.EngineView.prototype.checkForTileClick = function(mdata) 
{
	var lp = TRAVISO.globalToLocal(mdata.global, this.mapContainer);
	lp = { x:lp.x / this.currentScale, y:lp.y / this.currentScale };
	var closestTile = this.getTileFromLocalPos(lp);
	if (closestTile)
	{
		var a = this.objArray[closestTile.mapPos.r][closestTile.mapPos.c];
		if (a)
        {
            for (var k=0; k < a.length; k++)
            {
                if(a[k].isInteractive) 
                {
                    if (this.config.objectSelectCallback) { this.config.objectSelectCallback.call(this.config.callbackScope, a[k]); }
                    break;
                }
                // TODO CHECK: this might cause issues when there is one movable and one not movable object on the same tile
                else if(a[k].isMovableTo)
                {
                    if (!this.currentControllable || this.checkAndMoveObjectToTile(this.currentControllable, closestTile))
                    {
                        if (this.config.highlightTargetTile) { closestTile.setHighlighted(true, !this.config.tileHighlightAnimated); }
                        if (this.config.tileSelectCallback) { this.config.tileSelectCallback.call(this.config.callbackScope, closestTile.mapPos.r, closestTile.mapPos.c); }
                        break;
                    }
                } 
            }
        }
		else if (!this.currentControllable || this.checkAndMoveObjectToTile(this.currentControllable, closestTile))
		{
			if (this.config.highlightTargetTile) { closestTile.setHighlighted(true, !this.config.tileHighlightAnimated); }
			if (this.config.tileSelectCallback) { this.config.tileSelectCallback.call(this.config.callbackScope, closestTile.mapPos.r, closestTile.mapPos.c); }
		} 
	}
};

/**
 * Enables mouse/touch interactions.
 *
 * @method enableInteraction
 */
TRAVISO.EngineView.prototype.enableInteraction = function()
{
	var scope = this;
	this.mousedown = this.touchstart = function(d) { scope.onMouseDown(d); };
	this.mousemove = this.touchmove = function(d) { scope.onMouseMove(d); };
	this.mouseup = this.mouseupout = this.touchend = function(d) { scope.onMouseUp(d); };
	this.interactive = true;
};
/**
 * Disables mouse/touch interactions.
 *
 * @method disableInteraction
 */
TRAVISO.EngineView.prototype.disableInteraction = function()
{
	this.mousedown = this.touchstart = null;
	this.mousemove = this.touchmove = null;
	this.mouseup = this.mouseupout = this.touchend = null;
	this.interactive = true;
	this.dragging = false;
};

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
TRAVISO.EngineView.prototype.isInteractionInMask = function(p)
{
    if (this.config.useMask)
    {
        if (p.x < this.posFrame.x ||
            p.y < this.posFrame.y ||
            p.x > this.posFrame.x + this.posFrame.w ||
            p.y > this.posFrame.y + this.posFrame.h)
        {
            return false;  
        }
    }
    return true;
};

// ******************** START: MOUSE INTERACTIONS **************************** //
TRAVISO.EngineView.prototype.onMouseDown = function(mdata) 
{
	if (!this.dragging && this.isInteractionInMask(mdata.global))
	{
	    this.dragging = true;
		//this.mouseDownTime = new Date();
		this.dragInitStartingX = this.dragPrevStartingX = mdata.global.x;
		this.dragInitStartingY = this.dragPrevStartingY = mdata.global.y;
	}
};
TRAVISO.EngineView.prototype.onMouseMove = function(mdata) 
{
	if (this.dragging && this.config.mapDraggable)
	{
		this.mapContainer.position.x += mdata.global.x - this.dragPrevStartingX;
		this.mapContainer.position.y += mdata.global.y - this.dragPrevStartingY;
		this.dragPrevStartingX = mdata.global.x;
		this.dragPrevStartingY = mdata.global.y;
	}
};
TRAVISO.EngineView.prototype.onMouseUp = function(mdata) 
{
	if (this.dragging)
	{
		this.dragging = false;
		//var passedTime = (new Date()) - this.mouseDownTime;
		var distX = mdata.global.x - this.dragInitStartingX;
		var distY = mdata.global.y - this.dragInitStartingY;
		
		if (Math.abs(distX) < 5 && Math.abs(distY) < 5)
		{
			// NOT DRAGGING IT IS A CLICK
			this.checkForTileClick(mdata);
		}
	}
};
// ********************* END: MOUSE INTERACTIONS **************************** //


/**
 * Repositions the content according to user settings. Call this method 
 * whenever you want to change the size or position of the engine.
 *
 * @method repositionContent
 * @param [posFrame] {Object} frame to position the engine, default is { x : 0, y : 0, w : 800, h : 600 }
 */
TRAVISO.EngineView.prototype.repositionContent = function(posFrame)
{
    TRAVISO.trace("EngineView repositionContent");
    
    posFrame = posFrame || this.posFrame || { x : 0, y : 0, w : 800, h : 600 };
    
    this.position.x = posFrame.x;
    this.position.y = posFrame.y;

    this.externalCenter =
    {
        x : posFrame.w >> 1,
        y : posFrame.h >> 1
    };
    this.centralizeToCurrentFocusLocation(true);

    if (this.bg)
    {
        this.bg.clear();
        // this.bg.lineStyle(2, 0x000000, 1);
        this.bg.beginFill(this.config.backgroundColor, 1.0);
        this.bg.drawRect(0, 0, posFrame.w, posFrame.h);
        this.bg.endFill();
    }
    
    if (this.mapMask && this.mapContainer)
    {
        this.mapMask.clear();
        this.mapMask.beginFill("#000000");
        this.mapMask.drawRect(0, 0, posFrame.w, posFrame.h);
        this.mapMask.endFill();

        this.mapContainer.mask = this.mapMask;
    }
    
    this.posFrame = posFrame;
};

/**
 * Clears all references and stops all animations inside the engine.
 * Call this method when you want to get rid of an engine instance.
 *
 * @method destroy
 */
TRAVISO.EngineView.prototype.destroy = function() 
{
	TRAVISO.trace("EngineView destroy");
	
	this.disableInteraction();
	
	this.moveEngine.destroy();
    this.moveEngine = null;
	
	var item, i, j, k;
    for (i = 0; i < this.mapSizeR; i++)
    {
        for (j = this.mapSizeC-1; j >= 0; j--)
        {
            item = this.tileArray[i][j];
            if (item)
            {
                item.destroy();
                // this.groundContainer.removeChild(item);
            }
            this.tileArray[i][j] = null;
            
            item = this.objArray[i][j];
            if (item)
            {
                for (k=0; k < item.length; k++)
                {
                    if (item[k])
                    {
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
	
	if (this.mapContainer)
	{
	    this.mapContainer.mask = null;
	    this.removeChild(this.mapContainer);
	    this.mapContainer = null;
	}
	if (this.mapMask)
	{
		this.removeChild(this.mapMask);
	    this.mapMask = null;
	}
	
	this.config = null;
    this.mapData.groundMapData = null;
    this.mapData.objectsMapData = null;
    this.mapData.textures.tiles = null;
    this.mapData.textures.objects = null;
    this.mapData.textures = null;
    this.mapData = null;
};

/**
 * @author Hakan Karlidag - @axaq
 */

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = TRAVISO;
        }
        exports.TRAVISO = TRAVISO;
    } else if (typeof define !== 'undefined' && define.amd) {
        define(TRAVISO);
    } else {
        root.TRAVISO = TRAVISO;
    }
}).call(this);