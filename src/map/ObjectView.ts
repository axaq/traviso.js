/**
 * @author Hakan Karlidag - @axaq
 */

import { Container, AnimatedSprite } from 'pixi.js';
import { EngineView } from './EngineView';
import { existy } from '../utils/calculations';
import { Direction, DIRECTIONS } from '../utils/constants';
import {
    TColumnRowPair,
    ObjectInfoInteractionOffsets,
    ObjectInfoTextures,
    ObjectVisualKey,
    getMovingDirVisualId,
    getObjectInfo,
    getStationaryDirVisualId,
    IObjectInfo,
} from '../utils/map';

/**
 * Visual class for the map-objects.
 *
 * @class ObjectView
 * @extends PIXI.Container
 * @constructor
 * @param engine {EngineView} the engine instance that the map-object sits in
 * @param type {Number} type-id of the object as defined in the json file
 * @param [animSpeed=0.5] {Number} animation speed for the animated visuals
 */
export class ObjectView extends Container {
    /**
     * A reference to the engine view that the map-object sits in.
     * @property {EngineView} engine
     * @protected
     */
    private engine: EngineView;
    /**
     * Type-id of the map-object as defined in the json file.
     * @property {string} type
     */
    private type: string;
    /**
     * Defines if the map-object is movable onto by other map-objects.
     * @property {Boolean} isMovableTo
     */
    public isMovableTo: boolean;
    /**
     * Defines if the map-object is interactive/selectable.
     * @property {Boolean} isInteractive
     */
    public isInteractive: boolean;
    /**
     * Number of tiles that map-object covers horizontally on the isometric map
     * @property {Number} columnSpan
     */
    public columnSpan: number;
    /**
     * Number of tiles that map-object covers vertically on the isometric map
     * @property {Number} rowSpan
     */
    public rowSpan: number;

    /**
     * A dictionary for all the textures defined for the map-object.
     * @property {ObjectInfoTextures} textures
     * @protected
     */
    private textures: ObjectInfoTextures;

    /**
     * A dictionary for interaction offset points for each visual if defined in the map data file.
     * @property {ObjectInfoInteractionOffsets} interactionOffsets
     * @protected
     */
    private interactionOffsets: ObjectInfoInteractionOffsets;

    public noTransparency: boolean;
    public isFloorObject: boolean;

    public currentInteractionOffset: TColumnRowPair;

    public currentDirection: Direction;

    /**
     * Defines if the map-object is movable onto by other map-objects.
     * @property {Container} container
     * @protected
     * @private
     */
    private container: AnimatedSprite;
    /**
     * Position of the object in terms of column and row index.
     * @property {Boolean}
     */
    public mapPos: TColumnRowPair;

    private onContainerAnimCompleteCallback: (objectView: ObjectView) => unknown;
    private onContainerAnimComplete_delayed_binded: () => void;
    private onContainerAnimComplete_binded: () => void;

    /**
     * Visual class constructor for the map-objects.
     *
     * @constructor
     * @param engine {EngineView} the engine instance that the map-object sits in
     * @param type {Number} type-id of the object as defined in the JSON file
     * @param [animSpeed=0.5] {Number} animation speed for the animated visuals
     */
    constructor(engine: EngineView, type: string, animSpeed: number = 0.5) {
        super();

        this.onContainerAnimComplete_delayed_binded = this.onContainerAnimComplete_delayed.bind(this);
        this.onContainerAnimComplete_binded = this.onContainerAnimComplete.bind(this);

        this.engine = engine;
        this.type = type;

        const info: IObjectInfo = getObjectInfo(this.engine, this.type);
        this.isMovableTo = info.m;
        this.isInteractive = info.i;
        this.interactive = this.interactiveChildren = false;
        this.isFloorObject = info.f;
        this.noTransparency = info.nt;
        this.rowSpan = info.rowSpan;
        this.columnSpan = info.columnSpan;
        const xAnchor = this.rowSpan / (this.columnSpan + this.rowSpan);
        this.textures = info.t;
        this.interactionOffsets = info.io;
        this.currentInteractionOffset = this.interactionOffsets.idle;

        this.container = new AnimatedSprite(this.textures.idle);
        this.container.interactive = this.container.interactiveChildren = false;
        this.container.anchor.x = xAnchor;
        this.container.anchor.y = 1;
        this.addChild(this.container);
        this.animSpeed = animSpeed;
        this.container.gotoAndStop(0);
    }

    /**
     * Animation speed for the animated visuals included in the map-object visuals.
     *
     * @property {Number} animSpeed
     * @default 0.5
     */
    public get animSpeed(): number {
        return this.container.animationSpeed;
    }
    public set animSpeed(value: number) {
        this.container.animationSpeed = existy(value) && value > 0 ? value : 0.5;
    }

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
    public changeVisualToDirection(
        direction: Direction,
        moving: boolean = false,
        stopOnFirstFrame: boolean = false,
        noLoop: boolean = false,
        onAnimComplete: (objectView: ObjectView) => unknown = null,
        animSpeed: number = null
    ): void {
        if (
            !this.changeVisual(
                moving ? getMovingDirVisualId(direction) : getStationaryDirVisualId(direction),
                stopOnFirstFrame,
                noLoop,
                onAnimComplete,
                animSpeed
            )
        ) {
            if (!this.changeVisual('idle', stopOnFirstFrame, noLoop, onAnimComplete, animSpeed)) {
                throw new Error("no 'idle' visual defined as backup for object type " + this.type);
            } else {
                this.currentDirection = DIRECTIONS.O;
            }
        } else {
            this.currentDirection = direction;
        }
    }

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
    public changeVisual(
        vId: ObjectVisualKey,
        stopOnFirstFrame: boolean = false,
        noLoop: boolean = false,
        onAnimComplete: (objectView: ObjectView) => unknown = null,
        animSpeed: number = null
    ): boolean {
        if (!this.textures[vId]) {
            // trace("!!! No textures defined for vId: " + vId);
            return false;
        }

        this.currentInteractionOffset = this.interactionOffsets[vId];

        if (this.container.textures === this.textures[vId] && !noLoop) {
            this.container.loop = !noLoop;
            if (existy(animSpeed) && animSpeed > 0) {
                this.animSpeed = animSpeed;
            }
            return true;
        }

        this.container.textures = this.textures[vId];

        if (!stopOnFirstFrame && this.textures[vId].length > 1) {
            this.container.loop = !noLoop;
            if (noLoop && onAnimComplete) {
                this.onContainerAnimCompleteCallback = onAnimComplete;
                this.container.onComplete = this.onContainerAnimComplete_binded;
            }
            if (existy(animSpeed) && animSpeed > 0) {
                this.animSpeed = animSpeed;
            }
            this.container.gotoAndPlay(0);
        } else {
            this.container.gotoAndStop(0);
        }

        if (this.engine.objectUpdateCallback) {
            this.engine.objectUpdateCallback(this);
        }

        return true;
    }

    private onContainerAnimComplete(): void {
        setTimeout(this.onContainerAnimComplete_delayed_binded, 100);
    }
    private onContainerAnimComplete_delayed(): void {
        this.onContainerAnimCompleteCallback(this);
        this.onContainerAnimCompleteCallback = null;
    }

    /**
     * Clears all references.
     *
     * @method destroy
     */
    destroy(): void {
        if (this.container) {
            this.engine = null;
            this.textures = null;
            // this.removeChild(this.container);
            // this.container.textures = null;
            this.container.onComplete = null;
            this.container = null;
        }
    }
}
