"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instructionTypes = exports.meta = exports.instructionNames = void 0;
const instructionTypes = {
    litReg: 0,
    regLit: 1,
    regLit8: 2,
    regReg: 3,
    regMem: 4,
    memReg: 5,
    litMem: 6,
    regPtrReg: 7,
    litOffReg: 8,
    noArgs: 9,
    singleReg: 10,
    singleLit: 11,
};
exports.instructionTypes = instructionTypes;
const instructionTypeSizes = {
    litReg: 4,
    regLit: 4,
    regLit8: 3,
    regReg: 3,
    regMem: 4,
    memReg: 4,
    litMem: 5,
    regPtrReg: 3,
    litOffReg: 5,
    noArgs: 1,
    singleReg: 2,
    singleLit: 3,
};
var instructionNames;
(function (instructionNames) {
    instructionNames["MOV_LIT_REG"] = "MOV_LIT_REG";
    instructionNames["MOV_REG_REG"] = "MOV_REG_REG";
    instructionNames["MOV_REG_MEM"] = "MOV_REG_MEM";
    instructionNames["MOV_MEM_REG"] = "MOV_MEM_REG";
    instructionNames["MOV_LIT_MEM"] = "MOV_LIT_MEM";
    instructionNames["MOV_REG_PTR_REG"] = "MOV_REG_PTR_REG";
    instructionNames["MOV_LIT_OFF_REG"] = "MOV_LIT_OFF_REG";
    instructionNames["ADD_REG_REG"] = "ADD_REG_REG";
    instructionNames["ADD_LIT_REG"] = "ADD_LIT_REG";
    instructionNames["SUB_LIT_REG"] = "SUB_LIT_REG";
    instructionNames["SUB_REG_LIT"] = "SUB_REG_LIT";
    instructionNames["SUB_REG_REG"] = "SUB_REG_REG";
    instructionNames["INC_REG"] = "INC_REG";
    instructionNames["DEC_REG"] = "DEC_REG";
    instructionNames["MUL_LIT_REG"] = "MUL_LIT_REG";
    instructionNames["MUL_REG_REG"] = "MUL_REG_REG";
    instructionNames["LSF_REG_LIT"] = "LSF_REG_LIT";
    instructionNames["LSF_REG_REG"] = "LSF_REG_REG";
    instructionNames["RSF_REG_LIT"] = "RSF_REG_LIT";
    instructionNames["RSF_REG_REG"] = "RSF_REG_REG";
    instructionNames["AND_REG_LIT"] = "AND_REG_LIT";
    instructionNames["AND_REG_REG"] = "AND_REG_REG";
    instructionNames["OR_REG_LIT"] = "OR_REG_LIT";
    instructionNames["OR_REG_REG"] = "OR_REG_REG";
    instructionNames["XOR_REG_LIT"] = "XOR_REG_LIT";
    instructionNames["XOR_REG_REG"] = "XOR_REG_REG";
    instructionNames["NOT"] = "NOT";
    instructionNames["JMP_NOT_EQ"] = "JMP_NOT_EQ";
    instructionNames["JNE_REG"] = "JNE_REG";
    instructionNames["JEQ_REG"] = "JEQ_REG";
    instructionNames["JEQ_LIT"] = "JEQ_LIT";
    instructionNames["JLT_REG"] = "JLT_REG";
    instructionNames["JLT_LIT"] = "JLT_LIT";
    instructionNames["JGT_REG"] = "JGT_REG";
    instructionNames["JGT_LIT"] = "JGT_LIT";
    instructionNames["JLE_REG"] = "JLE_REG";
    instructionNames["JLE_LIT"] = "JLE_LIT";
    instructionNames["JGE_REG"] = "JGE_REG";
    instructionNames["JGE_LIT"] = "JGE_LIT";
    instructionNames["PSH_LIT"] = "PSH_LIT";
    instructionNames["PSH_REG"] = "PSH_REG";
    instructionNames["POP"] = "POP";
    instructionNames["CAL_LIT"] = "CAL_LIT";
    instructionNames["CAL_REG"] = "CAL_REG";
    instructionNames["RET"] = "RET";
    instructionNames["HLT"] = "HLT";
})(instructionNames || (exports.instructionNames = instructionNames = {}));
const meta = [
    {
        instruction: instructionNames.MOV_LIT_REG,
        opcode: 0x10,
        type: instructionTypes.litReg,
        size: instructionTypeSizes.litReg,
        mnemonic: 'mov',
    },
    {
        instruction: instructionNames.MOV_REG_REG,
        opcode: 0x11,
        type: instructionTypes.regReg,
        size: instructionTypeSizes.regReg,
        mnemonic: 'mov',
    },
    {
        instruction: instructionNames.MOV_REG_MEM,
        opcode: 0x12,
        type: instructionTypes.regMem,
        size: instructionTypeSizes.regMem,
        mnemonic: 'mov',
    },
    {
        instruction: instructionNames.MOV_MEM_REG,
        opcode: 0x13,
        type: instructionTypes.memReg,
        size: instructionTypeSizes.memReg,
        mnemonic: 'mov',
    },
    {
        instruction: instructionNames.MOV_LIT_MEM,
        opcode: 0x1B,
        type: instructionTypes.litMem,
        size: instructionTypeSizes.litMem,
        mnemonic: 'mov',
    },
    {
        instruction: instructionNames.MOV_REG_PTR_REG,
        opcode: 0x1C,
        type: instructionTypes.regPtrReg,
        size: instructionTypeSizes.regPtrReg,
        mnemonic: 'mov',
    },
    {
        instruction: instructionNames.MOV_LIT_OFF_REG,
        opcode: 0x1D,
        type: instructionTypes.litOffReg,
        size: instructionTypeSizes.litOffReg,
        mnemonic: 'mov',
    },
    {
        instruction: instructionNames.ADD_REG_REG,
        opcode: 0x14,
        type: instructionTypes.regReg,
        size: instructionTypeSizes.regReg,
        mnemonic: 'add',
    },
    {
        instruction: instructionNames.ADD_LIT_REG,
        opcode: 0x3F,
        type: instructionTypes.litReg,
        size: instructionTypeSizes.litReg,
        mnemonic: 'add',
    },
    {
        instruction: instructionNames.SUB_LIT_REG,
        opcode: 0x16,
        type: instructionTypes.litReg,
        size: instructionTypeSizes.litReg,
        mnemonic: 'sub',
    },
    {
        instruction: instructionNames.SUB_REG_LIT,
        opcode: 0x1E,
        type: instructionTypes.regLit,
        size: instructionTypeSizes.regLit,
        mnemonic: 'sub',
    },
    {
        instruction: instructionNames.SUB_REG_REG,
        opcode: 0x1F,
        type: instructionTypes.regReg,
        size: instructionTypeSizes.regReg,
        mnemonic: 'sub',
    },
    {
        instruction: instructionNames.INC_REG,
        opcode: 0x35,
        type: instructionTypes.singleReg,
        size: instructionTypeSizes.singleReg,
        mnemonic: 'inc',
    },
    {
        instruction: instructionNames.DEC_REG,
        opcode: 0x36,
        type: instructionTypes.singleReg,
        size: instructionTypeSizes.singleReg,
        mnemonic: 'dec',
    },
    {
        instruction: instructionNames.MUL_LIT_REG,
        opcode: 0x20,
        type: instructionTypes.litReg,
        size: instructionTypeSizes.litReg,
        mnemonic: 'mul',
    },
    {
        instruction: instructionNames.MUL_REG_REG,
        opcode: 0x21,
        type: instructionTypes.regReg,
        size: instructionTypeSizes.regReg,
        mnemonic: 'mul',
    },
    {
        instruction: instructionNames.LSF_REG_LIT,
        opcode: 0x26,
        type: instructionTypes.regLit8,
        size: instructionTypeSizes.regLit8,
        mnemonic: 'lsf',
    },
    {
        instruction: instructionNames.LSF_REG_REG,
        opcode: 0x27,
        type: instructionTypes.regReg,
        size: instructionTypeSizes.regReg,
        mnemonic: 'lsf',
    },
    {
        instruction: instructionNames.RSF_REG_LIT,
        opcode: 0x2A,
        type: instructionTypes.regLit8,
        size: instructionTypeSizes.regLit8,
        mnemonic: 'rsf',
    },
    {
        instruction: instructionNames.RSF_REG_REG,
        opcode: 0x2B,
        type: instructionTypes.regReg,
        size: instructionTypeSizes.regReg,
        mnemonic: 'rsf',
    },
    {
        instruction: instructionNames.AND_REG_LIT,
        opcode: 0x2E,
        type: instructionTypes.regLit,
        size: instructionTypeSizes.regLit,
        mnemonic: 'and',
    },
    {
        instruction: instructionNames.AND_REG_REG,
        opcode: 0x2F,
        type: instructionTypes.regReg,
        size: instructionTypeSizes.regReg,
        mnemonic: 'and',
    },
    {
        instruction: instructionNames.OR_REG_LIT,
        opcode: 0x30,
        type: instructionTypes.regLit,
        size: instructionTypeSizes.regLit,
        mnemonic: 'or',
    },
    {
        instruction: instructionNames.OR_REG_REG,
        opcode: 0x31,
        type: instructionTypes.regReg,
        size: instructionTypeSizes.regReg,
        mnemonic: 'or',
    },
    {
        instruction: instructionNames.XOR_REG_LIT,
        opcode: 0x32,
        type: instructionTypes.regLit,
        size: instructionTypeSizes.regLit,
        mnemonic: 'xor',
    },
    {
        instruction: instructionNames.XOR_REG_REG,
        opcode: 0x33,
        type: instructionTypes.regReg,
        size: instructionTypeSizes.regReg,
        mnemonic: 'xor',
    },
    {
        instruction: instructionNames.NOT,
        opcode: 0x34,
        type: instructionTypes.singleReg,
        size: instructionTypeSizes.singleReg,
        mnemonic: 'not',
    },
    {
        instruction: instructionNames.JMP_NOT_EQ,
        opcode: 0x15,
        type: instructionTypes.litMem,
        size: instructionTypeSizes.litMem,
        mnemonic: 'jne',
    },
    {
        instruction: instructionNames.JNE_REG,
        opcode: 0x40,
        type: instructionTypes.regMem,
        size: instructionTypeSizes.regMem,
        mnemonic: 'jne',
    },
    {
        instruction: instructionNames.JEQ_REG,
        opcode: 0x3E,
        type: instructionTypes.regMem,
        size: instructionTypeSizes.regMem,
        mnemonic: 'jeq',
    },
    {
        instruction: instructionNames.JEQ_LIT,
        opcode: 0x41,
        type: instructionTypes.litMem,
        size: instructionTypeSizes.litMem,
        mnemonic: 'jeq',
    },
    {
        instruction: instructionNames.JLT_REG,
        opcode: 0x42,
        type: instructionTypes.regMem,
        size: instructionTypeSizes.regMem,
        mnemonic: 'jlt',
    },
    {
        instruction: instructionNames.JLT_LIT,
        opcode: 0x43,
        type: instructionTypes.litMem,
        size: instructionTypeSizes.litMem,
        mnemonic: 'jlt',
    },
    {
        instruction: instructionNames.JGT_REG,
        opcode: 0x44,
        type: instructionTypes.regMem,
        size: instructionTypeSizes.regMem,
        mnemonic: 'jgt',
    },
    {
        instruction: instructionNames.JGT_LIT,
        opcode: 0x45,
        type: instructionTypes.litMem,
        size: instructionTypeSizes.litMem,
        mnemonic: 'jgt',
    },
    {
        instruction: instructionNames.JLE_REG,
        opcode: 0x46,
        type: instructionTypes.regMem,
        size: instructionTypeSizes.regMem,
        mnemonic: 'jle',
    },
    {
        instruction: instructionNames.JLE_LIT,
        opcode: 0x47,
        type: instructionTypes.litMem,
        size: instructionTypeSizes.litMem,
        mnemonic: 'jle',
    },
    {
        instruction: instructionNames.JGE_REG,
        opcode: 0x48,
        type: instructionTypes.regMem,
        size: instructionTypeSizes.regMem,
        mnemonic: 'jge',
    },
    {
        instruction: instructionNames.JGE_LIT,
        opcode: 0x49,
        type: instructionTypes.litMem,
        size: instructionTypeSizes.litMem,
        mnemonic: 'jge',
    },
    {
        instruction: instructionNames.PSH_LIT,
        opcode: 0x17,
        type: instructionTypes.singleLit,
        size: instructionTypeSizes.singleLit,
        mnemonic: 'psh',
    },
    {
        instruction: instructionNames.PSH_REG,
        opcode: 0x18,
        type: instructionTypes.singleReg,
        size: instructionTypeSizes.singleReg,
        mnemonic: 'psh',
    },
    {
        instruction: instructionNames.POP,
        opcode: 0x1A,
        type: instructionTypes.singleReg,
        size: instructionTypeSizes.singleReg,
        mnemonic: 'pop',
    },
    {
        instruction: instructionNames.CAL_LIT,
        opcode: 0x5E,
        type: instructionTypes.singleLit,
        size: instructionTypeSizes.singleLit,
        mnemonic: 'cal',
    },
    {
        instruction: instructionNames.CAL_REG,
        opcode: 0x5F,
        type: instructionTypes.singleReg,
        size: instructionTypeSizes.singleReg,
        mnemonic: 'cal',
    },
    {
        instruction: instructionNames.RET,
        opcode: 0x60,
        type: instructionTypes.noArgs,
        size: instructionTypeSizes.noArgs,
        mnemonic: 'ret',
    },
    {
        instruction: instructionNames.HLT,
        opcode: 0xFF,
        type: instructionTypes.noArgs,
        size: instructionTypeSizes.noArgs,
        mnemonic: 'hlt',
    },
];
exports.meta = meta;
