const {
    add,
    always,
    apply,
    compose,
    converge,
    identity,
    lensPath,
    lensProp,
    map,
    not,
    nthArg,
    pair,
    prop,
    reduceWhile,
    set,
    sum,
} = require('ramda');

const solution1 = compose(
    sum,
    map(parseInt)
);

/// Solution 2
const hasRepeated = converge(prop, [
    prop('frequency'),
    prop('frequenciesFound')
]);

// Same as in rxjs - Using set instead of assoc for performance.
const updateFrequenciesFound = converge(set, [
    compose(
        lensPath,
        pair('frequenciesFound'),
        prop('frequency')
    ),
    always(true),
    identity
]);
const addFrequency = (acc, value) => set(lensProp('frequency'), add(prop('frequency')(acc), value), acc);
converge(set(
    lensProp('frequency')
), [
    converge(add, [
        prop('frequency'),
        nthArg(1) // value
    ]),
    identity
]);

const reducer = compose(
    apply(addFrequency),
    converge( // We need to pass both arguments to next function
      pair,
      [updateFrequenciesFound, nthArg(1)]
    )
);

const iterationSolution = reduceWhile(
    compose(not, hasRepeated),
    reducer
);

const infiniteLoopSolution = list => {
    let acc = {
        frequency: 0,
        frequenciesFound: {}
    };
    do {
        acc = iterationSolution(acc, list);
    } while(!hasRepeated(acc));

    return acc.frequency;
}
const solution2 = compose(
    infiniteLoopSolution,
    map(parseInt)
)

module.exports = [solution1, solution2];
