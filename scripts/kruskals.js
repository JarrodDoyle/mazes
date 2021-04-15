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

function getEdges(size) {
    // Builds a list of North and West edges then shuffles
    // Only 2 directions are needed because all edges are bi-directional
    var edges = [];
    for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
            if (y > 0) edges.push([x, y, directions[0]]);
            if (x > 0) edges.push([x, y, directions[3]]);
        }
    }
    shuffleArray(edges);
    return edges;
}

function kruskalsMaze(grid, size) {
    // The sets can be stored as simple trees, we don't need to know all the cells in a
    // set. We only need to know if the root nodes are the same when comparing two cells
    var sets = Array(size).fill(null).map(()=>Array(size).fill(null).map(()=>new Tree()));
    var edges = getEdges(size);

    // For each check if the two cells are connected (in the same set)
    // Connect them if they aren't otherwise just ignore the edge
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