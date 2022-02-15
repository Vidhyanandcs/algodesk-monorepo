import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {handleException} from "./exception";
import fSdk from "../../utils/fSdk";
import {F_DB_POOL} from "@fundstack/sdk";
import {REACT_APP_API_BASE_URL} from "../../env";

export interface Pools {
    loading: boolean,
    list: F_DB_POOL[]
}

const initialState: Pools = {
    loading: false,
    list: []
}

export const loadPools = createAsyncThunk(
    'pools/loadPools',
    async (_, thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            dispatch(setLoading(true));
            let pools = await fSdk.fs.getPublishedPools(REACT_APP_API_BASE_URL);
            pools = pools.sort((a, b) => {
                return b.app_id - a.app_id;
            });

            dispatch(setLoading(false));
            return pools;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(setLoading(false));
        }
    }
);

export const poolsSlice = createSlice({
    name: 'pools',
    initialState,
    reducers: {
        setLoading: (state , action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadPools.fulfilled, (state, action: PayloadAction<any>) => {
            state.list = action.payload;
        })
    },
});

export const { setLoading } = poolsSlice.actions
export default poolsSlice.reducer