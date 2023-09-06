import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { ITransactionState } from "types/transaction/transaction.type";

const baseUrl = process.env.REACT_APP_BASE_URL;

const initialState: ITransactionState = {
  isLoading: false,
  data: [],
  isSuccess: false,
  errorMessage: "",
};

export const getTransactions = createAsyncThunk(
  "transactions/getTransactions",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${baseUrl}transaction`, {
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const transactionSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUpdateUser: (state) => {
      state.errorMessage = "";
      state.data = [];
      state.isLoading = false;
      state.isSuccess = false;
    },
    resetTransactionsSlice: (state) => {
      state.isLoading = false
      state.data = []
      state.isSuccess = false
      state.errorMessage = ""
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getTransactions.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getTransactions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = "";
      state.data = action.payload;
      state.isSuccess = true;
    });
    builder.addCase(getTransactions.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
      state.data = [];
      state.isSuccess = false;
    });
  },
});

export const { resetUpdateUser, resetTransactionsSlice } = transactionSlice.actions;
