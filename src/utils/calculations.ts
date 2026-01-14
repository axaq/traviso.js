import { DisplayObject } from 'pixi.js';
import { TPositionPair } from './map';

/**
 * Checks if the value existy.
 *
 * @memberof TRAVISO
 * @for TRAVISO
 *
 * @method
 * @function
 * @public
 * @static
 *
 * @param value {unknown} value to check
 * @return {boolean} if the value existy or not
 */
export const existy = (value: unknown): boolean => {
    return value !== null && value !== undefined;
};

/**
 * Linear maps a given number in a source range to a target range
 *
 * @memberof TRAVISO
 * @for TRAVISO
 *
 * @method
 * @function
 * @public
 * @static
 *
 * @param v {number} value to map
 * @param min1 {number} minimum value of the source range
 * @param max1 {number} maximum value of the source range
 * @param min2 {number} minimum value of the target range
 * @param max2 {number} maximum value of the target range
 * @param noOutliers {boolean} If the outlier values won't be processed, default false
 * @return {number} mapped value according to target range
 */
export const mathMap = (
    v: number,
    min1: number,
    max1: number,
    min2: number,
    max2: number,
    noOutliers: boolean = false
): number => {
    if (noOutliers) {
        if (v < min1) {
            return min2;
        } else if (v > max1) {
            return max2;
        }
    }
    return min2 + ((max2 - min2) * (v - min1)) / (max1 - min1);
};

/**
 * Produces dot product of two vectors.
 *
 * @memberof TRAVISO
 * @for TRAVISO
 *
 * @method
 * @function
 * @public
 * @static
 *
 * @param v1 {TPositionPair} first vector
 * @param v2 {TPositionPair} second vector
 * @return {number} dot product of two vectors
 */
export const dotProduct = (v1: TPositionPair, v2: TPositionPair): number => {
    return v1.x * v2.x + v1.y * v2.y;
};

/**
 * Produces unit vector of a given vector.
 *
 * @memberof TRAVISO
 * @for TRAVISO
 *
 * @method
 * @function
 * @public
 * @static
 *
 * @param v {TPositionPair} source vector
 * @return {TPositionPair} unit vector
 */
export const getUnit = (v: TPositionPair): TPositionPair => {
    const m = Math.sqrt(v.x * v.x + v.y * v.y);
    return { x: v.x / m, y: v.y / m };
};

/**
 * Checks if the given point is inside the polygon defined by the vertices.
 *
 * @memberof TRAVISO
 * @for TRAVISO
 *
 * @method
 * @function
 * @public
 * @static
 *
 * @param gp {TPositionPair} point to check
 * @param vertices {Array(Array(Number))} array containing the vertices of the polygon
 * @return {boolean} if the point is inside the polygon
 */
export const isInPolygon = (gp: TPositionPair, vertices: number[][]): boolean => {
    const testY = gp.y;
    const testX = gp.x;
    const nVert = vertices.length;
    let i,
        j,
        c = false;
    for (i = 0, j = nVert - 1; i < nVert; j = i++) {
        if (
            vertices[i][1] > testY !== vertices[j][1] > testY &&
            testX <
                ((vertices[j][0] - vertices[i][0]) * (testY - vertices[i][1])) / (vertices[j][1] - vertices[i][1]) +
                    vertices[i][0]
        ) {
            c = !c;
        }
    }
    return c;
};

/**
 * Calculates the distance between two points.
 *
 * @memberof TRAVISO
 * @for TRAVISO
 *
 * @method
 * @function
 * @public
 * @static
 *
 * @param p1 {TPositionPair} first point
 * @param p2 {TPositionPair} second point
 * @return {number} the distance between two points
 */
export const getDist = (p1: TPositionPair, p2: TPositionPair): number => {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
};

/**
 * Calculates the global point with respect to given local point and scope.
 *
 * @method
 * @function
 * @private
 * @internal
 * @static
 *
 * @param lp {TPositionPair} local point
 * @param scope {PIXI.DisplayObject} local scope
 * @return {TPositionPair} global point
 */
export const localToGlobal = (lp: TPositionPair, scope: DisplayObject): TPositionPair => {
    let sX = scope.position.x + lp.x;
    let sY = scope.position.y + lp.y;

    let p = scope.parent;
    while (p) {
        sX += p.position.x;
        sY += p.position.y;
        p = p.parent;
    }

    return {
        x: sX,
        y: sY,
    };
};

/**
 * Calculates the local point with respect to given global point and local scope.
 *
 * @method
 * @function
 * @private
 * @internal
 * @static
 *
 * @param gp {TPositionPair} global point
 * @param scope {PIXI.DisplayObject} local scope
 * @return {TPositionPair} local point
 */
export const globalToLocal = (gp: TPositionPair, scope: DisplayObject): TPositionPair => {
    let sX = scope.position.x;
    let sY = scope.position.y;

    let p = scope.parent;
    while (p) {
        sX += p.position.x;
        sY += p.position.y;
        p = p.parent;
    }

    return {
        x: gp.x - sX,
        y: gp.y - sY,
    };
};
