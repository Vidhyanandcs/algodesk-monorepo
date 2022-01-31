import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {
    A_AccountInformation, A_Asset
} from "@algodesk/core";
import {handleException} from "./exception";
import {showLoader, hideLoader} from './loader';
import algosdk from "../../utils/algosdk";


export interface Account {
    loggedIn: boolean
    information: A_AccountInformation,
    createdAssets: A_Asset[],
    optedAssets: A_Asset[]
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
    createdAssets: [],
    optedAssets: []
}

export const loadAccount = createAsyncThunk(
    'account/loadAccount',
    async (address: string, thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            dispatch(showLoader("Loading account information ..."));
            const accountInfo = await algosdk.algodesk.accountClient.getAccountInformation(address);
            dispatch(loadCreatedAssets(accountInfo));
            dispatch(loadOptedAssets(accountInfo));
            dispatch(hideLoader());
            return accountInfo;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const loadCreatedAssets = createAsyncThunk(
    'account/loadCreatedAssets',
    async (information: A_AccountInformation, thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            let createdAssets = algosdk.algodesk.accountClient.getCreatedAssets(information);
            createdAssets = createdAssets.sort((a, b) => {
                return b.index - a.index;
            });
            return createdAssets;
        }
        catch (e: any) {
            dispatch(handleException(e));
        }
    }
);

export const loadOptedAssets = createAsyncThunk(
    'account/loadOptedAssets',
    async (accountInformation: A_AccountInformation, thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            dispatch(resetOptedAssets());
            const optedAssets = algosdk.algodesk.accountClient.getHoldingAssets(accountInformation);
            optedAssets.forEach((asset) => {
                const isCreatedAsset = algosdk.algodesk.accountClient.isCreatedAsset(asset['asset-id'], accountInformation);
                if (!isCreatedAsset) {
                    dispatch(loadOptedAsset(asset['asset-id']));
                }
            });
        }
        catch (e: any) {
            dispatch(handleException(e));
        }
    }
);

export const loadOptedAsset = createAsyncThunk(
    'account/loadOptedAsset',
    async (id: number, thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            const assetDetails = await algosdk.algodesk.assetClient.get(id);
            return assetDetails;
        }
        catch (e: any) {
            dispatch(handleException(e));
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
            algosdk.signer.logout();
        },
        resetOptedAssets: (state) => {
            state.optedAssets = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadAccount.fulfilled, (state, action: PayloadAction<any>) => {
            state.loggedIn = true;
            state.information = action.payload;
        });
        builder.addCase(loadCreatedAssets.fulfilled, (state, action: PayloadAction<any>) => {
            state.createdAssets = action.payload;
        });
        builder.addCase(loadOptedAsset.fulfilled, (state, action: PayloadAction<any>) => {
            state.optedAssets.push(action.payload);
        });
    },
});

export const { logout, resetOptedAssets } = accountSlice.actions
export default accountSlice.reducer