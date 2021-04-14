import { between, directions, randInt } from "./utils.js";

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

function getInNeighbours(x, y, grid, size) {
    var inNeighbours = [];
    directions.forEach(function(direction) {
        var nx, ny;
        [nx, ny] = [x + direction[0], y + direction[1]];
        if (between(nx, 0, size) && between(ny, 0, size) && (grid[ny][nx] & 0x1) != 0) {
            inNeighbours.push(direction);
        }
    });
    return inNeighbours;
}

function primsMaze(grid, size) {
    var frontier = [];
    mark(randInt(0, size - 1), randInt(0, size - 1), grid, frontier, size);
    
    while (frontier.length != 0) {
        var x, y
        [x, y] = frontier.splice(randInt(0, frontier.length - 1), 1)[0];

        var nx, ny;
        var inNeighbours = getInNeighbours(x, y, grid, size);
        var direction = inNeighbours[randInt(0, inNeighbours.length - 1)];
        [nx, ny] = [x + direction[0], y + direction[1]];
        
        var index = directions.indexOf(direction);
        grid[y][x] |= 1 << index;
        grid[y + direction[1]][x + direction[0]] |= 1 << ((index + 2) % 4);

        mark(x, y, grid, frontier, size);
    }
}

export { primsMaze };