import readFile from 'read-file';
import path from 'path';
import nodeWindowPolyfill from "node-window-polyfill";
nodeWindowPolyfill.register();
import {mnemonicToSecretKey} from 'algosdk';
import {
    Algodesk,
    betanet,
    WalletSigner,
    getUintProgram,
    A_UpdateApplicationParams
} from "@algodesk/core";


const adminMnemonic = 'consider mind artefact motion margin more skate pave skill arrange reform media occur sugar section summer fantasy accident high column rescue horn amount able top';
const adminAccount = mnemonicToSecretKey(adminMnemonic);//77PMFSNBYH7UMT7ZQGAZAE6IFYC5SLMG4VQHNMYVBTALC74AD66KV4T5CE

const platformAppId = 438565946;

export async function updatePlatformApplication() {
    const approvalBytesPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'platform', 'bytes', 'approval.json');
    const clearBytesPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'platform', 'bytes', 'clear.json');

    let approvalBytes = readFile.sync(approvalBytesPath);
    let clearBytes = readFile.sync(clearBytesPath);

    approvalBytes = JSON.parse(approvalBytes.toString());
    clearBytes = JSON.parse(clearBytes.toString());

    const walletSigner = new WalletSigner(adminAccount);
    const algodesk = new Algodesk(betanet, walletSigner);

    const params: A_UpdateApplicationParams = {
        appId: platformAppId,
        approvalProgram: getUintProgram(approvalBytes.result),
        clearProgram: getUintProgram(clearBytes.result),
        from: adminAccount.addr
    };

    const {txId} = await algodesk.applicationClient.update(params);
    await algodesk.transactionClient.waitForConfirmation(txId);
    const pendingTransactionInfo = await algodesk.transactionClient.pendingTransactionInformation(txId);
    console.log(pendingTransactionInfo);
    return pendingTransactionInfo;
}

updatePlatformApplication()

