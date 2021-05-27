import { BinaryHeap } from './BinaryHeap';
import { GridNode } from './GridNode';

export type PathFindingHeuristicFunction = (pos0: GridNode, pos1: GridNode) => number;
export type PathFindingSearchOptions = {
    heuristic?: PathFindingHeuristicFunction;
    closest?: boolean;
};
export type PathFindingOptions = {
    diagonal?: boolean;
    closest?: boolean;
};

// Based on http://github.com/bgrins/javascript-astar v0.4.0

/**
 * Includes all path finding logic.
 *
 * @class PathFinding
 */
export class PathFinding {
    /**
     * @property {Array(Array(GridNode))} grid
     * @private
     */
    private grid: GridNode[][];
    /**
     * @property {boolean} diagonal
     * @private
     */
    private diagonal: boolean;
    /**
     * Active heuristic method to use
     * @property
     * @private
     */
    private heuristic: PathFindingHeuristicFunction;

    private closest: boolean;

    private nodes: GridNode[];
    private dirtyNodes: GridNode[];

    /**
     * See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
     *
     * @property
     * @private
     * @static
     */
    private static readonly HEURISTICS: {
        [key in 'manhattan' | 'diagonal']: PathFindingHeuristicFunction;
    } = {
        manhattan: (pos0: GridNode, pos1: GridNode) => {
            const d1 = Math.abs(pos1.x - pos0.x);
            const d2 = Math.abs(pos1.y - pos0.y);
            return d1 + d2;
        },
        diagonal: (pos0: GridNode, pos1: GridNode) => {
            const D = 1;
            const D2 = Math.sqrt(2);
            const d1 = Math.abs(pos1.x - pos0.x);
            const d2 = Math.abs(pos1.y - pos0.y);
            return D * (d1 + d2) + (D2 - 2 * D) * Math.min(d1, d2);
        },
    };
    /**
     * Constructor function for the PathFinding class.
     *
     * @constructor
     *
     * @param mapSizeC {number} number of columns
     * @param mapSizeR {number} number of rows
     * @param options {PathFindingOptions}  settings for the search algorithm, default `{}`
     */
    constructor(mapSizeC: number, mapSizeR: number, options: PathFindingOptions = {}) {
        //define map
        this.nodes = [];
        this.diagonal = !!options.diagonal;
        this.heuristic = this.diagonal ? PathFinding.HEURISTICS.diagonal : PathFinding.HEURISTICS.manhattan;
        this.closest = !!options.closest;
        this.grid = [];
        let c = 0,
            r = 0,
            node: GridNode;
        for (c = 0; c < mapSizeC; c++) {
            this.grid[c] = [];
            for (r = 0; r < mapSizeR; r++) {
                node = new GridNode(c, r, 1);
                this.grid[c][r] = node;
                this.nodes.push(node);
            }
        }
        this.init();
    }

    /**
     * Cleans/resets all nodes.
     *
     * @method init
     * @private
     */
    private init(): void {
        this.dirtyNodes = [];
        for (let i = 0; i < this.nodes.length; i++) {
            this.cleanNode(this.nodes[i]);
        }
    }

    // /**
    //  * Cleans only dirty nodes.
    //  *
    //  * @method cleanDirty
    //  * @private
    //  */
    // private cleanDirty(): void {
    //     for (let i = 0; i < this.dirtyNodes.length; i++) {
    //         this.cleanNode(this.dirtyNodes[i]);
    //     }
    //     this.dirtyNodes = [];
    // }

    /**
     * Marks a node as dirty.
     *
     * @method markDirty
     * @private
     * @param node {TRAVISO.PathFinding.GridNode} node to be marked
     */
    private markDirty(node: GridNode): void {
        this.dirtyNodes.push(node);
    }

    /**
     * Finds adjacent/neighboring cells of a single node.
     *
     * @method neighbors
     * @param node {TRAVISO.PathFinding.GridNode} source node
     * @return {Array(TRAVISO.PathFinding.GridNode)} an array of available cells
     */
    private neighbors(node: GridNode): GridNode[] {
        const ret = [],
            x = node.x,
            y = node.y,
            grid = this.grid;

        // West
        if (grid[x - 1] && grid[x - 1][y]) {
            ret.push(grid[x - 1][y]);
        }
        // East
        if (grid[x + 1] && grid[x + 1][y]) {
            ret.push(grid[x + 1][y]);
        }
        // South
        if (grid[x] && grid[x][y - 1]) {
            ret.push(grid[x][y - 1]);
        }
        // North
        if (grid[x] && grid[x][y + 1]) {
            ret.push(grid[x][y + 1]);
        }

        if (this.diagonal) {
            // Southwest
            if (grid[x - 1] && grid[x - 1][y - 1]) {
                ret.push(grid[x - 1][y - 1]);
            }
            // Southeast
            if (grid[x + 1] && grid[x + 1][y - 1]) {
                ret.push(grid[x + 1][y - 1]);
            }
            // Northwest
            if (grid[x - 1] && grid[x - 1][y + 1]) {
                ret.push(grid[x - 1][y + 1]);
            }
            // Northeast
            if (grid[x + 1] && grid[x + 1][y + 1]) {
                ret.push(grid[x + 1][y + 1]);
            }
        }
        return ret;
    }

    public toString(): string {
        const graphString: string[] = [],
            nodes = this.grid; // when using grid
        let rowDebug: number[], row: GridNode[], x: number, len: number, y: number, l: number;
        for (x = 0, len = nodes.length; x < len; x++) {
            rowDebug = [];
            row = nodes[x];
            for (y = 0, l = row.length; y < l; y++) {
                rowDebug.push(row[y].weight);
            }
            graphString.push(rowDebug.join(' '));
        }
        return graphString.join('\n');
    }

    /**
     * Solves path finding for the given source and destination locations.
     *
     * @method solve
     * @private
     * @param originC {number} column index of the source location
     * @param originR {number} row index of the source location
     * @param destC {number} column index of the destination location
     * @param destR {number} row index of the destination location
     * @return {Array(Object)} solution path
     */
    public solve(originC: number, originR: number, destC: number, destR: number): GridNode[] {
        const start = this.grid[originC][originR];
        const end = this.grid[destC][destR];
        const result = this.search(start, end, {
            heuristic: this.heuristic,
            closest: this.closest,
        });
        return result && result.length > 0 ? result : null;
    }

    /**
     * Finds available adjacent cells of an area defined by location and size.
     *
     * @method getAdjacentOpenCells
     * @param cellC {number} column index of the location
     * @param cellR {number} row index of the location
     * @param sizeC {number} column size of the area
     * @param sizeR {number} row size of the area
     * @return {Array(Object)} an array of available cells
     */
    public getAdjacentOpenCells(cellC: number, cellR: number, sizeC: number, sizeR: number): GridNode[] {
        let r: number,
            c: number,
            cellArray: GridNode[] = [];
        for (r = cellR; r > cellR - sizeR; r--) {
            for (c = cellC; c < cellC + sizeC; c++) {
                // NOTE: concat is browser dependent. It is fastest for Chrome. Might be a good idea to use for loop or "a.push.apply(a, b);" for other browsers
                cellArray = cellArray.concat(this.neighbors(this.grid[c][r]));
            }
        }
        return cellArray;
    }

    private pathTo(node: GridNode): GridNode[] {
        let curr = node;
        const path: GridNode[] = [];
        while (curr.parent) {
            path.push(curr);
            curr = curr.parent;
        }
        // return path.reverse();
        return path;
    }

    private getHeap(): BinaryHeap {
        return new BinaryHeap((node: unknown) => (node as GridNode).f);
    }

    /**
     * Perform an A* Search on a graph given a start and end node.
     *
     * @method
     * @function
     * @private
     *
     * @param start {GridNode} beginning node of search
     * @param end {GridNode} end node of the search
     * @param options {Object} Search options
     * @return {Array(GridNode)} resulting list of nodes
     */
    private search(start: GridNode, end: GridNode, options: PathFindingSearchOptions = {}): GridNode[] {
        this.init();

        const heuristic = options.heuristic || PathFinding.HEURISTICS.manhattan;
        const closest = options.closest || false;

        const openHeap = this.getHeap();
        let closestNode = start; // set the start node to be the closest if required

        start.h = heuristic(start, end);

        openHeap.push(start);

        while (openHeap.size() > 0) {
            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            const currentNode: GridNode = openHeap.pop() as GridNode;

            // End case -- result has been found, return the traced path.
            if (currentNode === end) {
                return this.pathTo(currentNode);
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // Find all neighbors for the current node.
            const neighbors = this.neighbors(currentNode);

            for (let i = 0, il = neighbors.length; i < il; ++i) {
                const neighbor = neighbors[i];

                if (neighbor.closed || neighbor.isWall()) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                const gScore = currentNode.g + neighbor.getCost(currentNode),
                    beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.g) {
                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor, end);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    this.markDirty(neighbor);
                    if (closest) {
                        // If the neighbor is closer than the current closestNode or if it's equally close but has
                        // a cheaper path than the current closest node then it becomes the closest node
                        if (
                            neighbor.h < closestNode.h ||
                            (neighbor.h === closestNode.h && neighbor.g < closestNode.g)
                        ) {
                            closestNode = neighbor;
                        }
                    }

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    } else {
                        // Already seen the node, but since it has been re-scored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }

        if (closest) {
            return this.pathTo(closestNode);
        }

        // No result was found - empty array signifies failure to find path.
        return [];
    }

    private cleanNode(node: GridNode): void {
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.visited = false;
        node.closed = false;
        node.parent = null;
    }

    /**
     * Checks if the location is occupied/available or not.
     *
     * @method isCellFilled
     * @param c {number} column index of the location
     * @param r {number} row index of the location
     * @return {Array(Object)} if the location is not available
     */
    public isCellFilled(c: number, r: number): boolean {
        if (this.grid[c][r].weight === 0) {
            return true;
        }
        return false;
    }

    /**
     * Sets individual cell state for ground layer.
     *
     * @method setCell
     * @param c {number} column index of the location
     * @param r {number} row index of the location
     * @param movable {boolean} free to move or not
     */
    public setCell(c: number, r: number, movable: number): void {
        this.grid[c][r].staticWeight = this.grid[c][r].weight = movable;
    }

    /**
     * Sets individual cell state for objects layer.
     *
     * @method setDynamicCell
     * @param c {number} column index of the location
     * @param r {number} row index of the location
     * @param movable {boolean} free to move or not
     */
    public setDynamicCell(c: number, r: number, movable: number): void {
        // if it is movable by static tile property
        if (this.grid[c][r].staticWeight !== 0) {
            this.grid[c][r].weight = movable;
        }
    }

    /**
     * Clears all references.
     *
     * @method
     * @function
     * @public
     */
    public destroy(): void {
        this.grid = null;
        this.nodes = null;
        this.dirtyNodes = null;
        this.heuristic = null;
    }
}
