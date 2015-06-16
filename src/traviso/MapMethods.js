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
        PIXI.loader.add(engine.config.assetsToLoad).load(function () { TRAVISO.loadData(engine, loadedCallback); });
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
                    
                    var oTextures, interactionOffsets, temp, isFloorObject, noTransparency;
                    for (i = 0; i < arr.length; i++)
                    {
                        oTextures = { };
                        interactionOffsets = { };

                        ///////////////////////////////////////////////////////////////////////////

                        var objectVisuals = arr[i].getElementsByTagName("v");

                        if (!objectVisuals || objectVisuals.length < 1)
                        {
                            throw new Error("TRAVISO: No visuals defined in XML for object type: " + arr[i].attributes.getNamedItem("id").nodeValue);
                        }
                        else
                        {
                        	var m, k, v, vId, vIpor, vIpoc, vFrames;
                            for (k = 0; k < objectVisuals.length; k++)
                            {
                                v = objectVisuals[k];
                                temp = v.attributes.getNamedItem("id");
                                vId = temp ? temp.nodeValue : null;
                                if (!vId || vId === "" || vId.length < 1)
                                {
                                    throw new Error("TRAVISO: A v tag without an id is detected in the XML file.");
                                }
                                
                                temp = v.attributes.getNamedItem("ipor");
                                vIpor = temp ? temp.nodeValue : null;
                                temp = v.attributes.getNamedItem("ipoc");
                                vIpoc = temp ? temp.nodeValue : null;
                                interactionOffsets[vId] = null;
                                if (vIpor && vIpor !== "" && vIpor.length > 0 && vIpoc && vIpoc !== "" && vIpoc.length > 0)
                                {
                                    interactionOffsets[vId] = { c: parseInt(vIpoc), r: parseInt(vIpor) };
                                }

                                vFrames = v.getElementsByTagName("f");
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
                        
                        isFloorObject = arr[i].attributes.getNamedItem("floor") ? parseInt(arr[i].attributes.getNamedItem("floor").nodeValue, 10) : false;
                        noTransparency = arr[i].attributes.getNamedItem("noTransparency") ? parseInt(arr[i].attributes.getNamedItem("noTransparency").nodeValue, 10) : false;
                        
                        engine.mapData.textures.objects[arr[i].attributes.getNamedItem("id").nodeValue] =
                        {
                            t : oTextures,
                            io : interactionOffsets,
                            s : arr[i].attributes.getNamedItem("s").nodeValue,
                            f : isFloorObject,
                            nt : noTransparency,
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
            f : objInfo.f,
            nt : objInfo.nt,
            t : textures,
            io : objInfo.io,
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
