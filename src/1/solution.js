const { asap } = require('rxjs/internal/scheduler/asap');
const { from } = require('rxjs');
const {
    reduce,
    filter,
    map,
    repeat,
    scan,
    take,
    subscribeOn
} = require('rxjs/operators');

const solution1 = inputLines => from(inputLines).pipe(
    reduce((acc, line) => acc + parseInt(line), 0)
);


const updateFrequencies = (acc, add) => {
    // We shouldn't mutate acc, but it makes performance too bad.
    acc.frequenciesFound[acc.frequency] = true;
    acc.frequency += add;
    return acc;
}

const solution2 = inputLines => from(inputLines).pipe(
    subscribeOn(asap),
    map(v => parseInt(v)),
    repeat(),
    scan(updateFrequencies, {
        frequenciesFound: {},
        frequency: 0
    }),
    filter(acc => acc.frequenciesFound[acc.frequency]),
    take(1),
    map(acc => acc.frequency),
);

module.exports = [solution1, solution2];
