"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CreateMemory_1 = __importDefault(require("./CreateMemory"));
const instructions_1 = require("./instructions");
class CPU {
    constructor(memory) {
        this.memory = memory;
        this.registerNames = [
            'ip', // program counter
            'acc', // accumulator, results of mathematical operation go into this.
            'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', // general purpose registers
            'sp', 'fp', // stack pointers
        ];
        this.registers = (0, CreateMemory_1.default)(this.registerNames.length * 2);
        this.registerMap = this.registerNames.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        }, {});
        this.setRegister('sp', 0xffff - 1); // starting from last to first
        this.setRegister('fp', 0xffff - 1); // starting from last to first
        this.stackFrameSize = 0;
    }
    debug() {
        this.registerNames.forEach(name => {
            console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, '0')}`);
        });
        console.log();
    }
    viewMemoryAt(address, n = 8) {
        const nextNBytes = Array.from({ length: n }, (_, i) => this.memory.getUint8(address + i)).map(v => `0x${v.toString(16).padStart(2, '0')}`);
        console.log(`0x${address.toString(16).padStart(4, '0')}: ${nextNBytes.join(' ')}`);
    }
    // get Register value
    getRegister(name) {
        if (!(name in this.registerMap))
            throw new Error(`setRegister: No such register ${name}`);
        return this.registers.getUint16(this.registerMap[name]); // returning 16 bit value
    }
    // set Register value
    setRegister(name, value) {
        if (!(name in this.registerMap))
            throw new Error(`setRegister: No such register ${name}`);
        this.registers.setUint16(this.registerMap[name], value); // setting 16 bit value
    }
    fetch() {
        const nextInstructionAddress = this.getRegister('ip');
        const instruction = this.memory.getUint8(nextInstructionAddress);
        this.setRegister('ip', nextInstructionAddress + 1);
        return instruction;
    }
    fetch16() {
        const nextInstructionAddress = this.getRegister('ip');
        const instruction = this.memory.getUint16(nextInstructionAddress);
        this.setRegister('ip', nextInstructionAddress + 2);
        return instruction;
    }
    execute(instruction) {
        switch (instruction) {
            //move literal into register register
            case instructions_1.MOV_LIT_REG: {
                const literal = this.fetch16();
                const register = this.fetchRegisterIndex();
                this.registers.setUint16(register, literal);
                return;
            }
            //move register to register
            case instructions_1.MOV_REG_REG: {
                const registerFrom = this.fetchRegisterIndex();
                const registerTo = this.fetchRegisterIndex();
                const value = this.registers.getUint16(registerFrom);
                this.registers.setUint16(registerTo, value);
                return;
            }
            case instructions_1.MOV_REG_MEM: {
                const registerFrom = this.fetchRegisterIndex();
                const address = this.fetch16();
                const value = this.registers.getUint16(registerFrom);
                this.memory.setUint16(address, value);
                return;
            }
            case instructions_1.MOV_MEM_REG: {
                const address = this.fetch16();
                const registerTo = this.fetchRegisterIndex();
                const value = this.memory.getUint16(address);
                this.registers.setUint16(registerTo, value);
                return;
            }
            //Add 2 registers
            case instructions_1.ADD_REG_REG: {
                const r1 = this.fetchRegisterIndex();
                const r2 = this.fetchRegisterIndex();
                const registerValue1 = this.registers.getUint16(r1);
                const registerValue2 = this.registers.getUint16(r2);
                this.setRegister('acc', registerValue1 + registerValue2);
                return;
            }
            case instructions_1.JMP_NOT_EQ: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value !== this.getRegister('acc'))
                    this.setRegister('ip', address);
                return;
            }
            case instructions_1.PSH_LIT: {
                const value = this.fetch16();
                this.push(value);
                return;
            }
            case instructions_1.PSH_REG: {
                const registerIndex = this.fetchRegisterIndex();
                const value = this.registers.getUint16(registerIndex);
                this.push(value);
                return;
            }
            case instructions_1.POP: {
                const registerIndex = this.fetchRegisterIndex();
                this.registers.setUint16(registerIndex, this.pop());
                return;
            }
            case instructions_1.CAL_LIT: {
                const address = this.fetch16();
                this.pushState();
                this.setRegister('ip', address);
                return;
            }
            case instructions_1.CAL_REG: {
                const registerIndex = this.fetchRegisterIndex();
                const address = this.registers.getUint16(registerIndex);
                this.pushState();
                this.setRegister('ip', address);
                return;
            }
            case instructions_1.RET: {
                this.popState();
                return;
            }
            case instructions_1.HLT: {
                return true;
            }
        }
    }
    popState() {
        const framePointerAddress = this.getRegister('fp');
        this.setRegister('sp', framePointerAddress);
        this.stackFrameSize = this.pop();
        const stackFrameSize = this.stackFrameSize;
        this.setRegister('ip', this.pop());
        this.setRegister('r8', this.pop());
        this.setRegister('r7', this.pop());
        this.setRegister('r6', this.pop());
        this.setRegister('r5', this.pop());
        this.setRegister('r4', this.pop());
        this.setRegister('r3', this.pop());
        this.setRegister('r2', this.pop());
        this.setRegister('r1', this.pop());
        const nArgs = this.pop();
        for (let i = 0; i < nArgs; i++)
            this.pop();
        this.setRegister('fp', framePointerAddress + stackFrameSize);
    }
    pushState() {
        this.push(this.getRegister('r1'));
        this.push(this.getRegister('r2'));
        this.push(this.getRegister('r3'));
        this.push(this.getRegister('r4'));
        this.push(this.getRegister('r5'));
        this.push(this.getRegister('r6'));
        this.push(this.getRegister('r7'));
        this.push(this.getRegister('r8'));
        this.push(this.getRegister('ip'));
        this.push(this.stackFrameSize + 2);
        this.setRegister('fp', this.getRegister('sp'));
        this.stackFrameSize = 0;
    }
    pop() {
        const nextSpAddress = this.getRegister('sp') + 2;
        this.setRegister('sp', nextSpAddress);
        this.stackFrameSize -= 2;
        return this.memory.getUint16(nextSpAddress);
    }
    fetchRegisterIndex() {
        return (this.fetch() % this.registerNames.length) * 2;
    }
    push(value) {
        const spAddress = this.getRegister('sp');
        this.memory.setUint16(spAddress, value);
        this.setRegister('sp', spAddress - 2);
        this.stackFrameSize += 2;
    }
    step() {
        const instruction = this.fetch();
        return this.execute(instruction);
    }
    run() {
        const halt = this.step();
        if (!halt) {
            setImmediate(() => this.run());
        }
    }
}
exports.default = CPU;
