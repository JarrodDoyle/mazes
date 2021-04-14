let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');


canvas.width = 800;
canvas.height = 800;

const mazeTypes = {
    BACKTRACKER: "Recursive Backtracker",
    ELLER: "Eller's",
    KRUSKAL: "Kruskal's",
    PRIM: "Prim's",
    DIVISION: "Recursive Division",
    ALDOUSBRODER: "Aldous-Broder",
    WILSON: "Wilson's",
    HUNTANDKILL: "Hunt-and-Kill",
    GROWINGTREE: "Growing Tree",
    BINARYTREE: "Binary Tree",
    SIDEWINDER: "Sidewinder"
}

const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function between(value, min, max) {
    return (value >= min) && (value < max);
}

function generateMaze(type, size) {
    var grid = Array(size).fill(null).map(()=>Array(size).fill(0));
    switch (type) {
        case mazeTypes.BACKTRACKER:
            backtrackerMaze(0, 0, grid);
            break;
    }
    console.log(grid);
    drawMaze(grid);
}

function backtrackerMaze(cx, cy, grid) {
    shuffleArray([...directions]).forEach(function(direction) {
        var nx = cx + direction[0];
        var ny = cy + direction[1];
        
        if (between(ny, 0, grid.length) && between(nx, 0, grid[ny].length) && grid[ny][nx] == 0) {
            var index = directions.indexOf(direction);
            grid[cy][cx] |= 1 << index;
            grid[ny][nx] |= 1 << ((index + 2) % 4);
            backtrackerMaze(nx, ny, grid);
        }
    });
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

window.onload = init;