
const chars = 'NSEW'.split('');

const parseRegex = (regex, start = 0) => {
    let ending = regex[start] === '^' ? '$' : ')';

    let roots = [];
    let leaves = [];
    let currents = [];
    let i=start+1;
    while(regex[i] !== ending) {
        if(regex[i] == '|') {
            const node = {
                dir: '',
                nexts: []
            }
            currents = [node];
            leaves.push(node);
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
            leaves = leaves.slice(0, -currents.length);
            currents = res.leaves;
            leaves = leaves.concat(res.leaves);

            i = res.finish;
        }
        if(chars.includes(regex[i])) {
            const node = {
                dir: regex[i],
                nexts: []
            }
            for(let j=0; j<currents.length; j++) {
                currents[j].nexts.push(node);
            }
            leaves = leaves.slice(0, -currents.length);

            if(!currents.length) {
                roots.push(node);
            }

            currents = [node];
            leaves.push(node);
        }
        i++;
    }

    return {
        roots,
        leaves,
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

const move = (start, dir) => {
    const pos = start.split(',').map(v => parseInt(v));
    switch(dir) {
        case 'S':
            pos[0]+=2;
            break;
        case 'N':
            pos[1]-=2;
            break;
        case 'E':
            pos[1]+=2;
            break;
        case 'W':
            pos[1]-=2;
            break;
    }
    return pos.join(',');
}

const followRegex = (field, root, start = '0,0') => {
    field[start] = field[start] || [];
    const next = move(start, root.dir);
    if(next !== start) {
        field[start].push(next);
    }

    root.nexts.forEach(n => followRegex(field, n, next));
}

const solution1 = inputLines => {
    // const points = inputLines.map(parsePoint);
    const regex = parseRegex("^WNE$").roots;
    // E(NS(W|W)|S(W|W))

    const field = {};
    followRegex(field, regex[0]);

    return field;
};

const solution2 = inputLines => {

    return inputLines;
};

module.exports = [solution1, solution2];