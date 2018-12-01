
module.exports = inputLines => {
    const numbers = inputLines.map(v => parseInt(v));

    let frequency = 0;
    let i=0;
    const frequenciesFound = {};

    do {
        frequenciesFound[frequency] = true;
        frequency += numbers[i];
        i++;
        i %= numbers.length;
    } while(!frequenciesFound[frequency]);

    return frequency;
};
