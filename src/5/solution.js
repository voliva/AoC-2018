
const react = polymer => {
    let newString = '';
    for(let i=0; i<polymer.length; i++) {
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
    return solution1(inputLines);
};

module.exports = [solution1, solution2];
