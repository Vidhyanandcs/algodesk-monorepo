import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {
    A_AccountInformation, A_Application
} from "@algodesk/core";
import {handleException} from "./exception";
import {showLoader, hideLoader} from './loader';
import fundstackSdk from "../../utils/fundstackSdk";


export interface Account {
    loggedIn: boolean
    information: A_AccountInformation,
    funds: A_Application[]
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
    information,
    funds: []
}

export const loadAccount = createAsyncThunk(
    'account/loadAccount',
    async (address: string, thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            dispatch(showLoader("Loading account information ..."));
            const accountInfo = await fundstackSdk.fundstack.algodesk.accountClient.getAccountInformation(address);
            dispatch(hideLoader());
            return accountInfo;
        }
        catch (e: any) {
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
            fundstackSdk.signer.logout();
            localStorage.removeItem("signer");
            localStorage.removeItem("address");
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadAccount.fulfilled, (state, action: PayloadAction<any>) => {
            const accountInfo = action.payload;
            state.loggedIn = true;
            state.information = accountInfo;
            state.funds = fundstackSdk.fundstack.getAccountFunds(accountInfo);
        })
    },
});

export const { logout } = accountSlice.actions
export default accountSlice.reducer