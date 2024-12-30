"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validIdentifier = exports.peek = exports.asType = exports.mapJoin = exports.deepLog = void 0;
const arcsecond_1 = require("arcsecond");
const util_1 = require("util");
const deepLog = (x) => console.log((0, util_1.inspect)(x, { depth: Infinity, colors: true }));
exports.deepLog = deepLog;
const asType = (type) => (value) => ({
    type,
    value,
});
exports.asType = asType;
const mapJoin = (parser) => parser.map((items) => items.join(''));
exports.mapJoin = mapJoin;
const peek = (0, arcsecond_1.lookAhead)((0, arcsecond_1.regex)(/^./));
exports.peek = peek;
const validIdentifier = mapJoin((0, arcsecond_1.sequenceOf)([
    (0, arcsecond_1.regex)(/^[a-zA-Z_]/),
    (0, arcsecond_1.possibly)((0, arcsecond_1.regex)(/^[a-zA-Z0-9_]+/)).map(x => x === null ? '' : x)
]));
exports.validIdentifier = validIdentifier;
