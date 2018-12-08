// 15:42
const distRegex = /([^ ]+) to ([^ ]+) = (\d+)/;
const parseJourneys = inputLines => inputLines.map(line => {
    const res = distRegex.exec(line);
    if(!res) {
        console.log('Cant parse', line);
        return null;
    }
    return {
        from: res[1],
        to: res[2],
        distance: parseInt(res[3])
    }
});

const buildGraph = journeys => {
    const nodes = {};
    journeys.forEach(({from, to, distance}) => {
        nodes[from] = nodes[from] || {};
        nodes[from][to] = distance;
        nodes[to] = nodes[to] || {};
        nodes[to][from] = distance;
    });
    return nodes;
}

const getMinimumPath = (root, visited, nodes, strategy = {fn: Math.min, start: Infinity}) => {
    const from = nodes[root];
    if(!from) {
        return 0;
    }

    visited = [
        ...visited,
        root
    ];

    const destinations = Object.keys(from)
        .filter(to => !visited.includes(to));
    if(!destinations.length) {
        return 0;
    }
    
    return destinations.reduce((acc, to) => {
        const dist = from[to] + getMinimumPath(to, visited, nodes, strategy);
        return strategy.fn(acc, dist);
    }, strategy.start);
}

const solution1 = inputLines => {
    const journeys = parseJourneys(inputLines);
    const cities = buildGraph(journeys);

    return Object.keys(cities).reduce((minDist, city) => {
        return Math.min(minDist, getMinimumPath(city, [], cities));
    }, Infinity);
};

// 16:04

const solution2 = inputLines => {
    const journeys = parseJourneys(inputLines);
    const cities = buildGraph(journeys);

    return Object.keys(cities).reduce((minDist, city) => {
        return Math.max(minDist, getMinimumPath(city, [], cities, {
            fn: Math.max,
            start: 0
        }));
    }, 0);
};

// 16:07

module.exports = [solution1, solution2];
