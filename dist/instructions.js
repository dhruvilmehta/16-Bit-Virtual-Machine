"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JMP_NOT_EQ = exports.ADD_REG_REG = exports.MOV_REG_REG = exports.MOV_REG_MEM = exports.MOV_MEM_REG = exports.MOV_LIT_REG = void 0;
const MOV_LIT_REG = 0x10; // Move literal to register
exports.MOV_LIT_REG = MOV_LIT_REG;
const MOV_REG_REG = 0x11; // Move register to register
exports.MOV_REG_REG = MOV_REG_REG;
const MOV_REG_MEM = 0x12; // Move register to memory
exports.MOV_REG_MEM = MOV_REG_MEM;
const MOV_MEM_REG = 0x13; // Move memory to register
exports.MOV_MEM_REG = MOV_MEM_REG;
const ADD_REG_REG = 0x14; // Move memory to register
exports.ADD_REG_REG = ADD_REG_REG;
const JMP_NOT_EQ = 0x15; // Jump not equal
exports.JMP_NOT_EQ = JMP_NOT_EQ;
