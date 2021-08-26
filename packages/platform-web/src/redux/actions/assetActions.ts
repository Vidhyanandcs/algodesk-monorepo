import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {A_Asset} from "@algodesk/core";


export interface AssetActions {
    selectedAsset?: A_Asset,
    action: string
}

const initialState: AssetActions = {
    action: ''
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
        }
    }
});

export const { setAction, setSelectedAsset } = assetActionsSlice.actions
export default assetActionsSlice.reducer