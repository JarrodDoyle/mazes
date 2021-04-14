import { directions, shuffleArray } from "./utils.js";

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

export { kruskalsMaze };