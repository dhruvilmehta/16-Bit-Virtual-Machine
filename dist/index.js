"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CPU_1 = __importDefault(require("./CPU"));
const CreateMemory_1 = __importDefault(require("./CreateMemory"));
const readline = __importStar(require("readline"));
const instructions_1 = require("./instructions");
const IP = 0;
const ACC = 1;
const R1 = 2;
const R2 = 3;
const memory = (0, CreateMemory_1.default)(256 * 256);
const writableBytes = new Uint8Array(memory.buffer);
const cpu = new CPU_1.default(memory);
let i = 0;
writableBytes[i++] = instructions_1.MOV_MEM_REG;
writableBytes[i++] = 0x01;
writableBytes[i++] = 0x00;
writableBytes[i++] = R1;
writableBytes[i++] = instructions_1.MOV_LIT_REG;
writableBytes[i++] = 0x00;
writableBytes[i++] = 0x01;
writableBytes[i++] = R2;
writableBytes[i++] = instructions_1.ADD_REG_REG;
writableBytes[i++] = R1;
writableBytes[i++] = R2;
writableBytes[i++] = instructions_1.MOV_REG_MEM;
writableBytes[i++] = ACC;
writableBytes[i++] = 0x01;
writableBytes[i++] = 0x00;
writableBytes[i++] = instructions_1.JMP_NOT_EQ;
writableBytes[i++] = 0x00;
writableBytes[i++] = 0x03;
writableBytes[i++] = 0x00;
writableBytes[i++] = 0x00;
cpu.debug();
cpu.viewMemoryAt(cpu.getRegister('ip'));
cpu.viewMemoryAt(0x0100);
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
r1.on('line', () => {
    cpu.step();
    cpu.debug();
    cpu.viewMemoryAt(cpu.getRegister('ip'));
    cpu.viewMemoryAt(0x0100);
});
// writableBytes[i++] = MOV_LIT_REG;
// writableBytes[i++] = 0x12; // 0x1234 (16 bits, therefore we are dividing into 2)
// writableBytes[i++] = 0x34;
// writableBytes[i++] = R1;
// writableBytes[i++] = MOV_LIT_REG;
// writableBytes[i++] = 0xAB; // 0xabcd (16 bits, therefore we are dividing into 2)
// writableBytes[i++] = 0xCD;
// writableBytes[i++] = R2;
// //Adding R1 and R2, reuslt will go into ACC
// writableBytes[i++] = ADD_REG_REG;
// writableBytes[i++] = R1;
// writableBytes[i++] = R2;
// //Moving the result into memory location 0x0100
// writableBytes[i++] = MOV_REG_MEM;
// writableBytes[i++] = ACC;
// writableBytes[i++] = 0x01;
// writableBytes[i++] = 0x00; //0x00
// cpu.debug()
// cpu.viewMemoryAt(cpu.getRegister('ip'))
// cpu.viewMemoryAt(0x0100)
// cpu.step()
// cpu.debug()
// cpu.viewMemoryAt(cpu.getRegister('ip'))
// cpu.viewMemoryAt(0x0100)
// cpu.step()
// cpu.debug()
// cpu.viewMemoryAt(cpu.getRegister('ip'))
// cpu.viewMemoryAt(0x0100)
// cpu.step()
// cpu.debug()
// cpu.viewMemoryAt(cpu.getRegister('ip'))
// cpu.viewMemoryAt(0x0100)
// cpu.step()
// cpu.debug()
// cpu.viewMemoryAt(cpu.getRegister('ip'))
// cpu.viewMemoryAt(0x0100)
