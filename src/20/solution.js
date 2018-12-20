const move = (start, dir) => {
    const pos = start.split(',').map(v => parseInt(v));
    switch(dir) {
        case 'S':
            pos[0]+=2;
            break;
        case 'N':
            pos[1]-=2;
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

const iterate = (line, i, field, currentPos) => {
    const initialPos = currentPos;
    const branches = new Set();
    while(![')', '$'].includes(line[i]) && i < line.length) {
        console.log(i);
        switch(line[i]) {
            case '(':
                const res = iterate(line, i+1, field, currentPos);
                currentPos = res.branches;
                i = res.i + 1;
                break;
            case '|':
                currentPos.forEach(p => branches.add(p));
                currentPos = initialPos;
                break;
            default:
                const newPositions = new Set();
                currentPos.forEach(oldPos => {
                    const newPos = move(oldPos, line[i]);
                    newPositions.add(newPos);

                    field[newPos] = field[newPos] || {
                        distance: Infinity,
                        doors: new Set()
                    };
                    field[newPos].distance = Math.min(field[newPos].distance, field[oldPos].distance + 1);
                    field[newPos].doors.add(oldPos);
                    field[oldPos].doors.add(newPos);
                });
                currentPos = newPositions;
                break;
        }
        i++;
    }

    currentPos.forEach(pos => {
        branches.add(pos);
    });

    return {
        branches,
        i
    };
}

const solution1 = inputLines => {
    const field = {
        '0,0': {
            distance: 0,
            doors: new Set()
        }
    };

    const currentPos = new Set();
    currentPos.add('0,0');

    const input = inputLines[0];

    iterate(input, 0, field, currentPos);

    return Object.values(field).reduce((max, room) => {
        return Math.max(max, room.distance)
    }, 0);
};

const solution2 = inputLines => {

    return inputLines;
};

module.exports = [solution1, solution2];