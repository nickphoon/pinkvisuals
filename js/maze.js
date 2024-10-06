/*

Maze Generation + Solver
Maze Generation Algorithm : Depth First Search .. will add more 
Solver : Djikstra... will add more


*/

// Initialize the canvas
let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");
let generationComplete = false;

let current;
let goal;


// ======================= DEPTH FIRST SEARCH MAZE GENERATION ===================== //
class Maze {
  constructor(size, rows, columns) {
    this.size = size
    this.columns = columns;
    this.rows = rows;
    this.grid = [];
    this.stack = [];
  }

  // Set the grid: Create new this.grid array based on number of instance rows and columns
  setup() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.columns; c++) {
        // Create a new instance of the Cell class for each element in the 2D array and push to the maze grid array
        let cell = new Cell(r, c, this.grid, this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }
    // Set the starting grid
    current = this.grid[0][0];
    this.grid[this.rows - 1][this.columns - 1].goal = true;
  }

  // Draw the canvas by setting the size and placing the cells in the grid array on the canvas.
  draw() {
    maze.width = this.size;
    maze.height = this.size;
    maze.style.background = "black";
    // Set the first cell as visited
    current.visited = true;
    // Loop through the 2d grid array and call the show method for each cell instance
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let grid = this.grid;
        grid[r][c].show(this.size, this.rows, this.columns);
      }
    }
    // This function will assign the variable 'next' to random cell out of the current cells available neighbouting cells
    let next = current.checkNeighbours();
    // If there is a non visited neighbour cell
    if (next) {
      next.visited = true;
      // Add the current cell to the stack for backtracking
      this.stack.push(current);
      // this function will highlight the current cell on the grid. The parameter columns is passed
      // in order to set the size of the cell
      current.highlight(this.columns);
      // This function compares the current cell to the next cell and removes the relevant walls for each cell
      current.removeWalls(current, next);
      // Set the nect cell to the current cell
      current = next;

      // Else if there are no available neighbours start backtracking using the stack
    } else if (this.stack.length > 0) {
      let cell = this.stack.pop();
      current = cell;
      current.highlight(this.columns);
    }
    // If no more items in the stack then all cells have been visted and the function can be exited
    if (this.stack.length === 0) {
      generationComplete = true;
      return;
    }

    // // Recursively call the draw function. This will be called up until the stack is empty
    // window.requestAnimationFrame(() => {
    //   this.draw();
    // });

    // Recursively call the draw function with a delay
    setTimeout(() => {
      this.draw();
    },  20);
  }
}



class Cell {
  // Constructor takes in the rowNum and colNum which will be used as coordinates to draw on the canvas.
  constructor(rowNum, colNum, parentGrid, parentSize) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.visited = false;
    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true,
    };
    this.goal = false;
    // parentGrid is passed in to enable the checkneighbours method.
    // parentSize is passed in to set the size of each cell on the grid
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
  }

  checkNeighbours() {
    let grid = this.parentGrid;
    let row = this.rowNum;
    let col = this.colNum;
    let neighbours = [];

    // The following lines push all available neighbours to the neighbours array
    // undefined is returned where the index is out of bounds (edge cases)
    let top = row !== 0 ? grid[row - 1][col] : undefined;
    let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
    let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
    let left = col !== 0 ? grid[row][col - 1] : undefined;

    // if the following are not 'undefined' then push them to the neighbours array
    if (top && !top.visited) neighbours.push(top);
    if (right && !right.visited) neighbours.push(right);
    if (bottom && !bottom.visited) neighbours.push(bottom);
    if (left && !left.visited) neighbours.push(left);

    // Choose a random neighbour from the neighbours array
    if (neighbours.length !== 0) {
      let random = Math.floor(Math.random() * neighbours.length);
      return neighbours[random];
    } else {
      return undefined;
    }
  }

  // Wall drawing functions for each cell. Will be called if relevent wall is set to true in cell constructor
  drawTopWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size / columns, y);
    ctx.stroke();
  }

  drawRightWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x + size / columns, y);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  drawBottomWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / rows);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  drawLeftWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + size / rows);
    ctx.stroke();
  }

  // Highlights the current cell on the grid. Columns is once again passed in to set the size of the grid.
  highlight(columns) {
    // Additions and subtractions added so the highlighted cell does cover the walls
    let x = (this.colNum * this.parentSize) / columns + 1;
    let y = (this.rowNum * this.parentSize) / columns + 1;
    ctx.fillStyle = "purple";
    ctx.fillRect(
      x,
      y,
      this.parentSize / columns - 3,
      this.parentSize / columns - 3
    );
  }

  // Highlights the current cell on the grid. Columns is once again passed in to set the size of the grid.
  highlightGreen(columns) {
    // Additions and subtractions added so the highlighted cell does cover the walls
    let x = (this.colNum * this.parentSize) / columns + 1;
    let y = (this.rowNum * this.parentSize) / columns + 1;
    ctx.fillStyle = "green";
    ctx.fillRect(
      x,
      y,
      this.parentSize / columns - 3,
      this.parentSize / columns - 3
    );
  }

  removeWalls(cell1, cell2) {
    // compares to two cells on x axis
    let x = cell1.colNum - cell2.colNum;
    // Removes the relevant walls if there is a different on x axis
    if (x === 1) {
      cell1.walls.leftWall = false;
      cell2.walls.rightWall = false;
    } else if (x === -1) {
      cell1.walls.rightWall = false;
      cell2.walls.leftWall = false;
    }
    // compares to two cells on x axis
    let y = cell1.rowNum - cell2.rowNum;
    // Removes the relevant walls if there is a different on x axis
    if (y === 1) {
      cell1.walls.topWall = false;
      cell2.walls.bottomWall = false;
    } else if (y === -1) {
      cell1.walls.bottomWall = false;
      cell2.walls.topWall = false;
    }
  }

  // Draws each of the cells on the maze canvas
  show(size, rows, columns) {
    let x = (this.colNum * size) / columns;
    let y = (this.rowNum * size) / rows;
    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
    if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
    if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
    if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
    if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
    if (this.visited) {
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
    if (this.goal) {
      ctx.fillStyle = "green";
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
  }
}


// =========== DIJKSTRA PATHFINDING ALGORITHM =========== //
class MazeSolverDijkstra {
  constructor(maze) {
    this.maze = maze;
  }

  solve() {
    let startCell = this.maze.grid[0][0];
    let goalCell = this.maze.grid[this.maze.rows - 1][this.maze.columns - 1];
    let unvisitedCells = this.getAllCells();
  
    // Create a distances array and initialize all distances as Infinity
    let distances = new Array(this.maze.rows);
    for (let i = 0; i < this.maze.rows; i++) {
      distances[i] = new Array(this.maze.columns).fill(Infinity);
    }
  
    // Set the distance of the start cell to 0
    distances[startCell.rowNum][startCell.colNum] = 0;
  
    // Create a previous array to store the previous cell for each cell
    let previous = new Array(this.maze.rows);
    for (let i = 0; i < this.maze.rows; i++) {
      previous[i] = new Array(this.maze.columns).fill(null);
    }
  
    let intervalId = setInterval(() => {
      // Find the cell with the minimum distance among the unvisited cells
      let currentCell = this.getMinDistanceCell(distances, unvisitedCells);
  
      // Remove the current cell from the unvisited cells array
      unvisitedCells.splice(unvisitedCells.indexOf(currentCell), 1);
  
      // Highlight the current cell
      currentCell.highlight(this.maze.columns);
  
      // Stop the loop if the goal cell is reached
      if (currentCell === goalCell || unvisitedCells.length === 0) {
        clearInterval(intervalId);
        this.highlightPath(previous, startCell, goalCell);
        console.log("Goal Reached");
        return;
      }
  
      // Get the neighbors of the current cell
      let neighbors = this.getNeighbors(currentCell);
  
      // Update the distances to the neighboring cells
      for (let neighbor of neighbors) {
        let distance = distances[currentCell.rowNum][currentCell.colNum] + 1;
        if (distance < distances[neighbor.rowNum][neighbor.colNum]) {
          distances[neighbor.rowNum][neighbor.colNum] = distance;
          previous[neighbor.rowNum][neighbor.colNum] = currentCell;
        }
      }
    }, 100); // Control the speed from here, must insert slider.
  }
  


  // highlightGoal(cell) {
  //   console.log("Highlighting Goal"); // Debug log
  //   cell.highlightGreen(this.maze.columns, "green");
  // }

  highlightPath(previous, startCell, goalCell) {
    let currentCell = goalCell;
    let path = [];
  
    // Traverse the path from the goal cell to the start cell
    while (currentCell !== startCell) {
      path.push(currentCell);
      currentCell = previous[currentCell.rowNum][currentCell.colNum];
    }
    path.push(startCell);
  
    // Highlight each cell in the path with a delay of 0.1 seconds, can edit with slider later on
    let delay = 100;
    path.reverse().forEach((cell, index) => {
      setTimeout(() => {
        cell.highlightGreen(this.maze.columns);
      }, delay * index);
    });
  }
  

  
  

  getAllCells() {
    let cells = [];
    for (let row of this.maze.grid) {
      for (let cell of row) {
        cells.push(cell);
      }
    }
    return cells;
  }

  getMinDistanceCell(distances, cells) {
    let minDistance = Infinity;
    let minCell = null;
    for (let cell of cells) {
      let distance = distances[cell.rowNum][cell.colNum];
      if (distance < minDistance) {
        minDistance = distance;
        minCell = cell;
      }
    }
    return minCell;
  }

  getNeighbors(cell) {
    let neighbors = [];
    let row = cell.rowNum;
    let col = cell.colNum;
    let grid = this.maze.grid;

    if (row > 0 && !grid[row - 1][col].walls.bottomWall) {
      neighbors.push(grid[row - 1][col]);
    }
    if (row < this.maze.rows - 1 && !grid[row + 1][col].walls.topWall) {
      neighbors.push(grid[row + 1][col]);
    }
    if (col > 0 && !grid[row][col - 1].walls.rightWall) {
      neighbors.push(grid[row][col - 1]);
    }
    if (col < this.maze.columns - 1 && !grid[row][col + 1].walls.leftWall) {
      neighbors.push(grid[row][col + 1]);
    }

    return neighbors;
  }
}




// =========== A* PATHFINDING ALGORITHM =========== //
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(element, priority) {
    const item = { element, priority };
    let added = false;

    for (let i = 0; i < this.queue.length; i++) {
      if (item.priority < this.queue[i].priority) {
        this.queue.splice(i, 0, item);
        added = true;
        break;
      }
    }

    if (!added) {
      this.queue.push(item);
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.queue.shift().element;
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}



class MazeSolverAStar {
  constructor(maze) {
    this.maze = maze;
  }

  solve() {
    let startCell = this.maze.grid[0][0];
    let goalCell = this.maze.grid[this.maze.rows - 1][this.maze.columns - 1];
    let unvisitedCells = this.getAllCells();

    // Create a priority queue
    let queue = new PriorityQueue();

    // Create a distances array and initialize all distances as Infinity
    let distances = new Array(this.maze.rows);
    for (let i = 0; i < this.maze.rows; i++) {
      distances[i] = new Array(this.maze.columns).fill(Infinity);
    }

    // Set the distance of the start cell to 0
    distances[startCell.rowNum][startCell.colNum] = 0;

    // Enqueue the start cell with its total cost (distance + heuristic)
    queue.enqueue(startCell, this.calculateTotalCost(startCell, goalCell));

    let intervalId = setInterval(() => {
      // Dequeue the cell with the lowest total cost
      let currentCell = queue.dequeue();

      // Highlight the current cell
      currentCell.highlight(this.maze.columns);

      // Stop the loop if the goal cell is reached or no more unvisited cells
      if (currentCell === goalCell || unvisitedCells.length === 0) {
        clearInterval(intervalId);
        this.highlightPath(currentCell, startCell, goalCell); // Pass the goalCell as a parameter
        console.log("Goal Reached");
        return;
      }

      // Remove the current cell from the unvisited cells array
      unvisitedCells.splice(unvisitedCells.indexOf(currentCell), 1);

      // Get the neighbors of the current cell
      let neighbors = this.getNeighbors(currentCell);

    // Update the distances and enqueue the neighboring cells
    for (let neighbor of neighbors) {
      let distance = distances[currentCell.rowNum][currentCell.colNum] + 1;

      if (distance < distances[neighbor.rowNum][neighbor.colNum]) {
        distances[neighbor.rowNum][neighbor.colNum] = distance;
        neighbor.parent = currentCell; // Set the parent property
        let totalCost = distance + this.calculateHeuristic(neighbor, goalCell);
        queue.enqueue(neighbor, totalCost);
      }
    }
  }, 100); // Control the speed from here, can adjust with a slider.
  }

  calculateTotalCost(cell, goalCell) {
    let distance = this.calculateDistance(cell, goalCell);
    let heuristic = this.calculateHeuristic(cell, goalCell);
    return distance + heuristic;
  }

  calculateDistance(cell, goalCell) {
    let dx = Math.abs(cell.colNum - goalCell.colNum);
    let dy = Math.abs(cell.rowNum - goalCell.rowNum);
    return dx + dy;
  }

  calculateHeuristic(cell, goalCell) {
    let dx = Math.abs(cell.colNum - goalCell.colNum);
    let dy = Math.abs(cell.rowNum - goalCell.rowNum);
    return dx + dy;
  }

  highlightPath(currentCell, startCell, goalCell) {
    let path = [];
    let cell = currentCell;
  
    // Traverse from the goal cell to the start cell using the parent-child relationship
    while (cell !== startCell) {
      path.push(cell);
      cell = cell.parent;
    }
    path.push(startCell);
  
    // Highlight each cell in the path in green
    let delay = 100;
    path.reverse().forEach((cell, index) => {
      setTimeout(() => {
        cell.highlightGreen(this.maze.columns);
      }, delay * index);
    });
  
    // Highlight the goal cell separately
    setTimeout(() => {
      goalCell.highlightGreen(this.maze.columns);
    }, delay * path.length);
  }
  
  
  


  getAllCells() {
    let cells = [];
    for (let row of this.maze.grid) {
      for (let cell of row) {
        cells.push(cell);
      }
    }
    return cells;
  }

  getNeighbors(cell) {
    let neighbors = [];
    let row = cell.rowNum;
    let col = cell.colNum;
    let grid = this.maze.grid;

    if (row > 0 && !grid[row - 1][col].walls.bottomWall) {
      neighbors.push(grid[row - 1][col]);
    }
    if (row < this.maze.rows - 1 && !grid[row + 1][col].walls.topWall) {
      neighbors.push(grid[row + 1][col]);
    }
    if (col > 0 && !grid[row][col - 1].walls.rightWall) {
      neighbors.push(grid[row][col - 1]);
    }
    if (col < this.maze.columns - 1 && !grid[row][col + 1].walls.leftWall) {
      neighbors.push(grid[row][col + 1]);
    }

    return neighbors;
  }
}










//===================== Main ============== //


// create this global variable so that the 2 functions that can use this newMaze.
let newMaze

// function to call from maze.html (Generate Maze)
function generateMaze(numSize) {
  newMaze = new Maze(500, numSize, numSize); // Maze(pixels, rows, columns), calling constructor.
  newMaze.setup();
  newMaze.draw();
}

// function to call from maze.html (DJIKSTRA)
function solveMazeDijkstra(){                   
  let mazeSolver = new MazeSolverDijkstra(newMaze);
  mazeSolver.solve();
}

// function to call from maze.html (DJIKSTRA)
function solveMazeAStar(){
  let mazeSolver = new MazeSolverAStar(newMaze);
  mazeSolver.solve();
}


// for testing 
// let newMaze = new Maze(500, 10, 10);
// newMaze.setup();
// newMaze.draw();