import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {SignerAccount, SupportedSigner} from "@algodesk/core";
import {handleException} from "./exception";


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
        const {dispatch} = thunkAPI;
        try {
            // @ts-ignore
            const accounts = await signer.instance.connect();
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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(connect.fulfilled, (state, action: PayloadAction<any>) => {
            if (action.payload) {
                state.accounts = action.payload;
            }
            console.log(action.payload);
        })
    },
});

export const { showConnectWallet, hideConnectWallet } = connectWalletSlice.actions
export default connectWalletSlice.reducer