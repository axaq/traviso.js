/**
 * @author Hakan Karlidag - @axaq
 */
import { Container } from 'pixi.js';
import { EngineView } from './EngineView';
import { ColumnRowPair } from '../utils/map';
/**
 * Visual class for the map-tiles.
 *
 * @class TileView
 * @extends PIXI.Container
 * @constructor
 * @param engine {EngineView} the engine instance that the map-tile sits in
 * @param type {String} type-id of the tile as defined in the JSON file
 */
export declare class TileView extends Container {
    /**
     * A reference to the engine view that the map-tile sits in.
     * @property {EngineView} engine
     * @protected
     */
    private engine;
    /**
     * Type-id of the map-tile as defined in the JSON file.
     * @property {string} type
     */
    private type;
    /**
     * Defines the positions of the vertices of the tile.
     * @property {Array(Array(Number))} vertices
     * @protected
     */
    vertices: number[][];
    /**
     * Defines if the map-tile is movable onto by map-objects.
     * @property {Boolean} isMovableTo
     */
    isMovableTo: boolean;
    private tileGraphics;
    /**
     * The visual that will be used to highlight the tile.
     * @property {Sprite | Graphics} highlightedOverlay
     * @protected
     */
    private highlightedOverlay;
    /**
     * The highlight state of the map-tile.
     * @property {Boolean} isHighlighted
     */
    private isHighlighted;
    /**
     * Position of the tile in terms of column and row index.
     * @property {Boolean}
     */
    mapPos: ColumnRowPair;
    private onHighlightTweenEnd_binded;
    /**
     * Visual class constructor for the map-tiles.
     *
     * @constructor
     * @param engine {EngineView} the engine instance that the map-tile sits in
     * @param type {String} type-id of the tile as defined in the JSON file
     */
    constructor(engine: EngineView, type: string);
    /**
     * Changes the highlight state of the map-tile.
     *
     * @method setHighlighted
     * @param isHighlighted {Boolean} if the tile is being highlighted or not
     * @param [instant=false] {Boolean} if the change will be instant or animated
     */
    setHighlighted(isHighlighted: boolean, instant: boolean): void;
    private onHighlightTweenEnd;
    /**
     * Clears all references.
     *
     * @method destroy
     */
    destroy(): void;
}
