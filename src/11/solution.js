
const solution1 = inputLines => {
    const gridSerialNumber = parseInt(inputLines);

    const grid = new Array(300*300);

    for(let y=0; y<300; y++){
        for(let x=0; x<300; x++){
            const rackId = (x+1+10);
            grid[y*300 + x] =
                Math.floor((
                    (
                        (rackId * (y+1))
                        + gridSerialNumber
                    )
                    * rackId
                ) / 100) % 10 - 5;
        }
    }

    for(let y=45; y<50; y++){
        let string = ''
        for(let x=32; x<37; x++) {
            string += grid[y*300 + x] + ' ';
        }
        console.log(string);
    }

    let max = {
        x: null, y: null,
        value: -Infinity
    }
    for(let y=0; y<300-3; y++){
        for(let x=0; x<300-3; x++){
            let totalPower = 0;
            for(let r=0; r<3; r++){
                for(let c=0; c<3; c++){
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

    return inputLines;
};

module.exports = [solution1, solution2];