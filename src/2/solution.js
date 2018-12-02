

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

const findSimilar = (tree, word) => {
    const characters = word.split('');
    let state = [{
        tree,
        wildcard: true,
        acceptedChars: ''
    }];

    for(let i=0; i<characters.length; i++) {
        const c = characters[i];

        const newState = [];
        for(let j=0; j<state.length; j++) {
            const s = state[j];
            if(s.tree[c]) {
                newState.push({
                    tree: s.tree[c],
                    wildcard: s.wildcard,
                    acceptedChars: s.acceptedChars + c
                });
            }
            if(s.wildcard) {
                Object.keys(s.tree).forEach(c => newState.push({
                    tree: s.tree[c],
                    wildcard: false,
                    acceptedChars: s.acceptedChars
                }));
            }
        }
        state = newState;

        if(!state.length) {
            return false;
        }
    }

    return state[0].acceptedChars;
}

const addWord = (tree, word) => {
    if(!Array.isArray(word)) word = word.split('');
    if(word.length === 0) return tree;
    tree[word[0]] = addWord(tree[word[0]] || {}, word.slice(1));
    return tree;
}

const solution2 = inputLines => {
    let tree = {};
    for(let i=0; i<inputLines.length; i++) {
        const similar = findSimilar(tree, inputLines[i]);
        if(similar) {
            return similar;
        }
        tree = addWord(tree, inputLines[i]);
    }
    return 'not found';
};

module.exports = [solution1, solution2];
