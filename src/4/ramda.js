const {
    sortBy,
    identity,
    pipe,
    map,
    compose,
    ifElse,
    propEq,
    assoc,
    omit,
    groupWith,
    reduce,
    nthArg,
    reduceBy,
    prop,
    toPairs,
    addIndex,
    equals,
    sum
} = require('ramda');

/// Javascript functions
const lineRegex = /(\d+):(\d+)\] (.*)$/;
const guardRegex = /^Guard #(\d+) begins shift$/;
const parseLine = line => {
    const [_, hour, minute, command] = lineRegex.exec(line);
    const parsedGuard = guardRegex.exec(command);
    const guardId = parsedGuard && parseInt(parsedGuard[1]);
    return {
        guardId,
        hour: parseInt(hour),
        minute: parseInt(minute),
        asleep: command === 'falls asleep'
    }
}

const updateGuardStats = (stats, command) => {
    const {minutesAsleep} = stats;
    
    const newMinsAsleep = [
        ...minutesAsleep
    ];
    if(!command.asleep && stats.lastAsleep != null) {
        for(let i=stats.lastAsleep; i<command.minute; i++) {
            newMinsAsleep[i] = 1;
        }
    }

    return {
        guardId: command.guardId || stats.guardId,
        lastAsleep: command.asleep ? command.minute : null,
        minutesAsleep: newMinsAsleep
    }
};

const addLastMinutes = stats => {
    const {minutesAsleep} = stats;

    for(let i=stats.lastAsleep; i<60; i++) {
        minutesAsleep[i] = (minutesAsleep[i] || 0) + 1;
    }
    
    return stats;
}

const addArrays = (a1, a2) => {
    const ret = [];
    for(let i=0; i<Math.max(a1.length, a2.length); i++){
        ret[i] = (a1[i] || 0) + (a2[i] || 0);
    }
    return ret;
}

const mapNthArg = (fn, n, mapFn) => (...args) => {
    args[n] = mapFn(args[n]);
    return fn(...args);
}

/// Point-free functions
const normalizeLine = compose(
    omit(['hour']),
    ifElse(
        propEq('hour', 23),
        assoc('minute', 0),
        identity
    ),
    parseLine
);

const calcNightStats = compose(
    omit(['lastAsleep']),
    ifElse(
        propEq('lastAsleep', null),
        identity,
        addLastMinutes
    ),
    reduce(
        updateGuardStats,
        {
            guardId: null,
            lastAsleep: null,
            value: Math.random(),
            minutesAsleep: []
        }
    )
);

const calculateStats = pipe(
    sortBy(identity),
    map(normalizeLine),
    groupWith(compose(
        propEq('guardId', null),
        nthArg(1)
    )),
    map(calcNightStats),
    reduceBy(
        mapNthArg(
            addArrays,
            1,
            prop('minutesAsleep')
        ),
        [],
        prop('guardId')
    ),
    toPairs
);

const addMinutes = addIndex(map)(
    ifElse(
        compose(
            equals(1),
            nthArg(1)
        ),
        sum,
        identity
    )
);

const solution1 = compose(
    map(addMinutes),
    calculateStats
);

const solution2 = inputLines => inputLines;

module.exports = [solution1, solution2];
