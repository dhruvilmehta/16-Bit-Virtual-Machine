import { char, choice, coroutine, optionalWhitespace, whitespace } from "arcsecond";
import { address, hexLiteral, register, upperOrLowerStr } from "./common";
import * as T from "./types";
import { squareBracketExpr } from "./expressions";


const litReg = (mnemonic: string, type: string) => coroutine(run => {
    run(upperOrLowerStr(mnemonic));
    run(whitespace);

    const arg1 = run(choice([
        hexLiteral,
        squareBracketExpr
    ]));

    run(optionalWhitespace);
    run(char(','));
    run(optionalWhitespace);

    const arg2 = run(register);
    run(optionalWhitespace);

    return T.instruction({
        instruction: type,
        args: [arg1, arg2]
    });
});

const regLit = (mnemonic: string, type: string) => coroutine(run => {
    run(upperOrLowerStr(mnemonic));
    run(whitespace);

    const r1 = run(register)

    run(optionalWhitespace);
    run(char(','));
    run(optionalWhitespace);

    const lit = run(choice([
        hexLiteral,
        squareBracketExpr
    ]));

    run(optionalWhitespace);

    return T.instruction({
        instruction: type,
        args: [r1, lit]
    });
});

const regReg = (mnemonic: string, type: string) => coroutine(run => {
    run(upperOrLowerStr(mnemonic));
    run(whitespace);

    const r1 = run(register);

    run(optionalWhitespace);
    run(char(','));
    run(optionalWhitespace);

    const r2 = run(register);
    run(optionalWhitespace);

    return T.instruction({
        instruction: type,
        args: [r1, r2]
    });
});

const regMem = (mnemonic: string, type: string) => coroutine(run => {
    run(upperOrLowerStr(mnemonic));
    run(whitespace);

    const r1 = run(register);

    run(optionalWhitespace);
    run(char(','));
    run(optionalWhitespace);

    const addr = run(choice([
        address,
        char('&').chain(() => squareBracketExpr)
    ]));
    run(optionalWhitespace);

    return T.instruction({
        instruction: type,
        args: [r1, addr]
    });
});

const memReg = (mnemonic: string, type: string) => coroutine(run => {
    run(upperOrLowerStr(mnemonic));
    run(whitespace);

    const addr = run(choice([
        address,
        char('&').chain(() => squareBracketExpr)
    ]));

    run(optionalWhitespace);
    run(char(','));
    run(optionalWhitespace);

    const r1 = run(register);

    run(optionalWhitespace);

    return T.instruction({
        instruction: type,
        args: [addr, r1]
    });
});

const litMem = (mnemonic: string, type: string) => coroutine(run => {
    run(upperOrLowerStr(mnemonic));
    run(whitespace);

    const lit = run(choice([
        hexLiteral,
        squareBracketExpr
    ]));

    run(optionalWhitespace);
    run(char(','));
    run(optionalWhitespace);

    const addr = run(choice([
        address,
        char('&').chain(() => squareBracketExpr)
    ]));
    run(optionalWhitespace);

    return T.instruction({
        instruction: type,
        args: [lit, addr]
    });
});

const regPtrReg = (mnemonic: string, type: string) => coroutine(run => {
    run(upperOrLowerStr(mnemonic));
    run(whitespace);

    const r1 = run(char('&').chain(() => register));

    run(optionalWhitespace);
    run(char(','));
    run(optionalWhitespace);

    const r2 = run(register)

    run(optionalWhitespace);

    return T.instruction({
        instruction: type,
        args: [r1, r2]
    });
});

const litOffReg = (mnemonic: string, type: string) => coroutine(run => {
    run(upperOrLowerStr(mnemonic));
    run(whitespace);

    const lit = run(choice([
        hexLiteral,
        squareBracketExpr
    ]))

    run(optionalWhitespace);
    run(char(','));
    run(optionalWhitespace);

    const r1 = run(char('&').chain(() => register));

    run(optionalWhitespace);
    run(char(','));
    run(optionalWhitespace);

    const r2 = run(register)

    run(optionalWhitespace);

    return T.instruction({
        instruction: type,
        args: [lit, r1, r2]
    });
});

const noArgs = (mnemonic: string, type: string) => coroutine(run => {
    run(upperOrLowerStr(mnemonic));
    run(optionalWhitespace);

    return T.instruction({
        instruction: type,
        args: []
    });
});

const singleReg = (mnemonic: string, type: string) => coroutine(run => {
    run(upperOrLowerStr(mnemonic));
    run(whitespace);

    const r1 = run(register);
    run(optionalWhitespace);

    return T.instruction({
        instruction: type,
        args: [r1]
    });
});

const singleLit = (mnemonic: string, type: string) => coroutine(run => {
    run(upperOrLowerStr(mnemonic));
    run(whitespace);

    const lit = run(choice([
        hexLiteral,
        squareBracketExpr
    ]));

    return T.instruction({
        instruction: type,
        args: [lit]
    });
});

export {
    litReg, regReg, regMem, memReg, litMem, regPtrReg, litOffReg, noArgs, singleReg, singleLit, regLit
}

