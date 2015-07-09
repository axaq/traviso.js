/**
 * @author Hakan Karlidag - @axaq
 */

// Based on http://github.com/bgrins/javascript-astar v0.4.0

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
TRAVISO.PathFinding = function(mapSizeC, mapSizeR, options)
{
	/**
	 * @property {Array(Array(TRAVISO.PathFinding.GridNode))} grid
	 * @protected
	 */
    /**
	 * @property {Boolean} diagonal
	 * @protected
	 */
	/**
	 * @property {Function} heuristic
	 * @protected
	 */
	
    var c = 0;
	var r = 0;
	
	//define map
	options = options || {};
    this.nodes = [];
    this.diagonal = !!options.diagonal;
    this.heuristic = this.diagonal ? this.heuristics.diagonal : this.heuristics.manhattan;
    this.closest = !!options.closest;
    this.grid = [];
    for (c = 0; c < mapSizeC; c++)
    {
        this.grid[c] = [];

        for (r = 0; r < mapSizeR; r++)
        {
            var node = new TRAVISO.PathFinding.GridNode(c, r, 1);
            this.grid[c][r] = node;
            this.nodes.push(node);
        }
    }
    this.init();
};

// constructor
TRAVISO.PathFinding.constructor = TRAVISO.PathFinding;

/**
 * Cleans/resets all nodes.
 *
 * @method init
 * @private
 */
TRAVISO.PathFinding.prototype.init = function()
{
    this.dirtyNodes = [];
    for (var i = 0; i < this.nodes.length; i++)
    {
        this.cleanNode(this.nodes[i]);
    }
};

/**
 * Cleans only dirty nodes.
 *
 * @method cleanDirty
 * @private
 */
TRAVISO.PathFinding.prototype.cleanDirty = function()
{
    for (var i = 0; i < this.dirtyNodes.length; i++)
    {
    	this.cleanNode(this.dirtyNodes[i]);
    }
    this.dirtyNodes = [];
};

/**
 * Marks a node as dirty.
 *
 * @method markDirty
 * @private
 * @param node {TRAVISO.PathFinding.GridNode} node to be marked
 */
TRAVISO.PathFinding.prototype.markDirty = function(node)
{
    this.dirtyNodes.push(node);
};

/**
 * Finds adjacent/neighboring cells of a single node.
 *
 * @method neighbors
 * @param node {TRAVISO.PathFinding.GridNode} source node
 * @return {Array(TRAVISO.PathFinding.GridNode)} an array of available cells
 */
TRAVISO.PathFinding.prototype.neighbors = function(node)
{
    var ret = [],
        x = node.x,
        y = node.y,
        grid = this.grid;

    // West
    if(grid[x-1] && grid[x-1][y]) {
        ret.push(grid[x-1][y]);
    }

    // East
    if(grid[x+1] && grid[x+1][y]) {
        ret.push(grid[x+1][y]);
    }

    // South
    if(grid[x] && grid[x][y-1]) {
        ret.push(grid[x][y-1]);
    }

    // North
    if(grid[x] && grid[x][y+1]) {
        ret.push(grid[x][y+1]);
    }

    if (this.diagonal) {
        // Southwest
        if(grid[x-1] && grid[x-1][y-1]) {
            ret.push(grid[x-1][y-1]);
        }

        // Southeast
        if(grid[x+1] && grid[x+1][y-1]) {
            ret.push(grid[x+1][y-1]);
        }

        // Northwest
        if(grid[x-1] && grid[x-1][y+1]) {
            ret.push(grid[x-1][y+1]);
        }

        // Northeast
        if(grid[x+1] && grid[x+1][y+1]) {
            ret.push(grid[x+1][y+1]);
        }
    }

    return ret;
};

TRAVISO.PathFinding.prototype.toString = function()
{
    var graphString = [],
        nodes = this.grid, // when using grid
        rowDebug, row, y, l;
    for (var x = 0, len = nodes.length; x < len; x++)
    {
        rowDebug = [];
        row = nodes[x];
        for (y = 0, l = row.length; y < l; y++) {
            rowDebug.push(row[y].weight);
        }
        graphString.push(rowDebug.join(' '));
    }
    return graphString.join('\n');
};

// Data structure for a grid-node used in pathfinding algorithm.
TRAVISO.PathFinding.GridNode = function(c, r, weight)
{
    this.x = c;
    this.y = r;
    this.weight = weight;
    this.mapPos = { c: c, r: r };
};

// constructor
TRAVISO.PathFinding.GridNode.constructor = TRAVISO.PathFinding.GridNode;

TRAVISO.PathFinding.GridNode.prototype.toString = function()
{
    return '[' + this.x + ' ' + this.y + ']';
};

TRAVISO.PathFinding.GridNode.prototype.getCost = function(fromNeighbor)
{
    // Take diagonal weight into consideration.
    if (fromNeighbor && fromNeighbor.x !== this.x && fromNeighbor.y !== this.y)
    {
        return this.weight * 1.41421;
    }
    return this.weight;
};

TRAVISO.PathFinding.GridNode.prototype.isWall = function()
{
    return this.weight === 0;
};

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
TRAVISO.PathFinding.prototype.solve = function(originC, originR, destC, destR)
{
	var start = this.grid[originC][originR];
	var end = this.grid[destC][destR];
	var result = this.search(start, end, { heuristic: this.heuristic, closest: this.closest });
	return result && result.length > 0 ? result : null;
};

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
TRAVISO.PathFinding.prototype.getAdjacentOpenCells = function(cellC, cellR, sizeC, sizeR)
{
	var r, c, cellArray = [];
	
	for (r = cellR; r > cellR-sizeR; r--)
    {
    	for (c = cellC; c < cellC + sizeC; c++)
    	{
			// NOTE: concat is browser dependent. It is fastest for Chrome. Might be a good idea to use for loop or "a.push.apply(a, b);" for other browsers
			cellArray = cellArray.concat(this.neighbors(this.grid[c][r]));
		}
	}
	
	return cellArray;
};

TRAVISO.PathFinding.prototype.pathTo = function(node)
{
    var curr = node,
        path = [];
    while(curr.parent) {
        path.push(curr);
        curr = curr.parent;
    }
    // return path.reverse();
    return path;
};

TRAVISO.PathFinding.prototype.getHeap = function()
{
    return new TRAVISO.PathFinding.BinaryHeap(function(node) {
        return node.f;
    });
};

/**
 * Perform an A* Search on a graph given a start and end node.
 * @param {GridNode} start
 * @param {GridNode} end
 * @param {Object} [options]
 * @param {Boolean} [options.closest] Specifies whether to return the
            path to the closest node if the target is unreachable.
 * @param {Function} [options.heuristic] Heuristic function.
 */
TRAVISO.PathFinding.prototype.search = function(start, end, options)
{
	this.init();
    options = options || {};
    var heuristic = options.heuristic || this.heuristics.manhattan,
        closest = options.closest || false;

    var openHeap = this.getHeap(),
        closestNode = start; // set the start node to be the closest if required

    start.h = heuristic(start, end);

    openHeap.push(start);
    
    while(openHeap.size() > 0) {

        // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
        var currentNode = openHeap.pop();

        // End case -- result has been found, return the traced path.
        if(currentNode === end) {
            return this.pathTo(currentNode);
        }

        // Normal case -- move currentNode from open to closed, process each of its neighbors.
        currentNode.closed = true;

        // Find all neighbors for the current node.
        var neighbors = this.neighbors(currentNode);

        for (var i = 0, il = neighbors.length; i < il; ++i) {
            var neighbor = neighbors[i];

            if (neighbor.closed || neighbor.isWall()) {
                // Not a valid node to process, skip to next neighbor.
                continue;
            }

            // The g score is the shortest distance from start to current node.
            // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
            var gScore = currentNode.g + neighbor.getCost(currentNode),
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
                    // If the neighbour is closer than the current closestNode or if it's equally close but has
                    // a cheaper path than the current closest node then it becomes the closest node
                    if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                        closestNode = neighbor;
                    }
                }

                if (!beenVisited) {
                    // Pushing to heap will put it in proper place based on the 'f' value.
                    openHeap.push(neighbor);
                }
                else {
                    // Already seen the node, but since it has been rescored we need to reorder it in the heap
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
};

// See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
TRAVISO.PathFinding.prototype.heuristics = {
    manhattan: function(pos0, pos1) {
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    },
    diagonal: function(pos0, pos1) {
        var D = 1;
        var D2 = Math.sqrt(2);
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
    }
};

TRAVISO.PathFinding.prototype.cleanNode = function(node) {
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.visited = false;
        node.closed = false;
        node.parent = null;
};

TRAVISO.PathFinding.BinaryHeap = function(scoreFunction)
{
	this.content = [];
    this.scoreFunction = scoreFunction;
};

TRAVISO.PathFinding.BinaryHeap.prototype = {
    push: function(element) {
        // Add the new element to the end of the array.
        this.content.push(element);

        // Allow it to sink down.
        this.sinkDown(this.content.length - 1);
    },
    pop: function() {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    },
    remove: function(node) {
        var i = this.content.indexOf(node);

        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();

        if (i !== this.content.length - 1) {
            this.content[i] = end;

            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(i);
            }
            else {
                this.bubbleUp(i);
            }
        }
    },
    size: function() {
        return this.content.length;
    },
    rescoreElement: function(node) {
        this.sinkDown(this.content.indexOf(node));
    },
    sinkDown: function(n) {
        // Fetch the element that has to be sunk.
        var element = this.content[n];

        // When at 0, an element can not sink any further.
        while (n > 0) {

            // Compute the parent element's index, and fetch it.
            var parentN = ((n + 1) >> 1) - 1,
                parent = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            // Found a parent that is less, no need to sink any further.
            else {
                break;
            }
        }
    },
    bubbleUp: function(n) {
        // Look up the target element and its score.
        var length = this.content.length,
            element = this.content[n],
            elemScore = this.scoreFunction(element);

        while(true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) << 1,
                child1N = child2N - 1;
            // This is used to store the new position of the element, if any.
            var swap = null,
                child1Score;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);

                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore){
                    swap = child1N;
                }
            }

            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N],
                    child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
            // Otherwise, we are done.
            else {
                break;
            }
        }
    }
};

/**
 * Checks if the location is occupied/available or not.
 *
 * @method isCellFilled
 * @param c {Number} column index of the location
 * @param r {Number} row index of the location
 * @return {Array(Object)} if the location is not available
 */
TRAVISO.PathFinding.prototype.isCellFilled = function(c, r)
{
	if (this.grid[c][r].weight === 0) { return true; }
	
	return false;
};

/**
 * Sets individual cell state for ground layer.
 *
 * @method setCell
 * @param c {Number} column index of the location
 * @param r {Number} row index of the location
 * @param movable {Boolean} free to move or not
 */
TRAVISO.PathFinding.prototype.setCell = function(c, r, movable)
{
	this.grid[c][r].staticWeight = this.grid[c][r].weight = movable;
};

/**
 * Sets individual cell state for objects layer.
 *
 * @method setDynamicCell
 * @param c {Number} column index of the location
 * @param r {Number} row index of the location
 * @param movable {Boolean} free to move or not
 */
TRAVISO.PathFinding.prototype.setDynamicCell = function(c, r, movable)
{
	// if it is movable by static tile property
	if (this.grid[c][r].staticWeight !== 0)
	{
		this.grid[c][r].weight = movable;
	}
};



/**
 * Clears all references.
 *
 * @method destroy
 */
TRAVISO.PathFinding.prototype.destroy = function() 
{
    TRAVISO.trace('PathFinding destroy');
    
    this.grid = null;
    this.nodes = null;
    this.dirtyNodes = null;
    this.heuristic = null;
};
