const pointRegex = /^$/;

const createMap = instructions => {
    const map = {};
    instructions.forEach(inst => {
        const res = inst.split(' => ');
        map[res[0]] = res[1];
    });
    return map;
}

const solution1 = inputLines => {
    const initialState = inputLines[0].slice('initial state: '.length);
    const instructions = inputLines.slice(2);
    const instrMap = createMap(instructions);

    let state = initialState.split('');
    let firstIndex = 0;

    for(let i=0; i<20; i++) {
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

    return inputLines;
};

module.exports = [solution1, solution2];