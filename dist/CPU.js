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
            'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8' // general purpose registers
        ];
        this.registers = (0, CreateMemory_1.default)(this.registerNames.length * 2);
        this.registerMap = this.registerNames.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        }, {});
    }
    debug() {
        this.registerNames.forEach(name => {
            console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, '0')}`);
        });
        console.log();
    }
    getRegister(name) {
        if (!(name in this.registerMap))
            throw new Error(`setRegister: No such register ${name}`);
        return this.registers.getUint16(this.registerMap[name]); // returning 16 bit value
    }
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
            //move literal into r1 register
            case instructions_1.MOV_LIT_R1: {
                const literal = this.fetch16();
                this.setRegister('r1', literal);
                return;
            }
            //move literal into r2 register
            case instructions_1.MOV_LIT_R2: {
                const literal = this.fetch16();
                this.setRegister('r2', literal);
                return;
            }
            //Add 2 registers
            case instructions_1.ADD_REG_REG: {
                const r1 = this.fetch();
                const r2 = this.fetch();
                const registerValue1 = this.registers.getUint16(r1 * 2); // the value we got from the instruction corresponds to the index that we originally specified in the register names, thats why we are multiplying it by 2
                // 0->0, 1->2, 2->4, etc
                const registerValue2 = this.registers.getUint16(r2 * 2);
                this.setRegister('acc', registerValue1 + registerValue2);
                return;
            }
        }
    }
    step() {
        const instruction = this.fetch();
        return this.execute(instruction);
    }
}
exports.default = CPU;
