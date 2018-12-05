const { invertObj, compose, head } = require('ramda');

const fromString = (str) => {
    if(!str.length) return null;
    const root = {
        value: str[0],
        previous: null,
        next: null
    };
    let node = root;
    for(let i=1; i<str.length; i++) {
        node.next = {
            value: str[i],
            previous: node,
            next: null
        }
        node = node.next;
    }
    return root;
}

const clone = list => {
    if(!list) return null;
    const root = {
        ...list
    };
    let node = root;
    for(; node.next; node = node.next) {
        node.next = {
            ...node.next
        }
    }
    return root;
}

const getLength = (list) => {
    if(!list) return 0;
    let length = 1;
    while(list.next) {
        list = list.next;
        length++;
    }
    return length;
}

const deleteNode = node => {
    if(node.next) {
        node.next.previous = node.previous;
    }
    if(node.previous) {
        node.previous.next = node.next;
    }
}

const getLCValueSet = list => {
    const set = new Set();
    for(; list; list = list.next) {
        set.add(list.value.toLowerCase())
    }
    return set;
}

const react = (polymer, ignore) => {
    const initialLength = getLength(polymer);
    let root = polymer;
    for(; polymer; polymer = polymer.next) {
        if(polymer.value.toLowerCase() === ignore) {
            deleteNode(polymer);
            if(!polymer.previous) {
                root = polymer.next;
            }
            continue;
        }
        if(
            polymer.next &&
            polymer.value !== polymer.next.value &&
            polymer.value.toLowerCase() === polymer.next.value.toLowerCase()
        ) {
            deleteNode(polymer);
            if(!polymer.previous) {
                root = polymer.next.next;
            }
            deleteNode(polymer.next);
            polymer = polymer.next;
            continue;
        }
    }

    const finalLength = getLength(root);
    if(initialLength === finalLength) {
        return root;
    }

    return react(root);
}

const solution1 = compose(
    getLength,
    react,
    fromString,
    head
);

const solution2 = compose(
    polymer => {
        const symbols = getLCValueSet(polymer);

        let minimum = Infinity;
        symbols.forEach(s => {
            const rereduced = getLength(react(clone(polymer), s));

            if(rereduced < minimum) {
                minimum = rereduced;
            }
        });

        return minimum;
    },
    react,
    fromString,
    head
); inputLines => {
    const reduced = react(inputLines[0]);
    const symbols = Object.keys(invertObj(reduced.toLowerCase().split('')));

    let minimum = Infinity;
    symbols.forEach(s => {
        const rereduced = react(reduced, s);

        if(rereduced.length < minimum) {
            minimum = rereduced.length;
        }
    });

    return minimum;
};

module.exports = [solution1, solution2];
