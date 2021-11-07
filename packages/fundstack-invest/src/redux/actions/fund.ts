import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {handleException} from "./exception";
import fundstackSdk from "../../utils/fundstackSdk";
import {Fund} from "@algodesk/fundstack-sdk";


export interface FundDetails {
    loading: boolean,
    fund?: Fund
}

const initialState: FundDetails = {
    loading: false
}

export const loadFund = createAsyncThunk(
    'fund/loadFund',
    async (id: number, thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            dispatch(setLoading(true));
            const fund = await fundstackSdk.fundstack.get(id);
            const fundInfo = JSON.parse(JSON.stringify(fund));
            dispatch(setLoading(false));
            return fundInfo;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(setLoading(false));
        }
    }
);

export const fundSlice = createSlice({
    name: 'fund',
    initialState,
    reducers: {
        setLoading: (state , action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadFund.fulfilled, (state, action: PayloadAction<any>) => {
            state.fund = action.payload;
        })
    },
});

export const {setLoading} = fundSlice.actions
export default fundSlice.reducer