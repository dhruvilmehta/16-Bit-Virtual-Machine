"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CreateMemory(sizeInBytes) {
    const ab = new ArrayBuffer(sizeInBytes);
    const dv = new DataView(ab);
    return dv;
}
exports.default = CreateMemory;
