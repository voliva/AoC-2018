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

const iterate = (line, i) => {
    let localDistances = {
        '0,0': 0
    };
    let position = '0,0';
    let distance = 0;
    const subBranchSizes = [];

    while(![')', '$'].includes(line[i]) && i < line.length) {
        switch(line[i]) {
            case '(':
                const res = iterate(line, i+1);
                subBranchSizes.push(distance + res.max);
                distance += res.cont;
                i = res.i;
                break;
            case '|':
                position = '0,0';
                distance = 0;
                break;
            default:
                const newPos = move(position, line[i]);
                if(newPos !== position) {
                    distance++;
                    localDistances[newPos] = localDistances[newPos] === undefined ? Infinity : localDistances[newPos];
                    localDistances[newPos] = Math.min(localDistances[newPos], distance);
                    position = newPos;
                }
                break;
        }
        i++;
    }

    // console.log(localDistances, subBranchSizes, localDistances[position]);
    return {
        max: Object.values(localDistances).concat(subBranchSizes).reduce((max, v) => Math.max(max, v)),
        cont: localDistances[position],
        i
    }
}

// 4332 too high

const solution1 = inputLines => {
    return iterate(inputLines[0], 0);
};

const solution2 = inputLines => {

    return inputLines;
};

module.exports = [solution1, solution2];