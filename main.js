
let NumberOfColumns = 50;
let NumberOfRows = 50;
let grid = [];
let openSet = [];
let closeSet = [];
let start;
let end;
let w, h;
let path = [];
let counter = 0;




function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    //wall basically obstacles for the maze 
    this.wall = Math.random() < 0.5;

    this.show = function (col) {
        fill(this.wall ? 0 : col);
        noStroke();
        rect(this.i * w, this.j * h, w, h);
    };

    this.addNeighbors = function (grid) {
        const i = this.i;
        const j = this.j;
        if (i < NumberOfColumns - 1) this.neighbors.push(grid[i + 1][j]);
        if (i > 0) this.neighbors.push(grid[i - 1][j]);
        if (j < NumberOfRows - 1) this.neighbors.push(grid[i][j + 1]);
        if (j > 0) this.neighbors.push(grid[i][j - 1]);


        //this will make sure we stick to the daigonal closes 
        if (i > 0 && j > 0) {
            this.neighbors.push(grid[i - 1][j - 1]);
        }
        if (i < NumberOfColumns - 1 && j > 0) {
            this.neighbors.push(grid[i + 1][j - 1]);
        }
        if (i > 0 && j < NumberOfRows - 1) {
            this.neighbors.push(grid[i - 1][j + 1]);
        }
        if (i < NumberOfColumns - 1 && j < NumberOfRows - 1) {
            this.neighbors.push(grid[i + 1][j + 1]);
        }


        //can add more centered towards daigonals also 
    };
}

function removeFromArray(arr, element) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === element) {
            arr.splice(i, 1);
        }
    }
}

function heuristic(a, b) {
    // Simple Euclidean distance
    // let d = dist(a.i, a.j, b.i, b.j);  it was not worign good 

    // use manhatand istance 
    return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
}

function setup() {
    createCanvas(800, 800);
    w = width / NumberOfColumns;
    h = height / NumberOfRows;

    for (let i = 0; i < NumberOfColumns; i++) {
        grid[i] = new Array(NumberOfRows);
    }

    for (let i = 0; i < NumberOfColumns; i++) {
        for (let j = 0; j < NumberOfRows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }


    for (let i = 0; i < NumberOfColumns; i++) {
        for (let j = 0; j < NumberOfRows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    start = grid[0][0];

    end = grid[NumberOfColumns - 1][NumberOfRows - 1];
    start.wall = false;
    end.wall = false;
    openSet.push(start);
}

function draw() {
    if (openSet.length > 0) {
        // A* algorithm
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }

        let current = openSet[lowestIndex];

        if (current === end) {
            console.log("Path Found!");
            console.log("Counter is " + counter);
            noLoop();
        }

        removeFromArray(openSet, current);
        closeSet.push(current);

        let neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!closeSet.includes(neighbor) && !neighbor.wall) {
                let tempG = current.g + 1;


                let newpath = false;
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                        newpath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    openSet.push(neighbor);
                    //as this is new path 
                    newpath = true;
                }

                if (newpath) {
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }

            }
        }

        // Rendering
        background(0);
        for (let i = 0; i < NumberOfColumns; i++) {
            for (let j = 0; j < NumberOfRows; j++) {
                grid[i][j].show(color(200)); // Color the grid
            }
        }
        for (let i = 0; i < NumberOfColumns; i++) {
            for (let j = 0; j < NumberOfRows; j++) {
                grid[i][j].show(color(200));
            }
        }

        for (let i = 0; i < closeSet.length; i++) {
            closeSet[i].show(color(220, 0, 0));
        }
        for (let i = 0; i < openSet.length; i++) {
            openSet[i].show(color(0, 210, 0));
        }

        counter = counter + 1;
        //goal color 
        end.show(color(255, 255, 0));
        // Path rendering
        path = [];
        let temp = current;
        path.push(temp);
        while (temp.previous) {
            path.push(temp.previous);
            temp = temp.previous;
        }

        for (let i = 0; i < path.length; i++) {
            path[i].show(color(0, 0, 100));
        }
    } else {
        console.log("No Solution");
        noLoop();
    }
}







