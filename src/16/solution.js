const registersRegex = /\[(\d+), (\d+), (\d+), (\d+)\]$/;

const parseRegisters = line => {
    const result = registersRegex.exec(line);
    return result.slice(1,5).map(v => parseInt(v));
}

const parseOperation = line => line.split(' ').map(v => parseInt(v));

const ops = {
    addr: (params, registers) => registers[params[1]] + registers[params[2]],
    addi: (params, registers) => registers[params[1]] + params[2],
    mulr: (params, registers) => registers[params[1]] * registers[params[2]],
    muli: (params, registers) => registers[params[1]] * params[2],
    banr: (params, registers) => registers[params[1]] & registers[params[2]],
    bani: (params, registers) => registers[params[1]] & params[2],
    borr: (params, registers) => registers[params[1]] | registers[params[2]],
    bori: (params, registers) => registers[params[1]] | params[2],
    setr: (params, registers) => registers[params[1]],
    seti: (params, registers) => params[1],
    gtir: (params, registers) => params[1] > registers[params[2]] ? 1 : 0,
    gtrr: (params, registers) => registers[params[1]] > params[2] ? 1 : 0,
    gtri: (params, registers) => registers[params[1]] > registers[params[2]] ? 1 : 0,
    eqir: (params, registers) => params[1] === registers[params[2]] ? 1 : 0,
    eqrr: (params, registers) => registers[params[1]] === params[2] ? 1 : 0,
    eqri: (params, registers) => registers[params[1]] === registers[params[2]] ? 1 : 0,
}

const parseOpLog = inputLines => {
    const posibleOps = Object.keys(ops);
    const result = [...new Array(posibleOps.length)].map(() => posibleOps);

    let i=0;
    while(inputLines[i].startsWith('Before')) {
        const initialRegisters = parseRegisters(inputLines[i]);
        const operation = parseOperation(inputLines[i+1]);
        const finalRegisters = parseRegisters(inputLines[i+2]);
        i += 3;

        const [opCode, A, B, C] = operation;

        result[opCode] = result[opCode].filter(opkey => {
            return finalRegisters[C] === ops[opkey](operation, initialRegisters);
        });

        while(inputLines[i] === '') i++;
    }

    return [i, result];
}

const guessOpCodes = opArray => {
    const opArrayPos = opArray.map(v => v.reduce((acc, v) => ({
        ...acc,
        [v]: true
    }), {}));

    while(opArray.some(v => Array.isArray(v))) {
        opArrayPos.forEach((obj,i) => {
            if(typeof opArray[i] === 'string') {
                return;
            }

            const posibilities = Object.entries(obj)
                .filter(([opkey, applies]) => applies)
                .map(([opkey]) => opkey);

            if(posibilities.length === 1) {
                opArray[i] = posibilities[0];

                opArrayPos.forEach((obj, i) => obj[posibilities[0]] = false);
            }
        });
    }

    return opArray;
}

const solution1 = inputLines => {
    let result = 0;

    let i=0;
    while(inputLines[i].startsWith('Before')) {
        const initialRegisters = parseRegisters(inputLines[i]);
        const operation = parseOperation(inputLines[i+1]);
        const finalRegisters = parseRegisters(inputLines[i+2]);
        i += 3;

        const [opCode, A, B, C] = operation;

        const posibleOps = Object.values(ops).filter(fn => finalRegisters[C] === fn(operation, initialRegisters)).length;
        if(posibleOps >= 3) result++;

        while(inputLines[i] === '') i++;
    }

    return result;
};

const parseOps = (inputLines, i) => {
    const ops = [];
    for(; i<inputLines.length; i++) {
        ops.push(inputLines[i].split(' ').map(v => parseInt(v)));
    }
    return ops;
}

const solution2 = inputLines => {
    const [i, opArray] = parseOpLog(inputLines);
    const opcodes = guessOpCodes(opArray);

    const opList = parseOps(inputLines, i);
    const registers = opList.reduce((reg, params) => {
        const opCode = opcodes[params[0]];
        reg[params[3]] = ops[opCode](params, reg);
        return reg;
    }, [0,0,0,0]);

    return registers;
};

module.exports = [solution1, solution2];