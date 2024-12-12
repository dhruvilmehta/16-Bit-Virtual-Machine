"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CPU_1 = __importDefault(require("./CPU"));
const CreateMemory_1 = __importDefault(require("./CreateMemory"));
const instructions_1 = require("./instructions");
const MemoryMapper_1 = __importDefault(require("./MemoryMapper"));
const screen_device_1 = __importDefault(require("./screen-device"));
const IP = 0;
const ACC = 1;
const R1 = 2;
const R2 = 3;
const R3 = 4;
const R4 = 5;
const R5 = 6;
const R6 = 7;
const R7 = 8;
const R8 = 9;
const SP = 10;
const FP = 11;
const MM = new MemoryMapper_1.default();
const memory = (0, CreateMemory_1.default)(256 * 256);
MM.map(memory, 0, 0xffff); // entire addres space
// map 0xff bytes of the address for the stdout (output device)
MM.map((0, screen_device_1.default)(), 0x3000, 0x30ff, true);
const writableBytes = new Uint8Array(memory.buffer);
const cpu = new CPU_1.default(MM);
let i = 0;
const writeCharacterToScreen = (char, command, position) => {
    writableBytes[i++] = instructions_1.MOV_LIT_REG; // moving the H into register R1
    writableBytes[i++] = command;
    writableBytes[i++] = char.charCodeAt(0);
    writableBytes[i++] = R1;
    writableBytes[i++] = instructions_1.MOV_REG_MEM;
    writableBytes[i++] = R1;
    writableBytes[i++] = 0x30;
    writableBytes[i++] = position;
};
writeCharacterToScreen(' ', 0xff, 0);
for (let i = 0; i < 0xff; i++) {
    const command = i % 2 === 0 ? 0x01 : 0x02;
    writeCharacterToScreen('*', command, i);
}
// "Hello World".split('').forEach((char, index) => {
//     writeCharacterToScreen(char, 0x02, index)
// })
writeCharacterToScreen('\n', 0x02, 0xff * 2);
writableBytes[i++] = instructions_1.HLT;
cpu.run();
// ------------------------------------------------------------------------------
// From 4th video
// const writableBytes = new Uint8Array(memory.buffer);
// const cpu = new CPU(MM);
// const subroutineAddress = 0x3000
// let i = 0;
// writableBytes[i++] = PSH_LIT // psh 0x3333
// writableBytes[i++] = 0x33
// writableBytes[i++] = 0x33
// writableBytes[i++] = PSH_LIT // psh 0x2222
// writableBytes[i++] = 0x22
// writableBytes[i++] = 0x22
// writableBytes[i++] = PSH_LIT // psh 0x1111
// writableBytes[i++] = 0x11
// writableBytes[i++] = 0x11
// writableBytes[i++] = MOV_LIT_REG // mov 0x1234, r1
// writableBytes[i++] = 0x12 // psh 0x3333
// writableBytes[i++] = 0x34
// writableBytes[i++] = R1
// writableBytes[i++] = MOV_LIT_REG // mov 0x5678, r4
// writableBytes[i++] = 0x56
// writableBytes[i++] = 0x78
// writableBytes[i++] = R4
// writableBytes[i++] = PSH_LIT // psh 0x0000 (no arguments)
// writableBytes[i++] = 0x00
// writableBytes[i++] = 0x00
// writableBytes[i++] = CAL_LIT;
// writableBytes[i++] = (subroutineAddress & 0xff00) >> 8
// writableBytes[i++] = (subroutineAddress & 0x00ff)
// writableBytes[i++] = PSH_LIT // psh 0x4444 just a test to see if the stack is working correctly
// writableBytes[i++] = 0x44
// writableBytes[i++] = 0x44
// i = subroutineAddress // go to the mentioned subroutine
// writableBytes[i++] = PSH_LIT // psh 0x0101
// writableBytes[i++] = 0x01
// writableBytes[i++] = 0x02
// writableBytes[i++] = PSH_LIT // psh 0x0304
// writableBytes[i++] = 0x03
// writableBytes[i++] = 0x04
// writableBytes[i++] = PSH_LIT // psh 0x0506
// writableBytes[i++] = 0x05
// writableBytes[i++] = 0x06
// writableBytes[i++] = MOV_LIT_REG // mov 0x0708, r1
// writableBytes[i++] = 0x07
// writableBytes[i++] = 0x08
// writableBytes[i++] = R1
// writableBytes[i++] = MOV_LIT_REG // mov 0x090A, r8
// writableBytes[i++] = 0x09
// writableBytes[i++] = 0x0A
// writableBytes[i++] = R8
// writableBytes[i++] = RET
// cpu.debug()
// cpu.viewMemoryAt(cpu.getRegister('ip'))
// cpu.viewMemoryAt(0xffff - 1 - 42, 44) // because this function shows 7 bytes
// const r1 = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })
// r1.on('line', () => {
//     cpu.step()
//     cpu.debug()
//     cpu.viewMemoryAt(cpu.getRegister('ip'))
//     cpu.viewMemoryAt(0xffff - 1 - 42, 44)
// })
// ----------------------------------------------------------------------
// From 3rd video
// writableBytes[i++] = MOV_LIT_REG // mov 0x5151, r1
// writableBytes[i++] = 0x51
// writableBytes[i++] = 0x51
// writableBytes[i++] = R1
// writableBytes[i++] = MOV_LIT_REG // mov 0x4242, r2
// writableBytes[i++] = 0x42
// writableBytes[i++] = 0x42
// writableBytes[i++] = R2
// writableBytes[i++] = PSH_REG // psh r1
// writableBytes[i++] = R1
// writableBytes[i++] = PSH_REG // psh r2
// writableBytes[i++] = R2
// writableBytes[i++] = POP // pop r1
// writableBytes[i++] = R1
// writableBytes[i++] = POP // pop r2
// writableBytes[i++] = R2
//-----------------------------------------------
// From 2nd video
// writableBytes[i++] = MOV_MEM_REG
// writableBytes[i++] = 0x01
// writableBytes[i++] = 0x00
// writableBytes[i++] = R1
// writableBytes[i++] = MOV_LIT_REG
// writableBytes[i++] = 0x00
// writableBytes[i++] = 0x01
// writableBytes[i++] = R2
// writableBytes[i++] = ADD_REG_REG
// writableBytes[i++] = R1
// writableBytes[i++] = R2
// writableBytes[i++] = MOV_REG_MEM
// writableBytes[i++] = ACC
// writableBytes[i++] = 0x01
// writableBytes[i++] = 0x00
// writableBytes[i++] = JMP_NOT_EQ
// writableBytes[i++] = 0x00
// writableBytes[i++] = 0x03
// writableBytes[i++] = 0x00
// writableBytes[i++] = 0x00
// -----------------------------------------------------------
// From 1st video
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
