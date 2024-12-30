"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const arcsecond_1 = require("arcsecond");
const common_1 = require("./common");
const T = __importStar(require("./types"));
const expressions_1 = require("./expressions");
const movLitToReg = (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)('mov'));
    run(arcsecond_1.whitespace);
    const arg1 = run((0, arcsecond_1.choice)([
        common_1.hexLiteral,
        expressions_1.squareBracketExpr
    ]));
    run(arcsecond_1.optionalWhitespace);
    run((0, arcsecond_1.char)(','));
    run(arcsecond_1.optionalWhitespace);
    const arg2 = run(common_1.register);
    run(arcsecond_1.optionalWhitespace);
    return T.instruction({
        instruction: 'MOV_LIT_REG',
        args: [arg1, arg2]
    });
});
const movRegToReg = (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)('mov'));
    run(arcsecond_1.whitespace);
    const r1 = run(common_1.register);
    run(arcsecond_1.optionalWhitespace);
    run((0, arcsecond_1.char)(','));
    run(arcsecond_1.optionalWhitespace);
    const r2 = run(common_1.register);
    run(arcsecond_1.optionalWhitespace);
    return T.instruction({
        instruction: 'MOV_REG_REG',
        args: [r1, r2]
    });
});
const movRegToMem = (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)('mov'));
    run(arcsecond_1.whitespace);
    const r1 = run(common_1.register);
    run(arcsecond_1.optionalWhitespace);
    run((0, arcsecond_1.char)(','));
    run(arcsecond_1.optionalWhitespace);
    const addr = run((0, arcsecond_1.choice)([
        common_1.address,
        (0, arcsecond_1.char)('&').chain(() => expressions_1.squareBracketExpr)
    ]));
    run(arcsecond_1.optionalWhitespace);
    return T.instruction({
        instruction: 'MOV_REG_MEM',
        args: [r1, addr]
    });
});
const movMemToReg = (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)('mov'));
    run(arcsecond_1.whitespace);
    const addr = run((0, arcsecond_1.choice)([
        common_1.address,
        (0, arcsecond_1.char)('&').chain(() => expressions_1.squareBracketExpr)
    ]));
    run(arcsecond_1.optionalWhitespace);
    run((0, arcsecond_1.char)(','));
    run(arcsecond_1.optionalWhitespace);
    const r1 = run(common_1.register);
    run(arcsecond_1.optionalWhitespace);
    return T.instruction({
        instruction: 'MOV_MEM_REG',
        args: [addr, r1]
    });
});
const movLitToMem = (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)('mov'));
    run(arcsecond_1.whitespace);
    const lit = run((0, arcsecond_1.choice)([
        common_1.hexLiteral,
        expressions_1.squareBracketExpr
    ]));
    run(arcsecond_1.optionalWhitespace);
    run((0, arcsecond_1.char)(','));
    run(arcsecond_1.optionalWhitespace);
    const addr = run((0, arcsecond_1.choice)([
        common_1.address,
        (0, arcsecond_1.char)('&').chain(() => expressions_1.squareBracketExpr)
    ]));
    run(arcsecond_1.optionalWhitespace);
    return T.instruction({
        instruction: 'MOV_LIT_MEM',
        args: [lit, addr]
    });
});
const movRegPtrToReg = (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)('mov'));
    run(arcsecond_1.whitespace);
    const r1 = run((0, arcsecond_1.char)('&').chain(() => common_1.register));
    run(arcsecond_1.optionalWhitespace);
    run((0, arcsecond_1.char)(','));
    run(arcsecond_1.optionalWhitespace);
    const r2 = run(common_1.register);
    run(arcsecond_1.optionalWhitespace);
    return T.instruction({
        instruction: 'MOV_REG_PTR_REG',
        args: [r1, r2]
    });
});
const movLitOffToReg = (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)('mov'));
    run(arcsecond_1.whitespace);
    const lit = run((0, arcsecond_1.choice)([
        common_1.hexLiteral,
        expressions_1.squareBracketExpr
    ]));
    run(arcsecond_1.optionalWhitespace);
    run((0, arcsecond_1.char)(','));
    run(arcsecond_1.optionalWhitespace);
    const r1 = run((0, arcsecond_1.char)('&').chain(() => common_1.register));
    run(arcsecond_1.optionalWhitespace);
    run((0, arcsecond_1.char)(','));
    run(arcsecond_1.optionalWhitespace);
    const r2 = run(common_1.register);
    run(arcsecond_1.optionalWhitespace);
    return T.instruction({
        instruction: 'MOV_LIT_OFF_REG',
        args: [lit, r1, r2]
    });
});
exports.default = (0, arcsecond_1.choice)([
    movLitToReg,
    movRegToReg,
    movRegToMem,
    movMemToReg,
    movLitToMem,
    movRegPtrToReg,
    movLitOffToReg
]);
