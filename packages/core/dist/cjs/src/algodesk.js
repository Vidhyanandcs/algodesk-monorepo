"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Algodesk = void 0;
const clients_1 = require("./clients");
class Algodesk {
    constructor(network, signer) {
        this.setNetwork(network, signer);
    }
    setNetwork(network, signer) {
        const client = network.getClient();
        const indexer = network.getIndexer();
        this.network = network;
        this.accountClient = new clients_1.AccountClient(client, indexer, signer);
        this.assetClient = new clients_1.AssetClient(client, indexer, signer);
        this.applicationClient = new clients_1.ApplicationClient(client, indexer, signer);
        this.transactionClient = new clients_1.TransactionClient(client, indexer, signer);
        this.paymentClient = new clients_1.PaymentClient(client, indexer, signer);
    }
}
exports.Algodesk = Algodesk;
//# sourceMappingURL=algodesk.js.map