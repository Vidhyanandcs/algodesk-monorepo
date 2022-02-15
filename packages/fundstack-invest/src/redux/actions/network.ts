import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {NETWORKS} from "@algodesk/core";
import fSdk from "../../utils/fSdk";


export interface Network {
    name: string
}

const initialState: Network = {
    name: NETWORKS.MAINNET
}

export const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        setNetwork: (state, action: PayloadAction<any>) => {
            state.name = action.payload;
            fSdk.changeNetwork(action.payload);
        },
    },
});

export const { setNetwork } = networkSlice.actions
export default networkSlice.reducer