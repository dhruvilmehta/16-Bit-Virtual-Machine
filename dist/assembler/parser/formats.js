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
exports.regLit = exports.singleLit = exports.singleReg = exports.noArgs = exports.litOffReg = exports.regPtrReg = exports.litMem = exports.memReg = exports.regMem = exports.regReg = exports.litReg = void 0;
const arcsecond_1 = require("arcsecond");
const common_1 = require("./common");
const T = __importStar(require("./types"));
const expressions_1 = require("./expressions");
const litReg = (mnemonic, type) => (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)(mnemonic));
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
        instruction: type,
        args: [arg1, arg2]
    });
});
exports.litReg = litReg;
const regLit = (mnemonic, type) => (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)(mnemonic));
    run(arcsecond_1.whitespace);
    const r1 = run(common_1.register);
    run(arcsecond_1.optionalWhitespace);
    run((0, arcsecond_1.char)(','));
    run(arcsecond_1.optionalWhitespace);
    const lit = run((0, arcsecond_1.choice)([
        common_1.hexLiteral,
        expressions_1.squareBracketExpr
    ]));
    run(arcsecond_1.optionalWhitespace);
    return T.instruction({
        instruction: type,
        args: [r1, lit]
    });
});
exports.regLit = regLit;
const regReg = (mnemonic, type) => (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)(mnemonic));
    run(arcsecond_1.whitespace);
    const r1 = run(common_1.register);
    run(arcsecond_1.optionalWhitespace);
    run((0, arcsecond_1.char)(','));
    run(arcsecond_1.optionalWhitespace);
    const r2 = run(common_1.register);
    run(arcsecond_1.optionalWhitespace);
    return T.instruction({
        instruction: type,
        args: [r1, r2]
    });
});
exports.regReg = regReg;
const regMem = (mnemonic, type) => (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)(mnemonic));
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
        instruction: type,
        args: [r1, addr]
    });
});
exports.regMem = regMem;
const memReg = (mnemonic, type) => (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)(mnemonic));
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
        instruction: type,
        args: [addr, r1]
    });
});
exports.memReg = memReg;
const litMem = (mnemonic, type) => (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)(mnemonic));
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
        instruction: type,
        args: [lit, addr]
    });
});
exports.litMem = litMem;
const regPtrReg = (mnemonic, type) => (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)(mnemonic));
    run(arcsecond_1.whitespace);
    const r1 = run((0, arcsecond_1.char)('&').chain(() => common_1.register));
    run(arcsecond_1.optionalWhitespace);
    run((0, arcsecond_1.char)(','));
    run(arcsecond_1.optionalWhitespace);
    const r2 = run(common_1.register);
    run(arcsecond_1.optionalWhitespace);
    return T.instruction({
        instruction: type,
        args: [r1, r2]
    });
});
exports.regPtrReg = regPtrReg;
const litOffReg = (mnemonic, type) => (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)(mnemonic));
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
        instruction: type,
        args: [lit, r1, r2]
    });
});
exports.litOffReg = litOffReg;
const noArgs = (mnemonic, type) => (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)(mnemonic));
    run(arcsecond_1.optionalWhitespace);
    return T.instruction({
        instruction: type,
        args: []
    });
});
exports.noArgs = noArgs;
const singleReg = (mnemonic, type) => (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)(mnemonic));
    run(arcsecond_1.whitespace);
    const r1 = run(common_1.register);
    run(arcsecond_1.optionalWhitespace);
    return T.instruction({
        instruction: type,
        args: [r1]
    });
});
exports.singleReg = singleReg;
const singleLit = (mnemonic, type) => (0, arcsecond_1.coroutine)(run => {
    run((0, common_1.upperOrLowerStr)(mnemonic));
    run(arcsecond_1.whitespace);
    const lit = run((0, arcsecond_1.choice)([
        common_1.hexLiteral,
        expressions_1.squareBracketExpr
    ]));
    return T.instruction({
        instruction: type,
        args: [lit]
    });
});
exports.singleLit = singleLit;
