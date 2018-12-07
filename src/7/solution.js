// Start 21:54

const regex = /^Step ([A-Z]) must be finished before step ([A-Z])/;

const parseLine = line => {
    const [source, dest] = line.split(' -> ');
    return {
        source, dest
    }
}

const numRegex = /^\d+$/;
const andRegex = /^([^ ]+) AND ([^ ]+)$/;
const orRegex = /^([^ ]+) OR ([^ ]+)$/;
const lShiftRegex = /^([^ ]+) LSHIFT ([^ ]+)$/;
const rShiftRegex = /^([^ ]+) RSHIFT ([^ ]+)$/;
const notRegex = /^NOT ([^ ]+)$/;
const wireRegex = /^([^ ]+)$/

const calculateWire = (wire, instructions) => {
    if(numRegex.test(wire)) {
        return parseInt(wire);
    }

    const command = instructions[wire];
    if(!command) {
        console.log('no command for', wire);
        return null;
    }
    if(numRegex.test(command)) {
        return parseInt(command);
    }

    const andResult = andRegex.exec(command);
    if(andResult) {
        const result = calculateWire(andResult[1], instructions) &
            calculateWire(andResult[2], instructions);
        instructions[wire] = result;
        return result;
    }

    const orResult = orRegex.exec(command);
    if(orResult) {
        const result = calculateWire(orResult[1], instructions) |
            calculateWire(orResult[2], instructions);
        instructions[wire] = result;
        return result;
    }

    const lShiftResult = lShiftRegex.exec(command);
    if(lShiftResult) {
        const result = calculateWire(lShiftResult[1], instructions) <<
            calculateWire(lShiftResult[2], instructions);
        instructions[wire] = result;
        return result;
    }

    const rShiftResult = rShiftRegex.exec(command);
    if(rShiftResult) {
        const result = calculateWire(rShiftResult[1], instructions) >>
            calculateWire(rShiftResult[2], instructions);
        instructions[wire] = result;
        return result;
    }

    const notResult = notRegex.exec(command);
    if(notResult) {
        const result = 65536 + ~calculateWire(notResult[1], instructions);
        instructions[wire] = result;
        return result;
    }

    const wireResult = wireRegex.exec(command);
    if(wireResult) {
        const result = calculateWire(wireResult[1], instructions);
        instructions[wire] = result;
        return result;
    }

    console.log('cant parse', command);
}

const solution1 = inputLines => {
    const parsed = inputLines.map(parseLine);

    const instructions = {};
    parsed.forEach(({source, dest}) => {
        instructions[dest] = source
    });

    return calculateWire('a', instructions);
};

const solution2 = inputLines => {
    const aValue = solution1(inputLines);

    const parsed = inputLines.map(parseLine);
    
    const instructions = {};
    parsed.forEach(({source, dest}) => {
        instructions[dest] = source
    });

    instructions['b'] = aValue;

    return calculateWire('a', instructions);
};

module.exports = [solution1, solution2];