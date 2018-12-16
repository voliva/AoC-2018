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

    return result;
}

const solution1 = inputLines => {
    const ops = parseOpLog(inputLines).filter(v => v.length >= 3).length;

    return ops;
};

const solution2 = inputLines => {

    return inputLines;
};

module.exports = [solution1, solution2];