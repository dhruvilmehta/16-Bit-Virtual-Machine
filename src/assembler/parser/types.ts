import { asType } from "./util"

const register = asType('REGISTER')
const hexLiteral = asType('HEX_LITERAL')
const variable = asType('VARIABLE')
const address = asType('ADDRESS')

const opPlus = asType('OP_PLUS')
const opMinus = asType('OP_MINUS')
const opMultiply = asType('OP_MULTIPLY')

const binaryOperation = asType('BINARY_OPERATION')
const bracketedExpr = asType('BRACKETED_EXPRESSION')
const squareBracketExpr = asType('SQUARE_BRACKETED_EXPRESSION')

const instruction = asType("INSTRUCTION")
const label = asType("LABEL")


export {
    register,
    hexLiteral,
    variable,
    opMinus,
    opMultiply,
    opPlus,
    binaryOperation,
    bracketedExpr,
    squareBracketExpr,
    instruction,
    address,
    label
}