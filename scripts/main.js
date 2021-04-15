import { mazeTypes } from "./utils.js";
import { backtrackerMaze } from "./backtracker.js";
import { kruskalsMaze } from "./kruskals.js";
import { primsMaze } from "./prims.js";
import { solveAStar } from "./astar.js";

function generateMaze(type, size) {
    var grid = Array(size).fill(null).map(()=>Array(size).fill(0));
    switch (type) {
        case mazeTypes.BACKTRACKER:
            backtrackerMaze(0, 0, grid, size);
            break;
        case mazeTypes.KRUSKAL:
            kruskalsMaze(grid, size);
            break;
        case mazeTypes.PRIM:
            primsMaze(grid, size);
            break
    }
    drawMaze(grid);
    return grid;
}

function drawMaze(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var cellWidth = canvas.width / grid[0].length;
    var cellHeight = canvas.height / grid.length;

    for (var y = 0; y < grid.length; y++) {
        for (var x = 0; x < grid[y].length; x++) {
            var cellX = x * cellWidth;
            var cellY = y * cellHeight;
            var cell = grid[y][x];

            // Draw top/right/bottom/left edges of a cell if appropriate
            ctx.beginPath();
            if ((cell & 0x1) == 0) {
                ctx.moveTo(cellX, cellY);
                ctx.lineTo(cellX + cellWidth, cellY);
            }
            if ((cell & 0x2) == 0) {
                ctx.moveTo(cellX + cellWidth, cellY);
                ctx.lineTo(cellX + cellWidth, cellY + cellHeight);
            }
            if ((cell & 0x4) == 0) {
                ctx.moveTo(cellX, cellY + cellHeight);
                ctx.lineTo(cellX + cellWidth, cellY + cellHeight);
            }
            if ((cell & 0x8) == 0) {
                ctx.moveTo(cellX, cellY);
                ctx.lineTo(cellX, cellY + cellHeight);
            }

            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    }
}

function drawSolution(path, size) {
    var cWidth = canvas.width / size;
    var cHeight = canvas.height / size;
    
    // Iterate over the path moving from cell center to cell center
    ctx.beginPath();
    ctx.moveTo(path[0][0] * cWidth + cWidth / 2, path[0][1] * cHeight + cHeight / 2);
    for (var i=1; i<path.length; i++) {
        ctx.lineTo(path[i][0] * cWidth + cWidth / 2, path[i][1] * cHeight + cHeight / 2);
    }
    ctx.strokeStyle = "#ff0000";
    ctx.stroke();
}

function init() {
    // Build the options for the select component
    var select = document.getElementById("mazeTypes");
    for (var item in mazeTypes) {
        var option = document.createElement("option");
        option.text = mazeTypes[item];
        select.add(option);
    }

    var sizeBox = document.getElementById("mazeSize");
    sizeBox.value = 10;

    var genBtn = document.getElementById("generateMaze");
    genBtn.addEventListener("click", () => {
        mazeGrid = generateMaze(select.value, parseInt(sizeBox.value, 10));
        solved = false;
    });

    var solveBtn = document.getElementById("solveMaze");
    solveBtn.addEventListener("click", () => {
        // Don't bother recomputing a path if it's already been calculated for this maze
        if (!solved) {
            var path = solveAStar(mazeGrid, [0, 0], [sizeBox.value - 1, sizeBox.value - 1]);
            drawSolution(path, sizeBox.value);
            solved = true;
        }
    });

    mazeGrid = generateMaze(select.value, parseInt(sizeBox.value, 10));
}

let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 800;

var mazeGrid;
var solved = false;

window.onload = init;