export type EasingType =
    | 'easeInOut'
    | 'easeInOutQuad'
    | 'Quad.easeInOut'
    | 'easeIn'
    | 'easeInQuad'
    | 'Quad.easeIn'
    | 'easeOut'
    | 'easeOutQuad'
    | 'Quad.easeOut'
    | 'linear';
export type EasingFunction = (t: number, b: number, c: number, d: number) => number;
/**
 * Returns the proper easing method to use depending on the easing id specified.
 *
 * @method getEasingFunc
 * @private
 * @param e {String} the easing id
 * @return {Function} the easing method to use
 */
export const getEasingFunc = (e: EasingType): EasingFunction => {
    if (e === 'easeInOut' || e === 'easeInOutQuad' || e === 'Quad.easeInOut') {
        return easeInOutQuad;
    } else if (e === 'easeIn' || e === 'easeInQuad' || e === 'Quad.easeIn') {
        return easeInQuad;
    } else if (e === 'easeOut' || e === 'easeOutQuad' || e === 'Quad.easeOut') {
        return easeOutQuad;
    } else {
        return linearTween;
    }
};

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
export const linearTween = (t: number, b: number, c: number, d: number): number => {
    return (c * t) / d + b;
};
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
export const easeInQuad = (t: number, b: number, c: number, d: number): number => {
    t /= d;
    return c * t * t + b;
};

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
export const easeOutQuad = (t: number, b: number, c: number, d: number): number => {
    t /= d;
    return -c * t * (t - 2) + b;
};
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
export const easeInOutQuad = (t: number, b: number, c: number, d: number): number => {
    t /= d / 2;
    if (t < 1) {
        return (c / 2) * t * t + b;
    }
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
};
