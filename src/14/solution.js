
const solution1 = inputLines => {
    const target = parseInt(inputLines[0]);

    const scores = [3,7];
    let elves = [0,1];

    while(scores.length < target + 10) {
        console.log(target - scores.length);
        const result = elves.reduce((acc, i) => acc + scores[i], 0);
        if(result < 10) {
            scores.push(result);
        } else {
            scores.push(Math.trunc(result/10));
            scores.push(result % 10);
        }
        elves = elves.map(e => (e + scores[e] + 1) % scores.length);
    }

    return scores.slice(target).join('');
};

const solution2 = inputLines => {

    return inputLines;
};

module.exports = [solution1, solution2];