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
exports.label = exports.upperOrLowerStr = exports.last = exports.variable = exports.register = exports.operator = exports.address = exports.hexLiteral = void 0;
const arcsecond_1 = require("arcsecond");
const T = __importStar(require("./types"));
const util_1 = require("./util");
const hexLiteral = (0, arcsecond_1.char)('$').chain(() => (0, util_1.mapJoin)((0, arcsecond_1.many1)(hexDigit))).map(T.hexLiteral);
exports.hexLiteral = hexLiteral;
const address = (0, arcsecond_1.char)('&').chain(() => (0, util_1.mapJoin)((0, arcsecond_1.many1)(hexDigit))).map(T.address);
exports.address = address;
const operator = (0, arcsecond_1.choice)([
    (0, arcsecond_1.char)('+').map(T.opPlus),
    (0, arcsecond_1.char)('-').map(T.opMinus),
    (0, arcsecond_1.char)('*').map(T.opMultiply),
]);
exports.operator = operator;
const upperOrLowerStr = (s) => (0, arcsecond_1.choice)([
    (0, arcsecond_1.str)(s.toLowerCase()),
    (0, arcsecond_1.str)(s.toUpperCase())
]);
exports.upperOrLowerStr = upperOrLowerStr;
const label = (0, arcsecond_1.sequenceOf)([
    util_1.validIdentifier,
    (0, arcsecond_1.char)(':'),
    arcsecond_1.optionalWhitespace
]).map(([labelName]) => labelName).map(T.label);
exports.label = label;
const register = (0, arcsecond_1.choice)([
    upperOrLowerStr('r1'),
    upperOrLowerStr('r2'),
    upperOrLowerStr('r3'),
    upperOrLowerStr('r4'),
    upperOrLowerStr('r5'),
    upperOrLowerStr('r6'),
    upperOrLowerStr('r7'),
    upperOrLowerStr('r8'),
    upperOrLowerStr('sp'),
    upperOrLowerStr('fp'),
    upperOrLowerStr('ip'),
    upperOrLowerStr('acc'),
]).map(T.register);
exports.register = register;
const hexDigit = (0, arcsecond_1.regex)(/^[0-9A-Fa-f]/);
const variable = (0, arcsecond_1.char)('!').chain(() => util_1.validIdentifier).map(T.variable);
exports.variable = variable;
const last = (a) => a[a.length - 1];
exports.last = last;
