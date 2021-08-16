import { AccountClient, ApplicationClient, AssetClient, PaymentClient, TransactionClient } from "./clients";
export class Algodesk {
    constructor(network, signer) {
        this.setNetwork(network, signer);
    }
    setNetwork(network, signer) {
        const client = network.getClient();
        const indexer = network.getIndexer();
        this.network = network;
        this.accountClient = new AccountClient(client, indexer, signer);
        this.assetClient = new AssetClient(client, indexer, signer);
        this.applicationClient = new ApplicationClient(client, indexer, signer);
        this.transactionClient = new TransactionClient(client, indexer, signer);
        this.paymentClient = new PaymentClient(client, indexer, signer);
    }
}
//# sourceMappingURL=algodesk.js.map