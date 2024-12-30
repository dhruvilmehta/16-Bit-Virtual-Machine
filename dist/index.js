"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CPU_1 = __importDefault(require("./CPU"));
const CreateMemory_1 = __importDefault(require("./CreateMemory"));
const MemoryMapper_1 = __importDefault(require("./MemoryMapper"));
const MM = new MemoryMapper_1.default();
const dataViewMethods = [
    'getUint8',
    'getUint16',
    'setUint8',
    'setUint16'
];
const createBankedMemory = (n, bankSize, cpu) => {
    const bankBuffers = Array.from({ length: n }, () => new ArrayBuffer(bankSize));
    const banks = bankBuffers.map(ab => new DataView(ab));
    const forwardToDataView = (name) => (...args) => {
        const bankIndex = cpu.getRegister("mb") % n;
        const memoryBankToUse = banks[bankIndex];
        return memoryBankToUse[name](...args); // Type assertion
    };
    const methods = dataViewMethods.reduce((dvOut, fnName) => {
        dvOut[fnName] = forwardToDataView(fnName);
        return dvOut;
    }, {});
    return methods;
};
const bankSize = 0xff;
const nBanks = 8;
const cpu = new CPU_1.default(MM);
const memoryBankDevice = createBankedMemory(nBanks, bankSize, cpu);
MM.map(memoryBankDevice, 0, bankSize);
const regularMemory = (0, CreateMemory_1.default)(0xff00);
MM.map(regularMemory, bankSize, 0xffff, true);
console.log("Writing value 1 to address 0");
MM.setUint16(0, 1);
console.log("Reading value from address 0", MM.getUint16(0));
console.log("Switching bank from 0 to 1");
cpu.setRegister('mb', 1);
console.log("Reading value at address 0", MM.getUint16(0));
console.log("Writing value 42 to address 0");
MM.setUint16(0, 42);
console.log("Switching bank from 1 to 2");
cpu.setRegister('mb', 2);
console.log("Reading value at address 0", MM.getUint16(0));
console.log("switching bank from 2 to 1");
cpu.setRegister('mb', 1);
console.log("Reading value at address 0", MM.getUint16(0));
console.log("Switching bank from 1 to 0");
cpu.setRegister('mb', 0);
console.log("Reading value at address 0", MM.getUint16(0));
// const memory = CreateMemory(256 * 256);
// MM.map(memory, 0, 0xffff) // entire addres space
// // map 0xff bytes of the address for the stdout (output device)
// MM.map(CreateScreenDevice(), 0x3000, 0x30ff, true)
// const writableBytes = new Uint8Array(memory.buffer);
// const cpu = new CPU(MM);
// let i = 0;
// const writeCharacterToScreen = (char: String, command: number, position: number) => {
//     writableBytes[i++] = MOV_LIT_REG // moving the H into register R1
//     writableBytes[i++] = command
//     writableBytes[i++] = char.charCodeAt(0)
//     writableBytes[i++] = R1
//     writableBytes[i++] = MOV_REG_MEM
//     writableBytes[i++] = R1
//     writableBytes[i++] = 0x30
//     writableBytes[i++] = position
// }
// writeCharacterToScreen(' ', 0xff, 0)
// for (let i = 0; i < 0xff; i++) {
//     const command = i % 2 === 0 ? 0x01 : 0x02
//     writeCharacterToScreen('*', command, i)
// }
// // "Hello World".split('').forEach((char, index) => {
// //     writeCharacterToScreen(char, 0x02, index)
// // })
// writeCharacterToScreen('\n', 0x02, 0xff*2)
// writableBytes[i++] = HLT
// cpu.run()
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
