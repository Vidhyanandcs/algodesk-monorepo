import { Network } from "./network";
import { AccountClient } from "./clients/accountClient";
import { ApplicationClient, AssetClient } from "./clients";
import { Signer } from "./signers";
import { TransactionClient } from "./clients/transactionClient";
export declare class Algodesk {
    network: Network;
    accountClient: AccountClient;
    assetClient: AssetClient;
    transactionClient: TransactionClient;
    applicationClient: ApplicationClient;
    constructor(network: Network, signer: Signer);
    setNetwork(network: Network, signer: Signer): void;
}
