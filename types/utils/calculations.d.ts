import { DisplayObject } from 'pixi.js';
import { PositionPair } from './map';
/**
 * Checks if the value existy.
 *
 * @method existy
 * @for TRAVISO
 * @static
 * @param value {Object} value to check
 * @return {Boolean} if the value existy
 */
export declare const existy: (value: unknown) => boolean;
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
export declare const mathMap: (v: number, min1: number, max1: number, min2: number, max2: number, noOutliers: boolean) => number;
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
export declare const dotProduct: (v1: PositionPair, v2: PositionPair) => number;
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
export declare const getUnit: (v: PositionPair) => PositionPair;
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
export declare const isInPolygon: (gp: PositionPair, vertices: number[][]) => boolean;
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
export declare const getDist: (p1: PositionPair, p2: PositionPair) => number;
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
export declare const localToGlobal: (lp: PositionPair, scope: DisplayObject) => PositionPair;
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
export declare const globalToLocal: (gp: PositionPair, scope: DisplayObject) => PositionPair;
