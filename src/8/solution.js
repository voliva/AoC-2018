
const buildTree = (input, i = 0) => {
    const nChildren = input[i++];
    const nMetadata = input[i++];

    const children = [];
    const metadata = [];
    for(let c=0; c<nChildren; c++) {
        const result = buildTree(input, i);
        i = result.next;
        children.push(result.node);
    }

    for(let m=0; m<nMetadata; m++) {
        metadata.push(input[i++]);
    }

    return {
        node: {
            children,
            metadata
        },
        next: i
    };
}

const addMetadata = tree => {
    let result = 0;
    tree.children.forEach(c => {
        result += addMetadata(c);
    });
    tree.metadata.forEach(m => {
        result += m
    });
    return result;
}

const solution1 = inputLines => {
    const input = inputLines[0]
        .split(' ')
        .map(n => parseInt(n));
    const result = buildTree(input);
    
    return addMetadata(result.node);
};

const solution2 = inputLines => {
    
    return inputLines;
};

module.exports = [solution1, solution2];
