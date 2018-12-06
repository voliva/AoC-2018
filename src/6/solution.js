const { groupBy, mapObjIndexed, omit } = require('ramda');

const parseCoordinates = inputLines => inputLines.map(
    line => line.split(', ').map(n => parseInt(n))
);

const getExtremes = coordinates => coordinates.reduce(
    ({min, max}, c) => ({
        min: [Math.min(min[0], c[0]), Math.min(min[1], c[1])],
        max: [Math.max(max[0], c[0]), Math.max(max[1], c[1])]
    })
, {
    min: [Infinity, Infinity],
    max: [-Infinity, -Infinity]
});

const normalize = (coordinates, min) => coordinates.map((c, i) => [
    c[0] - min[0],
    c[1] - min[1],
    i
]);

const getDistance = (c1, c2) => Math.abs(c1[0]-c2[0]) + Math.abs(c1[1]-c2[1]);

const getClosestTo = (x, y, coordinates) => coordinates.reduce((acc, c) => {
    const distance = getDistance([x,y], c);
    if(acc.distance > distance) {
        return {
            closest: c,
            distance
        }
    }
    if(acc.distance === distance) {
        return {
            closest: null,
            distance
        }
    }
    return acc;
}, {
    closest: null,
    distance: Infinity
}).closest;

const solution1 = inputLines => {
    const bigCoordinates = parseCoordinates(inputLines);
    const {min, max: _max} = getExtremes(bigCoordinates);
    const coordinates = normalize(bigCoordinates, min);
    const [max] = normalize([_max], min);
    const nCols = max[0]+1;
    const nRows = max[1]+1;

    const array = new Array(nCols * nRows);
    const getPos = (x, y) => y*nCols + x;

    for(let y=0; y<nRows; y++) {
        for(let x=0; x<nCols; x++) {
            const i = getPos(x, y);
            array[i] = getClosestTo(x, y, coordinates);
        }
    }

    const groups = groupBy(coord => coord && coord[2], array);
    const counts = mapObjIndexed(arr => arr.length, groups);

    const edges = new Set();
    for(let y=0; y<nRows; y++) {
        const il = getPos(0, y);
        edges.add(array[il] && array[il][2]);
        const ir = getPos(max[0], y);
        edges.add(array[ir] && array[ir][2]);
    }
    for(let x=0; x<nRows; x++) {
        const it = getPos(x, 0);
        edges.add(array[it] && array[it][2]);
        const ib = getPos(x, max[1]);
        edges.add(array[ib] && array[ib][2]);
    }

    const finiteCounts = omit([...edges], counts);
    
    return Object.values(finiteCounts).reduce((a,b) => Math.max(a,b), 0);
};

const solution2 = inputLines => {
    const coordinates = parseCoordinates(inputLines);
    const {min, max} = getExtremes(coordinates);
    
    let total = 0;
    for(let y=min[1]; y<=max[1]; y++) {
        for(let x=min[0]; x<=max[0]; x++) {
            const coord = [x,y];
            const localTotal = coordinates.reduce((acc, c) => acc + getDistance(coord, c), 0)
            if(localTotal < 10000) {
                total++;
            }
        }
    }

    return total;
};

module.exports = [solution1, solution2];
