import {Algodv2} from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {A_Asset, A_Nft_Media, A_Nft_MetaData_Arc3, A_Nft_MetaData_Arc69} from "../../types";
import {getWebUrl} from "./nftClient";
import axios from 'axios';

export class Arc3 {
    client: Algodv2;
    indexer: IndexerClient;

    constructor(client: Algodv2, indexer: IndexerClient) {
        this.client = client;
        this.indexer = indexer;
    }

    isArc3Nft(asset: A_Asset): boolean {
        const name = asset.params.name;
        const url = asset.params.url;

        if (name === 'arc3') {
            return true;
        }
        if (name && name.slice(name.length - 5) === '@arc3') {
            return true;
        }
        if (url && url.slice(url.length - 5) === '#arc3') {
            return true;
        }

        return false;
    }

    getMedia(metadata: A_Nft_MetaData_Arc3, asset: A_Asset): A_Nft_Media {
        return {
            file_url: metadata.image,
            web_url: getWebUrl(metadata.image)
        };
    }

    async getMetaData(asset: A_Asset): Promise<A_Nft_MetaData_Arc3> {

        if (this.isArc3Nft(asset)) {
            const resp = await axios.get(getWebUrl(asset.params.url));
            const arc3MetaData:A_Nft_MetaData_Arc3 = resp.data;

            if (!arc3MetaData.properties) {
                arc3MetaData.properties = {}
            }

            return arc3MetaData;
        }
    }
}