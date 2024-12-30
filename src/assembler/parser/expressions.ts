import { char, choice, coroutine, fail, optionalWhitespace } from "arcsecond";
import { peek } from "./util";
import * as T from "./types";
import { hexLiteral, last, operator, variable } from "./common";

const typifyBracketedExpression = (expr: any) => {
    const asBracketed = T.bracketedExpr
    return asBracketed(expr.map((element: any) => {
        if (Array.isArray(element)) {
            return typifyBracketedExpression(element)
        }
        return element
    }))
}

const disambiguateOrderOfOperations = (expr: any) => {
    if (expr.type !== 'SQUARE_BRACKETED_EXPRESSION' && expr.type !== 'BRACKETED_EXPRESSION') {
        return expr
    }
    if (expr.value.length === 1) {
        return expr.value[0]
    }

    const priorities: any = {
        OP_MULTIPLY: 2,
        OP_PLUS: 1,
        OP_MINUS: 0
    }

    let candidateExpression: any = {
        priority: -Infinity
    }

    for (let i = 1; i < expr.value.length; i += 2) {
        const level = priorities[expr.value[i].type]
        if (level > candidateExpression.priority) {
            candidateExpression = {
                priority: level,
                a: i - 1, // left hand side operand
                b: i + 1, // right hand side operand
                op: expr.value[i]
            }
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
    ])

    return disambiguateOrderOfOperations(newExpression)
}

const bracketedExpr = coroutine(run => {
    const states = {
        OPEN_BRACKET: 0,
        OPERATOR_OR_CLOSING_BRACKET: 1,
        ELEMENT_OR_OPENING_BRACKET: 2,
        CLOSE_BRACKET: 3
    }

    let state = states.ELEMENT_OR_OPENING_BRACKET
    const expr: any = []
    const stack: Array<Array<any>> = [expr]
    run(char('('))

    while (true) {
        const nextChar = run(peek)
        if (state === states.OPEN_BRACKET) {
            run(char('('))
            expr.push([])
            stack.push(last(expr))
            run(optionalWhitespace)
            state = states.ELEMENT_OR_OPENING_BRACKET
        } else if (state === states.CLOSE_BRACKET) {
            run(char(')'))
            stack.pop()
            if (stack.length === 0) {
                break;
            }
            run(optionalWhitespace)
            state = states.OPERATOR_OR_CLOSING_BRACKET
        } else if (state === states.ELEMENT_OR_OPENING_BRACKET) {
            if (nextChar === ')') {
                run(fail('Unexpected closing of expression'))
            }
            if (nextChar === '(') {
                state = states.OPEN_BRACKET
            } else {
                last(stack).push(run(choice([
                    hexLiteral,
                    variable
                ])))
                run(optionalWhitespace)
                state = states.OPERATOR_OR_CLOSING_BRACKET
            }
        } else if (state === states.OPERATOR_OR_CLOSING_BRACKET) {
            if (nextChar === ')') {
                state = states.CLOSE_BRACKET
                continue;
            }
            last(stack).push(run(operator))
            run(optionalWhitespace)
            state = states.ELEMENT_OR_OPENING_BRACKET
        } else {
            // Should never reach here
        }
    }

    return typifyBracketedExpression(expr)
})

const squareBracketExpr = coroutine(run => {
    run(char('['))
    run(optionalWhitespace)

    const states = {
        EXPECT_ELEMENT: 0,
        EXPECT_OPERATOR: 1
    }
    const expr: any = []
    let state = states.EXPECT_ELEMENT
    while (true) {
        if (state === states.EXPECT_ELEMENT) {
            const result = run(choice([
                bracketedExpr,
                hexLiteral,
                variable
            ]))

            expr.push(result);
            state = states.EXPECT_OPERATOR
            run(optionalWhitespace)
        } else if (state === states.EXPECT_OPERATOR) {
            const nextChar = run(peek)
            if (nextChar === ']') {
                run(char(']'))
                run(optionalWhitespace)
                break;
            }

            const result = run(operator)
            expr.push(result)
            state = states.EXPECT_ELEMENT;
            run(optionalWhitespace)
        }
    }
    return T.squareBracketExpr(expr)
}).map(disambiguateOrderOfOperations)

export {
    bracketedExpr,
    squareBracketExpr
}