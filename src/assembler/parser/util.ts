import { lookAhead, Parser, possibly, regex, sequenceOf } from "arcsecond";
import { inspect } from "util";

const deepLog = (x: any) => console.log(inspect(x, { depth: Infinity, colors: true }));

const asType = (type: string) => (value: any): { type: string; value: any } => ({
    type,
    value,
});

const mapJoin = (parser: Parser<string[], string, any>) => parser.map((items: string[]) => items.join(''));

const peek = lookAhead(regex(/^./))

const validIdentifier = mapJoin(sequenceOf([
    regex(/^[a-zA-Z_]/),
    possibly(regex(/^[a-zA-Z0-9_]+/)).map(x => x === null ? '' : x)
]))

export {
    deepLog, mapJoin, asType, peek, validIdentifier,
}