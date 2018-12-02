

const countletters = str => str.split('').reduce((acc, v) => ({
    ...acc,
    [v]: (acc[v] || 0) + 1
}), {});

const hasExactCount = (n, letterCount) => Object.values(letterCount).indexOf(n) >= 0;
const getExactCounts = (n, letterCounts) => letterCounts.reduce(
    (acc, v) => acc + (hasExactCount(n, v) ? 1 : 0),
    0
)

const solution1 = inputLines => {
    const letterCounts = inputLines.map(countletters);
    const twice = getExactCounts(2, letterCounts);
    const thrice = getExactCounts(3, letterCounts);

    return twice * thrice;
};

const wordsAreSimilar = (w1, w2) => {
    const w1a = w1.split('');
    const w2a = w2.split('');
    let diffingChar = -1;
    for(let i=0; i<w1a.length && i<w2a.length; i++) {
        if(w1a[i] !== w2a[i]) {
            if(diffingChar > 0) {
                return -1;
            }
            diffingChar = i;
        }
    }
    return diffingChar;
}

const solution2 = inputLines => {
    for(let i=0; i<inputLines.length; i++) {
        for(let j=i+1; j<inputLines.length; j++) {
            const idx = wordsAreSimilar(inputLines[i], inputLines[j]);
            if(idx >= 0) {
                return inputLines[i].slice(0, idx) + inputLines[i].slice(idx+1);
            }
        }
    }
    return 'not found';
};

module.exports = [solution1, solution2];
