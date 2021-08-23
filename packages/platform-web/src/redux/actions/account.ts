import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {
    A_AccountInformation
} from "@algodesk/core";
import {handleException} from "./exception";
import {showLoader, hideLoader} from './loader';
import algosdk from "../../utils/algosdk";


export interface Account {
    loggedIn: boolean
    information: A_AccountInformation,
}

const information: A_AccountInformation = {
    address: "",
    amount: 0,
    "amount-without-pending-rewards": 0,
    "apps-local-state": [],
    "apps-total-schema": {
        "num-byte-slice": 0,
        "num-uint": 0
    },
    assets: [],
    "created-apps": [],
    "created-assets": [],
    "pending-rewards": 0,
    "reward-base": 0,
    rewards: 0,
    round: 0,
    status: ""
}

const initialState: Account = {
    loggedIn: false,
    information
}

export const loadAccount = createAsyncThunk(
    'account/loadAccount',
    async (address: string, thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            dispatch(showLoader("Loading account information ..."));
            const accountInfo = await algosdk.algodesk.accountClient.getAccountInformation(address);
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
            state.information = information;
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