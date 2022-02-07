import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {A_Nft} from "@algodesk/core";


export interface NftActions {
    selectedNft?: A_Nft | null,
    action: string
}

const initialState: NftActions = {
    action: '',
}

export const nftActionsSlice = createSlice({
    name: 'nftActions',
    initialState,
    reducers: {
        setAction: (state, action: PayloadAction<string> ) => {
            state.action = action.payload;
        },
        setSelectedNft: (state, action: PayloadAction<A_Nft>) => {
            state.selectedNft = action.payload;
        }
    }
});

export const { setAction, setSelectedNft } = nftActionsSlice.actions
export default nftActionsSlice.reducer