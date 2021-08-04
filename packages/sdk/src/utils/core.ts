import Duration from 'duration';
import {BLOCK_TIME} from "../constants";

export function encodeText(text: string): Uint8Array {
    const enc = new TextEncoder();
    return  enc.encode(text);
}

export function durationBetweenBlocks(futureRound: number, currentRound: number): Duration {
    const sec: number = Math.round((futureRound - currentRound) * BLOCK_TIME);


    const start: Date = new Date();
    const end: Date = new Date(start.getTime() + (sec * 1000));

    return  new Duration(start, end);
}