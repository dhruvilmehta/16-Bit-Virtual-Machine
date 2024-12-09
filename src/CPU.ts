import CreateMemory from "./CreateMemory";
import { ADD_REG_REG, JMP_NOT_EQ, MOV_LIT_REG, MOV_MEM_REG, MOV_REG_MEM, MOV_REG_REG } from "./instructions";

class CPU {
    private memory: DataView;
    private registerNames: Array<string>;
    private registers: DataView;
    private registerMap: Record<string, number>;

    constructor(memory: DataView) {
        this.memory = memory;
        this.registerNames = [
            'ip', // program counter
            'acc', // accumulator, results of mathematical operation go into this.
            'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8' // general purpose registers
        ]

        this.registers = CreateMemory(this.registerNames.length * 2);
        this.registerMap = this.registerNames.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        }, {} as Record<string, number>)
    }

    public debug() {
        this.registerNames.forEach(name => {
            console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, '0')}`)
        })
        console.log()
    }

    public viewMemoryAt(address: number) {
        const nextEightBytes = Array.from({ length: 8 }, (_, i) =>
            this.memory.getUint8(address + i)
        ).map(v => `0x${v.toString(16).padStart(2, '0')}`)

        console.log(`0x${address.toString(16).padStart(4, '0')}: ${nextEightBytes.join(' ')}`)
    }

    public getRegister(name: string): number {
        if (!(name in this.registerMap))
            throw new Error(`setRegister: No such register ${name}`)

        return this.registers.getUint16(this.registerMap[name]); // returning 16 bit value
    }

    public setRegister(name: string, value: number): void {
        if (!(name in this.registerMap))
            throw new Error(`setRegister: No such register ${name}`)

        this.registers.setUint16(this.registerMap[name], value); // setting 16 bit value
    }

    public fetch(): number {
        const nextInstructionAddress: number = this.getRegister('ip');
        const instruction: number = this.memory.getUint8(nextInstructionAddress);
        this.setRegister('ip', nextInstructionAddress + 1);
        return instruction;
    }

    public fetch16(): number {
        const nextInstructionAddress: number = this.getRegister('ip');
        const instruction: number = this.memory.getUint16(nextInstructionAddress);
        this.setRegister('ip', nextInstructionAddress + 2);
        return instruction;
    }

    public execute(instruction: number) {
        switch (instruction) {
            //move literal into register register
            case MOV_LIT_REG: {
                const literal = this.fetch16();
                const register = (this.fetch() % this.registerNames.length) * 2
                this.registers.setUint16(register, literal)
                return;
            }
            //move register to register
            case MOV_REG_REG: {
                const registerFrom = (this.fetch() % this.registerNames.length) * 2
                const registerTo = (this.fetch() % this.registerNames.length) * 2
                const value = this.registers.getUint16(registerFrom)
                this.registers.setUint16(registerTo, value)
                return;
            }
            case MOV_REG_MEM: {
                const registerFrom = (this.fetch() % this.registerNames.length) * 2
                const address = this.fetch16()
                const value = this.registers.getUint16(registerFrom)
                this.memory.setUint16(address, value)
                return;
            }
            case MOV_MEM_REG: {
                const address = this.fetch16()
                const registerTo = (this.fetch() % this.registerNames.length) * 2
                const value = this.memory.getUint16(address)
                this.registers.setUint16(registerTo, value)
                return;
            }
            //Add 2 registers
            case ADD_REG_REG: {
                const r1 = this.fetch();
                const r2 = this.fetch();
                const registerValue1 = this.registers.getUint16(r1 * 2); // the value we got from the instruction corresponds to the index that we originally specified in the register names, thats why we are multiplying it by 2
                // 0->0, 1->2, 2->4, etc
                const registerValue2 = this.registers.getUint16(r2 * 2);

                this.setRegister('acc', registerValue1 + registerValue2)
                return;
            }

            case JMP_NOT_EQ: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value !== this.getRegister('acc'))
                    this.setRegister('ip', address)

                return;
            }
        }
    }

    public step() {
        const instruction = this.fetch();
        return this.execute(instruction);
    }
}

export default CPU;