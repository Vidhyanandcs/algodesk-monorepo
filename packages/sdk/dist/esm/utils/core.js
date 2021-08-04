import Duration from 'duration';
import { BLOCK_TIME } from "../constants";
export function encodeText(text) {
    const enc = new TextEncoder();
    return enc.encode(text);
}
export function durationBetweenBlocks(futureRound, currentRound) {
    const sec = Math.round((futureRound - currentRound) * BLOCK_TIME);
    const start = new Date();
    const end = new Date(start.getTime() + (sec * 1000));
    return new Duration(start, end);
}
//# sourceMappingURL=core.js.map