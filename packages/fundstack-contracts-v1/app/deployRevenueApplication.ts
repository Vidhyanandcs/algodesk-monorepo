import readFile from 'read-file';
import path from 'path';
import nodeWindowPolyfill from "node-window-polyfill";
nodeWindowPolyfill.register();
import {mnemonicToSecretKey, OnApplicationComplete} from 'algosdk';
import {A_CreateApplicationParams, Algodesk, betanet, WalletSigner, getUintProgram} from "@algodesk/core";


const adminMnemonic = 'consider mind artefact motion margin more skate pave skill arrange reform media occur sugar section summer fantasy accident high column rescue horn amount able top';
const adminAccount = mnemonicToSecretKey(adminMnemonic);//77PMFSNBYH7UMT7ZQGAZAE6IFYC5SLMG4VQHNMYVBTALC74AD66KV4T5CE

export async function deployRevenueApplication() {
    const approvalBytesPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'revenue', 'bytes', 'approval.json');
    const clearBytesPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'revenue', 'bytes', 'clear.json');

    let approvalBytes = readFile.sync(approvalBytesPath);
    let clearBytes = readFile.sync(clearBytesPath);

    approvalBytes = JSON.parse(approvalBytes.toString());
    clearBytes = JSON.parse(clearBytes.toString());

    const walletSigner = new WalletSigner(adminAccount);
    const algodesk = new Algodesk(betanet, walletSigner);

    const params: A_CreateApplicationParams = {
        approvalProgram: getUintProgram(approvalBytes.result),
        clearProgram: getUintProgram(clearBytes.result),
        from: adminAccount.addr,
        globalBytes: 20,
        globalInts: 20,
        localBytes: 7,
        localInts: 7,
        onComplete: OnApplicationComplete.NoOpOC
    };

    const {txId} = await algodesk.applicationClient.create(params);
    await algodesk.transactionClient.waitForConfirmation(txId);
    const pendingTransactionInfo = await algodesk.transactionClient.pendingTransactionInformation(txId);
    console.log(pendingTransactionInfo);
    return pendingTransactionInfo;
}

deployRevenueApplication()

