import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {SignerAccount, SupportedSigner} from "@algodesk/core";
import {handleException} from "./exception";
import {setSigner} from './signer';


export interface ConnectWallet {
    show: boolean
    accounts: SignerAccount[]
}

const initialState: ConnectWallet = {
    show: false,
    accounts: []
}

export const connect = createAsyncThunk(
    'connectWallet/connect',
    async (signer: SupportedSigner, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {network} = appState;
            dispatch(clearAccounts());
            dispatch(setSigner(signer.name));
            // @ts-ignore
            const accounts = await signer.instance.connect(network.name);
            return accounts;
        }
        catch (e) {
            dispatch(handleException(e));
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
        clearAccounts: (state) => {
            state.accounts = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(connect.fulfilled, (state, action: PayloadAction<any>) => {
            if (action.payload) {
                state.accounts = action.payload;
            }
        })
    },
});

export const { showConnectWallet, hideConnectWallet, clearAccounts } = connectWalletSlice.actions
export default connectWalletSlice.reducer