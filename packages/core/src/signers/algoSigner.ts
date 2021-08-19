import {Signer} from "../types";
import {Transaction} from "algosdk";

export class BrowserAlgoSigner implements Signer{

    constructor() {

    }

    async signTxn(unsignedTxn: Transaction): Promise<Uint8Array> {
        const byteTxn: Uint8Array = unsignedTxn.toByte();
        // @ts-ignore
        const b64Txn = AlgoSigner.encoding.msgpackToBase64(byteTxn);

        // @ts-ignore
        const signedTxns: any[] = await AlgoSigner.signTxn([
            {txn: b64Txn},
        ]);

        // @ts-ignore
        const rawSignedTxn: Uint8Array = AlgoSigner.encoding.base64ToMsgpack(signedTxns[0].blob);
        return rawSignedTxn;
    }

    async signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]> {
        const txns: any[] = [];

        unsignedTxns.forEach((unsignedTxn) => {
            const byteTxn: Uint8Array = unsignedTxn.toByte();
            // @ts-ignore
            const b64Txn = AlgoSigner.encoding.msgpackToBase64(byteTxn);
            txns.push({
                txn: b64Txn
            });
        });

        // @ts-ignore
        const signedTxns = await AlgoSigner.signTxn(txns);

        const rawSignedTransactions: Uint8Array[] = [];

        signedTxns.forEach((signedTxn) => {
            // @ts-ignore
            rawSignedTransactions.push(AlgoSigner.encoding.base64ToMsgpack(signedTxn.blob));
        });

        return rawSignedTransactions;
    }

    isInstalled(): boolean {
        // @ts-ignore
        if (AlgoSigner) {
            return true;
        }

        return false;
    }
}