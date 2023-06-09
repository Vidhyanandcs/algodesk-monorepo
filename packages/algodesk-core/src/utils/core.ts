import Duration from 'duration';
import {BLOCK_TIME} from "../constants";
import {formatNumber} from "accounting";
import moment from "moment";
import { sha256 } from 'js-sha256';

export function encodeText(text: string | undefined): Uint8Array | undefined {
    if (text) {
        const enc = new TextEncoder();
        return enc.encode(text);
    }
}

export function durationBetweenBlocks(futureRound: number, currentRound: number): Duration {
    const sec: number = Math.round((futureRound - currentRound) * BLOCK_TIME);

    const start: Date = new Date();
    const end: Date = new Date(start.getTime() + (sec * 1000));

    return  new Duration(start, end);
}

export function ellipseAddress(address: string = "", width: number = 5): string {
    return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export function formatNumWithDecimals(num: number, decimals: number): string {
    const number = formatNumber(num, {
        precision: decimals
    });

    return number.replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'');
}

export function isNumber(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function isPositive(n: number) {
    return n >= 0;
}

export function debounce (task: any, ms: number) {
    let t = { promise: null, cancel: _ => void 0 }
    return async (...args: any) => {
        try {
            // @ts-ignore
            t.cancel()
            t = deferred(ms)
            await t.promise
            await task(...args)
        }
        catch (_) { /* prevent memory leak */ }
    }
}

export function deferred (ms: number) {
    let cancel, promise = new Promise((resolve, reject) => {
        cancel = reject
        setTimeout(resolve, ms)
    })
    return { promise, cancel }
}

export function getBlockByDate(date: Date, currentRound: number): number {
    const currentMoment = moment();
    const futureMoment = moment(date);

    const secDiff = futureMoment.diff(currentMoment, "seconds");
    const roundsDiff = Math.abs(Math.round(secDiff / BLOCK_TIME));

    return currentRound + roundsDiff;
}

export async function getFileIntegrity(file: File): Promise<string> {
    const buff = await file.arrayBuffer()
    const bytes = new Uint8Array(buff)
    const hash = new Uint8Array(sha256.digest(bytes));
    return "sha256-"+Buffer.from(hash).toString("base64")
}