"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meta_1 = require("../instructions/meta");
const parser_1 = __importDefault(require("./parser"));
const index_1 = __importDefault(require("../instructions/index"));
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
};
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
const parsedOutput = parser_1.default.run(exampleProgram);
const machineCode = [];
const labels = {};
let currentAddress = 0;
parsedOutput.result.forEach((instructionOrLabel) => {
    if (instructionOrLabel.type === 'LABEL') {
        labels[instructionOrLabel.value] = currentAddress;
    }
    else {
        const metadata = index_1.default[instructionOrLabel.value.instruction];
        currentAddress += metadata.size;
    }
});
const encodeLitOrMem = (lit) => {
    let hexVal;
    if (lit.type === 'VARIABLE') {
        if (!(lit.value in labels)) {
            throw new Error(`Label ${lit.value} not found`);
        }
        hexVal = labels[lit.value];
    }
    else {
        hexVal = parseInt(lit.value, 16);
    }
    const highByte = (hexVal & 0xFF00) >> 8;
    const lowByte = hexVal & 0x00FF;
    machineCode.push(highByte, lowByte);
};
const encodeLit8 = (lit) => {
    let hexVal;
    if (lit.type === 'VARIABLE') {
        if (!(lit.value in labels)) {
            throw new Error(`Label ${lit.value} not found`);
        }
        hexVal = labels[lit.value];
    }
    else {
        hexVal = parseInt(lit.value, 16);
    }
    const lowByte = hexVal & 0x00FF;
    machineCode.push(lowByte);
};
const encodeReg = (reg) => {
    const mappedReg = registerMap[reg.value];
    machineCode.push(mappedReg);
};
parsedOutput.result.forEach((instruction) => {
    if (instruction.type === 'LABEL')
        return;
    const metadata = index_1.default[instruction.value.instruction];
    machineCode.push(metadata.opcode);
    if ([meta_1.instructionTypes.litReg, meta_1.instructionTypes.memReg].includes(metadata.type)) {
        encodeLitOrMem(instruction.value.args[0]);
        encodeReg(instruction.value.args[1]);
    }
    if ([meta_1.instructionTypes.regLit, meta_1.instructionTypes.regMem].includes(metadata.type)) {
        encodeReg(instruction.value.args[0]);
        encodeLitOrMem(instruction.value.args[1]);
    }
    if (meta_1.instructionTypes.regLit8 === metadata.type) {
        encodeReg(instruction.value.args[0]);
        encodeLit8(instruction.value.args[1]);
    }
    if ([meta_1.instructionTypes.regReg, meta_1.instructionTypes.regPtrReg].includes(metadata.type)) {
        encodeReg(instruction.value.args[0]);
        encodeReg(instruction.value.args[1]);
    }
    if (meta_1.instructionTypes.litMem === metadata.type) {
        encodeLitOrMem(instruction.value.args[0]);
        encodeLitOrMem(instruction.value.args[1]);
    }
    if (meta_1.instructionTypes.litOffReg === metadata.type) {
        encodeLitOrMem(instruction.value.args[0]);
        encodeReg(instruction.value.args[1]);
        encodeReg(instruction.value.args[2]);
    }
    if (meta_1.instructionTypes.singleReg === metadata.type) {
        encodeReg(instruction.value.args[0]);
    }
    if (meta_1.instructionTypes.singleLit === metadata.type) {
        encodeLitOrMem(instruction.value.args[0]);
    }
});
console.log(machineCode.join(' '));
