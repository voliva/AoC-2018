const parseArea = inputLines => {
    const area = new Array(inputLines.length);
    inputLines.forEach((line,i) => {
        area[i] = line.split('');
    });
    return area;
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
    console.log(result);

    return result['|'] * result['#'];
};

const solution2 = inputLines => {

    return inputLines;
};

module.exports = [solution1, solution2];