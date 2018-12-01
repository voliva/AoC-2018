// @ts-nocheck
const { from } = require('rxjs');
const {
    filter,
    map,
    repeat,
    scan,
    take,
    tap
} = require('rxjs/operators');

module.exports = inputLines => from(inputLines).pipe(
    map(v => parseInt(v)),
    repeat(),
    scan((acc, number) => ({
        frequenciesFound: {
            ...acc.frequenciesFounumber,
            [acc.frequency]: true
        },
        frequency: acc.frequency + number
    }), {
        frequenciesFound: {},
        frequency: 0
    }),
    filter(acc => acc.frequenciesFound[acc.frequency]),
    take(1),
    map(acc => acc.frequency)
);
