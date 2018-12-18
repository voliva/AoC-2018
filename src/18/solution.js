const parseArea = inputLines => {
    const area = new Array(inputLines.length);
    inputLines.forEach((line,i) => {
        area[i] = line.split('');
    });
    return area;
}

const printArea = area => {
    const rows = area.map(r => r.join(''));
    return rows.join('\n');
}

// const valueOfYard = c => c === '.' ? 0 : (c === '|' ? 1 : 2);
const createHash = area => {
    return printArea(area);
    // Hash with collisions :/
    // return area.reduce((acc, row, r) => acc + row.reduce((acc, char, c) => {
    //     return acc + (r*row.length + c)*3 + valueOfYard(char);
    // }, 0), 0);
}

const countAdjacent = (area, row, col) => {
    const counts = {
        '.': 0,
        '#': 0,
        '|': 0
    };
    for(let r=row-1; r<=row+1; r++) {
        if(r < 0 || r >= area.length) continue;

        for(let c=col-1; c<=col+1; c++) {
            if(c < 0 || c >= area[r].length) continue;
            if(r === row && c === col) continue;

            counts[area[r][c]]++;
        }
    }
    return counts;
}

const countAll = (area) => {
    const counts = {
        '.': 0,
        '#': 0,
        '|': 0
    };
    area.forEach(row => {
        row.forEach(c => {
            counts[c]++;
        });
    });
    return counts;
}

const evolveChar = (area, row, col) => {
    const char = area[row][col];
    const adjacentCount = countAdjacent(area, row, col);

    switch(char) {
        case '.':
            if(adjacentCount['|'] >= 3) return '|';
            break;
        case '|':
            if(adjacentCount['#'] >= 3) return '#';
            break;
        case '#':
            if(!(adjacentCount['#'] >= 1 && adjacentCount['|'] >= 1)) return '.';
            break;
    }
    return char;
}

const evolve = area => {
    const newArea = new Array(area.length);
    area.forEach((row, r) => {
        newArea[r] = new Array(row.length);
        row.forEach((_, c) => {
            newArea[r][c] = evolveChar(area, r, c);
        });
    });
    return newArea;
}

const solution1 = inputLines => {
    let area = parseArea(inputLines);

    for(let i=0; i<10; i++) {
        area = evolve(area);
    }

    const result = countAll(area);

    return result['|'] * result['#'];
};

const solution2 = inputLines => {
    let area = parseArea(inputLines);

    const scoreCache = {};
    let previousHash = null;
    let loopHash = null;
    for(let i=0; i<10000000 && loopHash === null; i++) {
        area = evolve(area);

        const result = countAll(area);
        const score = result['|'] * result['#'];
        const hash = createHash(area);
        if(previousHash !== null) {
            scoreCache[previousHash].next = hash;
        }
        previousHash = hash;

        if(scoreCache[hash]) {
            loopHash = {i, hash};
        } else {
            scoreCache[hash] = {
                score,
                next: null
            }
        }
    }

    // Find out loop size
    let loopSize = null;
    let currentHash = scoreCache[loopHash.hash].next;
    for(let i=1; i<loopHash.i && loopSize === null; i++) {
        if(currentHash === loopHash.hash) {
            loopSize = i;
        }
        currentHash = scoreCache[currentHash].next;
    }

    const remainingIterations = 1000000000 - loopHash.i - 1;
    const loopIterations = remainingIterations % loopSize;

    currentHash = loopHash.hash;
    for(let i=0; i<loopIterations; i++) {
        currentHash = scoreCache[currentHash].next;
    }

    return scoreCache[currentHash].score;
};

module.exports = [solution1, solution2];