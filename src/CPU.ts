import CreateMemory from "./CreateMemory";
import { ADD_REG_REG, MOV_LIT_R1, MOV_LIT_R2 } from "./instructions";

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
            //move literal into r1 register
            case MOV_LIT_R1: {
                const literal = this.fetch16();
                this.setRegister('r1', literal);
                return;
            }
            //move literal into r2 register
            case MOV_LIT_R2: {
                const literal = this.fetch16();
                this.setRegister('r2', literal);
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
        }
    }

    public step() {
        const instruction = this.fetch();
        return this.execute(instruction);
    }
}

export default CPU;