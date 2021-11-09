import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface successModal {
    show: boolean,
    message: string
}

const initialState: successModal = {
    show: false,
    message: ''
}

export const successModalSlice = createSlice({
    name: 'successModal',
    initialState,
    reducers: {
        showSuccessModal: (state, action: PayloadAction<string> ) => {
            state.show = true;
            state.message = action.payload;
        },
        hideSuccessModal: (state, action: PayloadAction<void>) => {
            state.show = false;
            state.message = '';
        }
    }
});

export const { showSuccessModal, hideSuccessModal } = successModalSlice.actions
export default successModalSlice.reducer