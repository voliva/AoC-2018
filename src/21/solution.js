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

    let previousR1Value = null;
    const r1Set = new Set();
    while(registers[ipReg] < program.length) {
        const instr = program[registers[ipReg]];
        const opCode = instr[0];
        
        let resStr = `ip=${registers[ipReg]} [${registers.join(', ')}] ${instr.join(', ')}`;
        registers[instr[3]] = ops[opCode](instr, registers);
        resStr += ` [${registers.join(', ')}]`;
        // console.log(registers[1], resStr);
        // As trying to figure out how r1 works (which gets multiplied by a specific number and masked) and the number of iterations
        // is hard (because of a goto and that it depends on r1), I'll just try to see when r1 gets repeated and use the previous R1
        if(registers[ipReg] === 28) {
            if(r1Set.has(registers[1])) {
                return previousR1Value;
            }
            previousR1Value = registers[1];
            r1Set.add(registers[1]);
            console.log(r1Set.size);
        }

        registers[ipReg]++;

        // Instructions 18 => 27 achieve this by doing an expensive loop
        if(registers[ipReg] === 18) {
            registers[4] = Math.floor(registers[4] / 256);
            registers[ipReg] = 8;
        }
    }

    return registers;
};

module.exports = [solution1, solution2];