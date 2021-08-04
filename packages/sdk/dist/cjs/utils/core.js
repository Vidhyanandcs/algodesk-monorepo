"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.durationBetweenBlocks = exports.encodeText = void 0;
const duration_1 = __importDefault(require("duration"));
const constants_1 = require("../constants");
function encodeText(text) {
    const enc = new TextEncoder();
    return enc.encode(text);
}
exports.encodeText = encodeText;
function durationBetweenBlocks(futureRound, currentRound) {
    const sec = Math.round((futureRound - currentRound) * constants_1.BLOCK_TIME);
    const start = new Date();
    const end = new Date(start.getTime() + (sec * 1000));
    return new duration_1.default(start, end);
}
exports.durationBetweenBlocks = durationBetweenBlocks;
//# sourceMappingURL=core.js.map