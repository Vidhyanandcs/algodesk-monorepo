import {Transaction} from "algosdk";

export class BaseSigner {
    constructor() {

    }

    async signTxn(unsignedTxn: Transaction): Promise<Uint8Array> {
        throw new Error("abstractMethod not implemented");
    }

    async signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]> {
        throw new Error("abstractMethod not implemented");
    }

    setWallet(wallet: any) {
        throw new Error("abstractMethod not implemented");
    }
}