"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CPU_1 = __importDefault(require("./CPU"));
const CreateMemory_1 = __importDefault(require("./CreateMemory"));
const instructions_1 = require("./instructions");
const memory = (0, CreateMemory_1.default)(256);
const writableBytes = new Uint8Array(memory.buffer);
const cpu = new CPU_1.default(memory);
writableBytes[0] = instructions_1.MOV_LIT_R1;
writableBytes[1] = 0x12; // 0x1234 (16 bits, therefore we are dividing into 2)
writableBytes[2] = 0x34;
writableBytes[3] = instructions_1.MOV_LIT_R2;
writableBytes[4] = 0xAB; // 0x1234 (16 bits, therefore we are dividing into 2)
writableBytes[5] = 0xCD;
writableBytes[6] = instructions_1.ADD_REG_REG;
writableBytes[7] = 2;
writableBytes[8] = 3;
cpu.debug();
cpu.step();
cpu.debug();
cpu.step();
cpu.debug();
cpu.step();
cpu.debug();
