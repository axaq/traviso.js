/**
 * @author Hakan Karlidag - @axaq
 */
import { EngineView } from '../map/EngineView';
import { ObjectView } from '../map/ObjectView';
import { GridNode } from '../pathFinding/GridNode';
import { EasingFunction, EasingType } from '../utils/easing';
import { ColumnRowPair, PositionPair } from '../utils/map';
export interface IMovable extends ObjectView {
    speedUnit: PositionPair;
    speedMagnitude: number;
    currentPath: GridNode[];
    currentPathStep: number;
    currentTarget: PositionPair;
    currentTargetTile: GridNode;
    currentReachThresh: number;
    prevPosition: PositionPair;
}
export interface ITween {
    target: {
        [key: string]: unknown;
    };
    duration: number;
    delay: number;
    easingFunc: EasingFunction;
    overwrite: boolean;
    onComplete: () => void;
    totalFrames: number;
    currentFrame: number;
    vars: {
        [key: string]: {
            b: number;
            c: number;
        };
    };
}
export interface ITweenTarget {
    [key: string]: unknown;
    tweens?: ITween[];
}
/**
 * Holds and manages all the logic for tween animations and map-object movement on the map.
 * This is created and used by EngineView instances.
 *
 * @class MoveEngine
 * @constructor
 * @param engine {EngineView} the engine instance that the animations will perform on
 * @param [defaultSpeed=3] {Number} default speed for the map-objects to be used when they move on map
 */
export declare class MoveEngine {
    /**
     * A reference to the engine view that uses this move engine.
     * @property {EngineView} engine
     * @protected
     */
    private engine;
    /**
     * The speed value to be used for object movements if not defined specifically.
     * @property {Number} DEFAULT_SPEED
     * @protected
     * @default 3
     */
    private DEFAULT_SPEED;
    /**
     * Specifies if the move-engine will process the object movements.
     * @property {Boolean} activeForMovables
     * @protected
     */
    private activeForMovables;
    /**
     * Specifies if the move-engine will process the tweens.
     * @property {Boolean} activeForTweens
     * @protected
     */
    private activeForTweens;
    /**
     * Specifies if the move-engine will process the tweens and object movements.
     * @property {Boolean} processFrame
     * @protected
     */
    private processFrame;
    /**
     * The list to store current map-objects in move.
     * @property {Array(ObjectView)} movables
     * @protected
     */
    private movables;
    /**
     * The list to store targets for the current tweens.
     * @property {Array(Object)} tweenTargets
     * @protected
     */
    private tweenTargets;
    /**
     * Used to calculate how many frames a tween will take to process.
     * @property {Number} fps
     * @protected
     */
    private fps;
    private ticker;
    private processFunc;
    constructor(engine: EngineView, defaultSpeed?: number);
    /**
     * Adds a single tween for the given object.
     *
     * @method addTween
     * @param o {Object} the object to add tween animation to
     * @param duration {Number} the duration of the tween animation in seconds
     * @param {{ [key: string]: number }} vars the object defining which properties of the target object will be animated
     * @param [delay=0] {Number} the amount of waiting before the tween animation starts, in seconds
     * @param [easing="linear"] {String} type of the easing
     * @param [overwrite=false] {Boolean} if the other tween animations assigned to the same object are going to be killed
     * @param [onComplete=null] {Function} callback function to be called after the tween animation finished
     */
    addTween(o: ITweenTarget, duration: number, vars: {
        [key: string]: number;
    }, delay?: number, easing?: EasingType, overwrite?: boolean, onComplete?: () => void): void;
    /**
     * Removes a single tween from the given object.
     *
     * @method removeTween
     * @param o {Object} the object to remove the tween animation from
     * @param t {Object} the tween to be removed from the object
     * @return {Boolean} if the tween is found and removed
     */
    removeTween(o: ITweenTarget, t: ITween): boolean;
    /**
     * Removes and kills all tweens assigned to the given object.
     *
     * @method killTweensOf
     * @param o {Object} the object to remove the tween animations from
     * @return {Boolean} if any tween is found and removed from the object specified
     */
    killTweensOf(o: ITweenTarget): boolean;
    /**
     * Removes and kills all the tweens in operation currently.
     *
     * @method removeAllTweens
     */
    private removeAllTweens;
    /**
     * Adds a map-object as movable to the engine.
     *
     * @method addMovable
     * @param o {ObjectView} the map-object to add as movable
     */
    addMovable(o: IMovable): void;
    /**
     * Removes a map-object from the current movables list.
     *
     * @method removeMovable
     * @param o {ObjectView} the map-object to remove
     * @return {Boolean} if the map-object is removed
     */
    removeMovable(o: IMovable): boolean;
    /**
     * Removes all movables.
     *
     * @method removeAllMovables
     */
    private removeAllMovables;
    /**
     * Changes the current path of a map-object.
     *
     * @method addNewPathToObject
     * @param o {ObjectView} the map-object to add the path to
     * @param path {Array(Object)} the new path
     * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
     */
    addNewPathToObject(o: IMovable, path: GridNode[], speed: number): void;
    /**
     * Prepares a map-object for movement.
     *
     * @method prepareForMove
     * @param o {ObjectView} the movable map-object
     * @param path {Array(Object)} the path for the object
     * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
     */
    prepareForMove(o: IMovable, path: GridNode[], speed?: number): void;
    /**
     * Sets movement specific parameters for the map-object according to target location.
     *
     * @method setMoveParameters
     * @param o {ObjectView} the movable map-object
     * @param pos {Object} target location
     * @param pos.r {Object} the row index of the map location
     * @param pos.c {Object} the column index of the map location
     */
    setMoveParameters(o: IMovable, pos: ColumnRowPair): void;
    /**
     * Method that precesses a single frame.
     *
     * @method run
     * @private
     */
    private run;
    /**
     * Clears all references and stops all animations and tweens.
     *
     * @method destroy
     */
    destroy(): void;
}
