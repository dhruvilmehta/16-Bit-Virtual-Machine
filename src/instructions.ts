const MOV_LIT_REG = 0x10; // Move literal to register
const MOV_REG_REG = 0x11; // Move register to register
const MOV_REG_MEM = 0x12; // Move register to memory
const MOV_MEM_REG = 0x13; // Move memory to register
const MOV_LIT_MEM = 0x20 // Move literal to memory
const MOV_REG_PTR_REG = 0x21 // Move register pointer to register
const MOV_LIT_OFF_REG = 0x22 // Move a literal address + a register to a register
const ADD_REG_REG = 0x14; // Move memory to register
const JMP_NOT_EQ = 0x15; // Jump not equal
const PSH_LIT = 0x16 // Push a literal value onto the stack
const PSH_REG = 0x17 // Push a register value onto the stack
const POP = 0x18 // Pop register from stack
const CAL_LIT = 0x5E // Call to literal to get subroutine address
const CAL_REG = 0x5F // get subroutine address from a register
const RET = 0x60 // Return from subroutine
const HLT = 0xFF

export {
    MOV_LIT_REG, MOV_MEM_REG, MOV_REG_MEM, MOV_REG_REG, ADD_REG_REG, JMP_NOT_EQ, PSH_LIT, PSH_REG, POP, CAL_LIT, CAL_REG, RET, HLT
}