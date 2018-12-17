const lineRegex = /^([x|y])=(\d+), [x|y]=(\d+)..(\d+)$/;

const parseRange = line => {
    const result = lineRegex.exec(line);
    if(!result) {
        console.log(line);
        throw 'err';
    }
    const [_,fixed,fv,r0,rf] = result;
    const fixedRange = {
        start: parseInt(fv),
        end: parseInt(fv)
    };
    const rangedRange = {
        start: parseInt(r0),
        end: parseInt(rf)
    }
    return {
        x: fixed === 'x' ? fixedRange : rangedRange,
        y: fixed === 'y' ? fixedRange : rangedRange
    }
}

const createSoil = max => {
    const soil = new Array(max.y+1);
    for(let y=0; y<=max.y; y++) {
        soil[y] = new Array(max.x+1);
        for(let x=0; x<=max.x; x++) {
            soil[y][x] = '.';
        }
    }
    return soil;
}

const isEmpty = (soil, point) => soil[point.y][point.x] === '.';

const printSoil = (soil, start = {x: 500, y:15}) => {
    soil.slice(Math.max(0,start.y-15), start.y+15).forEach((row, y) => {
        console.log(row.slice(start.x-15, start.x+15).join(''))
    });
    console.log('');
}

const printFullSoil = (soil) => {
    soil.forEach((row) => {
        console.log(row.join(''))
    });
    console.log('');
}

const fillSoilWithClay = (soil, ranges) => {
    ranges.forEach(r => {
        for(let y=r.y.start; y<=r.y.end; y++) {
            for(let x=r.x.start; x<=r.x.end; x++) {
                soil[y][x] = '#'
            }
        }
    });
}

// Returns [canSettle, pointer]
const flowHoriz = (soil, point, dir) => {
    let y = point.y;
    for(let x=point.x+dir; x<soil[y].length && x >= 0; x += dir) {
        if(isEmpty(soil, {x, y}) || soil[y][x] === '|') {
            soil[y][x] = '|';
            if(isEmpty(soil, {x, y: y+1})) {
                return [false, {x,y}];
            }
            if(soil[y+1][x] === '|') {
                return [false, null];
            }
        }else {
            if(soil[y][x] === '#') {
                return [true, {x: x-dir, y}];
            }
        }
    }
    return [false, null];
}

const flowDown = async soil => {
    const waterPointers = [{x: 500, y: 0}]

    while(waterPointers.length > 0) {
        const start = waterPointers.shift();

        // if(waterPointers.length === 0) {
        //     printSoil(soil, start);
        //     await(new Promise(resolve => setTimeout(resolve, 33)));
        // }

        let downPos = {x: start.x, y: start.y+1};
        if(downPos.y >= soil.length) {
            continue;
        }
        if(isEmpty(soil, downPos)) {
            soil[downPos.y][downPos.x] = '|';
            waterPointers.push(downPos);
        }else if(soil[downPos.y][downPos.x] !== '|') {
            soil[start.y][start.x] = '|';
            const [settleRight, rightPointer] = flowHoriz(soil, start, 1);
            const [settleLeft, leftPointer] = flowHoriz(soil, start, -1);
            if(settleRight && settleLeft) {
                for(x = leftPointer.x; x <= rightPointer.x; x++) {
                    soil[start.y][x] = '~';
                }

                // Water can settle
                waterPointers.push({
                    x: start.x,
                    y: start.y-1
                });
            }
            if (rightPointer && !settleRight)
                waterPointers.push(rightPointer);
            if (leftPointer && !settleLeft)
                waterPointers.push(leftPointer);
        }
    }
}

const solution1 = inputLines => {
    const ranges = inputLines.map(parseRange);
    const max = ranges.reduce(({x,y}, r) => ({
        x: Math.max(x, r.x.end),
        y: Math.max(y, r.y.end)
    }), { x: 0, y: 0});
    const min = ranges.reduce(({x,y}, r) => ({
        x: Math.min(x, r.x.start),
        y: Math.min(y, r.y.start)
    }), { x: Infinity, y: Infinity});

    const soil = createSoil(max);
    fillSoilWithClay(soil, ranges);

    flowDown(soil);

    let count = 0;
    soil.slice(min.y, max.y+1).forEach(row => {
        row.forEach(col => {
            if(col === '~' || col === '|') {
                count++;
            }
        })
    });

    // printFullSoil(soil);

    return count;
};

const solution2 = inputLines => {

    return inputLines;
};

module.exports = [solution1, solution2];