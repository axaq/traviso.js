/**
 * @author Hakan Karlidag - @axaq
 */
import { GridNode } from './GridNode';
export declare type PathFindingHeuristicFunction = (pos0: GridNode, pos1: GridNode) => number;
export declare type PathFindingSearchOptions = {
    heuristic?: PathFindingHeuristicFunction;
    closest?: boolean;
};
export declare type PathFindingOptions = {
    diagonal?: boolean;
    closest?: boolean;
};
/**
 * Includes all path finding logic.
 *
 * @class PathFinding
 * @constructor
 * @param mapSizeC {Number} number of columns
 * @param mapSizeR {Number} number of rows
 * @param {Object} [options] settings for the search algorithm
 * @param {Boolean} [options.diagonal] Specifies whether to use diagonal tiles
 */
export declare class PathFinding {
    /**
     * @property {Array(Array(GridNode))} grid
     * @protected
     */
    private grid;
    /**
     * @property {Boolean} diagonal
     * @protected
     */
    private diagonal;
    /**
     * @property {Function} heuristic
     * @protected
     */
    private heuristic;
    private closest;
    private nodes;
    private dirtyNodes;
    static heuristics: {
        [key in 'manhattan' | 'diagonal']: PathFindingHeuristicFunction;
    };
    constructor(mapSizeC: number, mapSizeR: number, options?: PathFindingOptions);
    /**
     * Cleans/resets all nodes.
     *
     * @method init
     * @private
     */
    private init;
    /**
     * Marks a node as dirty.
     *
     * @method markDirty
     * @private
     * @param node {TRAVISO.PathFinding.GridNode} node to be marked
     */
    private markDirty;
    /**
     * Finds adjacent/neighboring cells of a single node.
     *
     * @method neighbors
     * @param node {TRAVISO.PathFinding.GridNode} source node
     * @return {Array(TRAVISO.PathFinding.GridNode)} an array of available cells
     */
    private neighbors;
    toString(): string;
    /**
     * Solves path finding for the given source and destination locations.
     *
     * @method solve
     * @private
     * @param originC {Number} column index of the source location
     * @param originR {Number} row index of the source location
     * @param destC {Number} column index of the destination location
     * @param destR {Number} row index of the destination location
     * @return {Array(Object)} solution path
     */
    solve(originC: number, originR: number, destC: number, destR: number): GridNode[];
    /**
     * Finds available adjacent cells of an area defined by location and size.
     *
     * @method getAdjacentOpenCells
     * @param cellC {Number} column index of the location
     * @param cellR {Number} row index of the location
     * @param sizeC {Number} column size of the area
     * @param sizeR {Number} row size of the area
     * @return {Array(Object)} an array of available cells
     */
    getAdjacentOpenCells(cellC: number, cellR: number, sizeC: number, sizeR: number): GridNode[];
    private pathTo;
    private getHeap;
    /**
     * Perform an A* Search on a graph given a start and end node.
     * @param {GridNode} start
     * @param {GridNode} end
     * @param {Object} [options]
     * @param {Boolean} [options.closest] Specifies whether to return the
                path to the closest node if the target is unreachable.
    * @param {Function} [options.heuristic] Heuristic function.
    */
    private search;
    private cleanNode;
    /**
     * Checks if the location is occupied/available or not.
     *
     * @method isCellFilled
     * @param c {Number} column index of the location
     * @param r {Number} row index of the location
     * @return {Array(Object)} if the location is not available
     */
    isCellFilled(c: number, r: number): boolean;
    /**
     * Sets individual cell state for ground layer.
     *
     * @method setCell
     * @param c {Number} column index of the location
     * @param r {Number} row index of the location
     * @param movable {Boolean} free to move or not
     */
    setCell(c: number, r: number, movable: number): void;
    /**
     * Sets individual cell state for objects layer.
     *
     * @method setDynamicCell
     * @param c {Number} column index of the location
     * @param r {Number} row index of the location
     * @param movable {Boolean} free to move or not
     */
    setDynamicCell(c: number, r: number, movable: number): void;
    /**
     * Clears all references.
     *
     * @method destroy
     */
    destroy(): void;
}
