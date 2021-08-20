import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Algodesk, getNetwork, getSigner, A_AccountInformation} from "@algodesk/core";
import {handleException} from "./exception";
import {showLoader, hideLoader} from './loader';


export interface Account {
    loggedIn: boolean
    information?: A_AccountInformation,
}

const initialState: Account = {
    loggedIn: false,
}

export const loadAccount = createAsyncThunk(
    'account/loadAccount',
    async (address: string, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            dispatch(showLoader("Loading account information ..."));
            const appState: any = getState();
            const network = getNetwork(appState.network.name);
            const signer = getSigner(appState.signer.name);
            const algodesk = new Algodesk(network, signer);
            const accountInfo = await algodesk.accountClient.getAccountInformation(address);
            dispatch(hideLoader());
            return accountInfo;
        }
        catch (e) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        logout: (state) => {
            state.loggedIn = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadAccount.fulfilled, (state, action: PayloadAction<any>) => {
            state.loggedIn = true;
            state.information = action.payload;
        })
    },
});

export const { logout } = accountSlice.actions
export default accountSlice.reducer