

//This function defines the cell as an object prototype. The cell object has two key elements, it can have neighbours and it is either alive or dead.
//using Math.random, each cell has a 0.5 chance of being alive.
function cell () {
  this.alive = Math.random() > 0.5;
  this.neighbours = 0;
};

//This function defines game as an object prototype. It has 3 key elements that define the structure of the game.
//This. points to the object that "owns" the local code. In this case the object is game.
function game(size) {
  this.size = size;// Instead of giving size a numerical value I have kept this netural so that it can be easily adjusted later
  this.grid = this.generateGrid(size);// I have given the grid the value of the gridGenerator function.
  this.directions = [[-1,-1], [-1, 0], [-1, 1], [0,-1], [0, 1], [1, -1], [1, 0], [1, 1]];//This 2D array tells gives the cells directions about how to move within the grid.

}

//The .prototype property allows you to add new properties to an existing object prototype.
//The following two algorithyms add two functions to the game object that further define the board.

//This function generates a grid and pushes a new cell into each row of the grid.
  game.prototype.generateGrid = function (size) {
    var grid = [];
    for (var i = 0; i < size; i++) {
      var row = [];
      for (var j = 0; j < size; j++) {
        row.push (new cell());
      }
      grid.push(row);
    }
    return grid;
  };

//This function updates the board checking to see which cells are alive and which are dead.
game.prototype.show = function () {
  var updatedBoard = "";
  for (var i = 0; i < this.size; i++) {
    var row = this.grid[i];
    var rowString = ""
    for (var j = 0; j < this.size; j++) {
      var cell = row [j];
      if (cell.alive){
        rowString += "<td class='alive'> </td>";
      } else {
        rowString += "<td class='dead'> </td>";
      }
    }
    updatedBoard += "<tr>" + rowString + "</tr>";
  }
  document.getElementById("board").innerHTML = updatedBoard;
};

// Now that the structure of the board has been bulit the following functions outline the logic of the game.
// To do this I use the .prototype method, adding more functions to the game object.

//the isUnderPopulated function calls the grid variable and follows through its code checking for cells that have less then 2 neighbours
// r and c are the row and columns outlined in the grid
game.prototype.isUnderPopulated = function (r,c) {
  var cell = this.grid[r][c];
  return cell.neighbours < 2;
};

////the isOverPopulated function calls the grid variable and follows through its code checking for cells that have more then 3 neighbours
game.prototype.isOverPopulated = function (r,c) {
  var cell = this.grid[r][c];
  return cell.neighbours > 3;
};

////the isResurrectable function calls the grid variable and will return a cell, if the cell has 3 alive neighbours
game.prototype.isResurrectable = function (r,c) {
  var cell = this.grid[r][c];
  return !cell.alive && cell.neighbours === 3
};

//This function determines whether or not cells are in the bounds of the grid. It is called in the following algorithm
game.prototype.isInBounds = function (r,c) {
  return r >= 0 && r < this.size && c>= 0 && c < this.size;
};

//This function updates the neighbouring cells, by moving through the grid checking if their are any cells that need to come back to life or die.
//It calls on the above isInBounds function to ensure that cells only replicate within the grid.
//It also uses the 2D array directions (that were defined earlier) to naviagate through the grid
game.prototype.updateNeigboursForCell = function (r,c) {
  var cell = this.grid[r][c];
  cell.neighbours = 0;
  for (var i = 0; i < this.directions.length; i++) {
    var direction = this.directions[i];
    var dr = direction[0];
    var dc = direction[1];
    if (this.isInBounds(r + dr,c + dc)) {
      var neighbour = this.grid[r + dr][c + dc];
      if (neighbour.alive){
        cell.neighbours++;
      }
    }
  }
};

//This function loops the board and updates all the cell neighbours based on updateNeigboursForCell function's calculations
game.prototype.updateNeigbours = function () {
  for (var i = 0; i < this.size; i++){
    for (var j = 0; j < this.size; j++){
    this.updateNeigboursForCell(i,j);
    }
  }
};

//This function checks the state of each cell on the board after each turn.
game.prototype.updateStateForCell = function (r,c) {
  var cell = this.grid[r][c];
  if (this.isUnderPopulated(r,c)|| this.isOverPopulated(r,c)) {
    cell.alive = false;
  }
  else if (this.isResurrectable(r,c)) {
    cell.alive = true;
  }
};

//This function loops the board and updates all the cell states based on updateStateForCell function's calculations
game.prototype.updateStates = function () {
  for (var i = 0; i < this.size; i++){
    for (var j = 0; j < this.size; j++){
    this.updateStateForCell(i,j);
    }
  }
};

//This variable calls the game object with a board size of 70. The intervalVariable is also decleared here.
var game = new game(70);
var intervalVariable;

//This function outlines the stop and start condtions for the buttons. The intervalVariable is set to 20,
//this means there will be 20 milliseconds between each iteration of the game.
var startStop = function(action){
    if (action == "stop"){
      clearInterval(intervalVariable);
    }
    else{
      intervalVariable = setInterval(function(){
          game.show();
          game.updateNeigbours();
          game.updateStates();
        }, 20);
    }
}
