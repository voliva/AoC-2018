
const endsWith = (target, arr) => target.every((t, i) => t == arr[arr.length - target.length + i]) ||
    target.every((t, i) => t == arr[arr.length - target.length + i - 1]);

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
    const target = '157901'.split('');

    const scores = [3,7];
    let elves = [0,1];

    while(!endsWith(target, scores)) {
        const result = elves.reduce((acc, i) => acc + scores[i], 0);
        if(result < 10) {
            scores.push(result);
        } else {
            scores.push(Math.trunc(result/10));
            scores.push(result % 10);
        }
        elves = elves.map(e => (e + scores[e] + 1) % scores.length);
    }

    if(target.every((t, i) => t == scores[scores.length - target.length + i])) {
        return scores.length - target.length;
    }

    return scores.length - target.length - 1;
};

module.exports = [solution1, solution2];