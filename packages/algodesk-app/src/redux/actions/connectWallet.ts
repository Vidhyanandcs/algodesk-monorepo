import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {SignerAccount, SupportedSigner} from "@algodesk/core";
import {setSigner} from './signer';
import {loadAccount} from "./account";
import algosdk from "../../utils/algosdk";

export interface ConnectWallet {
    show: boolean,
    connecting: boolean,
    errMessage: string,
    accounts: SignerAccount[]
}

const initialState: ConnectWallet = {
    show: false,
    connecting: false,
    errMessage: "",
    accounts: []
}

export const connect = createAsyncThunk(
    'connectWallet/connect',
    async (signer: SupportedSigner, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {network} = appState;
            dispatch(walletConnecting());
            dispatch(clearAccounts());
            dispatch(setSigner(signer.name));
            algosdk.changeSigner(signer.name);
            // @ts-ignore
            const accounts = await signer.instance.connect(network.name, (err, payload)=> {
                dispatch(walletConnected());
                dispatch(setErrorMessage(payload.params[0].message));
            });
            if (accounts.length === 1) {
                dispatch(loadAccount(accounts[0].address));
                dispatch(hideConnectWallet());
            }
            dispatch(walletConnected());
            return accounts;
        }
        catch (e: any) {
            dispatch(walletConnected());
            dispatch(setErrorMessage(e.message));
        }
    }
);

export const connectWalletSlice = createSlice({
    name: 'connectWallet',
    initialState,
    reducers: {
        showConnectWallet: (state ) => {
            state.show = true;
        },
        hideConnectWallet: (state) => {
            state.show = false;
        },
        walletConnecting: (state) => {
            state.connecting = true;
            state.errMessage = "";
        },
        walletConnected: (state) => {
            state.connecting = false;
        },
        setErrorMessage: (state, action: PayloadAction<string>) => {
            state.errMessage = action.payload;
        },
        clearAccounts: (state) => {
            state.accounts = [];
        },
        resetConnectWallet: state => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(connect.fulfilled, (state, action: PayloadAction<any>) => {
            if (action.payload) {
                state.accounts = action.payload;
            }
        })
    },
});

export const { showConnectWallet, hideConnectWallet, clearAccounts, walletConnecting, walletConnected, setErrorMessage, resetConnectWallet } = connectWalletSlice.actions
export default connectWalletSlice.reducer