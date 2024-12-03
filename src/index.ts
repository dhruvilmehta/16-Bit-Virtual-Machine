import CPU from "./CPU";
import CreateMemory from "./CreateMemory";
import { ADD_REG_REG, MOV_LIT_R1, MOV_LIT_R2 } from "./instructions";

const memory = CreateMemory(256);
const writableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

writableBytes[0] = MOV_LIT_R1;
writableBytes[1] = 0x12; // 0x1234 (16 bits, therefore we are dividing into 2)
writableBytes[2] = 0x34;

writableBytes[3] = MOV_LIT_R2;
writableBytes[4] = 0xAB; // 0xabcd (16 bits, therefore we are dividing into 2)
writableBytes[5] = 0xCD;

writableBytes[6] = ADD_REG_REG;
writableBytes[7] = 2;
writableBytes[8] = 3;

cpu.debug()

cpu.step()
cpu.debug()

cpu.step()
cpu.debug()

cpu.step()
cpu.debug()