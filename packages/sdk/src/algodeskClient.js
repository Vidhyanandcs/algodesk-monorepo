import {AccountClient, ApplicationClient, PaymentClient} from "./clients";

export class AlgoDesk {
    constructor(name, signer, wallet) {
        this.applicationClient = new ApplicationClient(name, signer, wallet);
        this.paymentClient = new PaymentClient(name, signer, wallet);
        this.accountClient = new AccountClient(name, signer, wallet);
    }
}