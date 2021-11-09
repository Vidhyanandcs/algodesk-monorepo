import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import fundstackSdk from "../../utils/fundstackSdk";
import {hideLoader, showLoader} from "./loader";
import {handleException} from "./exception";
import {showSuccessModal} from "./successModal";
import {loadAccount} from "./account";

export interface Registration {

}

const initialState: Registration = {

}

export const register = createAsyncThunk(
    'registration/register',
    async (fundId: bigint | number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;
            dispatch(showLoader("Registering ..."));
            const txDetails = await fundstackSdk.fundstack.register(Number(fundId), address);
            dispatch(hideLoader());
            dispatch(showSuccessModal("Your registration is successful"));
            dispatch(loadAccount(address));
            return txDetails;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
        })
    },
});

// export const { } = registrationSlice.actions
export default registrationSlice.reducer