import {encodeText, formatNumWithDecimals} from "../utils";
import sdk, {Account, Algodv2, algosToMicroalgos, microalgosToAlgos, SuggestedParams, Transaction} from 'algosdk';
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {TransactionClient} from "./transactionClient";
import {
    Signer,
    A_FreezeAssetParams,
    A_CreateAssetParams,
    A_ModifyAssetParams,
    A_SendTxnResponse,
    A_RevokeAssetParams, A_TransferAssetParams, A_Asset, A_AccountInformation, A_BurnerVault, A_CompileProgram
} from "../types";
import {ApplicationClient} from "./applicationClient";
import {getContracts} from "../contracts";
import replaceAll from 'replaceall';
import {AccountClient} from "./accountClient";
import {BURN_ADDRESS_MIN_BAL, SIGNERS} from "../constants";
import {PaymentClient} from "./paymentClient";
import {getSigner} from "../signers";

export class AssetClient{
    client: Algodv2;
    indexer: IndexerClient;
    signer: Signer;
    transactionClient: TransactionClient;
    applicationClient: ApplicationClient;
    accountClient: AccountClient;
    paymentClient: PaymentClient;

    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
        this.transactionClient = new TransactionClient(client, indexer, signer);
        this.applicationClient = new ApplicationClient(client, indexer, signer);
        this.accountClient = new AccountClient(client, indexer, signer);
        this.paymentClient = new PaymentClient(client, indexer, signer);
    }

    async get(id: number): Promise<A_Asset>{
        const asset = await this.client.getAssetByID(id).do();
        return asset as A_Asset;
    }

    async prepareTransferTxn(params: A_TransferAssetParams, note?: string, rekeyTo?: string): Promise<Transaction> {
        const suggestedParams: SuggestedParams = await this.transactionClient.getSuggestedParams();

        const {assetId, from, to, closeRemainderTo, revocationTarget, amount} = params;
        const asset: any = await this.get(assetId);
        const amountInDecimals = amount * Math.pow(10, asset.params.decimals);

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        return sdk.makeAssetTransferTxnWithSuggestedParams(from, to, closeRemainderTo, revocationTarget, amountInDecimals, encodedNote, assetId, suggestedParams, rekeyTo);
    }

    async transfer(params: A_TransferAssetParams, note?: string, rekeyTo?: string): Promise<A_SendTxnResponse> {
        const unsignedTxn: Transaction = await this.prepareTransferTxn(params, note, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareCreateTxn(params: A_CreateAssetParams, note?: string, rekeyTo?: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        // @ts-ignore
        const totalSupply = params.total * Math.pow(10, params.decimals);

        return sdk.makeAssetCreateTxnWithSuggestedParams(params.creator, encodedNote, totalSupply, params.decimals, params.defaultFrozen, params.manager, params.reserve, params.freeze, params.clawback, params.unitName, params.name, params.url, params.metadataHash, suggestedParams, rekeyTo);
    }

    async create(params: A_CreateAssetParams, note?: string, rekeyTo?: string): Promise<A_SendTxnResponse> {
        const unsignedTxn = await this.prepareCreateTxn(params, note, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareModifyTxn(params: A_ModifyAssetParams, note?:string, rekeyTo?: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        return sdk.makeAssetConfigTxnWithSuggestedParams(params.from, encodedNote, params.assetIndex, params.manager, params.reserve, params.freeze, params.clawback, suggestedParams, params.strictEmptyAddressChecking, rekeyTo);
    }

    async modify(params: A_ModifyAssetParams, note?:string, rekeyTo?: string): Promise<any> {
        const unsignedTxn = await this.prepareModifyTxn(params, note, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareDestroyTxn(from: string, assetId: number, note?: string, rekeyTo?: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        return sdk.makeAssetDestroyTxnWithSuggestedParams(from, encodedNote, assetId, suggestedParams, rekeyTo);
    }

    async destroy(from: string, assetId: number, note?: string, rekeyTo?: string): Promise<A_SendTxnResponse> {
        const unsignedTxn = await this.prepareDestroyTxn(from, assetId, note, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareFreezeTxn(params: A_FreezeAssetParams, note?: string, rekeyTo?: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        return sdk.makeAssetFreezeTxnWithSuggestedParams(params.from, encodedNote, params.assetIndex, params.freezeAccount, params.freezeState, suggestedParams, rekeyTo);
    }

    async freeze(params: A_FreezeAssetParams, note?: string, rekeyTo?: string): Promise<A_SendTxnResponse> {
        const unsignedTxn = await this.prepareFreezeTxn(params, note, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async revoke(params: A_RevokeAssetParams, note?: string): Promise<A_SendTxnResponse> {
        const transferParams: A_TransferAssetParams = {
            from: params.from,
            to: params.revokeReceiver,
            assetId: params.assetIndex,
            amount: params.amount,
            revocationTarget: params.revokeTarget
        };

        return this.transfer(transferParams, note);
    }

    async optIn(from: string, assetIndex: number, note?: string): Promise<A_SendTxnResponse> {
        const transferParams: A_TransferAssetParams = {
            from: from,
            to: from,
            assetId: assetIndex,
            amount: 0,
        };

        return this.transfer(transferParams, note);
    }

    getTotalSupply(asset: A_Asset): number {
        return (asset.params.total / Math.pow(10, asset.params.decimals));
    }

    getTotalSupplyWithTicker(asset: A_Asset): string {
        return formatNumWithDecimals(this.getTotalSupply(asset), asset.params.decimals) + ' ' + asset.params['unit-name'];
    }

    async compileBurnerVault(assetId: number): Promise<A_CompileProgram> {
        const {burnProgram} = getContracts();
        let {teal} = burnProgram;
        teal = replaceAll("1111111", assetId + "", teal);
        console.log(teal);

        const compiledResult = await this.applicationClient.compileProgram(teal);

        return compiledResult as A_CompileProgram;
    }

    getBurnerVaultCharges(): number {
        return BURN_ADDRESS_MIN_BAL + 0.001
    }

    async getBurnerVault(assetId: number): Promise<A_BurnerVault> {
        const burnerVault: A_BurnerVault = {
            compiled: undefined,
            accountInfo: undefined,
            active: false
        };

        const compiledResult = await this.compileBurnerVault(assetId);
        burnerVault.compiled = compiledResult;

        const burnAddress = compiledResult.hash;

        const accountInfo = await this.accountClient.getAccountInformation(burnAddress);
        burnerVault.accountInfo = accountInfo;

        const balance = this.accountClient.getBalance(accountInfo);

        if (balance >= algosToMicroalgos(BURN_ADDRESS_MIN_BAL)) {
            burnerVault.active = true;
        }

        return burnerVault;
    }

    async deployBurnerVault(from: string, assetId: number): Promise<any> {
        const burnerVault = await this.getBurnerVault(assetId);
        const burnAddress = burnerVault.accountInfo.address;

        const {txId} = await this.paymentClient.payment(from, burnAddress, this.getBurnerVaultCharges(), 'deploying burner vault');
        await this.transactionClient.waitForConfirmation(txId);

        const params: A_TransferAssetParams = {
            from: burnAddress,
            to: burnAddress,
            assetId,
            amount: 0
        };
        const assetXferTxn = await this.prepareTransferTxn(params);

        const logicSigner = getSigner(SIGNERS.LOGIC_SIG);
        const logic = burnerVault.compiled.result;
        const signedAssetXferTxn = await logicSigner.signTxnByLogic(assetXferTxn, logic);

        return await this.client.sendRawTransaction(signedAssetXferTxn).do();
    }
}