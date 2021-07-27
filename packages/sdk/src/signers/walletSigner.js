import * as sdk from "algosdk";
import BaseSigner from "./baseSigner";

class WalletSigner extends BaseSigner{
    constructor(wallet) {
        super();
        this.wallet = wallet;
    }

    getSecretKey() {
        const {sk} = this.wallet;
        return sk;
    }

    signTxn(unsignedTxn) {
        const sk = this.getSecretKey();
        const signedRawTxn = unsignedTxn.signTxn(sk);
        return signedRawTxn;
    }
}

export default WalletSigner;