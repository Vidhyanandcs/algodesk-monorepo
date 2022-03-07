import { createSlice } from '@reduxjs/toolkit'


export interface App {
    visitedTab: string
}

const initialState: App = {
    visitedTab: 'pools'
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setVisitedTab: (state, action ) => {
            state.visitedTab = action.payload;
        }
    },
});

export const { setVisitedTab } = appSlice.actions
export default appSlice.reducer