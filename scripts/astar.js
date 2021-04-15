import { directions } from "./utils.js";

function heuristic(cell, goal) {
    return Math.pow(goal[0] - cell[0], 2) + Math.pow(goal[1] - cell[1], 2);
}

function reconstructPath(cameFrom, current) {
    var path = [current];
    while (current in cameFrom) {
        current = cameFrom[current];
        path.push(current);
    }
    return path.reverse();
}

function solveAStar(grid, start, goal) {
    var openList = [start];
    var closedList = {};

    var gScore = {};
    gScore[start] = 0;

    var fScore = {};
    fScore[start] = heuristic(start, goal);

    while (openList.length != 0) {
        var currentNode = openList.reduce(function (r, a, i) {
            return !i || +fScore[a] < +fScore[r] ? a : r;
        }, undefined);
        var idx = openList.indexOf(currentNode);
        if (currentNode[0] == goal[0] && currentNode[1] == goal[1]) return reconstructPath(closedList, currentNode);

        openList.splice(idx, 1);
        
        var neighbours = [];
        for (var i=0; i<directions.length; i++) {
            var cellValue = grid[currentNode[1]][currentNode[0]];
            if ((cellValue & (0x1 << i)) != 0) {
                neighbours.push([currentNode[0] + directions[i][0], currentNode[1] + directions[i][1]]);
            }
        }

        neighbours.forEach(function(neighbour) {
            var tentative_gscore = gScore[currentNode] + 1;
            if (!(neighbour in gScore) || tentative_gscore < gScore[neighbour]) {
                closedList[neighbour] = currentNode;
                gScore[neighbour] = tentative_gscore;
                fScore[neighbour] = gScore[neighbour] + heuristic(neighbour, goal);
                if (!(neighbour in openList)) openList.push(neighbour);
            }
        });
    }
    return [];
}

export { solveAStar };