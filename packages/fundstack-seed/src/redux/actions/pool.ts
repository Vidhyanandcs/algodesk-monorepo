import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {handleException} from "./exception";
import fSdk from "../../utils/fSdk";
import {F_AccountActivity, Pool} from "@fundstack/sdk";
import {hideLoader, showLoader} from "./loader";
import {showSuccessModal} from "./successModal";
import {loadAccount} from "./account";
import party from "party-js";


export interface PoolDetails {
    loading: boolean,
    pool?: Pool,
    account: {
        activity: {
            loading: boolean,
            list: F_AccountActivity[]
        }
    },
    action: string
}

const initialState: PoolDetails = {
    loading: false,
    account: {
        activity: {
            loading: false,
            list: []
        }
    },
    action: ''
}

export const loadPool = createAsyncThunk(
    'pool/loadPool',
    async (id: number, thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            dispatch(resetPool());
            dispatch(setLoading(true));
            const pool = await fSdk.fs.getPool(id);
            const poolInfo = JSON.parse(JSON.stringify(pool));
            dispatch(getAccountActivity(id));
            dispatch(setLoading(false));
            return poolInfo;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(setLoading(false));
        }
    }
);

export const create = createAsyncThunk(
    'pool/create',
    async (data: any, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;

            dispatch(showLoader("Creating pool ..."));
            const {txId} = await fSdk.fs.createPool(data.poolParams, data.metadata);
            dispatch(hideLoader());

            dispatch(showLoader("Waiting for confirmation ..."));
            await fSdk.fs.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());

            dispatch(showSuccessModal("Pool created successfully"));
            dispatch(loadAccount(address));

            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const publish = createAsyncThunk(
    'pool/publish',
    async (poolId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;


            dispatch(showLoader("Publishing ..."));
            const {txId} = await fSdk.fs.publish(poolId);
            dispatch(hideLoader());

            dispatch(showLoader("Waiting for confirmation ..."));
            await fSdk.fs.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());

            dispatch(showSuccessModal("Published successfully"));
            dispatch(loadAccount(address));
            dispatch(loadPool(poolId));
            dispatch(setAction(''));
            party.confetti(document.querySelector('body'), {
                count: party.variation.range(200, 300),
                size: party.variation.range(1, 1.4),
            });

            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const withdraw = createAsyncThunk(
    'pool/withdraw',
    async (poolId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;


            dispatch(showLoader("Withdrawing ..."));
            const {txId} = await fSdk.fs.ownerWithdraw(poolId);
            dispatch(hideLoader());

            dispatch(showLoader("Waiting for confirmation ..."));
            await fSdk.fs.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());

            dispatch(showSuccessModal("Withdrawn successfully"));
            dispatch(loadAccount(address));
            dispatch(loadPool(poolId));
            dispatch(setAction(''));

            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const claim = createAsyncThunk(
    'pool/claim',
    async (data: any, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;


            dispatch(showLoader("Claiming amount ..."));
            const {txId} = await fSdk.fs.ownerClaim(data.poolId, data.unsoldAssetAction);
            dispatch(hideLoader());

            dispatch(showLoader("Waiting for confirmation ..."));
            await fSdk.fs.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());

            dispatch(showSuccessModal("Claimed successfully"));
            dispatch(loadAccount(address));
            dispatch(loadPool(data.poolId));
            dispatch(setAction(''));

            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);


export const getAccountActivity = createAsyncThunk(
    'pool/getAccountActivity',
    async (poolId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            if (account.loggedIn) {
                dispatch(setActivityLoading(true));
                const list = await fSdk.fs.getAccountPoolActivity(poolId, account.information.address);
                return list.reverse();
            }
        }
        catch (e: any) {
            dispatch(setActivityLoading(false));
            dispatch(handleException(e));
        }
    }
);

export const poolSlice = createSlice({
    name: 'pool',
    initialState: {
        ...initialState
    },
    reducers: {
        setLoading: (state , action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setAction: (state , action: PayloadAction<string>) => {
            state.action = action.payload;
        },
        setActivityLoading: (state , action: PayloadAction<boolean>) => {
            state.account.activity.loading = action.payload;
        },
        resetPool: state => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(loadPool.fulfilled, (state, action: PayloadAction<any>) => {
            state.pool = action.payload;
        });
        builder.addCase(create.fulfilled, (state, action: PayloadAction<any>) => {

        });
        builder.addCase(publish.fulfilled, (state, action: PayloadAction<any>) => {

        });
        builder.addCase(getAccountActivity.fulfilled, (state, action: PayloadAction<any>) => {
            state.account.activity = {
                loading: false,
                list: action.payload
            };
        });
    },
});

export const {setLoading, resetPool, setAction, setActivityLoading} = poolSlice.actions
export default poolSlice.reducer