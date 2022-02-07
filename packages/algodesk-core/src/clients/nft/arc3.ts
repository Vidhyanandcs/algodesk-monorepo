import {Algodv2} from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {A_Asset, A_Nft_MetaData} from "../../types";
import {NFT_STANDARDS} from "../../constants";
import {getFileUrl} from "./nftClient";
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

    async getMetaData(asset: A_Asset): Promise<A_Nft_MetaData> {

        if (this.isArc3Nft(asset)) {
            const resp = await axios.get(getFileUrl(asset.params.url));
            const arc3MetaData = resp.data;

            const nftMetaData: A_Nft_MetaData = {
                description: arc3MetaData.description,
                external_url: "",
                file_url: "",
                media_url: arc3MetaData.image,
                standard: NFT_STANDARDS.ARC3,
                attributes: arc3MetaData.properties
            }
            nftMetaData.file_url = getFileUrl(nftMetaData.media_url);
            if (!nftMetaData.attributes) {
                nftMetaData.attributes = []
            }

            return nftMetaData;
        }
    }
}