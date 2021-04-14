let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 800;

class Tree {
    constructor() {
        this.parent = null;
    }

    root() {
        return (this.parent != null ? this.parent.root() : this);
    }

    connected(tree) {
        return this.root() == tree.root();
    }

    connect(tree) {
        tree.root().parent = this;
    }
}

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

function backtrackerMaze(cx, cy, grid, size) {
    shuffleArray([...directions]).forEach(function(direction) {
        var nx = cx + direction[0];
        var ny = cy + direction[1];
        
        if (between(ny, 0, size) && between(nx, 0, size) && grid[ny][nx] == 0) {
            var index = directions.indexOf(direction);
            grid[cy][cx] |= 1 << index;
            grid[ny][nx] |= 1 << ((index + 2) % 4);
            backtrackerMaze(nx, ny, grid, size);
        }
    });
}

function kruskalsMaze(grid, size) {
    var sets = Array(size).fill(null).map(()=>Array(size).fill(null).map(()=>new Tree()));
    var edges = [];
    for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
            if (y > 0) edges.push([x, y, directions[0]]);
            if (x > 0) edges.push([x, y, directions[3]]);
        }
    }
    shuffleArray(edges);

    while (edges.length != 0) {
        var x, y, direction, nx, ny, s1, s2;
        [x, y, direction] = edges.pop();
        [nx, ny] = [x + direction[0], y + direction[1]];
        [s1, s2] = [sets[y][x], sets[ny][nx]];

        if (!s1.connected(s2)) {
            s1.connect(s2);
            var index = directions.indexOf(direction);
            grid[y][x] |= 1 << index;
            grid[ny][nx] |= 1 << ((index + 2) % 4);
        }
    }
}

function mark(x, y, grid, frontier, size) {
    grid[y][x] |= 0x1;
    directions.forEach(function(direction) {
        var nx, ny;
        [nx, ny] = [x + direction[0], y + direction[1]];
        if (between(nx, 0, size) && between(ny, 0, size) && grid[ny][nx] == 0) {
            grid[ny][nx] |= 0x2;
            frontier.push([nx, ny]);
        }
    });
}

function primsMaze(grid, size) {
    var frontier = [];
    mark(Math.floor(Math.random()*(size - 1)), Math.floor(Math.random()*(size - 1)), grid, frontier, size);
    
    while (frontier.length != 0) {
        var x, y
        [x, y] = frontier.splice(Math.floor(Math.random()*(frontier.length - 1)), 1)[0];
        var inNeighbours = [];
        directions.forEach(function(direction) {
            var nx, ny;
            [nx, ny] = [x + direction[0], y + direction[1]];
            if (between(nx, 0, size) && between(ny, 0, size) && (grid[ny][nx] & 0x1) != 0) {
                inNeighbours.push(direction);
            }
        });
        var direction = inNeighbours[Math.floor(Math.random()*(inNeighbours.length - 1))];
        var nx, ny;
        [nx, ny] = [x + direction[0], y + direction[1]];
        var index = directions.indexOf(direction);
        grid[y][x] |= 1 << index;
        grid[ny][nx] |= 1 << ((index + 2) % 4);

        mark(x, y, grid, frontier, size);
    }
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