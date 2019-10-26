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
    if (!engine.config.mapDataPath)
    {
        throw new Error("TRAVISO: No JSON-file path defined for map data. Plese check your configuration object that you pass to the 'getEngineInstance' method.");
    } else if (engine.config.mapDataPath.split(".").pop() !== "json") {
        throw new Error("TRAVISO: Invalid map-data file path. This file has to be a json file.");
    }

    var loader = new PIXI.loaders.Loader();
    loader.add("mapData", engine.config.mapDataPath);

    if (engine.config.assetsToLoad && engine.config.assetsToLoad !== "" && engine.config.assetsToLoad.length > 0)
    {
        loader.add(engine.config.assetsToLoad);
    }

    loader.load(function (loader, resources) { TRAVISO.assetsAndDataLoaded(engine, loadedCallback, resources); });

    // TRAVISO.loadData();
};


/**
 * Handles loading of map data for the given engine instance 
 *
 * @method assetsAndDataLoaded
 * @for TRAVISO
 * @static
 * @private
 * @param engine {EngineView} engine instance
 * @param [loadedCallback=null] {Function} Callback function
 * @param resources {Object} object holding the resources loaded
 * @param resources.mapData.data {Object} the object that holds the json map data
 */
TRAVISO.assetsAndDataLoaded = function(engine, loadedCallback, resources) {
    // console.log('assetsAndDataLoaded', resources.mapData.data);

    var mapData = resources.mapData.data;

    // initial controls

    if ( !TRAVISO.existy(mapData.initialControllableLocation) ) {
        TRAVISO.trace("Map-data file warning: No 'initialControllableLocation' defined. Ignore this warning if you are adding it later manually.");
    } else if ( !TRAVISO.existy(mapData.initialControllableLocation.columnIndex) || !TRAVISO.existy(mapData.initialControllableLocation.rowIndex) ) {
        TRAVISO.trace("Map-data file warning: 'initialControllableLocation' exists but it is not defined properly.");
        mapData.initialControllableLocation = null;
    }

    if ( mapData.tileHighlightImage && !mapData.tileHighlightImage.path ) {
        TRAVISO.trace("Map-data file warning: 'tileHighlightImage' exists but its 'path' is not defined properly.");
        mapData.tileHighlightImage = null;
    }

    if ( mapData.singleGroundImage && !mapData.singleGroundImage.path ) {
        TRAVISO.trace("Map-data file warning: 'singleGroundImage' exists but its 'path' is not defined properly.");
        mapData.singleGroundImage = null;
    }

    var i,j, arr;
    var rows = mapData.groundMap;
    mapData.groundMapData = [];
    for (i = 0; i < rows.length; i++) {
        arr = String(rows[i].row).split(",");
        // remove empty spaces in a row and cast to an array
        for (j = arr.length; j--; ) { arr[j] = arr[j] | 0; }
        mapData.groundMapData[i] = arr;
    }
    
    rows = mapData.objectsMap;
    mapData.objectsMapData = [];
    for (i = 0; i < rows.length; i++) {
        arr = String(rows[i].row).split(",");
        // remove empty spaces in a row and cast to an array
        for (j = arr.length; j--; ) { arr[j] = arr[j] | 0; }
        mapData.objectsMapData[i] = arr;
    }

    if ( !TRAVISO.existy(mapData.tiles) ) {
        TRAVISO.trace("Map-data file warning: No 'tiles' defined.");
        mapData.tiles = {};
    }
    if ( !TRAVISO.existy(mapData.objects) ) {
        TRAVISO.trace("Map-data file warning: No 'objects' defined.");
        mapData.objects = {};
    } 

    var obj, objId, visual, visualId, 
        interactionOffsets, oTextures, m, n;
    for (objId in mapData.objects) {
        obj = mapData.objects[objId];
        if ( !TRAVISO.existy(obj.visuals) ) {
            throw new Error("TRAVISO: No visuals defined in data-file for object type: " + objId);
        }
        obj.id = objId;
        if ( !TRAVISO.existy(obj.rowSpan) ) { obj.rowSpan = 1; }
        if ( !TRAVISO.existy(obj.columnSpan) ) { obj.columnSpan = 1; }

        oTextures = {};
        interactionOffsets = {};

        for (visualId in obj.visuals) {
            visual = obj.visuals[visualId];

            if ( TRAVISO.existy(visual.ipor) && TRAVISO.existy(visual.ipoc) ) {
                interactionOffsets[visualId] = { c: parseInt(visual.ipoc), r: parseInt(visual.ipor) };
            }

            if ( visual.frames && visual.frames.length > 0 ) {
                oTextures[visualId] = [];
                for (m = 0; m < visual.frames.length; m++) {
                    oTextures[visualId][m] = visual.frames[m].path;
                }
            } else {
                if (!visual.path || !visual.extension || !visual.numberOfFrames || visual.numberOfFrames < 1) {
                    throw new Error("TRAVISO: Invalid or missing visual attributes detected in data-file for visual with id: " + visualId);
                }

                oTextures[visualId] = [];
                if (visual.numberOfFrames === 1) {
                    oTextures[visualId][0] = visual.path + "." + visual.extension;
                } else {
                    n = 0;
                    for (m = visual.startIndex; m < visual.numberOfFrames; m++) {
                        oTextures[visualId][n++] = visual.path + String(m) + "." + visual.extension;
                    }
                }
            }
        }

        obj.t = oTextures;
        obj.io = interactionOffsets;
        obj.f = !!obj.floor;
        obj.nt = !!obj.noTransparency;
        obj.m = !!obj.movable;
        obj.i = !!obj.interactive;
    }
    
    delete mapData.objectsMap;
    delete mapData.groundMap;

    engine.mapData = mapData;

    if (loadedCallback) {
        loadedCallback();
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
    var objInfo = engine.mapData.objects[objectType];
    if (objInfo) {
        var textures = {};
        for (var key in objInfo.t)
        {
            textures[key] = TRAVISO.getObjectTextures(engine, objectType, key);
        }
        return {
            m : objInfo.m,
            i : objInfo.i,
            f : objInfo.f,
            nt : objInfo.nt,
            t : textures,
            io : objInfo.io,
            s : objInfo.s,
            rowSpan : objInfo.rowSpan,
            columnSpan : objInfo.columnSpan
        };
    }
    else {
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
TRAVISO.getObjectTextures = function(engine, objectType, visualId) {
    var objInfo = engine.mapData.objects[objectType];
    if (objInfo) {
        var textures = null;
        var textureNames = objInfo.t[visualId];
        if (textureNames) {
            textures = [];
            for (var j = 0; j < textureNames.length; j++) {
                textures[textures.length] = PIXI.Texture.fromFrame(textureNames[j]);
            }
        }
        else {
            TRAVISO.trace("No textures defined for object type: " + objectType + " and visualId: " + visualId);
        }
        return textures;
    }
    else {
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
TRAVISO.getTileInfo = function(engine, tileType) {
    var tileInfo = engine.mapData.tiles[tileType];
    if (tileInfo) {
        return {
            // m : tileInfo.m,
            m : tileInfo.movable,
            // t : tileInfo.t ? [PIXI.Texture.fromFrame(tileInfo.t)] : []
            t : tileInfo.path ? [PIXI.Texture.fromFrame(tileInfo.path)] : []
        };
    }
    else if (engine.mapData.singleGroundImage) {
        return {
            m : parseInt(tileType) > 0 ? 1 : 0,
            t : []
        };
    }
    else {
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
TRAVISO.getStationaryDirVisualId = function(dir) {
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
TRAVISO.getMovingDirVisualId = function(dir) {
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
TRAVISO.getDirBetween = function(r1, c1, r2, c2) {
    var dir = TRAVISO.directions.S;
    if (r1 === r2) {
        if (c1 === c2) 		{ dir = TRAVISO.directions.O; }
        else if (c1 < c2) 	{ dir = TRAVISO.directions.NE; }
        else 				{ dir = TRAVISO.directions.SW; }
    }
    else if (r1 < r2) {
        if (c1 === c2)		{ dir = TRAVISO.directions.SE; }
        else if (c1 < c2)	{ dir = TRAVISO.directions.E; }
        else				{ dir = TRAVISO.directions.S; }
    }
    else if (r1 > r2) {
        if (c1 === c2)		{ dir = TRAVISO.directions.NW; }
        else if (c1 < c2)	{ dir = TRAVISO.directions.N; }
        else				{ dir = TRAVISO.directions.W; }
    }
    return dir;
};
