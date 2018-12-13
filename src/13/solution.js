
const isCart = char => ['<', '>', '^', 'v'].includes(char);
const isVertical = char => ['^', 'v', '|'].includes(char);
const isHorizontal = char => ['<', '>', '-'].includes(char);

const buildGraph = inputLines => {
    const carts = [];
    const nodes = [];

    inputLines.forEach((line, row) => {
        nodes[row] = [];
        chars = line.split('');
        chars.forEach((c,col) => {
            if(c === ' ') return;

            if(c === '+') {
                nodes[row][col] = {
                    c,
                    row, col,
                    up: nodes[row-1][col],
                    left: nodes[row][col-1],
                    down: true,
                    right: true
                }
                nodes[row-1][col].down = nodes[row][col];
                nodes[row][col-1].right = nodes[row][col];
            }else if(c === '/' || c === '\\') {
                const upNode = nodes[row-1] && nodes[row-1][col] || null;
                const leftNode = nodes[row][col-1] || null;
                const up = upNode && upNode.down ? upNode : null;
                const left = leftNode && leftNode.right ? leftNode : null;
                nodes[row][col] = {
                    c,
                    row, col,
                    up,
                    left,
                    down: up ? null : true,
                    right: left ? null : true
                }
                if(up) up.down = nodes[row][col];
                if(left) left.right = nodes[row][col];
            }else if(isVertical(c)) {
                nodes[row][col] = {
                    c,
                    row, col,
                    up: nodes[row-1][col],
                    down: true,
                    left: null,
                    right: null
                }
                nodes[row-1][col].down = nodes[row][col];
            }else if(isHorizontal(c)) {
                nodes[row][col] = {
                    c,
                    row, col,
                    up: null,
                    down: null,
                    left: nodes[row][col-1],
                    right: true
                }
                nodes[row][col-1].right = nodes[row][col];
            }

            if(isCart(c)) {
                const cart = {
                    c,
                    node: nodes[row][col],
                    hasMoved: false,
                    nextTurn: 'l' // l -> s -> r
                };
                carts.push(cart);
            }
        });
    });

    return carts;
}

const getNextDirection = {
    '^': {
        'l': '<',
        's': '^',
        'r': '>'
    },
    '>': {
        'l': '^',
        's': '>',
        'r': 'v'
    },
    'v': {
        'l': '>',
        's': 'v',
        'r': '<'
    },
    '<': {
        'l': 'v',
        's': '<',
        'r': '^'
    }
}
const getNextTurn = {
    'l': 's',
    's': 'r',
    'r': 'l'
}
const getCurveDirection = {
    '^': {
        '/': '>',
        '\\': '<'
    },
    '>': {
        '/': '^',
        '\\': 'v'
    },
    'v': {
        '/': '<',
        '\\': '>'
    },
    '<': {
        '/': 'v',
        '\\': '^'
    }
}

const tick = carts => {
    carts.sort((c1, c2) => {
        if(c1.row < c2.row) return -1;
        if(c1.row > c2.row) return 1;
        if(c1.col < c2.col) return -1;
        if(c1.col > c2.col) return 1;
        return 0;
    });

    const newPositions = {};
    let collision = false;
    carts.forEach(cart => {
        let dest = null;
        if(cart.c === '^') {
            dest = cart.node.up;
        }else if(cart.c === '>') {
            dest = cart.node.right;
        }else if(cart.c === 'v') {
            dest = cart.node.down;
        }else if(cart.c === '<') {
            dest = cart.node.up;
        }

        if(dest.c === '+') {
            cart.c = getNextDirection[cart.c][cart.nextTurn];
            cart.nextTurn = getNextTurn[cart.nextTurn];
        }else if(dest.c === '/' || dest.c === '\\') {
            cart.c = getCurveDirection[cart.c][dest.c];
        }
    });

    return collision;
}

const solution1 = inputLines => {
    const carts = buildGraph(inputLines);

    let collisionFound = false;
    while(!collisionFound) {

    }

    return carts.length;
};

const solution2 = inputLines => {

    return inputLines;
};

module.exports = [solution1, solution2];