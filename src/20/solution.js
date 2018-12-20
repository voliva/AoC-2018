
const chars = 'NSEW'.split('');

const getAllLeaves = roots => roots.reduce((leaves, root) => leaves.concat(
    root.nexts.length > 0 ? getAllLeaves(root.nexts) : root
), []);

const parseRegex = (regex, start = 0) => {
    let ending = regex[start] === '^' ? '$' : ')';

    let roots = [];
    let currents = [];
    let i=start+1;
    while(regex[i] !== ending) {
        if(regex[i] == '|') {
            const node = {
                dir: '',
                nexts: []
            }
            currents = [node];
            roots.push(node);
        }
        if(regex[i] == '(') {
            const res = parseRegex(regex, i);
            for(let j=0; j<currents.length; j++) {
                currents[j].nexts = currents[j].nexts.concat(res.roots);
            }
            if(!currents.length) {
                roots = roots.concat(res.roots);
            }
            currents = getAllLeaves(res.roots); // getAllLeaves gives duplicates >:(

            i = res.finish;
        }
        if(chars.includes(regex[i])) {
            const node = {
                dir: regex[i],
                nexts: []
            }
            for(let j=0; j<currents.length; j++) {
                currents[j].nexts.push(node);
                currents[j] = node;
            }
            if(!currents.length) {
                roots.push(node);
                currents.push(node);
            }
        }
        i++;
    }

    return {
        roots,
        finish: i
    }
}

const printRegex = (roots) => {
    if(roots.length === 0) return '';
    if(roots.length === 1) {
        return roots[0].dir + printRegex(roots[0].nexts);
    }
    return `(${
        roots.map(r => r.dir + printRegex(r.nexts)).join('|')
    })`;
}

const solution1 = inputLines => {
    // const points = inputLines.map(parsePoint);
    const regex = parseRegex("^E(N|)SW$").roots;
    // E(NS(W|W)|S(W|W))

    return printRegex(regex);
};

const solution2 = inputLines => {

    return inputLines;
};

module.exports = [solution1, solution2];