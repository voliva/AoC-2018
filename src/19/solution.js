const parseOp = line => {
    const result = line.split(' ');
    const [opcode,p1,p2,p3] = result
    return [
        opcode,
        parseInt(p1),
        parseInt(p2),
        parseInt(p3)
    ]
}

const ops = {
    addr: (instr, registers) => registers[instr[1]] + registers[instr[2]],
    addi: (instr, registers) => registers[instr[1]] + instr[2],
    mulr: (instr, registers) => registers[instr[1]] * registers[instr[2]],
    muli: (instr, registers) => registers[instr[1]] * instr[2],
    banr: (instr, registers) => registers[instr[1]] & registers[instr[2]],
    bani: (instr, registers) => registers[instr[1]] & instr[2],
    borr: (instr, registers) => registers[instr[1]] | registers[instr[2]],
    bori: (instr, registers) => registers[instr[1]] | instr[2],
    setr: (instr, registers) => registers[instr[1]],
    seti: (instr, registers) => instr[1],
    gtir: (instr, registers) => instr[1] > registers[instr[2]] ? 1 : 0,
    gtrr: (instr, registers) => registers[instr[1]] > registers[instr[2]] ? 1 : 0,
    gtri: (instr, registers) => registers[instr[1]] > instr[2] ? 1 : 0,
    eqir: (instr, registers) => instr[1] === registers[instr[2]] ? 1 : 0,
    eqrr: (instr, registers) => registers[instr[1]] === registers[instr[2]] ? 1 : 0,
    eqri: (instr, registers) => registers[instr[1]] === instr[2] ? 1 : 0,
}

const solution1 = inputLines => {
    const ipReg = parseInt(inputLines[0].split(' ')[1]);
    const program = inputLines.slice(1).map(parseOp);

    const registers = [0,0,0,0,0,0];
    while(registers[ipReg] < program.length) {
        const instr = program[registers[ipReg]];
        const opCode = instr[0];
        let resStr = `ip=${registers[ipReg]} [${registers.join(', ')}] ${instr.join(', ')}`;
        registers[instr[3]] = ops[opCode](instr, registers);
        resStr += ` [${registers.join(', ')}]`;
        // console.log(resStr);
        registers[ipReg]++;
    }

    return registers;
};

const solution2 = inputLines => {

    return inputLines;
};

module.exports = [solution1, solution2];