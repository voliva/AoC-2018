
const claimRegex = /^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/;
const parseClaim = line => {
    const result = claimRegex.exec(line);
    if(!result) {
        console.error('cant parse line', line);
        return null;
    }
    return {
        id: result[1],
        left: parseInt(result[2]),
        top: parseInt(result[3]),
        width: parseInt(result[4]),
        height: parseInt(result[5])
    }
}

const solution1 = inputLines => {
    const resultReduce = inputLines
        .map(parseClaim)
        .reduce(({fabric, disputes}, claim, i) => {
            for(let r = 0; r < claim.height; r++) {
                for(let c = 0; c < claim.width; c++) {
                    const row = claim.top + r;
                    const col = claim.left + c;
                    fabric[row] = (fabric[row]) || [];
                    if(fabric[row][col] === 1) {
                        disputes++;
                    }
                    fabric[row][col] = (fabric[row][col] || 0) + 1;
                }
            }
            return {
                fabric,
                disputes
            };
        }, {
            fabric: [],
            disputes: 0
        });
    return resultReduce.disputes;
};

const solution2 = inputLines => {
    const resultReduce = inputLines
        .map(parseClaim)
        .reduce(({fabric, candidates}, claim) => {
            let isCandidate = true;
            for(let r = 0; r < claim.height; r++) {
                for(let c = 0; c < claim.width; c++) {
                    const row = claim.top + r;
                    const col = claim.left + c;
                    fabric[row] = (fabric[row]) || [];
                    if(fabric[row][col]) {
                        candidates.delete(fabric[row][col]);
                        isCandidate = false;
                    }
                    fabric[row][col] = claim.id;
                }
            }
            if(isCandidate) {
                candidates.add(claim.id);
            }

            return {
                fabric,
                candidates
            };
        }, {
            fabric: [],
            candidates: new Set()
        });
    return resultReduce.candidates.values().next().value;
};


module.exports = [solution1, solution2];
