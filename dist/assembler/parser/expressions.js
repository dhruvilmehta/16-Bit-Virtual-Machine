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
exports.squareBracketExpr = exports.bracketedExpr = void 0;
const arcsecond_1 = require("arcsecond");
const util_1 = require("./util");
const T = __importStar(require("./types"));
const common_1 = require("./common");
const typifyBracketedExpression = (expr) => {
    const asBracketed = T.bracketedExpr;
    return asBracketed(expr.map((element) => {
        if (Array.isArray(element)) {
            return typifyBracketedExpression(element);
        }
        return element;
    }));
};
const disambiguateOrderOfOperations = (expr) => {
    if (expr.type !== 'SQUARE_BRACKETED_EXPRESSION' && expr.type !== 'BRACKETED_EXPRESSION') {
        return expr;
    }
    if (expr.value.length === 1) {
        return expr.value[0];
    }
    const priorities = {
        OP_MULTIPLY: 2,
        OP_PLUS: 1,
        OP_MINUS: 0
    };
    let candidateExpression = {
        priority: -Infinity
    };
    for (let i = 1; i < expr.value.length; i += 2) {
        const level = priorities[expr.value[i].type];
        if (level > candidateExpression.priority) {
            candidateExpression = {
                priority: level,
                a: i - 1, // left hand side operand
                b: i + 1, // right hand side operand
                op: expr.value[i]
            };
        }
    }
    const newExpression = T.bracketedExpr([
        ...expr.value.slice(0, candidateExpression.a),
        T.binaryOperation({
            a: disambiguateOrderOfOperations(expr.value[candidateExpression.a]),
            b: disambiguateOrderOfOperations(expr.value[candidateExpression.b]),
            op: candidateExpression.op
        }),
        ...expr.value.slice(candidateExpression.b + 1)
    ]);
    return disambiguateOrderOfOperations(newExpression);
};
const bracketedExpr = (0, arcsecond_1.coroutine)(run => {
    const states = {
        OPEN_BRACKET: 0,
        OPERATOR_OR_CLOSING_BRACKET: 1,
        ELEMENT_OR_OPENING_BRACKET: 2,
        CLOSE_BRACKET: 3
    };
    let state = states.ELEMENT_OR_OPENING_BRACKET;
    const expr = [];
    const stack = [expr];
    run((0, arcsecond_1.char)('('));
    while (true) {
        const nextChar = run(util_1.peek);
        if (state === states.OPEN_BRACKET) {
            run((0, arcsecond_1.char)('('));
            expr.push([]);
            stack.push((0, common_1.last)(expr));
            run(arcsecond_1.optionalWhitespace);
            state = states.ELEMENT_OR_OPENING_BRACKET;
        }
        else if (state === states.CLOSE_BRACKET) {
            run((0, arcsecond_1.char)(')'));
            stack.pop();
            if (stack.length === 0) {
                break;
            }
            run(arcsecond_1.optionalWhitespace);
            state = states.OPERATOR_OR_CLOSING_BRACKET;
        }
        else if (state === states.ELEMENT_OR_OPENING_BRACKET) {
            if (nextChar === ')') {
                run((0, arcsecond_1.fail)('Unexpected closing of expression'));
            }
            if (nextChar === '(') {
                state = states.OPEN_BRACKET;
            }
            else {
                (0, common_1.last)(stack).push(run((0, arcsecond_1.choice)([
                    common_1.hexLiteral,
                    common_1.variable
                ])));
                run(arcsecond_1.optionalWhitespace);
                state = states.OPERATOR_OR_CLOSING_BRACKET;
            }
        }
        else if (state === states.OPERATOR_OR_CLOSING_BRACKET) {
            if (nextChar === ')') {
                state = states.CLOSE_BRACKET;
                continue;
            }
            (0, common_1.last)(stack).push(run(common_1.operator));
            run(arcsecond_1.optionalWhitespace);
            state = states.ELEMENT_OR_OPENING_BRACKET;
        }
        else {
            // Should never reach here
        }
    }
    return typifyBracketedExpression(expr);
});
exports.bracketedExpr = bracketedExpr;
const squareBracketExpr = (0, arcsecond_1.coroutine)(run => {
    run((0, arcsecond_1.char)('['));
    run(arcsecond_1.optionalWhitespace);
    const states = {
        EXPECT_ELEMENT: 0,
        EXPECT_OPERATOR: 1
    };
    const expr = [];
    let state = states.EXPECT_ELEMENT;
    while (true) {
        if (state === states.EXPECT_ELEMENT) {
            const result = run((0, arcsecond_1.choice)([
                bracketedExpr,
                common_1.hexLiteral,
                common_1.variable
            ]));
            expr.push(result);
            state = states.EXPECT_OPERATOR;
            run(arcsecond_1.optionalWhitespace);
        }
        else if (state === states.EXPECT_OPERATOR) {
            const nextChar = run(util_1.peek);
            if (nextChar === ']') {
                run((0, arcsecond_1.char)(']'));
                run(arcsecond_1.optionalWhitespace);
                break;
            }
            const result = run(common_1.operator);
            expr.push(result);
            state = states.EXPECT_ELEMENT;
            run(arcsecond_1.optionalWhitespace);
        }
    }
    return T.squareBracketExpr(expr);
}).map(disambiguateOrderOfOperations);
exports.squareBracketExpr = squareBracketExpr;
