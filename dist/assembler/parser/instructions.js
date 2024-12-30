"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arcsecond_1 = require("arcsecond");
const formats_1 = require("./formats");
const mov = (0, arcsecond_1.choice)([
    (0, formats_1.regReg)('mov', 'MOV_REG_REG'),
    (0, formats_1.regMem)('mov', 'MOV_REG_MEM'),
    (0, formats_1.litMem)('mov', 'MOV_LIT_MEM'),
    (0, formats_1.memReg)('mov', 'MOV_MEM_REG'),
    (0, formats_1.litReg)('mov', 'MOV_LIT_REG'),
    (0, formats_1.regPtrReg)('mov', 'MOV_REG_PTR_REG'),
    (0, formats_1.litOffReg)('mov', 'MOV_LIT_OFF_REG'),
]);
const add = (0, arcsecond_1.choice)([
    (0, formats_1.regReg)('add', 'ADD_REG_REG'),
    (0, formats_1.litReg)('add', 'ADD_LIT_REG'),
]);
const sub = (0, arcsecond_1.choice)([
    (0, formats_1.regReg)('sub', 'SUB_REG_REG'),
    (0, formats_1.litReg)('sub', 'SUB_LIT_REG'),
    (0, formats_1.regLit)('sub', 'SUB_REG_LIT'),
]);
const mul = (0, arcsecond_1.choice)([
    (0, formats_1.regReg)('mul', 'MUL_REG_REG'),
    (0, formats_1.litReg)('mul', 'MUL_LIT_REG'),
]);
const lsf = (0, arcsecond_1.choice)([
    (0, formats_1.regReg)('lsf', 'LSF_REG_REG'),
    (0, formats_1.regLit)('lsf', 'LSF_REG_LIT'),
]);
const rsf = (0, arcsecond_1.choice)([
    (0, formats_1.regReg)('rsf', 'RSF_REG_REG'),
    (0, formats_1.regLit)('rsf', 'RSF_REG_LIT'),
]);
const and = (0, arcsecond_1.choice)([
    (0, formats_1.regReg)('and', 'AND_REG_REG'),
    (0, formats_1.litReg)('and', 'AND_LIT_REG'),
]);
const or = (0, arcsecond_1.choice)([
    (0, formats_1.regReg)('or', 'OR_REG_REG'),
    (0, formats_1.litReg)('or', 'OR_LIT_REG'),
]);
const xor = (0, arcsecond_1.choice)([
    (0, formats_1.regReg)('xor', 'XOR_REG_REG'),
    (0, formats_1.litReg)('xor', 'XOR_LIT_REG'),
]);
const inc = (0, formats_1.singleReg)('inc', 'INC_REG');
const dec = (0, formats_1.singleReg)('dec', 'DEC_REG');
const not = (0, formats_1.singleReg)('not', 'NOT');
const jeq = (0, arcsecond_1.choice)([
    (0, formats_1.regMem)('jeq', 'JEQ_REG'),
    (0, formats_1.litMem)('jeq', 'JEQ_LIT'),
]);
const jne = (0, arcsecond_1.choice)([
    (0, formats_1.regMem)('jne', 'JNE_REG'),
    (0, formats_1.litMem)('jne', 'JMP_NOT_EQ'),
]);
const jlt = (0, arcsecond_1.choice)([
    (0, formats_1.regMem)('jlt', 'JLT_REG'),
    (0, formats_1.litMem)('jlt', 'JLT_LIT'),
]);
const jgt = (0, arcsecond_1.choice)([
    (0, formats_1.regMem)('jgt', 'JGT_REG'),
    (0, formats_1.litMem)('jgt', 'JGT_LIT'),
]);
const jle = (0, arcsecond_1.choice)([
    (0, formats_1.regMem)('jle', 'JLE_REG'),
    (0, formats_1.litMem)('jle', 'JLE_LIT'),
]);
const jge = (0, arcsecond_1.choice)([
    (0, formats_1.regMem)('jge', 'JGE_REG'),
    (0, formats_1.litMem)('jge', 'JGE_LIT'),
]);
const psh = (0, arcsecond_1.choice)([
    (0, formats_1.singleLit)('psh', 'PSH_LIT'),
    (0, formats_1.singleReg)('psh', 'PSH_REG'),
]);
const pop = (0, formats_1.singleReg)('pop', 'POP_REG');
const cal = (0, arcsecond_1.choice)([
    (0, formats_1.singleLit)('cal', 'CAL_LIT'),
    (0, formats_1.singleReg)('cal', 'CAL_REG'),
]);
const ret = (0, formats_1.noArgs)('ret', 'RET');
const hlt = (0, formats_1.noArgs)('hlt', 'HLT');
exports.default = (0, arcsecond_1.choice)([
    mov, add, sub, mul, lsf, rsf, and, or, xor, inc, dec, not, jeq, jne, jlt, jgt, jle, jge, psh, pop, cal, ret, hlt
]);
