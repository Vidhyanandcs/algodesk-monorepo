import {BaseNet, getNetwork} from "./networks";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {AccountClient} from "./clients/accountClient";
import {AssetClient} from "./clients";
import {BaseSigner, getSigner} from "./signers";
import {NETWORKS, SIGNERS} from "./constants";
import {TransactionClient} from "./clients/transactionClient";
import {sign} from "crypto";

export class Algodesk {
    public network: BaseNet
    public accountClient: AccountClient;
    public assetClient: AssetClient;
    public transactionClient: TransactionClient

    constructor(networkName: string = NETWORKS.MAINNET, signer: BaseSigner) {
        this.setNetwork(networkName, signer);
    }

    setNetwork(name: string, signer: BaseSigner): void {
        const network = getNetwork(name);
        const client = network.getClient();
        const indexer = network.getIndexer();

        this.network = network;
        this.accountClient = new AccountClient(client, indexer, signer);
        this.assetClient = new AssetClient(client, indexer, signer);
        this.transactionClient = new TransactionClient(client, indexer, signer);
    }
}