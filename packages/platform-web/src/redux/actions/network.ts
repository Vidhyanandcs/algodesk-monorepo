import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {NETWORKS} from "@algodesk/core";
import algosdk from "../../utils/algosdk";


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
            algosdk.changeNetwork(state.name);
        },
    },
});

export const { setNetwork } = networkSlice.actions
export default networkSlice.reducer