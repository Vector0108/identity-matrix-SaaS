import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "../../utils/axios";
import { IAuthState, ILoginData, ISignupData } from "types/auth/auth.type";

const baseUrl = process.env.REACT_APP_BASE_URL;

const initialState: IAuthState = {
  isLoading: false,
  isSuccess: false,
  errorMessage: "",
  logout: {
    isSuccess: false,
    isLoading: false,
    isError: null,
  },
  resetPassword: {
    isSuccess: false,
    isLoading: false,
    isError: null,
  },
  signUp: {
    isSuccess: false,
    isLoading: false,
    successMessage: "",
    errorMessage: "",
  },
};

export const signIn = createAsyncThunk(
  "auth/signin",
  async (data: ILoginData, thunkAPI) => {
    try {
      const response = await axios.post(`${baseUrl}auth/login`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (data: ISignupData, thunkAPI) => {
    try {
      const response = await axios.post(`${baseUrl}auth/register`, data, {
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    localStorage.removeItem("accessToken");
    const resp = await axios.post(
      `${baseUrl}auth/logout`,
      {},
      { withCredentials: true }
    );
    return thunkAPI.fulfillWithValue(resp.data);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email: string, thunkAPI) => {
    try {
      await axios.post(`${baseUrl}auth/requestResetPassword`, {
        email,
      });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.logout.isLoading = false;
      state.logout.isSuccess = false;
      state.logout.isError = null;
    },
    resetSignIn: (state) => {
      state.isSuccess = false;
      state.isLoading = false;
      state.errorMessage = "";
    },
    resetResetPassword: (state) => {
      state.resetPassword.isLoading = false;
      state.resetPassword.isSuccess = false;
      state.resetPassword.isError = null;
    },
    resetSignUp: (state) => {
      state.signUp.isLoading = false;
      state.signUp.isSuccess = false;
      state.signUp.errorMessage = "";
      state.signUp.successMessage = "";
    },
    resetAuthSlice: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = "";
      state.logout.isSuccess = false;
      state.logout.isError = "";
      state.logout.isLoading = false;
      state.resetPassword.isSuccess = false;
      state.resetPassword.isLoading = false;
      state.resetPassword.isError = null;
      state.signUp.isSuccess = false;
      state.signUp.isLoading = false;
      state.signUp.successMessage = "";
      state.signUp.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.pending, (state, _action) => {
      state.isLoading = true;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = "";
      localStorage.setItem("accessToken", action.payload.token);
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.isLoading = false;
      //@ts-ignore
      state.errorMessage = action.payload;
      state.isSuccess = false;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.logout.isLoading = false;
      state.logout.isSuccess = true;
      state.logout.isSuccess = false;
      state.logout.isError = "";
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.logout.isSuccess = false;
      state.logout.isLoading = false;
      state.logout.isError = "Something went wrong...";
    });
    builder.addCase(resetPassword.pending, (state, action) => {
      state.resetPassword.isLoading = true;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.resetPassword.isLoading = false;
      //@ts-ignore
      state.resetPassword.isError = action.payload;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.resetPassword.isLoading = false;
      state.resetPassword.isSuccess = true;
    });
    builder.addCase(signUp.pending, (state, action) => {
      state.signUp.isLoading = true;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.signUp.isLoading = false;
      state.signUp.errorMessage = action.payload;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.signUp.isLoading = false;
      state.signUp.isSuccess = true;
      state.signUp.successMessage = action.payload;
    });
  },
});
export const {
  reset,
  resetSignIn,
  resetResetPassword,
  resetSignUp,
  resetAuthSlice,
} = authSlice.actions;
export const selectErrorMessage = (state: RootState) => state.auth.errorMessage;
