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
    // By analyzing the code, I see that it will halt if when reaching ip=30 r0===31
    while(registers[ipReg] < program.length && registers[ipReg] !== 28) {
        const instr = program[registers[ipReg]];
        const opCode = instr[0];
        
        let resStr = `ip=${registers[ipReg]} [${registers.join(', ')}] ${instr.join(', ')}`;
        registers[instr[3]] = ops[opCode](instr, registers);
        resStr += ` [${registers.join(', ')}]`;
        console.log(resStr);

        registers[ipReg]++;
    }

    return registers[1];
};

const solution2 = inputLines => {

    const ipReg = parseInt(inputLines[0].split(' ')[1]);
    const program = inputLines.slice(1).map(parseOp);

    const registers = [1,0,0,0,0,0];
    

    return registers;
};

module.exports = [solution1, solution2];