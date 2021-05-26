/**
 * @author Hakan Karlidag - @axaq
 */

import { Ticker } from 'pixi.js';
import { trace } from '../utils/trace';
import { EngineView } from '../map/EngineView';
import { ObjectView } from '../map/ObjectView';
import { GridNode } from '../pathFinding/GridNode';
import { getDist, getUnit } from '../utils/calculations';
import { EasingFunction, EasingType, getEasingFunc } from '../utils/easing';
import { TColumnRowPair, TPositionPair } from '../utils/map';

export interface IMovable extends ObjectView {
    // [key: string]: any,
    speedUnit: TPositionPair;
    speedMagnitude: number;
    currentPath: GridNode[];
    currentPathStep: number;
    currentTarget: TPositionPair;
    currentTargetTile: GridNode;
    currentReachThresh: number;
    prevPosition: TPositionPair;
}

export interface ITween {
    target: { [key: string]: unknown };
    duration: number;
    delay: number;
    easingFunc: EasingFunction;
    overwrite: boolean;
    onComplete: () => void;
    totalFrames: number;
    currentFrame: number;
    vars: { [key: string]: { b: number; c: number } };
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
export class MoveEngine {
    /**
     * A reference to the engine view that uses this move engine.
     * @property {EngineView} engine
     * @protected
     */
    private engine: EngineView;

    /**
     * The speed value to be used for object movements if not defined specifically.
     * @property {Number} DEFAULT_SPEED
     * @protected
     * @default 3
     */
    private DEFAULT_SPEED: number;
    /**
     * Specifies if the move-engine will process the object movements.
     * @property {Boolean} activeForMovables
     * @protected
     */
    private activeForMovables: boolean = false;
    /**
     * Specifies if the move-engine will process the tweens.
     * @property {Boolean} activeForTweens
     * @protected
     */
    private activeForTweens: boolean = false;
    /**
     * Specifies if the move-engine will process the tweens and object movements.
     * @property {Boolean} processFrame
     * @protected
     */
    private processFrame: boolean = true;
    /**
     * The list to store current map-objects in move.
     * @property {Array(ObjectView)} movables
     * @protected
     */
    private movables: IMovable[] = [];
    /**
     * The list to store targets for the current tweens.
     * @property {Array(Object)} tweenTargets
     * @protected
     */
    private tweenTargets: ITweenTarget[] = [];
    /**
     * Used to calculate how many frames a tween will take to process.
     * @property {Number} fps
     * @protected
     */
    private fps: number = 60;

    private ticker: Ticker;
    private processFunc: () => void;

    constructor(engine: EngineView, defaultSpeed: number = 3) {
        this.engine = engine;
        this.DEFAULT_SPEED = defaultSpeed;

        this.processFunc = this.run.bind(this);
        this.ticker = new Ticker();
        this.ticker.add(this.processFunc);
        this.ticker.start();
    }

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
    public addTween(
        o: ITweenTarget,
        duration: number,
        vars: { [key: string]: number },
        delay: number = 0,
        easing: EasingType = 'linear',
        overwrite: boolean = false,
        onComplete: () => void = null
    ): void {
        let v: { [key: string]: { b: number; c: number } } = null;
        for (const prop in vars) {
            if (o[prop] !== vars[prop]) {
                if (!v) {
                    v = {};
                }
                v[prop] = { b: o[prop] as number, c: vars[prop] - (o[prop] as number) };
            }
        }

        if (v) {
            const t: ITween = {
                target: o,
                duration: duration,
                delay: Number(delay) || 0,
                easingFunc: getEasingFunc(easing),
                overwrite: overwrite || false,
                onComplete: onComplete || null,
                totalFrames: duration * this.fps,
                currentFrame: 0,
                vars: v,
            };

            const idx = this.tweenTargets.indexOf(o);
            if (idx >= 0) {
                let tweens: ITween[] = o.tweens;
                if (!tweens) {
                    tweens = [];
                }
                if (t.overwrite) {
                    for (let i = 0; i < tweens.length; i++) {
                        tweens[i] = null;
                    }
                    tweens = [];
                }

                tweens[tweens.length] = t;
                o.tweens = tweens;
            } else {
                o.tweens = [t];
                this.tweenTargets[this.tweenTargets.length] = o;
            }

            if (this.tweenTargets.length > 0 && !this.activeForTweens) {
                this.activeForTweens = true;
            }
        }
    }

    /**
     * Removes a single tween from the given object.
     *
     * @method removeTween
     * @param o {Object} the object to remove the tween animation from
     * @param t {Object} the tween to be removed from the object
     * @return {Boolean} if the tween is found and removed
     */
    public removeTween(o: ITweenTarget, t: ITween): boolean {
        let targetRemoved = false;

        if (o && t) {
            const idx = this.tweenTargets.indexOf(o);
            if (idx >= 0) {
                if (this.tweenTargets[idx].tweens && this.tweenTargets[idx].tweens.length > 0) {
                    const tweens = this.tweenTargets[idx].tweens;
                    const idx2 = tweens.indexOf(t);
                    if (idx2 >= 0) {
                        t.onComplete = null;
                        t.easingFunc = null;
                        t.target = null;

                        tweens.splice(idx2, 1);
                        if (tweens.length === 0) {
                            this.tweenTargets.splice(idx, 1);
                            targetRemoved = true;
                        }
                    } else {
                        throw new Error('No tween defined for this object');
                    }
                } else {
                    throw new Error('No tween defined for this object');
                }
            } else {
                throw new Error('No tween target defined for this object');
            }

            if (this.tweenTargets.length === 0) {
                this.activeForTweens = false;
            }
        }

        return targetRemoved;
    }

    /**
     * Removes and kills all tweens assigned to the given object.
     *
     * @method killTweensOf
     * @param o {Object} the object to remove the tween animations from
     * @return {Boolean} if any tween is found and removed from the object specified
     */
    public killTweensOf(o: ITweenTarget): boolean {
        let targetRemoved = false;

        const idx = this.tweenTargets.indexOf(o);
        if (idx >= 0) {
            if (this.tweenTargets[idx].tweens && this.tweenTargets[idx].tweens.length > 0) {
                const tweens = this.tweenTargets[idx].tweens;
                for (let j = 0; j < tweens.length; j++) {
                    tweens[j].onComplete = null;
                    tweens[j].easingFunc = null;
                    tweens[j].target = null;
                    tweens[j] = null;
                }
                this.tweenTargets[idx].tweens = null;
            }

            this.tweenTargets.splice(idx, 1);

            targetRemoved = true;
        }

        if (this.tweenTargets.length === 0) {
            this.activeForTweens = false;
        }

        return targetRemoved;
    }

    /**
     * Removes and kills all the tweens in operation currently.
     *
     * @method removeAllTweens
     */
    private removeAllTweens(): void {
        this.activeForTweens = false;

        let tweens, i, j;
        const len = this.tweenTargets.length;
        for (i = 0; i < len; i++) {
            tweens = this.tweenTargets[i].tweens;
            for (j = 0; j < tweens.length; j++) {
                tweens[j].onComplete = null;
                tweens[j].easingFunc = null;
                tweens[j].target = null;
                tweens[j] = null;
            }
            this.tweenTargets[i].tweens = null;
            this.tweenTargets[i] = null;
        }

        this.tweenTargets = [];
    }

    /**
     * Adds a map-object as movable to the engine.
     *
     * @method addMovable
     * @param o {ObjectView} the map-object to add as movable
     */
    public addMovable(o: IMovable): void {
        if (this.movables.indexOf(o) >= 0) {
            return;
        }

        this.movables[this.movables.length] = o;

        if (this.movables.length > 0 && !this.activeForMovables) {
            this.activeForMovables = true;
        }

        // all movables needs to have the following variables:
        // speedMagnitude, speedUnit (more to come...)

        // NOTE: might be a good idea to add all necessary parameters to the object here
    }

    /**
     * Removes a map-object from the current movables list.
     *
     * @method removeMovable
     * @param o {ObjectView} the map-object to remove
     * @return {Boolean} if the map-object is removed
     */
    public removeMovable(o: IMovable): boolean {
        const idx = this.movables.indexOf(o);
        if (idx !== -1) {
            o.speedUnit = { x: 0, y: 0 };
            this.movables.splice(idx, 1);
        }
        if (this.movables.length === 0) {
            this.activeForMovables = false;
        }
        // TODO: might be a good idea to remove/reset all related parameters from the object here

        return idx !== -1;
    }

    /**
     * Removes all movables.
     *
     * @method removeAllMovables
     */
    private removeAllMovables(): void {
        this.activeForMovables = false;

        const len = this.movables.length;
        for (let i = 0; i < len; i++) {
            this.movables[i] = null;
        }

        this.movables = [];
    }

    /**
     * Changes the current path of a map-object.
     *
     * @method addNewPathToObject
     * @param o {ObjectView} the map-object to add the path to
     * @param path {Array(Object)} the new path
     * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
     */
    public addNewPathToObject(o: IMovable, path: GridNode[], speed: number): void {
        if (o.currentPath && o.currentTarget) {
            path[path.length] = o.currentPath[o.currentPathStep];
        }
        o.currentPath = path;
        o.currentPathStep = o.currentPath.length - 1;
        o.speedMagnitude = speed || o.speedMagnitude || this.DEFAULT_SPEED;
    }

    /**
     * Prepares a map-object for movement.
     *
     * @method prepareForMove
     * @param o {ObjectView} the movable map-object
     * @param path {Array(Object)} the path for the object
     * @param [speed=null] {Number} speed of the map-object to be used during movement, if not defined it uses previous speed or the MoveEngine's default speed, default null
     */
    public prepareForMove(o: IMovable, path: GridNode[], speed: number = null): void {
        o.currentPath = path;
        o.currentPathStep = o.currentPath.length - 1;
        o.speedMagnitude = speed || o.speedMagnitude || this.DEFAULT_SPEED;
    }

    /**
     * Sets movement specific parameters for the map-object according to target location.
     *
     * @method setMoveParameters
     * @param o {ObjectView} the movable map-object
     * @param pos {Object} target location
     * @param pos.r {Object} the row index of the map location
     * @param pos.c {Object} the column index of the map location
     */
    public setMoveParameters(o: IMovable, pos: TColumnRowPair): void {
        const px = this.engine.getTilePosXFor(pos.r, pos.c);
        const py = this.engine.getTilePosYFor(pos.r, pos.c) + this.engine.tileHalfHeight;

        o.speedUnit = getUnit({ x: px - o.position.x, y: py - o.position.y });

        o.currentTarget = { x: px, y: py };
        o.currentReachThresh = Math.ceil(
            Math.sqrt(o.speedUnit.x * o.speedUnit.x + o.speedUnit.y * o.speedUnit.y) * o.speedMagnitude
        );
    }

    /**
     * Method that precesses a single frame.
     *
     * @method run
     * @private
     */
    private run(): void {
        // NOTE: Write an alternative with a real time driven animator

        if (this.processFrame) {
            let len: number, o: IMovable, i: number;
            if (this.activeForMovables) {
                len = this.movables.length;

                let dist;
                for (i = 0; i < len; i++) {
                    o = this.movables[i];

                    // move object

                    // speed vector (magnitude and direction)

                    o.prevPosition = { x: o.position.x, y: o.position.y };

                    // check for target reach
                    if (o.currentTarget) {
                        dist = getDist(o.position, o.currentTarget);
                        if (dist <= o.currentReachThresh) {
                            // reached to the target
                            o.position.x = o.currentTarget.x;
                            o.position.y = o.currentTarget.y;

                            this.engine.onObjMoveStepEnd(o);
                            i--;
                            len--;
                            continue;
                        }
                    }

                    o.position.x += o.speedMagnitude * o.speedUnit.x;
                    o.position.y += o.speedMagnitude * o.speedUnit.y;

                    // check for tile change
                    this.engine.checkForTileChange(o);
                    this.engine.checkForFollowCharacter(o);

                    // check for direction change
                }

                // will need a different loop to process crashes
                // for (i=0; i < len; i++)
                // {
                // o = this.movables[i];
                // }
            }

            if (this.activeForTweens) {
                // and a loop for tween animations
                len = this.tweenTargets.length;
                let t: ITween,
                    tt: ITweenTarget,
                    tweens: ITween[],
                    j: number,
                    vars: { [key: string]: { b: number; c: number } };
                for (i = 0; i < len; i++) {
                    tt = this.tweenTargets[i];
                    tweens = tt.tweens;
                    for (j = 0; j < tweens.length; j++) {
                        t = tweens[j];
                        t.currentFrame++;
                        vars = t.vars;
                        for (const prop in vars) {
                            tt[prop] = t.easingFunc(t.currentFrame, vars[prop].b, vars[prop].c, t.totalFrames);
                        }

                        if (t.currentFrame >= t.totalFrames) {
                            if (t.onComplete) {
                                t.onComplete();
                            }
                            if (this.removeTween(tt, t)) {
                                i--;
                                len--;
                            }
                            j--;
                        }
                    }
                }
            }
        }
    }

    /**
     * Clears all references and stops all animations and tweens.
     *
     * @method destroy
     */
    public destroy(): void {
        trace('MoveEngine destroy');

        this.processFrame = false;

        if (this.ticker) {
            this.ticker.stop();
        }

        this.removeAllMovables();
        this.removeAllTweens();
        this.movables = null;
        this.tweenTargets = null;
        this.engine = null;
        this.ticker = null;
    }
}
