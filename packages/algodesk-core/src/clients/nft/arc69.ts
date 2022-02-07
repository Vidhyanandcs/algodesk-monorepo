import {Algodv2} from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {A_Asset, A_Nft_MetaData} from "../../types";
import {NFT_STANDARDS} from "../../constants";
import {getFileUrl} from "./nftClient";

export class Arc69 {
    client: Algodv2;
    indexer: IndexerClient;

    constructor(client: Algodv2, indexer: IndexerClient) {
        this.client = client;
        this.indexer = indexer;
    }

    async getMetaData(asset: A_Asset): Promise<A_Nft_MetaData> {
        const {transactions} = await this.indexer.searchForTransactions().assetID(asset.index).txType("acfg").do();
        transactions.sort((a, b) => b["round-time"] - a["round-time"]);

        for (const transaction of transactions) {
            try {
                const noteBase64 = transaction.note;
                const noteString = atob(noteBase64)
                    .trim()
                    .replace(/[^ -~]+/g, "");
                const noteObject: A_Nft_MetaData = JSON.parse(noteString);
                if (noteObject.standard === NFT_STANDARDS.ARC69) {
                    noteObject.media_url = asset.params.url;
                    noteObject.file_url = getFileUrl(noteObject.media_url);

                    if (!noteObject.description) {
                        noteObject.description = '';
                    }
                    if (!noteObject.external_url) {
                        noteObject.external_url = '';
                    }
                    if (!noteObject.attributes) {
                        noteObject.attributes = [];
                    }
                    return noteObject;
                }
            } catch (err) {

            }
        }
    }
}