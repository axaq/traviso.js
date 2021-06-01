import { Container, AnimatedSprite } from 'pixi.js';
import { EngineView } from './EngineView';
import { existy } from '../utils/calculations';
import { TDirection, DIRECTIONS } from '../utils/constants';
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
 */
export class ObjectView extends Container {
    /**
     * A reference to the engine view that the map-object sits in.
     * @property {EngineView} engine
     * @private
     * @internal
     */
    private _engine: EngineView;
    /**
     * Type-id of the map-object as defined in the json file.
     * @property
     * @public
     */
    private type: string;
    /**
     * Defines if the map-object is movable onto by other map-objects.
     * @property
     * @public
     */
    public isMovableTo: boolean;
    /**
     * Defines if the map-object is interactive/selectable.
     * @property
     * @public
     */
    public isInteractive: boolean;
    /**
     * Number of tiles that map-object covers horizontally on the isometric map
     * @property
     * @public
     */
    public columnSpan: number;
    /**
     * Number of tiles that map-object covers vertically on the isometric map
     * @property
     * @public
     */
    public rowSpan: number;

    /**
     * A dictionary for all the textures defined for the map-object.
     * @property
     * @private
     */
    private _textures: ObjectInfoTextures;

    /**
     * A dictionary for interaction offset points for each visual if defined in the map data file.
     * @property
     * @private
     */
    private _interactionOffsets: ObjectInfoInteractionOffsets;

    /**
     * If true doesn't allow transparency change on this object
     * @property
     * @public
     */
    public noTransparency: boolean;
    /**
     * Defines if the object is a floor object or not
     * @property
     * @public
     */
    public isFloorObject: boolean;
    /**
     * Interaction offset points for the active visual.
     * @property
     * @public
     */
    public currentInteractionOffset: TColumnRowPair;
    /**
     * Current direction of the object.
     * @property
     * @public
     */
    public currentDirection: TDirection;

    /**
     * Defines if the map-object is movable onto by other map-objects.
     * @property
     * @private
     * @internal
     */
    private _container: AnimatedSprite;
    /**
     * Position of the object in terms of column and row index.
     * @property
     * @public
     */
    public mapPos: TColumnRowPair;

    /**
     * @property
     * @function
     * @private
     * @internal
     */
    private onContainerAnimCompleteCallback: (objectView: ObjectView) => unknown;
    /**
     * @property
     * @function
     * @private
     * @internal
     */
    private onContainerAnimComplete_delayed_binded: () => void;
    /**
     * @property
     * @function
     * @private
     * @internal
     */
    private onContainerAnimComplete_binded: () => void;

    /**
     * Visual class constructor for the map-objects.
     *
     * @constructor
     *
     * @param engine {EngineView} the engine instance that the map-object sits in, required
     * @param type {number} type-id of the object as defined in the JSON file
     * @param animSpeed {number} animation speed for the animated visuals, default 0.5
     */
    constructor(engine: EngineView, type: string, animSpeed: number = 0.5) {
        super();

        this.onContainerAnimComplete_delayed_binded = this.onContainerAnimComplete_delayed.bind(this);
        this.onContainerAnimComplete_binded = this.onContainerAnimComplete.bind(this);

        this._engine = engine;
        this.type = type;

        const info: IObjectInfo = getObjectInfo(this._engine, this.type);
        this.isMovableTo = info.m;
        this.isInteractive = info.i;
        this.interactive = this.interactiveChildren = false;
        this.isFloorObject = info.f;
        this.noTransparency = info.nt;
        this.rowSpan = info.rowSpan;
        this.columnSpan = info.columnSpan;
        const xAnchor = this.rowSpan / (this.columnSpan + this.rowSpan);
        this._textures = info.t;
        this._interactionOffsets = info.io;
        this.currentInteractionOffset = this._interactionOffsets.idle;

        this._container = new AnimatedSprite(this._textures.idle);
        this._container.interactive = this._container.interactiveChildren = false;
        this._container.anchor.x = xAnchor;
        this._container.anchor.y = 1;
        this.addChild(this._container);
        this.animSpeed = animSpeed;
        this._container.gotoAndStop(0);
    }

    /**
     * Animation speed for the animated visuals included in the map-object visuals.
     *
     * @property
     * @default 0.5
     */
    public get animSpeed(): number {
        return this._container.animationSpeed;
    }
    public set animSpeed(value: number) {
        this._container.animationSpeed = existy(value) && value > 0 ? value : 0.5;
    }

    /**
     * Changes the map-object's texture(s) according to the specified direction-id and the state of the map-object (moving or stationary).
     *
     * @method
     * @function
     * @public
     *
     * @param direction {TDirection} direction-id as defined in `TRAVISO.DIRECTIONS`
     * @param moving {boolean} if the requested visuals are for moving or stationary state, default `false`
     * @param stopOnFirstFrame {boolean} if true stops on the first frame after changing the visuals, default `false`
     * @param noLoop {boolean} if true the animation will not loop after the first run, default `false`
     * @param onAnimComplete {Function} callback function to call if 'noLoop' is true after the first run of the animation, default `null`
     * @param animSpeed {number} animation speed for the animated visuals, stays the same if not defined, default `null`
     */
    public changeVisualToDirection(
        direction: TDirection,
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
     * @method
     * @function
     * @public
     * @internal
     *
     * @param vId {string} visual-id
     * @param stopOnFirstFrame {boolean} if true stops on the first frame after changing the visuals, default `false`
     * @param noLoop {boolean} if true the animation will not loop after the first run, default `false`
     * @param onAnimComplete {Function} callback function to call if 'noLoop' is true after the first run of the animation, default `null`
     * @param animSpeed {number} animation speed for the animated visuals, stays the same if not defined, default `null`
     * @return {boolean} `true` if the visual-id was valid and the visual has changed without errors
     */
    public changeVisual(
        vId: ObjectVisualKey,
        stopOnFirstFrame: boolean = false,
        noLoop: boolean = false,
        onAnimComplete: (objectView: ObjectView) => unknown = null,
        animSpeed: number = null
    ): boolean {
        if (!this._textures[vId]) {
            // trace("!!! No textures defined for vId: " + vId);
            return false;
        }

        this.currentInteractionOffset = this._interactionOffsets[vId];

        if (this._container.textures === this._textures[vId] && !noLoop) {
            this._container.loop = !noLoop;
            if (existy(animSpeed) && animSpeed > 0) {
                this.animSpeed = animSpeed;
            }
            return true;
        }

        this._container.textures = this._textures[vId];

        if (!stopOnFirstFrame && this._textures[vId].length > 1) {
            this._container.loop = !noLoop;
            if (noLoop && onAnimComplete) {
                this.onContainerAnimCompleteCallback = onAnimComplete;
                this._container.onComplete = this.onContainerAnimComplete_binded;
            }
            if (existy(animSpeed) && animSpeed > 0) {
                this.animSpeed = animSpeed;
            }
            this._container.gotoAndPlay(0);
        } else {
            this._container.gotoAndStop(0);
        }

        if (this._engine.objectUpdateCallback) {
            this._engine.objectUpdateCallback(this);
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
     * @method
     * @function
     * @public
     */
    public destroy(): void {
        if (this._container) {
            this._engine = null;
            this._textures = null;
            // this.removeChild(this._container);
            // this._container.textures = null;
            this._container.onComplete = null;
            this._container = null;
        }
    }
}
