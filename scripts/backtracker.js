import { between, directions, shuffleArray } from "./utils.js";

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

export { backtrackerMaze };