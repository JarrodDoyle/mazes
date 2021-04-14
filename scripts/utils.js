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
        const j = randInt(0, i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function between(value, min, max) {
    return (value >= min) && (value < max);
}

export { mazeTypes, directions, shuffleArray, randInt, between };