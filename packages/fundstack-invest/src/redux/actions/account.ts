import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {
    A_AccountInformation
} from "@algodesk/core";
import {handleException} from "./exception";
import {showLoader, hideLoader} from './loader';
import fSdk from "../../utils/fSdk";
import {REACT_APP_API_BASE_URL} from "../../env";
import {setLoading} from "./pools";
import {F_DB_POOL} from "@fundstack/sdk";


export interface Account {
    loggedIn: boolean
    information: A_AccountInformation
    investments: {
        loading: boolean,
        pools: F_DB_POOL[]
    }
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
    investments: {
        loading: false,
        pools: []
    }
}

export const loadAccount = createAsyncThunk(
    'account/loadAccount',
    async (address: string, thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            dispatch(showLoader("Loading account information ..."));
            const accountInfo = await fSdk.fs.algodesk.accountClient.getAccountInformation(address);
            dispatch(loadInvestedPools(accountInfo.address));
            dispatch(hideLoader());
            return accountInfo;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const loadInvestedPools = createAsyncThunk(
    'pools/loadInvestedPools',
    async (address: string, thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            dispatch(setInvestmentsLoading(true));
            let pools = await fSdk.fs.getInvestedPools(REACT_APP_API_BASE_URL, address);
            pools = pools.sort((a, b) => {
                return b.app_id - a.app_id;
            });
            dispatch(setInvestmentsLoading(false));

            return pools;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(setLoading(false));
        }
    }
);

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        logout: (state) => {
            state.loggedIn = initialState.loggedIn;
            state.information = initialState.information;
            state.investments = initialState.investments
            fSdk.signer.logout();
            localStorage.removeItem("signer");
            localStorage.removeItem("address");
        },
        setInvestmentsLoading: (state, action: PayloadAction<boolean>) => {
            state.investments.loading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadAccount.fulfilled, (state, action: PayloadAction<any>) => {
            state.loggedIn = true;
            state.information = action.payload;
        });
        builder.addCase(loadInvestedPools.fulfilled, (state, action: PayloadAction<F_DB_POOL[]>) => {
            state.investments.pools = action.payload;
        });
    },
});

export const { logout, setInvestmentsLoading } = accountSlice.actions
export default accountSlice.reducer