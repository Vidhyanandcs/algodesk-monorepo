import {Algodv2} from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {A_Asset, A_Nft_Media, A_Nft_MetaData_Arc69} from "../../types";
import {NFT_STANDARDS} from "../../constants";
import {getWebUrl} from "./nftClient";

export class Arc69 {
    client: Algodv2;
    indexer: IndexerClient;

    constructor(client: Algodv2, indexer: IndexerClient) {
        this.client = client;
        this.indexer = indexer;
    }

    getMedia(metadata: A_Nft_MetaData_Arc69, asset: A_Asset): A_Nft_Media {
        return {
            file_url: asset.params.url,
            web_url: getWebUrl(asset.params.url)
        };
    }

    async getMetaData(asset: A_Asset): Promise<A_Nft_MetaData_Arc69> {
        const {transactions} = await this.indexer.searchForTransactions().assetID(asset.index).txType("acfg").do();
        transactions.sort((a, b) => b["round-time"] - a["round-time"]);

        for (const transaction of transactions) {
            try {
                const noteBase64 = transaction.note;
                const noteString = atob(noteBase64)
                    .trim()
                    .replace(/[^ -~]+/g, "");
                const arc69MetaData: A_Nft_MetaData_Arc69 = JSON.parse(noteString);
                if (arc69MetaData.standard === NFT_STANDARDS.ARC69) {
                    if (!arc69MetaData.description) {
                        arc69MetaData.description = '';
                    }
                    if (!arc69MetaData.external_url) {
                        arc69MetaData.external_url = '';
                    }
                    if (!arc69MetaData.properties) {
                        arc69MetaData.properties = {};
                    }
                    return arc69MetaData;
                }
            } catch (err) {

            }
        }
    }
}