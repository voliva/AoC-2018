
const getErosionLvl = (erosionLvls, pos) => {
    return erosionLvls[pos.join(',')];
}
const setErosionLvl = (erosionLvls, pos, v) => {
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
    return getErosionLvl(erosionLvls, [pos[0], pos[1]-1]) *
    getErosionLvl(erosionLvls, [pos[0]-1, pos[1]]);
}

const calErosionLevel = (geologicIndex, depth) => (geologicIndex + depth) % 20183;
// 0: rocky, 1: Wet, 2: Narrow
const getRegionType = (pos, erosionLvls) => getErosionLvl(erosionLvls, pos) % 3;

const solution1 = inputLines => {
    const inputValues = inputLines.map(
        i => i.split(': ')
    ).map(a => a[1]);
    const depth = Number(inputValues[0]);
    const [tx, ty] = inputValues[1].split(',').map(v => Number(v)); // Target is X-Y
    const target = [ty, tx];

    const erosionLvls = {};
    let result = 0;
    for(r=0; r<=target[0]; r++) {
        for(c=0; c<=target[1]; c++) {
            const pos = [r,c];
            const geologicIndex = getGeologicIndex(pos, target, erosionLvls);
            setErosionLvl(erosionLvls, pos, calErosionLevel(geologicIndex, depth));
            result += getRegionType(pos, erosionLvls);
        }
    }

    return result;
}


module.exports = [ solution1 ];