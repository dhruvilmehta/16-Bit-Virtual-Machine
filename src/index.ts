import CPU from "./CPU";
import CreateMemory from "./CreateMemory";
import * as readline from 'readline'

import { ADD_REG_REG, JMP_NOT_EQ, MOV_LIT_REG, MOV_MEM_REG, MOV_REG_MEM, MOV_REG_REG } from "./instructions";

const IP = 0
const ACC = 1
const R1 = 2
const R2 = 3

const memory = CreateMemory(256 * 256);
const writableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

let i = 0;

writableBytes[i++] = MOV_MEM_REG
writableBytes[i++] = 0x01
writableBytes[i++] = 0x00
writableBytes[i++] = R1

writableBytes[i++] = MOV_LIT_REG
writableBytes[i++] = 0x00
writableBytes[i++] = 0x01
writableBytes[i++] = R2

writableBytes[i++] = ADD_REG_REG
writableBytes[i++] = R1
writableBytes[i++] = R2

writableBytes[i++] = MOV_REG_MEM
writableBytes[i++] = ACC
writableBytes[i++] = 0x01
writableBytes[i++] = 0x00

writableBytes[i++] = JMP_NOT_EQ
writableBytes[i++] = 0x00
writableBytes[i++] = 0x03
writableBytes[i++] = 0x00
writableBytes[i++] = 0x00

cpu.debug()
cpu.viewMemoryAt(cpu.getRegister('ip'))
cpu.viewMemoryAt(0x0100)

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

r1.on('line', () => {
    cpu.step()
    cpu.debug()
    cpu.viewMemoryAt(cpu.getRegister('ip'))
    cpu.viewMemoryAt(0x0100)
})

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