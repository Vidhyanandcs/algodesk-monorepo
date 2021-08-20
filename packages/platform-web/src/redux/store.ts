import { configureStore } from '@reduxjs/toolkit';
import snackbarReducer from './actions/snackbar';
import settingsReducer from "./actions/settings";
import connectWalletReducer from "./actions/connectWallet";
import networkReducer from "./actions/network";

export const store = configureStore({
    reducer: {
        snackbar: snackbarReducer,
        settings: settingsReducer,
        connectWallet: connectWalletReducer,
        network: networkReducer
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch