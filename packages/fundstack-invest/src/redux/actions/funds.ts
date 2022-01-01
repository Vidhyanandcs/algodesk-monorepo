import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {handleException} from "./exception";
import fundstackSdk from "../../utils/fundstackSdk";
import {F_DB_FUND} from "@fundstack/sdk";
import {REACT_APP_API_BASE_URL} from "../../env";

export interface Funds {
    loading: boolean,
    list: F_DB_FUND[]
}

const initialState: Funds = {
    loading: false,
    list: []
}

export const loadFunds = createAsyncThunk(
    'funds/loadFunds',
    async (_, thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            dispatch(setLoading(true));
            let funds = await fundstackSdk.fundstack.getPublishedFunds(REACT_APP_API_BASE_URL);
            funds = funds.sort((a, b) => {
                return b.app_id - a.app_id;
            });

            dispatch(setLoading(false));
            return funds;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(setLoading(false));
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
            state.list = action.payload;
        })
    },
});

export const { setLoading } = fundsSlice.actions
export default fundsSlice.reducer