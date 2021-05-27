import { Texture, Container, Graphics, Sprite, AnimatedSprite } from 'pixi.js';
import { EngineView } from './EngineView';
import { TColumnRowPair, getTileInfo } from '../utils/map';
import { ITweenTarget } from './MoveEngine';

/**
 * Visual class for the map-tiles.
 *
 * @class TileView
 * @extends PIXI.Container
 * @constructor
 * @param engine {EngineView} the engine instance that the map-tile sits in
 * @param type {string} type-id of the tile as defined in the JSON file
 */
export class TileView extends Container {
    /**
     * A reference to the engine view that the map-tile sits in.
     * @property
     * @private
     * @internal
     */
    private _engine: EngineView;
    /**
     * Type-id of the map-tile as defined in the JSON file.
     * @property
     * @private
     */
    private _type: string;
    /**
     * Defines the positions of the vertices of the tile.
     * @property
     * @public
     */
    public vertices: number[][];
    /**
     * Defines if the map-tile is movable onto by map-objects.
     * @property
     * @public
     */
    public isMovableTo: boolean;
    /**
     * @property
     * @private
     * @internal
     */
    private _tileGraphics: AnimatedSprite;
    /**
     * The visual that will be used to highlight the tile.
     * @property
     * @private
     * @internal
     */
    private _highlightedOverlay: Sprite | Graphics;
    /**
     * The highlight state of the map-tile.
     * @property
     * @private
     * @internal
     */
    private _isHighlighted: boolean = false;
    /**
     * Position of the tile in terms of column and row index.
     * @property
     * @public
     */
    public mapPos: TColumnRowPair;
    /**
     * @property
     * @private
     * @internal
     */
    private onHighlightTweenEnd_binded: () => void;

    /**
     * Visual class constructor for the map-tiles.
     *
     * @constructor
     *
     * @param engine {EngineView} the engine instance that the map-tile sits in
     * @param type {string} type-id of the tile as defined in the JSON file
     */
    constructor(engine: EngineView, type: string) {
        super();

        this.onHighlightTweenEnd_binded = this.onHighlightTweenEnd.bind(this);

        this._engine = engine;
        this._type = type;

        const halfHeight = this._engine.tileHalfHeight;
        const halfWidth = this._engine.tileHalfWidth;

        this.vertices = [
            [-halfWidth, 0],
            [0, -halfHeight],
            [halfWidth, 0],
            [0, halfHeight],
        ];

        const tileInfo = getTileInfo(this._engine, this._type);
        this.isMovableTo = tileInfo.m;

        if (tileInfo.t.length > 0) {
            this._tileGraphics = new AnimatedSprite(tileInfo.t);
            this._tileGraphics.anchor.x = 0.5;
            this._tileGraphics.anchor.y = 0.5;
            this.addChild(this._tileGraphics);
            this._tileGraphics.gotoAndStop(parseInt(this._type));
        }

        // const colorsArray = [0x0106ff, 0x3b6d14, 0x8789ff, 0xb32bf9, 0xeb36d0, 0xfe0000, 0xeb3647, 0xf27e31, 0xffea01, 0x00ff18, 0x3b6d14, 0xfa9bbb, 0xf9c7bc, 0x8d6729, 0x633e07];
        // const c = colorsArray[ this._type < 2 ? this._type : 0 ];

        // this._tileGraphics = new PIXI.Graphics();
        // this._tileGraphics.clear();
        // this._tileGraphics.beginFill(c);
        // this._tileGraphics.moveTo(this.vertices[0][0], this.vertices[0][1]);
        // for (let i=1; i < this.vertices.length; i++)
        // {
        // this._tileGraphics.lineTo(this.vertices[i][0], this.vertices[i][1]);
        // };
        // this._tileGraphics.endFill();

        if (this._engine.mapData.tileHighlightImage) {
            this._highlightedOverlay = new Sprite(Texture.from(this._engine.mapData.tileHighlightImage.path));
            this._highlightedOverlay.anchor.x = 0.5;
            this._highlightedOverlay.anchor.y = 0.5;
            this.addChild(this._highlightedOverlay);
        } else {
            this._highlightedOverlay = new Graphics();
            this._highlightedOverlay.clear();
            this._highlightedOverlay.lineStyle(
                this._engine.tileHighlightStrokeAlpha <= 0 ? 0 : 2,
                this._engine.tileHighlightStrokeColor,
                this._engine.tileHighlightStrokeAlpha
            );
            this._highlightedOverlay.beginFill(
                this._engine.tileHighlightFillColor,
                this._engine.tileHighlightFillAlpha
            );
            this._highlightedOverlay.moveTo(this.vertices[0][0], this.vertices[0][1]);
            for (let i = 1; i < this.vertices.length; i++) {
                this._highlightedOverlay.lineTo(this.vertices[i][0], this.vertices[i][1]);
            }
            this._highlightedOverlay.lineTo(this.vertices[0][0], this.vertices[0][1]);
            this._highlightedOverlay.endFill();
            this.addChild(this._highlightedOverlay);
        }

        this._highlightedOverlay.scale.x = this._highlightedOverlay.scale.y = 0.1;
        this._highlightedOverlay.visible = false;
    }

    /**
     * Changes the highlight state of the map-tile.
     *
     * @method
     * @function
     * @public
     *
     * @param isHighlighted {boolean} if the tile is being highlighted or not
     * @param instant {boolean} if the change will be instant or animated, default `false`
     */
    public setHighlighted(isHighlighted: boolean, instant: boolean = false): void {
        if (this._isHighlighted !== isHighlighted) {
            if (instant) {
                this._highlightedOverlay.scale.x = this._highlightedOverlay.scale.y = isHighlighted ? 1 : 0.1;
                this._highlightedOverlay.visible = isHighlighted;
                this._isHighlighted = isHighlighted;
                return;
            }

            if (isHighlighted) {
                this._highlightedOverlay.visible = isHighlighted;
            }

            this._isHighlighted = isHighlighted;

            const ts = isHighlighted ? 1 : 0.1;
            if (this._highlightedOverlay.scale.x === ts) {
                this._highlightedOverlay.visible = isHighlighted;
            } else {
                this._highlightedOverlay.scale.x = this._highlightedOverlay.scale.y = isHighlighted ? 0.1 : 1;

                // @formatter:off
                this._engine.moveEngine.addTween(
                    this._highlightedOverlay.scale as unknown as ITweenTarget,
                    0.5,
                    { x: ts, y: ts },
                    0,
                    'linear',
                    true,
                    this.onHighlightTweenEnd_binded
                );
                // @formatter:on
            }
        }
    }
    /**
     * @method
     * @function
     * @private
     * @internal
     */
    private onHighlightTweenEnd(): void {
        this._highlightedOverlay.visible = this._isHighlighted;
    }

    /**
     * Clears all references.
     *
     * @method
     * @function
     * @public
     */
    public destroy(): void {
        if (this._engine) {
            if (this._engine && this._engine.moveEngine) {
                this._engine.moveEngine.killTweensOf(this._highlightedOverlay.scale as unknown as ITweenTarget);
            }
            this._engine = null;
            this._highlightedOverlay = null;
            this._tileGraphics = null;
        }
    }
}
