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
    const branchSizes = [];
    let subBranchDistance = 0;

    while(![')', '$'].includes(line[i]) && i < line.length) {
        switch(line[i]) {
            case '(':
                const res = iterate(line, i+1);
                subBranchDistance += res.size;
                i = res.i + 1;
                break;
            case '|':
                branchSizes.push(localDistances[position] + subBranchDistance);
                position = '0,0';
                subBranchDistance = 0;
                break;
            default:
                const newPos = move(position, line[i]);
                localDistances[newPos] = localDistances[newPos] === undefined ? Infinity : localDistances[newPos];
                localDistances[newPos] = Math.min(localDistances[newPos], localDistances[position] + 1);
                position = newPos;
                break;
        }
        i++;
    }

    branchSizes.push(localDistances[position] + subBranchDistance);

    console.log(branchSizes, localDistances);
    return {
        size: branchSizes.reduce((max, v) => Math.max(max, v)),
        i
    }
}

// 4332 too high

const solution1 = inputLines => {
    return iterate('^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$', 0);
};

const solution2 = inputLines => {

    return inputLines;
};

module.exports = [solution1, solution2];