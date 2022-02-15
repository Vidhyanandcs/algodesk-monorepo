import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {handleException} from "./exception";
import fSdk from "../../utils/fSdk";
import {F_AccountActivity, Pool} from "@fundstack/sdk";
import {hideLoader, showLoader} from "./loader";
import {showSuccessModal} from "./successModal";
import {loadAccount} from "./account";
import {isNumber} from "util";
import {showSnack} from "./snackbar";


export interface PoolDetails {
    loading: boolean,
    pool?: Pool,
    account: {
        registered: boolean,
        invested: boolean,
        claimed: boolean,
        withdrawn: boolean,
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
        registered: false,
        invested: false,
        claimed: false,
        withdrawn: false,
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
            dispatch(setRegistration(id));
            dispatch(setInvestment(id));
            dispatch(setClaim(id));
            dispatch(setWithdraw(id));
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

export const register = createAsyncThunk(
    'pool/register',
    async (poolId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;
            dispatch(showLoader("Registering ..."));
            const {txId} = await fSdk.fs.register(poolId, address);
            dispatch(hideLoader());
            dispatch(showLoader("Waiting for confirmation ..."));
            await fSdk.fs.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            dispatch(setAction(''));
            dispatch(showSuccessModal("Your registration is successful"));
            dispatch(loadAccount(address));
            dispatch(loadPool(poolId));
            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const setRegistration = createAsyncThunk(
    'pool/setRegistration',
     (poolId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            if (account.loggedIn) {
                return fSdk.fs.hasRegistered(account.information, poolId);
            }

            return false;
        }
        catch (e: any) {
            dispatch(handleException(e));
        }
    }
);

export const invest = createAsyncThunk(
    'pool/invest',
    async (data: any, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;

            const {amount, pool} = data;

            if (amount === undefined || amount === null || !isNumber(amount)) {
                dispatch(showSnack({
                    severity: 'error',
                    message: 'Invalid amount'
                }));
                return;
            }

            const minAllocation = fSdk.fs.getMinAllocationInDecimals(pool);
            if (amount < minAllocation) {
                dispatch(showSnack({
                    severity: 'error',
                    message: 'Minimum allocation is ' + minAllocation
                }));
                return;
            }

            const maxAllocation = fSdk.fs.getMaxAllocationInDecimals(pool);
            if (amount > maxAllocation) {
                dispatch(showSnack({
                    severity: 'error',
                    message: 'Maximum allocation is  ' + maxAllocation
                }));
                return;
            }

            const payableAmount = fSdk.fs.calculatePayableAmount(amount, pool);

            dispatch(showLoader("Investing ..."));
            const {txId} = await fSdk.fs.invest(pool.id, address, payableAmount);
            dispatch(hideLoader());
            dispatch(showLoader("Waiting for confirmation ..."));
            await fSdk.fs.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            dispatch(showSuccessModal("Your investment is successful"));
            dispatch(loadAccount(address));
            dispatch(loadPool(pool.id));
            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const setInvestment = createAsyncThunk(
    'pool/setInvestment',
    (poolId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            if (account.loggedIn) {
                return fSdk.fs.hasInvested(account.information, poolId);
            }

            return false;
        }
        catch (e: any) {
            dispatch(handleException(e));
        }
    }
);

export const claimAssets = createAsyncThunk(
    'pool/claimAssets',
    async (poolId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;
            dispatch(showLoader("Claiming assets ..."));
            const {txId} = await fSdk.fs.investorClaim(poolId, address);
            dispatch(hideLoader());
            dispatch(showLoader("Waiting for confirmation ..."));
            await fSdk.fs.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            dispatch(setAction(''));
            dispatch(showSuccessModal("Your claim is successful"));
            dispatch(loadAccount(address));
            dispatch(loadPool(poolId));
            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const setClaim = createAsyncThunk(
    'pool/setClaim',
    (poolId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            if (account.loggedIn) {
                return fSdk.fs.hasClaimed(account.information, poolId);
            }

            return false;
        }
        catch (e: any) {
            dispatch(handleException(e));
        }
    }
);

export const withdrawInvestment = createAsyncThunk(
    'pool/withdrawInvestment',
    async (poolId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;
            dispatch(showLoader("withdrawing investment ..."));
            const {txId} = await fSdk.fs.investorWithdraw(poolId, address);
            dispatch(hideLoader());
            dispatch(showLoader("Waiting for confirmation ..."));
            await fSdk.fs.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            dispatch(setAction(''));
            dispatch(showSuccessModal("Your withdraw is successful"));
            dispatch(loadAccount(address));
            dispatch(loadPool(poolId));
            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const setWithdraw = createAsyncThunk(
    'pool/setWithdraw',
    (poolId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            if (account.loggedIn) {
                return fSdk.fs.hasWithDrawn(account.information, poolId);
            }

            return false;
        }
        catch (e: any) {
            dispatch(handleException(e));
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
        builder.addCase(setRegistration.fulfilled, (state, action: PayloadAction<any>) => {
            state.account.registered = action.payload;
        });
        builder.addCase(setInvestment.fulfilled, (state, action: PayloadAction<any>) => {
            state.account.invested = action.payload;
        });
        builder.addCase(setClaim.fulfilled, (state, action: PayloadAction<any>) => {
            state.account.claimed = action.payload;
        });
        builder.addCase(setWithdraw.fulfilled, (state, action: PayloadAction<any>) => {
            state.account.withdrawn = action.payload;
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