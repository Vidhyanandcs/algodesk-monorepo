import {BLOCK_TIME} from "../constants";
// import Duration from 'duration';

export function prepareNote(note) {
    const enc = new TextEncoder();
    return  enc.encode(note);
}

export function getDurationBetweenBlocks(futureRound, currentRound) {
    const sec = Math.round((futureRound - currentRound) * BLOCK_TIME);

    const start = new Date();
    const end = new Date(start.getTime() + (sec * 1000));

    // const duration = new Duration(start, end);
    //
    // return duration;
}