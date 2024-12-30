import { char, choice, lookAhead, many1, optionalWhitespace, Parser, possibly, regex, sequenceOf, str } from "arcsecond";
import * as T from "./types";
import { mapJoin, validIdentifier } from "./util";

const hexLiteral = char('$').chain(() => mapJoin(many1(hexDigit))).map(T.hexLiteral);

const address = char('&').chain(() => mapJoin(many1(hexDigit))).map(T.address);

const operator = choice([
    char('+').map(T.opPlus),
    char('-').map(T.opMinus),
    char('*').map(T.opMultiply),
])

const upperOrLowerStr = (s: string) => choice([
    str(s.toLowerCase()),
    str(s.toUpperCase())
]);

const label = sequenceOf([
    validIdentifier,
    char(':'),
    optionalWhitespace
]).map(([labelName]) => labelName).map(T.label)

const register = choice([
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


const hexDigit = regex(/^[0-9A-Fa-f]/);

const variable = char('!').chain(() => validIdentifier).map(T.variable);

const last = (a: any) => a[a.length - 1]

export {
    hexLiteral,
    address,
    operator,
    register,
    variable,
    last,
    upperOrLowerStr,
    label
}