import { mazeTypes } from "./utils.js";
import { backtrackerMaze } from "./backtracker.js";
import { kruskalsMaze } from "./kruskals.js";
import { primsMaze } from "./prims.js";

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
    // console.log(grid);
    drawMaze(grid);
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

            ctx.stroke();
        }
    }
}

function init() {
    var select = document.getElementById("mazeTypes");
    for (var item in mazeTypes) {
        var option = document.createElement("option");
        option.text = mazeTypes[item];
        select.add(option);
    }

    var sizeBox = document.getElementById("mazeSize");
    sizeBox.value = 10;

    var btn = document.getElementById("generateMaze");
    btn.addEventListener("click", () => {
        generateMaze(select.value, parseInt(sizeBox.value, 10));
    });
}

let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 800;

window.onload = init;