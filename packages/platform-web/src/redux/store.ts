import { configureStore } from '@reduxjs/toolkit';
import snackbarReducer from './actions/snackbar';
import settingsReducer from "./actions/settings";
import connectWalletReducer from "./actions/connectWallet";
import networkReducer from "./actions/network";
import loaderReducer from "./actions/loader";
import signerReducer from "./actions/signer";
import accountReducer from "./actions/account";
import assetActionsReducer from "./actions/assetActions";

export const store = configureStore({
    reducer: {
        snackbar: snackbarReducer,
        settings: settingsReducer,
        connectWallet: connectWalletReducer,
        network: networkReducer,
        loader: loaderReducer,
        signer: signerReducer,
        account: accountReducer,
        assetActions: assetActionsReducer
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch