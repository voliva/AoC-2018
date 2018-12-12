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

    let result = 0;
    for(let i=0; i<state.length; i++) {
        if(state[i] === '#') {
            result += (i + firstIndex);
        }
    }
    return result;
};

const solution2 = inputLines => {
    const initialState = inputLines[0].slice('initial state: '.length);
    const instructions = inputLines.slice(2);
    const instrMap = createMap(instructions);

    let state = initialState.split('');
    let firstIndex = 0;

    for(let i=0; i<200; i++) {
        const [newState, idx] = evolveState(state, instrMap);
        state = newState;
        firstIndex -= idx;

        // After using this log, I've found a pattern:
        // console.log(
        //     state.map(_ => _ === '.' ? ' ' : _).join('').trim(), i, state.indexOf('#')
        // );
        // In which by i=99, structure doesn't change anymore and value just gets shifted.

        if(i >= 99) {
            let result = 0;
            for(let i=0; i<state.length; i++) {
                if(state[i] === '#') {
                    result += (i + firstIndex);
                }
            }
            console.log(i, result);
            // I see that after i = 99 = 8000, it raises value by 80 on each step.
            // So answer will be 8000 + (50000000000-1 - 99) * 80
        }

    }
};

module.exports = [solution1, solution2];