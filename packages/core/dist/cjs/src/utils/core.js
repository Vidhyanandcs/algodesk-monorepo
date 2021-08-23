"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ellipseAddress = exports.durationBetweenBlocks = exports.encodeText = void 0;
const duration_1 = __importDefault(require("duration"));
const constants_1 = require("../constants");
function encodeText(text) {
    if (text) {
        const enc = new TextEncoder();
        return enc.encode(text);
    }
}
exports.encodeText = encodeText;
function durationBetweenBlocks(futureRound, currentRound) {
    const sec = Math.round((futureRound - currentRound) * constants_1.BLOCK_TIME);
    const start = new Date();
    const end = new Date(start.getTime() + (sec * 1000));
    return new duration_1.default(start, end);
}
exports.durationBetweenBlocks = durationBetweenBlocks;
function ellipseAddress(address = "", width = 5) {
    return `${address.slice(0, width)}...${address.slice(-width)}`;
}
exports.ellipseAddress = ellipseAddress;
//# sourceMappingURL=core.js.map