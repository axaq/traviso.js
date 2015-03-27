/**
 * @author Hakan Karlidag - @axaq
 */


/**
 * Includes all path finding logic.
 *
 * @class PathFinding
 * @constructor
 * @param _groundMapData {Array(Array)} a two dimensinal array of tile IDs
 * @param _objectsMapData {Array(Array)} a two dimensinal array of object IDs
 * @param [algorithm=TRAVISO.pfAlgorithms.ASTAR_ORTHOGONAL] {Number} type of the path finding algorithm to use
 */
TRAVISO.PathFinding = function(_groundMapData, _objectsMapData, algorithm)
{
	this.algorithm = algorithm || TRAVISO.pfAlgorithms.ASTAR_ORTHOGONAL;
	
	/**
	 * @property {Object} originCell
	 * @protected
	 */
	/**
	 * @property {Object} destinationCell
	 * @protected
	 */
	/**
	 * @property {Object} currentCell
	 * @protected
	 */
	/**
	 * @property {Object} finishCode
	 * @protected
	 */
	
	/**
     * @property {Number} MAX_ITERATIONS
     * @default 2000
     */
	this.MAX_ITERATIONS = 2000;
	
	/**
	 * @property {Number} FINISH_CODE_SUCCESS=0
	 * @protected
	 */
	/**
	 * @property {Number} FINISH_CODE_ILLEGAL_DEST=1
	 * @protected
	 */
	/**
	 * @property {Number} FINISH_CODE_NO_PATH=2
	 * @protected
	 */
	/**
	 * @property {Number} FINISH_CODE_TOO_LONG=3
	 * @protected
	 */

    // finishCode will be set to one of these after solve() is called.
    this.FINISH_CODE_SUCCESS = 0;
    this.FINISH_CODE_ILLEGAL_DEST = 1;
    this.FINISH_CODE_NO_PATH = 2;     
    this.FINISH_CODE_TOO_LONG = 3;
    
    /**
	 * @property {Array(Array(Object))} mapArray
	 * @protected
	 */
	/**
	 * @property {Array(Array(Object))} mapDynamicArray
	 * @protected
	 */
	
	this.mapArray = _groundMapData;
    this.mapDynamicArray = _objectsMapData;
    
    /**
	 * @property {Number} mapSizeR
	 * @protected
	 */
    /**
	 * @property {Number} mapSizeC
	 * @protected
	 */
    this.mapSizeR = this.mapArray.length;
    this.mapSizeC = this.mapArray[0].length;

	var c = 0;
	var r = 0;
	
	var cellObj;
	
	//define maps
	for(r = 0; r < this.mapSizeR; r++)
	{
		for(c = 0; c < this.mapSizeC; c++)
		{
		    cellObj = {};
			cellObj.type = this.mapArray[r][c];
			cellObj.isMovableTo = 1;
			cellObj.parentCell = null;
			cellObj.g = 0;
			cellObj.f = 0;
			cellObj.mapPos = {};
			cellObj.mapPos.c = c;
			cellObj.mapPos.r = r;
			this.mapArray[r][c] = cellObj;
		}				
	}
	
	for(r = 0; r < this.mapSizeR; r++)
	{
	    for(c = 0; c < this.mapSizeC; c++)
	    {
	        cellObj = {};
			cellObj.type = this.mapDynamicArray[r][c];
			cellObj.isMovableTo = 1;
			cellObj.mapPos = {};					
			cellObj.mapPos.c = c;
			cellObj.mapPos.r = r;
            this.mapDynamicArray[r][c] = cellObj;
		}				
	}
	
	/**
	 * @property {Array} openList
	 * @protected
	 */
    /**
	 * @property {Array} closedList
	 * @protected
	 */
	
	this.openList = [];
	this.closedList = [];
};

// constructor
TRAVISO.PathFinding.constructor = TRAVISO.PathFinding;

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
	this.originCell = this.mapArray[originR][originC];
	this.destinationCell = this.mapArray[destR][destC];
	
	if (!this.originCell || !this.destinationCell)
	{
		this.finishCode = this.FINISH_CODE_ILLEGAL_DEST;
		return null;
	}
	
	if(!this.destinationCell.isMovableTo) {
		this.finishCode = this.FINISH_CODE_ILLEGAL_DEST;
		return null;
	}			
	
	if(this.destinationCell.mapPos.c === this.originCell.mapPos.c && this.destinationCell.mapPos.r === this.originCell.mapPos.r) {
		this.finishCode = this.FINISH_CODE_ILLEGAL_DEST;
		return null;
	}

	this.currentCell = this.originCell;

	this.reset();
	
	var isSolved = false;
	var iter = 0;

	do {
		 isSolved = this.stepPathfinder();
		if(iter++ < this.MAX_ITERATIONS)
		{
			isSolved = this.stepPathfinder();
		} else
		{
			isSolved = true;
			this.finishCode = this.FINISH_CODE_TOO_LONG;
			return null;
		}
	} while(!isSolved);
	
	if(this.finishCode !== this.FINISH_CODE_SUCCESS)
	{
		return null;
	}			

	var solutionPath = [];
	
	//set pointer to last cell on list
	var cellPointer = this.closedList[this.closedList.length - 1];
	
	//"trace the ancestry" to get the solution path
	while(cellPointer !== this.originCell)
	{
		solutionPath.push(cellPointer);	
		cellPointer = cellPointer.parentCell;					
	}
	
	if(this.finishCode !== this.FINISH_CODE_SUCCESS)
	{
		return null;
	}
	
	return solutionPath;
};

/**
 * Step function for the path finder.
 *
 * @method stepPathfinder
 * @private
 * @return {Boolean} if the search is ended with success or not
 */
TRAVISO.PathFinding.prototype.stepPathfinder = function()
{
	if(this.currentCell === this.destinationCell) {
		this.finishCode = this.FINISH_CODE_SUCCESS;
		this.closedList.push(this.destinationCell);
		return true;
	}

	//place current cell into openList
	this.openList.push(this.currentCell);

	//place all legal adjacent squares into a temporary array
	var adjacentCells = [];
	var arryPtrDynMap;
	var arryPtr;				
	
	var c = this.currentCell.mapPos.c;
	var r = this.currentCell.mapPos.r;
	
	//four if-blocks handle each orthogonal group
	if(c - 1 >= 0) {
		arryPtr = this.mapArray[r + 0][c - 1];
		arryPtrDynMap = this.mapDynamicArray[r + 0][c - 1];
		if(arryPtr.isMovableTo && arryPtrDynMap.isMovableTo && this.closedList.indexOf(arryPtr) === -1) {
			adjacentCells.push(arryPtr);
		}
	}
	
	if(r - 1 >= 0) {
		arryPtr = this.mapArray[r - 1][c + 0];
		arryPtrDynMap = this.mapDynamicArray[r - 1][c + 0];
		if(arryPtr.isMovableTo && arryPtrDynMap.isMovableTo && this.closedList.indexOf(arryPtr) === -1) {
			adjacentCells.push(arryPtr);
		}
	}
	
	if(c + 1 < this.mapSizeC) {
		arryPtr = this.mapArray[r + 0][c + 1];
		arryPtrDynMap = this.mapDynamicArray[r + 0][c + 1];
		if(arryPtr.isMovableTo && arryPtrDynMap.isMovableTo && this.closedList.indexOf(arryPtr) === -1) {
			adjacentCells.push(arryPtr);
		}
	}
	
	if(r + 1 < this.mapSizeR) {
		arryPtr = this.mapArray[r + 1][c + 0];
		arryPtrDynMap = this.mapDynamicArray[r + 1][c + 0];
		if(arryPtr.isMovableTo && arryPtrDynMap.isMovableTo && this.closedList.indexOf(arryPtr) === -1) {
			adjacentCells.push(arryPtr);
		}
	}
	
	if (this.algorithm === TRAVISO.pfAlgorithms.ASTAR_DIAGONAL)
	{
		if(c - 1 >= 0 && r - 1 >= 0) {
			arryPtr = this.mapArray[r - 1][c - 1];
			arryPtrDynMap = this.mapDynamicArray[r - 1][c - 1];
			if(arryPtr.isMovableTo && arryPtrDynMap.isMovableTo && this.closedList.indexOf(arryPtr) === -1) {
				adjacentCells.push(arryPtr);
			}
		}
		
		if(c + 1 >= 0 && r - 1 >= 0) {
			arryPtr = this.mapArray[r - 1][c + 1];
			arryPtrDynMap = this.mapDynamicArray[r - 1][c + 1];
			if(arryPtr.isMovableTo && arryPtrDynMap.isMovableTo && this.closedList.indexOf(arryPtr) === -1) {
				adjacentCells.push(arryPtr);
			}
		}
		
		if(c + 1 >= 0 && r + 1 >= 0) {
			arryPtr = this.mapArray[r + 1][c + 1];
			arryPtrDynMap = this.mapDynamicArray[r + 1][c + 1];
			if(arryPtr.isMovableTo && arryPtrDynMap.isMovableTo && this.closedList.indexOf(arryPtr) === -1) {
				adjacentCells.push(arryPtr);
			}
		}
		
		if(c - 1 >= 0 && r + 1 >= 0) {
			arryPtr = this.mapArray[r + 1][c - 1];
			arryPtrDynMap = this.mapDynamicArray[r + 1][c - 1];
			if(arryPtr.isMovableTo && arryPtrDynMap.isMovableTo && this.closedList.indexOf(arryPtr) === -1) {
				adjacentCells.push(arryPtr);
			}
		}
	}


	var g;
	var h;
	var l = adjacentCells.length;
	for(var ii = 0; ii < l; ii++) {
		
		//this.currentCell is the "parent" of all cells in adjacentCells; add 1 unit of distance to G sum. 
		//there is no handling of diagonal distance in this "ortho" implementation
		g = this.currentCell.g + 1;
		
		//H calc'd per "Manhattan" method
		h = Math.abs(adjacentCells[ii].mapPos.c - this.destinationCell.mapPos.c) + Math.abs(adjacentCells[ii].mapPos.r - this.destinationCell.mapPos.r);
			
		if(this.openList.indexOf(adjacentCells[ii]) === -1) { //is cell already on the open list? - no									

			adjacentCells[ii].f = g + h;
			adjacentCells[ii].parentCell = this.currentCell;
			adjacentCells[ii].g = g;					
			this.openList.push(adjacentCells[ii]);

		} else { //is cell already on the open list? - yes
			
			if(adjacentCells[ii].g < this.currentCell.parentCell.g) {
				
				this.currentCell.parentCell = adjacentCells[ii];
				this.currentCell.g = adjacentCells[ii].g + 1;
				this.currentCell.f = adjacentCells[ii].g + h;
				
			}
		}
	}
	
	//Remove current cell from this.openList and add to this.closedList.
	var indexOfCurrent = this.openList.indexOf(this.currentCell);
	this.closedList.push(this.currentCell);
	this.openList.splice(indexOfCurrent, 1);			
	
	if(this.openList.length === 0) {
		this.finishCode = this.FINISH_CODE_NO_PATH;
		return true;
	}
	
	//Take the lowest scoring this.openList cell and make it the current cell.
	this.openList.sort(function (a, b) {
        return b.f > a.f;
    });
	//this.openList.sortOn("f", Array.NUMERIC | Array.DESCENDING);
	this.currentCell = this.openList.pop();	
	
	//returning false continues algo
	return false;
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
			cellArray = cellArray.concat(this.getAdjacentOpenCellsForSingle(c, r));
		}
	}
	
	return cellArray;
};

/**
 * Finds available adjacent cells of a single location.
 *
 * @method getAdjacentOpenCellsForSingle
 * @param cellC {Number} column index of the location
 * @param cellR {Number} row index of the location
 * @return {Array(Object)} an array of available cells
 */
TRAVISO.PathFinding.prototype.getAdjacentOpenCellsForSingle = function(cellC, cellR)
{
	var cellArray = [];
	var tmpPtr, tmpPtrDynMap;
	
	tmpPtr = this.mapArray[cellR][cellC+1];
	tmpPtrDynMap = this.mapDynamicArray[cellR][cellC+1];
	if(tmpPtr.isMovableTo && tmpPtrDynMap.isMovableTo) { cellArray.push(tmpPtr); }
	
	tmpPtr = this.mapArray[cellR+1][cellC];
	tmpPtrDynMap = this.mapDynamicArray[cellR+1][cellC];
	if(tmpPtr.isMovableTo && tmpPtrDynMap.isMovableTo) { cellArray.push(tmpPtr); }
	
	tmpPtr = this.mapArray[cellR][cellC-1];
	tmpPtrDynMap = this.mapDynamicArray[cellR][cellC-1];
	if(tmpPtr.isMovableTo && tmpPtrDynMap.isMovableTo) { cellArray.push(tmpPtr); }
	
	tmpPtr = this.mapArray[cellR-1][cellC];
	tmpPtrDynMap = this.mapDynamicArray[cellR-1][cellC];
	if(tmpPtr.isMovableTo && tmpPtrDynMap.isMovableTo) { cellArray.push(tmpPtr); }
	
	if (this.algorithm === TRAVISO.pfAlgorithms.ASTAR_DIAGONAL)
	{
		tmpPtr = this.mapArray[cellR+1][cellC+1];
		tmpPtrDynMap = this.mapDynamicArray[cellR+1][cellC+1];
		if(tmpPtr.isMovableTo && tmpPtrDynMap.isMovableTo) { cellArray.push(tmpPtr); }
		
		tmpPtr = this.mapArray[cellR+1][cellC-1];
		tmpPtrDynMap = this.mapDynamicArray[cellR+1][cellC-1];
		if(tmpPtr.isMovableTo && tmpPtrDynMap.isMovableTo) { cellArray.push(tmpPtr); }
		
		tmpPtr = this.mapArray[cellR-1][cellC-1];
		tmpPtrDynMap = this.mapDynamicArray[cellR-1][cellC-1];
		if(tmpPtr.isMovableTo && tmpPtrDynMap.isMovableTo) { cellArray.push(tmpPtr); }
		
		tmpPtr = this.mapArray[cellR-1][cellC+1];
		tmpPtrDynMap = this.mapDynamicArray[cellR-1][cellC+1];
		if(tmpPtr.isMovableTo && tmpPtrDynMap.isMovableTo) { cellArray.push(tmpPtr); }
	}
	
	return cellArray;
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
	if(!this.mapArray[r][c].isMovableTo) { return true; }
	if(!this.mapDynamicArray[r][c].isMovableTo) { return true; }
	
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
	this.mapArray[r][c].isMovableTo = movable;			
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
    this.mapDynamicArray[r][c].isMovableTo = movable;
};

/**
 * Resets algorithm without clearing cells.
 *
 * @method reset
 * @private
 */
TRAVISO.PathFinding.prototype.reset = function()
{	
    for(var r = 0; r < this.mapSizeR; r++)
    {
	   for(var c = 0; c < this.mapSizeC; c++)
	   {								
			this.mapArray[r][c].parentCell = null;
			this.mapArray[r][c].g = 0;
			this.mapArray[r][c].f = 0;
		}				
	}
	
	this.openList = [];
	this.closedList = [];
};

/**
 * Resets the dynamic (mobile unit tracking) map.
 *
 * @method resetDynamicMap
 * @private
 */
TRAVISO.PathFinding.prototype.resetDynamicMap = function()
{
    for(var r = 0; r < this.mapSizeR; r++)
    {
	   for(var c = 0; c < this.mapSizeC; c++)
	   {
			this.mapDynamicArray[r][c].mapPos.c = c;
			this.mapDynamicArray[r][c].mapPos.r = r;
			this.mapDynamicArray[r][c].type = 0;
			this.mapDynamicArray[r][c].isMovableTo = 1;
		}				
	}
};

/**
 * Clears all references.
 *
 * @method destroy
 */
TRAVISO.PathFinding.prototype.destroy = function() 
{
    TRAVISO.trace("PathFinding destroy");
    
	this.mapArray = null;
	this.mapDynamicArray = null;
	this.openList = null;
    this.closedList = null;
};
