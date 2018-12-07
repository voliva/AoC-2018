
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
const getPos = (row, col) => {
    return row*symbols + col;
}
const getCharPos = (req, then) => {
    const row = req.charCodeAt(0) - Achar;
    const col = then.charCodeAt(0) - Achar;
    return getPos(row, col);
}

const findAvailableChars = (graph, picked = []) => {
    const candidates = [];
    for(let col = 0; col < symbols; col++) {
        let isCandidate = !picked.some(c => c.charCodeAt(0) - Achar === col);

        for(let row = 0; row < symbols && isCandidate; row++) {
            const i = getPos(row, col);
            isCandidate = isCandidate && !graph[i];
        }

        if(isCandidate) {
            candidates.push(String.fromCharCode(Achar + col));
        }
    }
    return candidates;
}

const fillGraph = instructions => {
    const graph = new Array(symbols*symbols);

    instructions.forEach(({req, then}) => {
        const i = getCharPos(req, then);
        graph[i] = true;
    });

    return graph;
}

const markStepDone = (step, graph) => {
    const row = step.charCodeAt(0) - Achar;
    for(let col=0; col<symbols; col++) {
        const i = getPos(row, col);
        graph[i] = false;
    }
}

const getDependencies = (step, graph) => {
    const row = step.charCodeAt(0) - Achar;
    const deps = [];
    for(let i=0; i<symbols; i++) {
        if(graph[getPos(row, i)]) {
            const dep = String.fromCharCode(Achar + i);
            deps.push(dep);
        }
    }
    return deps;
}

const solution1 = inputLines => {
    const instructions = inputLines.map(parseLine);

    const graph = fillGraph(instructions);

    const picked = [];
    let toPick = null;
    do {
        const available = findAvailableChars(graph, picked);
        toPick = available[0];

        if(toPick) {
            const deps = getDependencies(toPick, graph);
            console.log(`${toPick} (${toPick.charCodeAt(0)-Achar+61}) unlocks [${deps.join(',')}]`);

            picked.push(toPick);
            markStepDone(toPick, graph);
        }
    } while(toPick);

    return picked.join('');
};

const solution2 = inputLines => {
    const instructions = inputLines.map(parseLine);

    const graph = fillGraph(instructions);

    const nWorkers = 5;
    let timeSpent = 0;
    const picked = [];
    const workQueue = [];

    do {
        if(workQueue.length) {
            const workFinished = workQueue.shift();
            workQueue.forEach(w => w.time -= workFinished.time);
            timeSpent += workFinished.time;
            markStepDone(workFinished.step, graph);
        }
        const available = findAvailableChars(graph, picked);
        
        while(
            available.length &&
            workQueue.length < nWorkers
        ) {
            const step = available.shift();
            picked.push(step);
            workQueue.push({
                step: step,
                time: 61 + step.charCodeAt(0) - Achar
            });
            workQueue.sort(({time: t1}, {time: t2}) => t1 - t2);
        }
    } while(workQueue.length);

    return timeSpent;
};

module.exports = [solution1, solution2];