import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { IUser } from "types/user/user.type";
import { IUserState } from "types/user/user.type";

const baseUrl = process.env.REACT_APP_BASE_URL;

const initialState: IUserState = {
  isLoading: false,
  data: {} as IUser,
  isSuccess: false,
  errorMessage: "",
  updateUser: {
    isLoading: false,
    isSuccess: false,
    errorMessage: "",
    successMessage: "",
  },
};

export const getUser = createAsyncThunk("user/getUser", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${baseUrl}user`, {
      withCredentials: true,
    });
    return thunkAPI.fulfillWithValue(response.data);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data: { email?: string; name?: string, lastName?:string }, thunkAPI) => {
    try {
      const response = await axios.post(`${baseUrl}user/update`, data, {
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const disableFirstLogin = createAsyncThunk(
  "user/disableFirstLogin",
  async (_, thunkAPI) => {
    try {
      await axios.get(`${baseUrl}user/disableFirstLogin`, {
        withCredentials:true
      })
    }catch(err:any) {
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const updateUserPassword = createAsyncThunk(
  "user/updateUserPassword",
  async (data: { newPassword: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${baseUrl}user/update`, data, {
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUpdateUser: (state) => {
      state.updateUser.errorMessage = "";
      state.updateUser.successMessage = "";
      state.updateUser.isLoading = false;
      state.updateUser.isSuccess = false;
    },
    resetUser: (state) => {
      state.errorMessage = "";
      state.data = {} as IUser;
      state.isLoading = false;
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.isSuccess = true;
      state.errorMessage = null;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.data = {} as IUser;
      state.isLoading = false;
      state.errorMessage = action.payload;
      state.isSuccess = false;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.updateUser.isLoading = false;
      state.updateUser.errorMessage = "";
      state.updateUser.isSuccess = true;
      state.updateUser.successMessage = action.payload;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.updateUser.isLoading = false;
      state.updateUser.successMessage = "";
      state.updateUser.isSuccess = false;
      state.updateUser.errorMessage = action.payload;
    });
    builder.addCase(updateUser.pending, (state, action) => {
      state.updateUser.isLoading = true;
    });
    builder.addCase(updateUserPassword.fulfilled, (state, action) => {
      state.updateUser.isLoading = false;
      state.updateUser.errorMessage = "";
      state.updateUser.isSuccess = true;
      state.updateUser.successMessage = action.payload;
    });
    builder.addCase(updateUserPassword.rejected, (state, action) => {
      state.updateUser.isLoading = false;
      state.updateUser.successMessage = "";
      state.updateUser.isSuccess = false;
      state.updateUser.errorMessage = action.payload;
    });
    builder.addCase(updateUserPassword.pending, (state, action) => {
      state.updateUser.isLoading = true;
    });
  },
});

export const { resetUpdateUser, resetUser } = userSlice.actions;
