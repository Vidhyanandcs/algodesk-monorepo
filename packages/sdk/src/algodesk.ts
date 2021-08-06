import {BaseNet, getNetwork} from "./networks";
import {AccountClient} from "./clients/accountClient";
import {ApplicationClient, AssetClient} from "./clients";
import {BaseSigner} from "./signers";
import {NETWORKS} from "./constants";
import {TransactionClient} from "./clients/transactionClient";

export class Algodesk {
    public network: BaseNet
    public accountClient: AccountClient;
    public assetClient: AssetClient;
    public transactionClient: TransactionClient
    private applicationClient: ApplicationClient;

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
        this.applicationClient = new ApplicationClient(client, indexer, signer);
        this.transactionClient = new TransactionClient(client, indexer, signer);
    }
}