const move = (start, dir) => {
    const pos = start.split(',').map(v => parseInt(v));
    switch(dir) {
        case 'S':
            pos[0]+=2;
            break;
        case 'N':
            pos[0]-=2;
            break;
        case 'E':
            pos[1]+=2;
            break;
        case 'W':
            pos[1]-=2;
            break;
    }
    return pos.join(',');
}

const iterate = (line, i, distances, initialPosition = '0,0') => {
    distances[initialPosition] = distances[initialPosition] || 0;
    let initialDistance = distances[initialPosition];

    let localDistances = {
        [initialPosition]: initialDistance
    }

    let position = initialPosition;
    let distance = initialDistance;
    const subBranchSizes = [];

    while(![')', '$'].includes(line[i]) && i < line.length) {
        switch(line[i]) {
            case '(':
                const res = iterate(line, i+1, distances, position);
                subBranchSizes.push(distance + res.max);
                distance += res.cont;
                i = res.i;
                break;
            case '|':
                position = initialPosition;
                distance = initialDistance;
                break;
            default:
                const newPos = move(position, line[i]);
                if(newPos !== position) {
                    distance++;
                    distances[newPos] = distances[newPos] === undefined ? Infinity : distances[newPos];
                    distances[newPos] = Math.min(distances[newPos], distance);
                    localDistances[newPos] = distances[newPos];
                    position = newPos;
                }
                break;
        }
        i++;
    }

    const allSizes = Object.values(localDistances).concat(subBranchSizes);
    return {
        max: allSizes.reduce((max, v) => Math.max(max, v)) - initialDistance,
        cont: localDistances[position] - initialDistance,
        i
    }
}

const solution1 = inputLines => {
    return iterate(inputLines[0], 0, {}).max;
};

const solution2 = inputLines => {
    const distances = {}
    iterate(inputLines[0], 0, distances);
    return Object.values(distances).filter(d => d >= 1000).length;
};

module.exports = [solution1, solution2];