/**
* Author: Evan Putnam
* Description: A javascript application that allows you to input
* a sudoku 9x9 puzzle and it will be solved.
* 0 means empty space.
*/

class Square{

  /**
  * Constructor for Square object which is a space on the grid.
  * Takes in x, y, value, and quadrant its in.
  * Quadrants are 1-9 and are the square inner sections.
  */
  constructor(x, y, val, quadrant){
    this.x = x;
    this.y = y;
    this.val = val;
    this.quadrant = quadrant;
    this.isComplete = false;
  }

  /**
  * Sees if can set the value beyond what is already.
  * Used in debugging but not in final.  Kept it for future personal use...
  */
  setVal(value){
    if (value < 10 && value >= 0) {
      this.val = value;
      return true
    }
    return false;
  }
}


class Grid{

  /**
  * Constructor for the grid class.
  * Grid is just a 2d array list of spaces.
  */
  constructor(){
    this.grid = new Array(9);
    for(var i = 0; i < 9; i++){
      this.grid[i] = new Array(9);
    }

    for (var x = 0; x < 9; x++) {
      for (var y = 0; y < 9; y++) {
        this.grid[y][x] = new Square(x, y, 0, Grid.getQuadrant(x,y));
      }
    }
  }

  /**
  * Static function to get the quadrant of an x/y location
  */
  static getQuadrant(x, y){
    var quadrant = 0;
    if (x >= 6) {
      if (y >= 6) {
        quadrant = 9;
      }else if (y >= 3) {
        quadrant = 6;
      }else {
        quadrant = 3;
      }
    }else if (x >= 3) {
      if (y >= 6) {
        quadrant = 8;
      }else if (y >= 3) {
        quadrant = 5;
      }else {
        quadrant = 2;
      }
    }else{
      if (y >= 6) {
        quadrant = 7;
      }else if (y >= 3) {
        quadrant = 4;
      }else {
        quadrant = 1;
      }
    }
    return quadrant;
  }

  /**
  * Prints out the grid to the terminal.  Used for testing
  */
  printGrid(){
    for (var x = 0; x < 9; x++) {
      for (var y = 0; y < 9; y++) {
        process.stdout.write(this.grid[y][x].val.toString()+" ")
      }
      console.log("");
    }
  }

  /**
  * TODO add population algo
  * Used for terminal testing
  */
  populateBoard(config){

  }

  /**
  * Gets the next available coordinate.
  */
  getNextCoord(){
    for (var x = 0; x < 9; x++) {
      for (var y = 0; y < 9; y++) {
        if (this.grid[y][x].val == 0) {
          return this.grid[y][x]
        }
      }
    }
    //Indicates the grid is complete.
    this.isComplete = true;
    return null;
  }

  /**
  * Checks if the current configuration is valid.
  * Recursive backtracking is involved where the config is modified each
  * level of recursion.
  */
  checkValid(){

    var coord = this.getNextCoord();
    if (this.isComplete) {
      return true;
    }

    //Iterates through
    for (var i = 1; i < 10; i++) {
      if (this.checkConflict(coord.x, coord.y, i) == true) {
        //// TODO:
        coord.val = i;
        if (this.checkValid()) {
          return true;
        }else{
          coord.val = 0;
        }
      }
    }
    return false;

  }

  /**
  * Checks to see if there is a conflict on the board
  * Looks for quadrant/up/down conflicts.
  */
  checkConflict(x, y, value){
    for (var v = 0; v < 9; v++) {
      if (this.grid[y][v].val == value) {
        return false;
      }
    }

    for (var i = 0; i < 9; i++) {
      if (value == this.grid[i][x].val) {
        return false;
      }
    }

    var quad = this.getElemsInQuadrant(this.grid[y][x].quadrant)

    if (quad.includes(value )) {
      return false;
    }

    return true;


  }



  /**
  * Returns a list of all elements in the given quadrant
  */
  getElemsInQuadrant(quadrant){
    var locations = [[0,0], [3,0],[6,0], [0, 3], [3, 3],[6, 3],[0,6],[3,6],[6,6]]
    var quad = locations[quadrant-1];
    var arr = []
    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        if (this.grid[quad[1]+y][quad[0]+x].val != 0)  {
          arr.push(this.grid[quad[1]+y][quad[0]+x].val)
        }
      }
    }
    return arr;
  }

}



/**
//Checks for built non html stuff

var g = new Grid();
g.checkValid()
g.printGrid();
*/

//Grid object
var grid = new Grid();

//Store the buttons that are created
var buttons = []

for (var y = 0; y < 9; y++) {
  for (var x = 0; x < 9; x++) {
    var button = document.createElement("button");
    //Add a space attribute to the buttons
    button.space = grid.grid[x][y];
    button.innerText = button.space.val.toString();
    button.addEventListener("click", function(){
      if (this.space.val == 9) {
          this.space.val = 0;
      }else{
        this.space.val += 1;
      }
      this.innerText = this.space.val.toString();
    })
    buttons.push(button);
    document.getElementById("iText").appendChild(button);

    if (x % 3 == 2) {
      document.getElementById("iText").appendChild(document.createTextNode(" "))
    }

  }
  document.getElementById("iText").appendChild(document.createElement("br"))
  if (y % 3 == 2) {
    document.getElementById("iText").appendChild(document.createElement("br"))
  }
}

document.body.appendChild(document.createElement("br"));
var submitButton = document.createElement("button");
submitButton.buttons = buttons;
submitButton.innerText = "Solve Puzzle";
//Event listenter to solve.
submitButton.addEventListener("click", function(){
  var valid = grid.checkValid();
  if (!valid) {
    alert("No valid solution found")
  }else{
    var i = 0;
    for (var x = 0; x < 9; x++) {
      for (var y = 0; y < 9; y++) {
        this.buttons[i].innerText = this.buttons[i].space.val.toString()
        i += 1;
      }
    }
  }
  document.getElementById("iText").removeChild(this);
});
document.getElementById("iText").appendChild(submitButton);
