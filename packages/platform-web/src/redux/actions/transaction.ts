import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {A_Asset} from "@algodesk/core";


export interface AssetActions {
    show: boolean,
    txId: string
}

const initialState: AssetActions = {
    show: false,
    txId: ''
}

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        showTransactionDetails: (state, action: PayloadAction<string> ) => {
            state.show = true;
            state.txId = action.payload;
        },
        hideTransactionDetails: (state, action: PayloadAction<A_Asset>) => {
            state.show = false;
            state.txId = '';
        }
    }
});

export const { showTransactionDetails, hideTransactionDetails } = transactionSlice.actions
export default transactionSlice.reducer