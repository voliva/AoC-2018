const queue = require('priorityqueuejs');

const getFromMap = (erosionLvls, pos) => {
    return erosionLvls[pos.join(',')];
}
const setOnMap = (erosionLvls, pos, v) => {
    erosionLvls[pos.join(',')] = v;
}

// Coordinates in row-col (Y-X)
const getGeologicIndex = (pos, target, erosionLvls) => {
    if(pos[0] === 0 && pos[1] === 0) {
        return 0;
    }
    if(pos[0] === target[0] && pos[1] === target[1]) {
        return 0;
    }
    if(pos[0] === 0) {
        return pos[1] * 16807
    };
    if(pos[1] === 0) {
        return pos[0] * 48271
    }
    return getFromMap(erosionLvls, [pos[0], pos[1]-1]) *
    getFromMap(erosionLvls, [pos[0]-1, pos[1]]);
}

const calErosionLevel = (geologicIndex, depth) => (geologicIndex + depth) % 20183;
// 0: rocky, 1: Wet, 2: Narrow
const getRegionType = (pos, erosionLvls) => getFromMap(erosionLvls, pos) % 3;

const readInput = inputLines => {
    const inputValues = inputLines.map(
        i => i.split(': ')
    ).map(a => a[1]);
    const depth = Number(inputValues[0]);
    const [tx, ty] = inputValues[1].split(',').map(v => Number(v)); // Target is X-Y
    const target = [ty, tx];
    return [depth, target];
}

const solution1 = inputLines => {
    const [depth, target] = readInput(inputLines);

    const erosionLvls = {};
    let result = 0;
    for(r=0; r<=target[0]; r++) {
        for(c=0; c<=target[1]; c++) {
            const pos = [r,c];
            const geologicIndex = getGeologicIndex(pos, target, erosionLvls);
            setOnMap(erosionLvls, pos, calErosionLevel(geologicIndex, depth));
            result += getRegionType(pos, erosionLvls);
        }
    }

    return result;
}

const solution2 = inputLines => {
    const [depth, target] = readInput(inputLines);

    const erosionLvls = {};
    const rockTypes = {};
    const distances = {};

    const edges = new queue((a,b) => b.dist - a.dist);
    edges.enq({
        dist: 0,
        dest: [0,0,1] // 1 torch, 2 climbing
    });

    const ensurePosition = pos => {
        if(getFromMap(erosionLvls, pos) === undefined) {
            if(pos[0] > 0) {
                ensurePosition([pos[0]-1, pos[1]]);
            }
            if(pos[1] > 0) {
                ensurePosition([pos[0], pos[1]-1]);
            }
            const geologicIndex = getGeologicIndex(pos, target, erosionLvls);
            setOnMap(erosionLvls, pos, calErosionLevel(geologicIndex, depth));
            setOnMap(rockTypes, pos, getRegionType(pos, erosionLvls));
        }
        return getFromMap(rockTypes, pos);
    }

    const isCompatible = (type, equip) => {
        return type !== equip
    }

    let result = undefined;
    while(result === undefined) {
        const edge = edges.deq();
        if(getFromMap(distances, edge.dest) === undefined) {
            console.log(edge.dest);
            setOnMap(distances, edge.dest, edge.dist);

            const pos = edge.dest.slice(0, 2);
            const equip = edge.dest[2];

            const enqueueEquip = (pos, eq) => {
                const changePen = eq === equip ? 0 : 7;
                edges.enq({
                    dist: edge.dist + 1 + changePen,
                    dest: [...pos, eq]
                });
            }
            const enqueueAllEquips = pos => {
                if(pos[0] === target[0] && pos[1] === target[1]) {
                    enqueueEquip(pos, 1);
                    return;
                }

                const type = ensurePosition(pos);
                // console.log(pos, type);
                // process.exit(1);
                for(let eq=0; eq<3; eq++) {
                    if(isCompatible(type, eq)) {
                        enqueueEquip(pos, eq);
                    }
                }
            }

            if(pos[0] > 0) {
                enqueueAllEquips([pos[0]-1, pos[1]]);
            }
            if(pos[1] > 0) {
                enqueueAllEquips([pos[0], pos[1]-1]);
            }
            enqueueAllEquips([pos[0]+1, pos[1]]);
            enqueueAllEquips([pos[0], pos[1]+1]);
        }
        if(edge.dest[0] === target[0] && edge.dest[1] === target[1]) {
            result = edge.dist;
        }
    }

    // 6312 too high
    // 1069 too low
    return result;
}

module.exports = [ solution1, solution2 ];