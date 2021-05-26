import { DisplayObject } from 'pixi.js';
import { TPositionPair } from './map';

/**
 * Checks if the value existy.
 *
 * @method existy
 * @for TRAVISO
 * @static
 * @param value {Object} value to check
 * @return {Boolean} if the value existy
 */
export const existy = (value: unknown): boolean => {
    return value !== null && value !== undefined;
};

/**
 * Linear maps a given number in a source range to a target range
 *
 * @method mathMap
 * @for TRAVISO
 * @static
 * @param v {Number} value to map
 * @param min1 {Number} minimum value of the source range
 * @param max1 {Number} maximum value of the source range
 * @param min2 {Number} minimum value of the target range
 * @param max2 {Number} maximum value of the target range
 * @param [noOutliers=false] {Boolean} If the outlier values won't be processed, default false
 * @return {Number} mapped value according to target range
 */
export const mathMap = (
    v: number,
    min1: number,
    max1: number,
    min2: number,
    max2: number,
    noOutliers: boolean
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
 * @method dotProduct
 * @for TRAVISO
 * @static
 * @param v1 {Object} first vector
 * @param v1.x {Number} x component
 * @param v1.y {Number} y component
 * @param v2 {Object} second vector
 * @param v2.x {Number} x component
 * @param v2.y {Number} y component
 * @return {Number} dot product of two vectors
 */
export const dotProduct = (v1: TPositionPair, v2: TPositionPair): number => {
    return v1.x * v2.x + v1.y * v2.y;
};

/**
 * Produces unit vector of a given vector.
 *
 * @method getUnit
 * @for TRAVISO
 * @static
 * @param v {Object} source vector
 * @param v.x {Number} x component
 * @param v.y {Number} y component
 * @return {Object} unit vector
 */
export const getUnit = (v: TPositionPair): TPositionPair => {
    const m = Math.sqrt(v.x * v.x + v.y * v.y);
    return { x: v.x / m, y: v.y / m };
};

/**
 * Checks if the given point is the polygon defined by the vertices.
 *
 * @method isInPolygon
 * @for TRAVISO
 * @static
 * @param gp {Object} point to check
 * @param gp.x {Number} x component
 * @param gp.y {Number} y component
 * @param vertices {Array(Array(Number))} array containing the vertices of the polygon
 * @return {Boolean} if the point is inside the polygon
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
 * @method getDist
 * @for TRAVISO
 * @static
 * @param p1 {Object} first point
 * @param p1.x {Number} x component
 * @param p1.y {Number} y component
 * @param p2 {Object} second point
 * @param p2.x {Number} x component
 * @param p2.y {Number} y component
 * @return {Boolean} the distance between two points
 */
export const getDist = (p1: TPositionPair, p2: TPositionPair): number => {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
};

/**
 * Calculates the global point with respect to given local point and scope.
 *
 * @method localToGlobal
 * @for TRAVISO
 * @static
 * @param lp {Object} local point
 * @param lp.x {Number} x component
 * @param lp.y {Number} y component
 * @param scope {Object} local scope
 * @return {Boolean} global point
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
 * @method globalToLocal
 * @for TRAVISO
 * @static
 * @param gp {Object} global point
 * @param gp.x {Number} x component
 * @param gp.y {Number} y component
 * @param scope {Object} local scope
 * @return {Boolean} local point
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
