import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {A_Asset, A_BurnerVault} from "@algodesk/core";
import algosdk from "../../utils/algosdk";
import {handleException} from "./exception";


export interface AssetActions {
    selectedAsset?: A_Asset | null,
    action: string,
    burnDetails: {
        loading: boolean,
        burnerVault?: A_BurnerVault
    }
}

export const loadBurnerVault = createAsyncThunk(
    'account/loadBurnerVault',
    async (assetId: number, thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            dispatch(setBurnDetails({
                loading: true
            }));

            const burnerVault = await algosdk.algodesk.assetClient.getBurnerVault(assetId);

            dispatch(setBurnDetails({
                loading: false,
                burnerVault
            }));

            return burnerVault;
        }
        catch (e: any) {
            dispatch(handleException(e));
        }
    }
);

const initialState: AssetActions = {
    action: '',
    burnDetails: {
        loading: false
    }
}

export const assetActionsSlice = createSlice({
    name: 'assetActions',
    initialState,
    reducers: {
        setAction: (state, action: PayloadAction<string> ) => {
            state.action = action.payload;
        },
        setSelectedAsset: (state, action: PayloadAction<A_Asset>) => {
            state.selectedAsset = action.payload;
        },
        setBurnDetails: (state, action: PayloadAction<any>) => {
            state.burnDetails = action.payload;
        }
    }
});

export const { setAction, setSelectedAsset, setBurnDetails } = assetActionsSlice.actions
export default assetActionsSlice.reducer