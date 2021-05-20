/**
 * @author Hakan Karlidag - @axaq
 */

import { Texture, Container, Graphics, Sprite, AnimatedSprite } from 'pixi.js';
import { EngineView } from './EngineView';
import { ColumnRowPair, getTileInfo } from '../utils/map';
import { ITweenTarget } from './MoveEngine';

/**
 * Visual class for the map-tiles.
 *
 * @class TileView
 * @extends PIXI.Container
 * @constructor
 * @param engine {EngineView} the engine instance that the map-tile sits in
 * @param type {String} type-id of the tile as defined in the JSON file
 */
export class TileView extends Container {
    /**
     * A reference to the engine view that the map-tile sits in.
     * @property {EngineView} engine
     * @protected
     */
    private engine: EngineView;
    /**
     * Type-id of the map-tile as defined in the JSON file.
     * @property {string} type
     */
    private type: string;
    /**
     * Defines the positions of the vertices of the tile.
     * @property {Array(Array(Number))} vertices
     * @protected
     */
    public vertices: number[][];
    /**
     * Defines if the map-tile is movable onto by map-objects.
     * @property {Boolean} isMovableTo
     */
    public isMovableTo: boolean;

    private tileGraphics: AnimatedSprite;
    /**
     * The visual that will be used to highlight the tile.
     * @property {Sprite | Graphics} highlightedOverlay
     * @protected
     */
    private highlightedOverlay: Sprite | Graphics;
    /**
     * The highlight state of the map-tile.
     * @property {Boolean} isHighlighted
     */
    private isHighlighted: boolean = false;
    /**
     * Position of the tile in terms of column and row index.
     * @property {Boolean}
     */
    public mapPos: ColumnRowPair;

    private onHighlightTweenEnd_binded: () => void;

    /**
     * Visual class constructor for the map-tiles.
     *
     * @constructor
     * @param engine {EngineView} the engine instance that the map-tile sits in
     * @param type {String} type-id of the tile as defined in the JSON file
     */
    constructor(engine: EngineView, type: string) {
        super();

        this.onHighlightTweenEnd_binded = this.onHighlightTweenEnd.bind(this);

        this.engine = engine;
        this.type = type;

        const halfHeight = this.engine.TILE_HALF_H;
        const halfWidth = this.engine.TILE_HALF_W;

        this.vertices = [
            [-halfWidth, 0],
            [0, -halfHeight],
            [halfWidth, 0],
            [0, halfHeight],
        ];

        const tileInfo = getTileInfo(this.engine, this.type);
        this.isMovableTo = tileInfo.m;

        if (tileInfo.t.length > 0) {
            this.tileGraphics = new AnimatedSprite(tileInfo.t);
            this.tileGraphics.anchor.x = 0.5;
            this.tileGraphics.anchor.y = 0.5;
            this.addChild(this.tileGraphics);
            this.tileGraphics.gotoAndStop(parseInt(this.type));
        }

        // const colorsArray = [0x0106ff, 0x3b6d14, 0x8789ff, 0xb32bf9, 0xeb36d0, 0xfe0000, 0xeb3647, 0xf27e31, 0xffea01, 0x00ff18, 0x3b6d14, 0xfa9bbb, 0xf9c7bc, 0x8d6729, 0x633e07];
        // const c = colorsArray[ this.type < 2 ? this.type : 0 ];

        // this.tileGraphics = new PIXI.Graphics();
        // this.tileGraphics.clear();
        // this.tileGraphics.beginFill(c);
        // this.tileGraphics.moveTo(this.vertices[0][0], this.vertices[0][1]);
        // for (let i=1; i < this.vertices.length; i++)
        // {
        // this.tileGraphics.lineTo(this.vertices[i][0], this.vertices[i][1]);
        // };
        // this.tileGraphics.endFill();

        if (this.engine.mapData.tileHighlightImage) {
            this.highlightedOverlay = new Sprite(Texture.from(this.engine.mapData.tileHighlightImage.path));
            this.highlightedOverlay.anchor.x = 0.5;
            this.highlightedOverlay.anchor.y = 0.5;
            this.addChild(this.highlightedOverlay);
        } else {
            this.highlightedOverlay = new Graphics();
            this.highlightedOverlay.clear();
            this.highlightedOverlay.lineStyle(
                this.engine.tileHighlightStrokeAlpha <= 0 ? 0 : 2,
                this.engine.tileHighlightStrokeColor,
                this.engine.tileHighlightStrokeAlpha
            );
            this.highlightedOverlay.beginFill(this.engine.tileHighlightFillColor, this.engine.tileHighlightFillAlpha);
            this.highlightedOverlay.moveTo(this.vertices[0][0], this.vertices[0][1]);
            for (let i = 1; i < this.vertices.length; i++) {
                this.highlightedOverlay.lineTo(this.vertices[i][0], this.vertices[i][1]);
            }
            this.highlightedOverlay.lineTo(this.vertices[0][0], this.vertices[0][1]);
            this.highlightedOverlay.endFill();
            this.addChild(this.highlightedOverlay);
        }

        this.highlightedOverlay.scale.x = this.highlightedOverlay.scale.y = 0.1;
        this.highlightedOverlay.visible = false;
    }

    /**
     * Changes the highlight state of the map-tile.
     *
     * @method setHighlighted
     * @param isHighlighted {Boolean} if the tile is being highlighted or not
     * @param [instant=false] {Boolean} if the change will be instant or animated
     */
    public setHighlighted(isHighlighted: boolean, instant: boolean): void {
        if (this.isHighlighted !== isHighlighted) {
            if (instant) {
                this.highlightedOverlay.scale.x = this.highlightedOverlay.scale.y = isHighlighted ? 1 : 0.1;
                this.highlightedOverlay.visible = isHighlighted;
                this.isHighlighted = isHighlighted;
                return;
            }

            if (isHighlighted) {
                this.highlightedOverlay.visible = isHighlighted;
            }

            this.isHighlighted = isHighlighted;

            const ts = isHighlighted ? 1 : 0.1;
            if (this.highlightedOverlay.scale.x === ts) {
                this.highlightedOverlay.visible = isHighlighted;
            } else {
                this.highlightedOverlay.scale.x = this.highlightedOverlay.scale.y = isHighlighted ? 0.1 : 1;

                // @formatter:off
                this.engine.moveEngine.addTween(
                    this.highlightedOverlay.scale as unknown as ITweenTarget,
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
    private onHighlightTweenEnd(): void {
        this.highlightedOverlay.visible = this.isHighlighted;
    }

    /**
     * Clears all references.
     *
     * @method destroy
     */
    public destroy(): void {
        if (this.engine) {
            if (this.engine && this.engine.moveEngine) {
                this.engine.moveEngine.killTweensOf(this.highlightedOverlay.scale as unknown as ITweenTarget);
            }
            this.engine = null;
            this.highlightedOverlay = null;
            this.tileGraphics = null;
        }
    }
}
