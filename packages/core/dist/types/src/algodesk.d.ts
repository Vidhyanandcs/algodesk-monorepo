import { Network } from "./network";
import { AccountClient, ApplicationClient, AssetClient, PaymentClient, TransactionClient } from "./clients";
import { Signer } from "./types";
export declare class Algodesk {
    network: Network;
    accountClient: AccountClient;
    assetClient: AssetClient;
    transactionClient: TransactionClient;
    applicationClient: ApplicationClient;
    paymentClient: PaymentClient;
    constructor(network: Network, signer: Signer);
    setNetwork(network: Network, signer: Signer): void;
}
