import BaseSigner from "./baseSigner";

class AlgoSigner extends BaseSigner{
    constructor() {
        super();
    }

    getSignedTxnBlob(signedTxn) {
        return AlgoSigner.encoding.base64ToMsgpack(signedTxn.blob);
    }

    async sign(unsignedTxn) {
        const byteTxn = unsignedTxn.toByte();
        const b64Txn = AlgoSigner.encoding.msgpackToBase64(byteTxn);

        const rawSignedTxns = await AlgoSigner.signTxn([
            {txn: b64Txn},
        ]);

        return rawSignedTxns;
    }

    async signTxn(unsignedTxn) {
        const signedTxns = await this.sign(unsignedTxn);
        const rawSignedTxn = this.getSignedTxnBlob(signedTxns[0]);
        return rawSignedTxn;
    }
}

export default AlgoSigner;