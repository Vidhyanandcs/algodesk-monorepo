import { createSlice } from '@reduxjs/toolkit'


export interface Settings {
    show: boolean
}

const initialState: Settings = {
    show: false
}

export const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        showSettings: (state ) => {
            state.show = true;
        },
        hideSettings: (state) => {
            state.show = false;
        }
    },
});

export const { showSettings, hideSettings } = snackbarSlice.actions
export default snackbarSlice.reducer