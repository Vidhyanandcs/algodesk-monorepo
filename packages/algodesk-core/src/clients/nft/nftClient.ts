import {Algodv2} from 'algosdk';
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {TransactionClient} from "../transactionClient";
import {
    Signer,
    A_Nft, A_Nft_MetaData
} from "../../types";
import {ApplicationClient} from "../applicationClient";
import {AccountClient} from "../accountClient";
import {PaymentClient} from "../paymentClient";
import {Arc69} from "./arc69";
import {AssetClient} from "../assetClient";
import {IPFS_GATEWAY} from "../../constants";
import {Arc3} from "./arc3";

export function getFileUrl(url: string): string {
    const chunks = url.split("://")

    if(chunks.length < 2 ) return url

    switch(chunks[0]){
        case "ipfs":
            return IPFS_GATEWAY + "/" + chunks[1]
        case "https":
            return url
    }

    return url
}

export class NFTClient{
    client: Algodv2;
    indexer: IndexerClient;
    signer: Signer;
    transactionClient: TransactionClient;
    applicationClient: ApplicationClient;
    accountClient: AccountClient;
    paymentClient: PaymentClient;
    assetClient: AssetClient;
    arc69: Arc69
    arc3: Arc3;

    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
        this.arc69 = new Arc69(client, indexer);
        this.arc3 = new Arc3(client, indexer);
        this.transactionClient = new TransactionClient(client, indexer, signer);
        this.applicationClient = new ApplicationClient(client, indexer, signer);
        this.accountClient = new AccountClient(client, indexer, signer);
        this.paymentClient = new PaymentClient(client, indexer, signer);
        this.assetClient = new AssetClient(client, indexer, signer);
    }

    async get(id: number): Promise<A_Nft>{
        const asset = await this.assetClient.get(id);

        const arc3MetaData = await this.arc3.getMetaData(asset);
        if (arc3MetaData) {
            return {
                asset,
                metadata: arc3MetaData
            }
        }

        const arc69Metadata = await this.arc69.getMetaData(asset);
        if (arc69Metadata) {
            return {
                asset,
                metadata: arc69Metadata
            }
        }
    }

}