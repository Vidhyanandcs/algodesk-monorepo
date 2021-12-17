import {Network} from "./network";
import {AccountClient, ApplicationClient, AssetClient, PaymentClient, TransactionClient} from "./clients";
import {Signer} from "./types";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";


export class Algodesk {
    public network: Network
    public accountClient: AccountClient;
    public assetClient: AssetClient;
    public transactionClient: TransactionClient
    public applicationClient: ApplicationClient;
    public paymentClient: PaymentClient;
    public indexer: IndexerClient

    constructor(network: Network, signer?: Signer) {
        this.setNetwork(network);
        this.setClients(signer);
    }

    setNetwork(network: Network): void {
        this.network = network;
    }

    setClients(signer: Signer): void {
        const client = this.network.getClient();
        const indexer = this.network.getIndexer();
        this.indexer = indexer;
        this.accountClient = new AccountClient(client, indexer, signer);
        this.assetClient = new AssetClient(client, indexer, signer);
        this.applicationClient = new ApplicationClient(client, indexer, signer);
        this.transactionClient = new TransactionClient(client, indexer, signer);
        this.paymentClient = new PaymentClient(client, indexer, signer);
    }
}