import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import defaxios from "axios";
import { IEmailState } from "types/email/email.type";

const baseUrl = process.env.REACT_APP_BASE_URL;

const initialState: IEmailState = {
  isLoading: false,
  successMessage: "",
  isSuccess: false,
  errorMessage: "",
  sendAgain: {
    isLoading: false,
    successMessage: "",
    isSuccess: false,
    errorMessage: "",
  },
};

export const verifyEmail = createAsyncThunk(
  "email/verify",
  async (data: string, thunkAPI) => {
    try {
      console.log(`${baseUrl}auth/verifyEmail/${data}`)
      const response = await defaxios.get(
        `${baseUrl}auth/verifyEmail/${data}`
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const sendEmailAgain = createAsyncThunk(
  "resendValidationEmail",
  async (token: string, thunkAPI) => {
    try {
      const response = await axios.post(`${baseUrl}auth/resendValidationEmail`, {
        token,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    resetEmailState: (state) => {
      state.isLoading = false;
      state.successMessage = "";
      state.isSuccess = false;
      state.errorMessage = "";
      state.sendAgain.isLoading = false;
      state.sendAgain.successMessage = "";
      state.sendAgain.isSuccess = false;
      state.sendAgain.errorMessage = "";
    },
    resetSendAgain: (state) => {
      state.sendAgain.isLoading = false;
      state.sendAgain.successMessage = "";
      state.sendAgain.isSuccess = false;
      state.sendAgain.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(verifyEmail.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
      state.successMessage = "";
      state.isSuccess = true;
    });
    builder.addCase(verifyEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = "";
      state.successMessage = action.payload;
      state.isSuccess = true;
    });
    builder.addCase(sendEmailAgain.pending, (state, action) => {
      state.sendAgain.isLoading = true;
    });
    builder.addCase(sendEmailAgain.rejected, (state, action) => {
      state.sendAgain.isLoading = false;
      state.sendAgain.errorMessage = action.payload;
      state.sendAgain.successMessage = "";
      state.sendAgain.isSuccess = true;
    });
    builder.addCase(sendEmailAgain.fulfilled, (state, action) => {
      state.sendAgain.isLoading = false;
      state.sendAgain.errorMessage = "";
      state.sendAgain.successMessage = action.payload;
      state.sendAgain.isSuccess = true;
    });
  },
});

export const { resetEmailState, resetSendAgain } = emailSlice.actions;
