import Duration from 'duration';
export declare function encodeText(text: string | undefined): Uint8Array | undefined;
export declare function durationBetweenBlocks(futureRound: number, currentRound: number): Duration;
export declare function ellipseAddress(address: string, width?: number): string;
