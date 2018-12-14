
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
                    id: carts.length,
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
        "\\": '<'
    },
    '>': {
        '/': '^',
        "\\": 'v'
    },
    'v': {
        '/': '<',
        "\\": '>'
    },
    '<': {
        '/': 'v',
        "\\": '^'
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

    const positionsMoved = {};
    const collisions = {};
    carts.forEach(cart => {
        const sourceKey = `${cart.node.col},${cart.node.row}`;
        if(positionsMoved[sourceKey]) {
            collisions[sourceKey] = [
                positionsMoved[sourceKey],
                cart
            ]
            return;
        }

        let dest = null;
        if(cart.c === '^') {
            dest = cart.node.up;
        }else if(cart.c === '>') {
            dest = cart.node.right;
        }else if(cart.c === 'v') {
            dest = cart.node.down;
        }else if(cart.c === '<') {
            dest = cart.node.left;
        }

        if(dest.c === '+') {
            cart.c = getNextDirection[cart.c][cart.nextTurn];
            cart.nextTurn = getNextTurn[cart.nextTurn];
        }else if(dest.c === '/' || dest.c === '\\') {
            cart.c = getCurveDirection[cart.c][dest.c];
        }
        cart.node = dest;
        const key = `${dest.col},${dest.row}`;
        if(positionsMoved[key]) {
            collisions[key] = [
                positionsMoved[key],
                cart
            ];
        }
        positionsMoved[key] = cart;
    });

    return collisions;
}

const solution1 = inputLines => {
    const carts = buildGraph(inputLines);

    let collisions = {};
    while(Object.keys(collisions).length === 0) {
        collisions = tick(carts);
    }

    return Object.keys(collisions);
};

const solution2 = inputLines => {
    let carts = buildGraph(inputLines);

    while(carts.length > 1) {
        const collisions = tick(carts);
        const collisionedCarts = Object.values(collisions).reduce((acc, arr) => [...acc,...arr], []);
        const collisionedCartsSet = new Set(collisionedCarts);
        carts = carts.filter(cart => !collisionedCartsSet.has(cart));
    }

    const key = `${carts[0].node.col},${carts[0].node.row}`;
    return key;
};

module.exports = [solution1, solution2];