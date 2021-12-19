import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {handleException} from "./exception";
import fundstackSdk from "../../utils/fundstackSdk";
import {F_DB_FUND} from "@algodesk/fundstack-sdk";
import {NETWORKS} from "@algodesk/core";


export interface Funds {
    loading: boolean,
    funds: F_DB_FUND[]
}

const initialState: Funds = {
    loading: false,
    funds: []
}

export const loadFunds = createAsyncThunk(
    'funds/loadFunds',
    async (address: string = "", thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            const network: string = process.env.REACT_APP_NETWORK;
            let apiBaseUrl = '';
            if (network === NETWORKS.BETANET) {
                apiBaseUrl = 'https://fundstack-serverless-api.vercel.app';
            }
            return await fundstackSdk.fundstack.getPublishedFunds(apiBaseUrl);
        }
        catch (e: any) {
            dispatch(handleException(e));
        }
    }
);

export const fundsSlice = createSlice({
    name: 'funds',
    initialState,
    reducers: {
        setLoading: (state , action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadFunds.fulfilled, (state, action: PayloadAction<any>) => {
            state.funds = action.payload;
        })
    },
});

export const { setLoading } = fundsSlice.actions
export default fundsSlice.reducer