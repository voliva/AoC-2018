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

const solution1 = (inputLines, gridSize = 3) => {
    const grid = createGrid(parseInt(inputLines[0]));

    let max = {
        x: null, y: null,
        value: -Infinity
    }
    for(let y=0; y<300-gridSize; y++){
        for(let x=0; x<300-gridSize; x++){
            let totalPower = 0;
            for(let r=0; r<gridSize; r++){
                for(let c=0; c<gridSize; c++){
                    totalPower += grid[(y+r)*300 + (x+c)];
                }
            }
            if(totalPower > max.value) {
                max = {
                    x, y,
                    value: totalPower
                }
            }
        }
    }

    return {
        x: max.x + 1,
        y: max.y + 1,
        value: max.value
    };
};

const solution2 = inputLines => {
    let max = {
        value: -Infinity,
        gridSize: null,
        params: null
    }
    for(let gridSize = 1; gridSize < 300; gridSize++) {
        console.log(gridSize);
        const result = solution1(inputLines, gridSize);
        if(result.value > max.value) {
            max = {
                value: result.value,
                gridSize,
                params: result
            }
        }
    }

    return max;
};

module.exports = [solution1, solution2];