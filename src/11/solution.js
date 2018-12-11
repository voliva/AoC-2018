const createGrid = serialNumber => {
    const grid = new Array(300*300);

    for(let y=0; y<300; y++){
        for(let x=0; x<300; x++){
            const rackId = (x+1+10);
            grid[y*300 + x] =
                Math.floor((
                    (
                        (rackId * (y+1))
                        + serialNumber
                    )
                    * rackId
                ) / 100) % 10 - 5;
        }
    }

    return grid;
}

const calculateTotalPower = (grid, subGridSize, step = 1) => {
    const size = Math.sqrt(grid.length);
    const newSize = size - subGridSize;
    const totalPowerGrid = new Array(newSize*newSize);

    let max = {
        x: null, y: null,
        value: -Infinity
    }
    for(let y=0; y<newSize; y++){
        for(let x=0; x<newSize; x++){
            let totalPower = 0;
            for(let r=0; r<subGridSize; r += step){
                for(let c=0; c<subGridSize; c += step){
                    totalPower += grid[(y+r)*size + (x+c)];
                }
            }
            if(totalPower > max.value) {
                max = {
                    x, y,
                    value: totalPower
                }
            }
            totalPowerGrid[y*newSize + x] = totalPower;
        }
    }

    return {
        grid: totalPowerGrid,
        max
    }
}

const solution1 = (inputLines) => {
    const grid = createGrid(parseInt(inputLines[0]));

    const {max} = calculateTotalPower(grid, 3);

    return {
        x: max.x + 1,
        y: max.y + 1,
        value: max.value
    };
};

const solution2 = inputLines => {
    // Old one took 105 seconds, now 33s

    const originalGrid = createGrid(parseInt(inputLines[0]));

    const grids = {};

    for(let gridSize = 2; gridSize < 300; gridSize++) {
        console.log(gridSize);
        const calculatedGrids = Object.keys(grids)
            .reverse()
            .map(v => parseInt(v));
        const step = calculatedGrids.find(g => gridSize % g === 0) || 1;
        const grid = step === 1 ? originalGrid : grids[step].grid;
        grids[gridSize] = calculateTotalPower(grid, gridSize, step);
    }

    let max = {
        value: -Infinity,
        gridSize: null,
        params: null
    }
    Object.keys(grids).forEach(key => {
        const gridResult = grids[key];
        if(gridResult.max.value > max.value) {
            max = {
                value: gridResult.max.value,
                params: gridResult.max,
                gridSize: key
            };
        }
    });

    return max;
};

module.exports = [solution1, solution2];