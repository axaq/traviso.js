/**
 * @author Hakan Karlidag - @axaq
 */
import { Container } from 'pixi.js';
import { EngineView } from './EngineView';
import { Direction } from '../utils/constants';
import { ColumnRowPair, ObjectVisualKey } from '../utils/map';
/**
 * Visual class for the map-objects.
 *
 * @class ObjectView
 * @extends PIXI.Container
 * @constructor
 * @param engine {EngineView} the engine instance that the map-object sits in
 * @param type {Number} type-id of the object as defined in the XML file
 * @param [animSpeed=0.5] {Number} animation speed for the animated visuals
 */
export declare class ObjectView extends Container {
    /**
     * A reference to the engine view that the map-object sits in.
     * @property {EngineView} engine
     * @protected
     */
    private engine;
    /**
     * Type-id of the map-object as defined in the XML file.
     * @property {string} type
     */
    private type;
    /**
     * Defines if the map-object is movable onto by other map-objects.
     * @property {Boolean} isMovableTo
     */
    isMovableTo: boolean;
    /**
     * Defines if the map-object is interactive/selectable.
     * @property {Boolean} isInteractive
     */
    isInteractive: boolean;
    /**
     * Number of tiles that map-object covers horizontally on the isometric map
     * @property {Number} columnSpan
     */
    columnSpan: number;
    /**
     * Number of tiles that map-object covers vertically on the isometric map
     * @property {Number} rowSpan
     */
    rowSpan: number;
    /**
     * A dictionary for all the textures defined for the map-object.
     * @property {ObjectInfoTextures} textures
     * @protected
     */
    private textures;
    /**
     * A dictionary for interaction offset points for each visual if defined in the map data file.
     * @property {ObjectInfoInteractionOffsets} interactionOffsets
     * @protected
     */
    private interactionOffsets;
    noTransparency: boolean;
    isFloorObject: boolean;
    currentInteractionOffset: ColumnRowPair;
    currentDirection: Direction;
    /**
     * Defines if the map-object is movable onto by other map-objects.
     * @property {Container} container
     * @protected
     * @private
     */
    private container;
    /**
     * Position of the object in terms of column and row index.
     * @property {Boolean}
     */
    mapPos: ColumnRowPair;
    private onContainerAnimCompleteCallback;
    private onContainerAnimComplete_delayed_binded;
    private onContainerAnimComplete_binded;
    /**
     * Visual class constructor for the map-objects.
     *
     * @constructor
     * @param engine {EngineView} the engine instance that the map-object sits in
     * @param type {Number} type-id of the object as defined in the JSON file
     * @param [animSpeed=0.5] {Number} animation speed for the animated visuals
     */
    constructor(engine: EngineView, type: string, animSpeed?: number);
    /**
     * Animation speed for the animated visuals included in the map-object visuals.
     *
     * @property {Number} animSpeed
     * @default 0.5
     */
    get animSpeed(): number;
    set animSpeed(value: number);
    /**
     * Changes the map-object's texture(s) according to the specified direction-id and the state of the map-object (moving or stationary).
     *
     * @method changeVisualToDirection
     * @param direction {Number} direction-id as defined in 'TRAVISO.DIRECTIONS'
     * @param [moving=false] {Boolean} if the requested visuals are for moving or stationary state
     * @param [stopOnFirstFrame=false] {Boolean} if true stops on the first frame after changing the visuals
     * @param [noLoop=false] {Boolean} if true the animation will not loop after the first run
     * @param [onAnimComplete=null] {Function} callback function to call if 'noLoop' is true after the first run of the animation
     * @param [animSpeed=null] {Number} animation speed for the animated visuals, stays the same if not defined
     */
    changeVisualToDirection(direction: Direction, moving?: boolean, stopOnFirstFrame?: boolean, noLoop?: boolean, onAnimComplete?: (objectView: ObjectView) => unknown, animSpeed?: number): void;
    /**
     * Changes the map-object's texture(s) according to the specified visual-id.
     *
     * @method changeVisual
     * @private
     * @param vId {String} visual-id
     * @param [stopOnFirstFrame=false] {Boolean} if true stops on the first frame after changing the visuals
     * @param [noLoop=false] {Boolean} if true the animation will not loop after the first run
     * @param [onAnimComplete=null] {Function} callback function to call if 'noLoop' is true after the first run of the animation
     * @param [animSpeed=null] {Number} animation speed for the animated visuals, stays the same if not defined
     */
    changeVisual(vId: ObjectVisualKey, stopOnFirstFrame?: boolean, noLoop?: boolean, onAnimComplete?: (objectView: ObjectView) => unknown, animSpeed?: number): boolean;
    private onContainerAnimComplete;
    private onContainerAnimComplete_delayed;
    /**
     * Clears all references.
     *
     * @method destroy
     */
    destroy(): void;
}
