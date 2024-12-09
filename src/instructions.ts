const MOV_LIT_REG = 0x10; // Move literal to register
const MOV_REG_REG = 0x11; // Move register to register
const MOV_REG_MEM = 0x12; // Move register to memory
const MOV_MEM_REG = 0x13; // Move memory to register
const ADD_REG_REG = 0x14; // Move memory to register
const JMP_NOT_EQ = 0x15; // Jump not equal

export {
    MOV_LIT_REG, MOV_MEM_REG, MOV_REG_MEM, MOV_REG_REG, ADD_REG_REG, JMP_NOT_EQ
}