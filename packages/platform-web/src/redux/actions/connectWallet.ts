import { createSlice } from '@reduxjs/toolkit'


export interface ConnectWallet {
    show: boolean
}

const initialState: ConnectWallet = {
    show: false
}

export const connectWalletSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        showConnectWallet: (state ) => {
            state.show = true;
        },
        hideConnectWallet: (state) => {
            state.show = false;
        }
    },
});

export const { showConnectWallet, hideConnectWallet } = connectWalletSlice.actions
export default connectWalletSlice.reducer