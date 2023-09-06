import { IListState } from "./../../types/components/listItem.type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "../../utils/axios";

const baseUrl = process.env.REACT_APP_BASE_URL;
const clientUrl = process.env.REACT_APP_CLIENT_URL;

const initialState: IListState = {
  isLoading: false,
  lists: [],
  errorMessage: "",
  isSuccess: false,
  uploadData: {
    isLoading: false,
    isSuccess: false,
    errorMessage: "",
  },
};

export const getLists = createAsyncThunk(
  "lists/fetchLists",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${baseUrl}list`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const uploadData = createAsyncThunk(
  "lists/uploadList",
  async (file: any, thunkAPI) => {
    try {
      const response = await axios.post(`${baseUrl}data/upload`, file, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": clientUrl,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const listsSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    resetUploadData: (state) => {
      state.uploadData.errorMessage = "";
      state.uploadData.isLoading = false;
      state.uploadData.isSuccess = false;
    },
    resetListSlice: (state) => {
      state.isLoading = false;
      state.lists = [];
      state.errorMessage = "";
      state.isSuccess = false;
      state.uploadData.isLoading = false;
      state.uploadData.isSuccess = false;
      state.uploadData.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLists.pending, (state, _action) => {
      state.isLoading = true;
    });
    builder.addCase(getLists.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.lists = action.payload;
    });
    builder.addCase(getLists.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = "Something went wrong";
    });
    builder.addCase(uploadData.pending, (state, _action) => {
      state.uploadData.isLoading = true;
    });
    builder.addCase(uploadData.fulfilled, (state, action) => {
      state.uploadData.isLoading = false;
      state.uploadData.isSuccess = true;
    });
    builder.addCase(uploadData.rejected, (state, action) => {
      state.uploadData.isLoading = false;
      state.uploadData.isSuccess = false;
      //@ts-ignore
      state.uploadData.errorMessage = action.payload;
    });
  },
});

export const { resetUploadData, resetListSlice } = listsSlice.actions;

export const selectLists = (state: RootState) => state.lists.lists;
export const selectErrorMessage = (state: RootState) =>
  state.lists.errorMessage;
