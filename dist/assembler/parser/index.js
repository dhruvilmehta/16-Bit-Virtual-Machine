"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const arcsecond_1 = require("arcsecond");
const instructions_1 = __importDefault(require("./instructions"));
const common_1 = require("./common");
exports.default = (0, arcsecond_1.many)((0, arcsecond_1.choice)([instructions_1.default, common_1.label]));
