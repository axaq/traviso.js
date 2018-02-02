/**
 * @author Hakan Karlidag - @axaq
 */

/**
 * Visual class for the map-objects.
 *
 * @class ObjectView
 * @extends PIXI.Container
 * @constructor
 * @param engine {EngineView} the engine instance that the map-object sits in
 * @param [objectType=0] {Number} type-id of the object as defined in the XML file
 * @param [animSpeed=0.5] {Number} animation speed for the movieclips
 */
TRAVISO.ObjectView = function(engine, objectType, animSpeed)
{
    PIXI.Container.call(this);
    
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
	 * Number of tiles that map-object covers horizontally on the isometric map
     * @property {Number} columnSpan
	 */
    /**
	 * Number of tiles that map-object covers vertically on the isometric map
     * @property {Number} rowSpan
	 */
    var info = TRAVISO.getObjectInfo(this.engine, this.type);
    this.isMovableTo = info.m;
    this.isInteractive = info.i;
    this.interactive = this.interactiveChildren = false;
    this.isFloorObject = info.f;
    this.noTransparency = info.nt;
    this.rowSpan = info.rowSpan;
    this.columnSpan = info.columnSpan;
    var xAnchor = this.rowSpan / (this.columnSpan + this.rowSpan);
	
	/**
	 * A dictionary for all the textures defined for the map-object.
	 * @property {Object} textures
	 * @protected
	 */
    this.textures = info.t;
    /**
	 * A dictionary for interaction offset points for each visual if defined in the map data file.
	 * @property {Object} interactionOffsets
	 * @protected
	 */
    this.interactionOffsets = info.io;
    
    this.currentInteractionOffset = this.interactionOffsets.idle;
	
    this.container = new PIXI.extras.AnimatedSprite(this.textures.idle);
    this.container.interactive = this.container.interactiveChildren = false;
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
TRAVISO.ObjectView.prototype = Object.create(PIXI.Container.prototype);

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
 * @param [onAnimComplete=null] {Function} callback function to call if 'noLoop' is true after the first run of the animation
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
        else
        {
            this.currentDirection = TRAVISO.directions.O;
        }
	}
    else
    {
        this.currentDirection = direction;
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
 * @param [onAnimComplete=null] {Function} callback function to call if 'noLoop' is true after the first run of the animation
 * @param [animSpeed=null] {Number} animation speed for the movieclips, stays the same if not defined
 */
TRAVISO.ObjectView.prototype.changeVisual = function(vId, stopOnFirstFrame, noLoop, onAnimComplete, animSpeed)
{
    if (!this.textures[vId])
    {
        // TRAVISO.trace("!!! No textures defined for vId: " + vId);
        return false;
    }
    
    this.currentInteractionOffset = this.interactionOffsets[vId];
    
    if (this.container.textures === this.textures[vId] && !noLoop)
    {
        this.container.loop = !noLoop;
        if (TRAVISO.existy(animSpeed) && animSpeed > 0) { this.animSpeed = animSpeed; }
        return true;
    }
    
    this.container.textures = this.textures[vId];
    
    if (!stopOnFirstFrame && this.textures[vId].length > 1)
    {
        this.container.loop = !noLoop;
        if (noLoop && onAnimComplete) 
        {
            var scope = this;
            this.container.onComplete = function () { setTimeout(function () { onAnimComplete( scope ); }, 100); };
        }
        if (TRAVISO.existy(animSpeed) && animSpeed > 0) { this.animSpeed = animSpeed; }
        this.container.gotoAndPlay(0);
    }
    else
    {
        this.container.gotoAndStop(0);
    }
    
    if (this.engine.config.objectUpdateCallback) { this.engine.config.objectUpdateCallback( this ); }
    
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
	    this.textures = null;
	    // this.removeChild(this.container);
	    // this.container.textures = null;
	    this.container.onComplete = null;
	    this.container = null;
	}
};

