import { configureStore } from '@reduxjs/toolkit';
import snackbarReducer from './actions/snackbar';
import connectWalletReducer from "./actions/connectWallet";
import networkReducer from "./actions/network";
import loaderReducer from "./actions/loader";
import signerReducer from "./actions/signer";
import accountReducer from "./actions/account";
import poolReducer from "./actions/pool";
import successModal from "./actions/successModal";

export const store = configureStore({
    reducer: {
        snackbar: snackbarReducer,
        connectWallet: connectWalletReducer,
        network: networkReducer,
        loader: loaderReducer,
        signer: signerReducer,
        account: accountReducer,
        pool: poolReducer,
        successModal: successModal
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch