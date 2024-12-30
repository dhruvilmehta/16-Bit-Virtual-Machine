import { choice } from "arcsecond";
import { litMem, litOffReg, litReg, memReg, noArgs, regLit, regMem, regPtrReg, regReg, singleLit, singleReg } from "./formats";

const mov = choice([
    regReg('mov', 'MOV_REG_REG'),
    regMem('mov', 'MOV_REG_MEM'),
    litMem('mov', 'MOV_LIT_MEM'),
    memReg('mov', 'MOV_MEM_REG'),
    litReg('mov', 'MOV_LIT_REG'),
    regPtrReg('mov', 'MOV_REG_PTR_REG'),
    litOffReg('mov', 'MOV_LIT_OFF_REG'),
])

const add = choice([
    regReg('add', 'ADD_REG_REG'),
    litReg('add', 'ADD_LIT_REG'),
])

const sub = choice([
    regReg('sub', 'SUB_REG_REG'),
    litReg('sub', 'SUB_LIT_REG'),
    regLit('sub', 'SUB_REG_LIT'),
])

const mul = choice([
    regReg('mul', 'MUL_REG_REG'),
    litReg('mul', 'MUL_LIT_REG'),
])

const lsf = choice([
    regReg('lsf', 'LSF_REG_REG'),
    regLit('lsf', 'LSF_REG_LIT'),
])

const rsf = choice([
    regReg('rsf', 'RSF_REG_REG'),
    regLit('rsf', 'RSF_REG_LIT'),
])

const and = choice([
    regReg('and', 'AND_REG_REG'),
    litReg('and', 'AND_LIT_REG'),
])

const or = choice([
    regReg('or', 'OR_REG_REG'),
    litReg('or', 'OR_LIT_REG'),
])

const xor = choice([
    regReg('xor', 'XOR_REG_REG'),
    litReg('xor', 'XOR_LIT_REG'),
])

const inc = singleReg('inc', 'INC_REG')
const dec = singleReg('dec', 'DEC_REG')
const not = singleReg('not', 'NOT')

const jeq = choice([
    regMem('jeq', 'JEQ_REG'),
    litMem('jeq', 'JEQ_LIT'),
])

const jne = choice([
    regMem('jne', 'JNE_REG'),
    litMem('jne', 'JMP_NOT_EQ'),
])

const jlt = choice([
    regMem('jlt', 'JLT_REG'),
    litMem('jlt', 'JLT_LIT'),
])

const jgt = choice([
    regMem('jgt', 'JGT_REG'),
    litMem('jgt', 'JGT_LIT'),
])

const jle = choice([
    regMem('jle', 'JLE_REG'),
    litMem('jle', 'JLE_LIT'),
])

const jge = choice([
    regMem('jge', 'JGE_REG'),
    litMem('jge', 'JGE_LIT'),
])

const psh = choice([
    singleLit('psh', 'PSH_LIT'),
    singleReg('psh', 'PSH_REG'),
])

const pop = singleReg('pop', 'POP_REG')

const cal = choice([
    singleLit('cal', 'CAL_LIT'),
    singleReg('cal', 'CAL_REG'),
])

const ret = noArgs('ret', 'RET')

const hlt = noArgs('hlt', 'HLT')

export default choice([
    mov, add, sub, mul, lsf, rsf, and, or, xor, inc, dec, not, jeq, jne, jlt, jgt, jle, jge, psh, pop, cal, ret, hlt
])