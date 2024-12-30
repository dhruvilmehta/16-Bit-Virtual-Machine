"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meta_1 = require("./meta");
const indexBy = (array, prop) => array.reduce((output, item) => {
    output[item[prop]] = item;
    return output;
}, {});
exports.default = indexBy(meta_1.meta, 'instruction');
