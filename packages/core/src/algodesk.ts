import {Network} from "./network";
import {AccountClient} from "./clients/accountClient";
import {ApplicationClient, AssetClient} from "./clients";
import {Signer} from "./signers";
import {TransactionClient} from "./clients/transactionClient";

export class Algodesk {
    public network: Network
    public accountClient: AccountClient;
    public assetClient: AssetClient;
    public transactionClient: TransactionClient
    public applicationClient: ApplicationClient;

    constructor(network: Network, signer: Signer) {
        this.setNetwork(network, signer);
    }

    setNetwork(network: Network, signer: Signer): void {
        const client = network.getClient();
        const indexer = network.getIndexer();

        this.network = network;
        this.accountClient = new AccountClient(client, indexer, signer);
        this.assetClient = new AssetClient(client, indexer, signer);
        this.applicationClient = new ApplicationClient(client, indexer, signer);
        this.transactionClient = new TransactionClient(client, indexer, signer);
    }
}