import { instructionTypes as I, instructionNames } from "../instructions/meta";
import parser from "./parser";
import instructions from "../instructions/index";

const registerMap = {
    ip: 0,
    acc: 1,
    r1: 2,
    r2: 3,
    r3: 4,
    r4: 5,
    r5: 6,
    r6: 7,
    r7: 8,
    r8: 9,
    sp: 10,
    fp: 11,
}

// const exampleProgram = [
//     'mov $4200, r1',
//     'mov r1, &0060',
//     'mov $1300, r1',
//     'mov &0060, r2',
//     'add r1, r2',
// ].join('\n')

const exampleProgram = [
    'start:',
    '  mov $0A, &0050',
    'loop:',
    '  mov &0050, acc',
    '  dec acc',
    '  mov acc, &0050',
    '  inc r2',
    '  inc r2',
    '  inc r2',
    '  jne $00, &[!loop]',
    'end:',
    '  hlt',
].join('\n');

const parsedOutput: { isError: boolean, result: [], index: number, data: {} } = parser.run(exampleProgram) as { isError: boolean, result: [], index: number, data: {} }

const machineCode: number[] = []
const labels = {} as any
let currentAddress = 0

parsedOutput.result.forEach((instructionOrLabel: {
    type: string,
    value: any,
}) => {
    if (instructionOrLabel.type === 'LABEL') {
        labels[instructionOrLabel.value] = currentAddress
    } else {
        const metadata = instructions[instructionOrLabel.value.instruction as instructionNames]
        currentAddress += metadata.size
    }
})

const encodeLitOrMem = (lit: { type: string, value: string }) => {
    let hexVal;
    if (lit.type === 'VARIABLE') {
        if (!(lit.value in labels)) {
            throw new Error(`Label ${lit.value} not found`)
        }
        hexVal = labels[lit.value]
    } else {
        hexVal = parseInt(lit.value, 16);
    }
    const highByte = (hexVal & 0xFF00) >> 8;
    const lowByte = hexVal & 0x00FF;
    machineCode.push(highByte, lowByte);
}

const encodeLit8 = (lit: { type: string, value: string }) => {
    let hexVal;
    if (lit.type === 'VARIABLE') {
        if (!(lit.value in labels)) {
            throw new Error(`Label ${lit.value} not found`)
        }
        hexVal = labels[lit.value]
    } else {
        hexVal = parseInt(lit.value, 16);
    }
    const lowByte = hexVal & 0x00FF;
    machineCode.push(lowByte);
}

const encodeReg = (reg: { type: string, value: string }) => {
    const mappedReg = registerMap[reg.value as keyof typeof registerMap]
    machineCode.push(mappedReg)
}

parsedOutput.result.forEach((instruction: {
    type: string,
    value: {
        instruction: string,
        args: { type: string, value: string }[],
    },
}) => {
    if (instruction.type === 'LABEL') return;

    const metadata = instructions[instruction.value.instruction as instructionNames]
    machineCode.push(metadata.opcode)
    if ([I.litReg, I.memReg].includes(metadata.type)) {
        encodeLitOrMem(instruction.value.args[0])
        encodeReg(instruction.value.args[1])
    }
    if ([I.regLit, I.regMem].includes(metadata.type)) {
        encodeReg(instruction.value.args[0])
        encodeLitOrMem(instruction.value.args[1])
    }
    if (I.regLit8 === metadata.type) {
        encodeReg(instruction.value.args[0])
        encodeLit8(instruction.value.args[1])
    }
    if ([I.regReg, I.regPtrReg].includes(metadata.type)) {
        encodeReg(instruction.value.args[0])
        encodeReg(instruction.value.args[1])
    }
    if (I.litMem === metadata.type) {
        encodeLitOrMem(instruction.value.args[0])
        encodeLitOrMem(instruction.value.args[1])
    }
    if (I.litOffReg === metadata.type) {
        encodeLitOrMem(instruction.value.args[0])
        encodeReg(instruction.value.args[1])
        encodeReg(instruction.value.args[2])
    }
    if (I.singleReg === metadata.type) {
        encodeReg(instruction.value.args[0])
    }
    if (I.singleLit === metadata.type) {
        encodeLitOrMem(instruction.value.args[0])
    }
})

console.log(machineCode.join(' '))