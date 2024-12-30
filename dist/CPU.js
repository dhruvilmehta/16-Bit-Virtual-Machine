"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CreateMemory_1 = __importDefault(require("./CreateMemory"));
const instructions_1 = __importDefault(require("./instructions"));
const register_1 = __importDefault(require("./register"));
class CPU {
    constructor(memory) {
        this.memory = memory;
        this.registers = (0, CreateMemory_1.default)(register_1.default.length * 2);
        this.registerMap = register_1.default.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        }, {});
        this.setRegister('sp', 0xffff - 1); // starting from last to first
        this.setRegister('fp', 0xffff - 1); // starting from last to first
        this.stackFrameSize = 0;
    }
    debug() {
        register_1.default.forEach(name => {
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
            // Move literal into register
            case instructions_1.default.MOV_LIT_REG.opcode: {
                const literal = this.fetch16();
                const register = this.fetchRegisterIndex();
                this.registers.setUint16(register, literal);
                return;
            }
            // Move register to register
            case instructions_1.default.MOV_REG_REG.opcode: {
                const registerFrom = this.fetchRegisterIndex();
                const registerTo = this.fetchRegisterIndex();
                const value = this.registers.getUint16(registerFrom);
                this.registers.setUint16(registerTo, value);
                return;
            }
            // Move register to memory
            case instructions_1.default.MOV_REG_MEM.opcode: {
                const registerFrom = this.fetchRegisterIndex();
                const address = this.fetch16();
                const value = this.registers.getUint16(registerFrom);
                this.memory.setUint16(address, value);
                return;
            }
            // Move memory to register
            case instructions_1.default.MOV_MEM_REG.opcode: {
                const address = this.fetch16();
                const registerTo = this.fetchRegisterIndex();
                const value = this.memory.getUint16(address);
                this.registers.setUint16(registerTo, value);
                return;
            }
            // Move literal to memory
            case instructions_1.default.MOV_LIT_MEM.opcode: {
                const value = this.fetch16();
                const address = this.fetch16();
                this.memory.setUint16(address, value);
                return;
            }
            // Move register* to register
            case instructions_1.default.MOV_REG_PTR_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const r2 = this.fetchRegisterIndex();
                const ptr = this.registers.getUint16(r1);
                const value = this.memory.getUint16(ptr);
                this.registers.setUint16(r2, value);
                return;
            }
            // Move value at [literal + register] to register
            case instructions_1.default.MOV_LIT_OFF_REG.opcode: {
                const baseAddress = this.fetch16();
                const r1 = this.fetchRegisterIndex();
                const r2 = this.fetchRegisterIndex();
                const offset = this.registers.getUint16(r1);
                const value = this.memory.getUint16(baseAddress + offset);
                this.registers.setUint16(r2, value);
                return;
            }
            // Add register to register
            case instructions_1.default.ADD_REG_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const r2 = this.fetchRegisterIndex();
                const registerValue1 = this.registers.getUint16(r1);
                const registerValue2 = this.registers.getUint16(r2);
                this.setRegister('acc', registerValue1 + registerValue2);
                return;
            }
            // Add literal to register
            case instructions_1.default.ADD_LIT_REG.opcode: {
                const literal = this.fetch16();
                const r1 = this.fetchRegisterIndex();
                const registerValue = this.registers.getUint16(r1);
                this.setRegister('acc', literal + registerValue);
                return;
            }
            // Subtract literal from register value
            case instructions_1.default.SUB_LIT_REG.opcode: {
                const literal = this.fetch16();
                const r1 = this.fetchRegisterIndex();
                const registerValue = this.registers.getUint16(r1);
                const res = registerValue - literal;
                this.setRegister('acc', res);
                return;
            }
            // Subtract register value from literal
            case instructions_1.default.SUB_REG_LIT.opcode: {
                const r1 = this.fetchRegisterIndex();
                const literal = this.fetch16();
                const registerValue = this.registers.getUint16(r1);
                const res = literal - registerValue;
                this.setRegister('acc', res);
                return;
            }
            // Subtract register value from register value
            case instructions_1.default.SUB_REG_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const r2 = this.fetchRegisterIndex();
                const registerValue1 = this.registers.getUint16(r1);
                const registerValue2 = this.registers.getUint16(r2);
                const res = registerValue1 - registerValue2;
                this.setRegister('acc', res);
                return;
            }
            // Multiply literal by register value
            case instructions_1.default.MUL_LIT_REG.opcode: {
                const literal = this.fetch16();
                const r1 = this.fetchRegisterIndex();
                const registerValue = this.registers.getUint16(r1);
                const res = literal * registerValue;
                this.setRegister('acc', res);
                return;
            }
            // Multiply register value by register value
            case instructions_1.default.MUL_REG_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const r2 = this.fetchRegisterIndex();
                const registerValue1 = this.registers.getUint16(r1);
                const registerValue2 = this.registers.getUint16(r2);
                const res = registerValue1 * registerValue2;
                this.setRegister('acc', res);
                return;
            }
            // Increment value in register (in place)
            case instructions_1.default.INC_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const oldValue = this.registers.getUint16(r1);
                const newValue = oldValue + 1;
                this.registers.setUint16(r1, newValue);
                return;
            }
            // Decrement value in register (in place)
            case instructions_1.default.DEC_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const oldValue = this.registers.getUint16(r1);
                const newValue = oldValue - 1;
                this.registers.setUint16(r1, newValue);
                return;
            }
            // Left shift register by literal (in place)
            case instructions_1.default.LSF_REG_LIT.opcode: {
                const r1 = this.fetchRegisterIndex();
                const literal = this.fetch();
                const oldValue = this.registers.getUint16(r1);
                const res = oldValue << literal;
                this.registers.setUint16(r1, res);
                return;
            }
            // Left shift register by register (in place)
            case instructions_1.default.LSF_REG_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const r2 = this.fetchRegisterIndex();
                const oldValue = this.registers.getUint16(r1);
                const shiftBy = this.registers.getUint16(r2);
                const res = oldValue << shiftBy;
                this.registers.setUint16(r1, res);
                return;
            }
            // Right shift register by literal (in place)
            case instructions_1.default.RSF_REG_LIT.opcode: {
                const r1 = this.fetchRegisterIndex();
                const literal = this.fetch();
                const oldValue = this.registers.getUint16(r1);
                const res = oldValue >> literal;
                this.registers.setUint16(r1, res);
                return;
            }
            // Right shift register by register (in place)
            case instructions_1.default.RSF_REG_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const r2 = this.fetchRegisterIndex();
                const oldValue = this.registers.getUint16(r1);
                const shiftBy = this.registers.getUint16(r2);
                const res = oldValue >> shiftBy;
                this.registers.setUint16(r1, res);
                return;
            }
            // And register with literal
            case instructions_1.default.AND_REG_LIT.opcode: {
                const r1 = this.fetchRegisterIndex();
                const literal = this.fetch16();
                const registerValue = this.registers.getUint16(r1);
                const res = registerValue & literal;
                this.setRegister('acc', res);
                return;
            }
            // And register with register
            case instructions_1.default.AND_REG_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const r2 = this.fetchRegisterIndex();
                const registerValue1 = this.registers.getUint16(r1);
                const registerValue2 = this.registers.getUint16(r2);
                const res = registerValue1 & registerValue2;
                this.setRegister('acc', res);
                return;
            }
            // Or register with literal
            case instructions_1.default.OR_REG_LIT.opcode: {
                const r1 = this.fetchRegisterIndex();
                const literal = this.fetch16();
                const registerValue = this.registers.getUint16(r1);
                const res = registerValue | literal;
                this.setRegister('acc', res);
                return;
            }
            // Or register with register
            case instructions_1.default.OR_REG_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const r2 = this.fetchRegisterIndex();
                const registerValue1 = this.registers.getUint16(r1);
                const registerValue2 = this.registers.getUint16(r2);
                const res = registerValue1 | registerValue2;
                this.setRegister('acc', res);
                return;
            }
            // Xor register with literal
            case instructions_1.default.XOR_REG_LIT.opcode: {
                const r1 = this.fetchRegisterIndex();
                const literal = this.fetch16();
                const registerValue = this.registers.getUint16(r1);
                const res = registerValue ^ literal;
                this.setRegister('acc', res);
                return;
            }
            // Xor register with register
            case instructions_1.default.XOR_REG_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const r2 = this.fetchRegisterIndex();
                const registerValue1 = this.registers.getUint16(r1);
                const registerValue2 = this.registers.getUint16(r2);
                const res = registerValue1 ^ registerValue2;
                this.setRegister('acc', res);
                return;
            }
            // Not (invert) register
            case instructions_1.default.NOT.opcode: {
                const r1 = this.fetchRegisterIndex();
                const registerValue = this.registers.getUint16(r1);
                const res = (~registerValue) & 0xffff;
                this.setRegister('acc', res);
                return;
            }
            // Jump if literal not equal
            case instructions_1.default.JMP_NOT_EQ.opcode: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value !== this.getRegister('acc'))
                    this.setRegister('ip', address);
                return;
            }
            // Jump if register not equal
            case instructions_1.default.JNE_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const value = this.registers.getUint16(r1);
                const address = this.fetch16();
                if (value !== this.getRegister('acc'))
                    this.setRegister('ip', address);
                return;
            }
            // Jump if literal equal
            case instructions_1.default.JEQ_LIT.opcode: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value === this.getRegister('acc'))
                    this.setRegister('ip', address);
                return;
            }
            // Jump if register equal
            case instructions_1.default.JEQ_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const value = this.registers.getUint16(r1);
                const address = this.fetch16();
                if (value === this.getRegister('acc'))
                    this.setRegister('ip', address);
                return;
            }
            // Jump if literal less than
            case instructions_1.default.JLT_LIT.opcode: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value < this.getRegister('acc'))
                    this.setRegister('ip', address);
                return;
            }
            // Jump if register less than
            case instructions_1.default.JLT_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const value = this.registers.getUint16(r1);
                const address = this.fetch16();
                if (value < this.getRegister('acc'))
                    this.setRegister('ip', address);
                return;
            }
            // Jump if literal greater than
            case instructions_1.default.JGT_LIT.opcode: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value > this.getRegister('acc'))
                    this.setRegister('ip', address);
                return;
            }
            // Jump if register greater than
            case instructions_1.default.JGT_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const value = this.registers.getUint16(r1);
                const address = this.fetch16();
                if (value > this.getRegister('acc'))
                    this.setRegister('ip', address);
                return;
            }
            // Jump if literal less than or equal to
            case instructions_1.default.JLE_LIT.opcode: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value <= this.getRegister('acc'))
                    this.setRegister('ip', address);
                return;
            }
            // Jump if register less than or equal to
            case instructions_1.default.JLE_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const value = this.registers.getUint16(r1);
                const address = this.fetch16();
                if (value <= this.getRegister('acc'))
                    this.setRegister('ip', address);
                return;
            }
            // Jump if literal greater than or equal to
            case instructions_1.default.JGE_LIT.opcode: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value >= this.getRegister('acc'))
                    this.setRegister('ip', address);
                return;
            }
            // Jump if register greater than or equal to
            case instructions_1.default.JGE_REG.opcode: {
                const r1 = this.fetchRegisterIndex();
                const value = this.registers.getUint16(r1);
                const address = this.fetch16();
                if (value >= this.getRegister('acc'))
                    this.setRegister('ip', address);
                return;
            }
            // Push Literal
            case instructions_1.default.PSH_LIT.opcode: {
                const value = this.fetch16();
                this.push(value);
                return;
            }
            // Push Register
            case instructions_1.default.PSH_REG.opcode: {
                const registerIndex = this.fetchRegisterIndex();
                this.push(this.registers.getUint16(registerIndex));
                return;
            }
            // Pop
            case instructions_1.default.POP.opcode: {
                const registerIndex = this.fetchRegisterIndex();
                const value = this.pop();
                this.registers.setUint16(registerIndex, value);
                return;
            }
            // Call literal
            case instructions_1.default.CAL_LIT.opcode: {
                const address = this.fetch16();
                this.pushState();
                this.setRegister('ip', address);
                return;
            }
            // Call register
            case instructions_1.default.CAL_REG.opcode: {
                const registerIndex = this.fetchRegisterIndex();
                const address = this.registers.getUint16(registerIndex);
                this.pushState();
                this.setRegister('ip', address);
                return;
            }
            // Return from subroutine
            case instructions_1.default.RET.opcode: {
                this.popState();
                return;
            }
            // Halt all computation
            case instructions_1.default.HLT.opcode: {
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
        return (this.fetch() % register_1.default.length) * 2;
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
