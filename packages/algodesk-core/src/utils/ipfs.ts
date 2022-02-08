import { Web3Storage } from 'web3.storage';

export async function uploadToIpfs(apiKey: string, file: File): Promise<string> {
    const client = new Web3Storage({ token: apiKey });
    const cid = await client.put([file], {wrapWithDirectory: false})
    return cid;
}

export function cidToIpfsFile(cid: string): string {
    return 'ipfs://' + cid;
}