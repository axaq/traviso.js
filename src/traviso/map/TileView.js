/**
 * @author Hakan Karlidag - @axaq
 */

/**
 * Visual class for the map-tiles.
 *
 * @class TileView
 * @extends PIXI.Container
 * @constructor
 * @param engine {EngineView} the engine instance that the map-tile sits in
 * @param [tileType="0"] {String} type-id of the tile as defined in the XML file
 */
TRAVISO.TileView = function(engine, tileType)
{
    PIXI.Container.call(this);

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
     * Defines the positions of the vertices of the tile.
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
        this.tileGraphics = new PIXI.extras.AnimatedSprite(tileInfo.t);
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
    if (this.engine.mapData.tileHighlightImage) {
        this.highlightedOverlay = new PIXI.Sprite.fromFrame(this.engine.mapData.tileHighlightImage.path);
        this.highlightedOverlay.anchor.x = 0.5;
        this.highlightedOverlay.anchor.y = 0.5;
        this.addChild(this.highlightedOverlay);
    }
    else
    {
        this.highlightedOverlay = new PIXI.Graphics();
        this.highlightedOverlay.clear();
        this.highlightedOverlay.lineStyle(this.engine.config.tileHighlightStrokeAlpha <= 0 ? 0 : 2, this.engine.config.tileHighlightStrokeColor, this.engine.config.tileHighlightStrokeAlpha);
        this.highlightedOverlay.beginFill(this.engine.config.tileHighlightFillColor, this.engine.config.tileHighlightFillAlpha);
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

    this.highlightedOverlay.scale.tweenScope = this.highlightedOverlay;
    this.highlightedOverlay.scale.isHighlighted = this.isHighlighted = false;
};

// constructor
TRAVISO.TileView.constructor = TRAVISO.TileView;
TRAVISO.TileView.prototype = Object.create(PIXI.Container.prototype);

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
                    this.target.tweenScope.visible = this.target.isHighlighted;
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
        this.highlightedOverlay.scale.tweenScope = null;
        this.highlightedOverlay = null;
        this.tileGraphics = null;
    }
};

