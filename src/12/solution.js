const pointRegex = /^$/;

const createMap = instructions => {
    const map = {};
    instructions.forEach(inst => {
        const res = inst.split(' => ');
        map[res[0]] = res[1];
    });
    return map;
}

const evolveState = (state, instrMap) => {
    const newState = [];
    let idx = 0;
    for(let j=-3; j<state.length+2; j++) { // j is center
        const prefix = [...new Array(-Math.min(0, j-2))].map(_ => '.')
            .join('');
        let value = prefix + state.slice(
            Math.max(0, j-2), j+3
        ).join('');
        while(value.length < 5) value += '.';

        if(j < 0 && instrMap[value] === '.' && idx === 0) {
            continue;
        }
        if(j < 0 && idx === 0) {
            idx = -j;
        }
        newState[j+idx] = instrMap[value];
    }
    return [newState, idx];
}

const calculateResult = (state, firstIndex) => {
    let result = 0;
    for(let i=0; i<state.length; i++) {
        if(state[i] === '#') {
            result += (i + firstIndex);
        }
    }
    return result;
}

const solution1 = inputLines => {
    const initialState = inputLines[0].slice('initial state: '.length);
    const instructions = inputLines.slice(2);
    const instrMap = createMap(instructions);

    let state = initialState.split('');
    let firstIndex = 0;

    for(let i=0; i<20; i++) {
        const [newState, idx] = evolveState(state, instrMap);
        state = newState;
        firstIndex -= idx;

        console.log(state.join(''), firstIndex);
    }

    return calculateResult(result, firstIndex);
};

const FINISH = 50000000000;
const solution2 = inputLines => {
    const initialState = inputLines[0].slice('initial state: '.length);
    const instructions = inputLines.slice(2);
    const instrMap = createMap(instructions);

    let state = initialState.split('');
    let firstIndex = 0;

    let lastPattern = '';
    let lastResult = 0;
    for(let i=0; i<FINISH; i++) {
        const [newState, idx] = evolveState(state, instrMap);
        state = newState;
        firstIndex -= idx;

        const pattern = state.map(_ => _ === '.' ? ' ' : _).join('').trim();
        const result = calculateResult(state, firstIndex);
        if(pattern === lastPattern) {
            // Match found, let's get the answer....
            const resultDiff = result - lastResult;
            return lastResult + (FINISH - i) * resultDiff;
        }
        lastPattern = pattern;
        lastResult = result;
    }
};

module.exports = [solution1, solution2];