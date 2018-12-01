const { from } = require('rxjs');
const { reduce } = require('rxjs/operators');

module.exports = inputLines => from(inputLines).pipe(
    reduce((acc, line) => acc + parseInt(line), 0)
);
