export declare type EasingType = 'easeInOut' | 'easeInOutQuad' | 'Quad.easeInOut' | 'easeIn' | 'easeInQuad' | 'Quad.easeIn' | 'easeOut' | 'easeOutQuad' | 'Quad.easeOut' | 'linear';
export declare type EasingFunction = (t: number, b: number, c: number, d: number) => number;
/**
 * Returns the proper easing method to use depending on the easing id specified.
 *
 * @method getEasingFunc
 * @private
 * @param e {String} the easing id
 * @return {Function} the easing method to use
 */
export declare const getEasingFunc: (e: EasingType) => EasingFunction;
/**
 * Linear tween calculation.
 *
 * @method linearTween
 * @private
 * @param t {Number} current time
 * @param b {Number} initial value
 * @param c {Number} difference with the target value
 * @param d {Number} total time
 * @return {Number} result of the calculation
 */
export declare const linearTween: (t: number, b: number, c: number, d: number) => number;
/**
 * Quadratic ease-in tween calculation.
 *
 * @method easeInQuad
 * @private
 * @param t {Number} current time
 * @param b {Number} initial value
 * @param c {Number} difference with the target value
 * @param d {Number} total time
 * @return {Number} result of the calculation
 */
export declare const easeInQuad: (t: number, b: number, c: number, d: number) => number;
/**
 * Quadratic ease-out tween calculation.
 *
 * @method easeOutQuad
 * @private
 * @param t {Number} current time
 * @param b {Number} initial value
 * @param c {Number} difference with the target value
 * @param d {Number} total time
 * @return {Number} result of the calculation
 */
export declare const easeOutQuad: (t: number, b: number, c: number, d: number) => number;
/**
 * Quadratic ease-in-out tween calculation.
 *
 * @method easeInOutQuad
 * @private
 * @param t {Number} current time
 * @param b {Number} initial value
 * @param c {Number} difference with the target value
 * @param d {Number} total time
 * @return {Number} result of the calculation
 */
export declare const easeInOutQuad: (t: number, b: number, c: number, d: number) => number;
