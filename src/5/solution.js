const { invertObj } = require('ramda');

const react = (polymer, ignore) => {
    let newString = '';
    for(let i=0; i<polymer.length; i++) {
        if(polymer[i].toLowerCase() === ignore) {
            continue;
        }
        if(
            i+1 < polymer.length &&
            polymer[i] !== polymer[i+1] &&
            polymer[i].toLowerCase() === polymer[i+1].toLowerCase()
        ) {
            i++;
            continue;
        }
        newString += polymer[i];
    }

    if(newString.length === polymer.length) {
        return newString;
    }

    return react(newString);
}

const solution1 = inputLines => react(inputLines[0]).length

const solution2 = inputLines => {
    const reduced = react(inputLines[0]);
    const symbols = Object.keys(invertObj(reduced.toLowerCase().split('')));

    let minimum = Infinity;
    symbols.forEach(s => {
        const rereduced = react(reduced, s);

        if(rereduced.length < minimum) {
            minimum = rereduced.length;
            console.log(s, rereduced);
        }
    });

    return minimum;
};

module.exports = [solution1, solution2];
