
const regex = /^Step ([A-Z]) must be finished before step ([A-Z])/;

const parseLine = line => {
    const result = regex.exec(line);
    return {
        req: result[1],
        then: result[2]
    };
}

const Achar = 'A'.charCodeAt(0);
const Zchar = 'Z'.charCodeAt(0);
const symbols = Zchar - Achar + 1;
const getPos = (req, then) => {
    const row = req.charCodeAt(0) - Achar;
    const col = then.charCodeAt(0) - Achar;
    return row*symbols + col;
}

const findAvailableChars = graph => {
    const candidates = [];
    for(let col = 0; col < symbols; col++) {
        let isCandidate = true;
        for(let row = 0; row < symbols && isCandidate; row++) {
            const i = row*symbols + col;
            isCandidate = isCandidate && !graph[i];
        }

        if(isCandidate) {
            candidates.push(String.fromCharCode(Achar + col));
        }
    }
    return candidates;
}

const pickBest = (candidates, expired) => {
    return candidates
        .filter(c => !expired.includes(c))
        [0];
}

const solution1 = inputLines => {
    const instructions = inputLines.map(parseLine);

    const graph = new Array(symbols*symbols);

    instructions.forEach(({req, then}) => {
        const i = getPos(req, then);
        graph[i] = true;
    });

    const picked = [];
    let toPick = null;
    do {
        const available = findAvailableChars(graph);
        toPick = pickBest(available, picked);

        if(toPick) {
            picked.push(toPick);
            for(let then=Achar; then<=Zchar; then++) {
                const i = getPos(toPick, String.fromCharCode(then));
                graph[i] = false;
            }
        }
    } while(toPick);

    return picked.join('');
};

const solution2 = inputLines => {
    return inputLines;
};

module.exports = [solution1, solution2];
