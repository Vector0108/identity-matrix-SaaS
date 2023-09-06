import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import {
  ISearchData,
  ISearchDataForm,
  ISearchDataState,
} from "types/data/data.types";

const baseUrl = process.env.REACT_APP_BASE_URL;

const initialState: ISearchDataState = {
  isLoading: false,
  datas: [],
  isSuccess: false,
	errorMessage: '',
  searchData: {
		errorMessage: '',
		data: {} as ISearchData,
    isLoading: false,
    isSuccess: false,
  },
};

export const getSingleData = createAsyncThunk(
  "data/getSingleData",
  async (data: ISearchDataForm, thunkAPI) => {
    try {
      const response = await axios.post(`${baseUrl}data/getSingleData`, data, {
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getSingleDatas = createAsyncThunk(
  "data/getSingleDatas",
  async (queryParams: any, thunkAPI) => {
    try {
      const response = await axios.get(`${baseUrl}data/getSingleDatas`, {
        params: queryParams,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    resetDataSlice: (state) => {
      state.isLoading = false;
      state.datas = [];
      state.isSuccess = false;
      state.errorMessage = "";
      state.searchData.isLoading = false;
      state.searchData.isSuccess = false;
    },
    resetSearchData: (state) => {
      state.searchData.data = {} as ISearchData;
      state.searchData.isLoading = false;
      state.searchData.isSuccess = false;
      state.searchData.errorMessage = "";
    },
    resetSearchDataWithoutData: (state) => {
      state.searchData.isLoading = false;
      state.searchData.isSuccess = false;
      state.searchData.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSingleData.pending, (state, action) => {
      state.searchData.isLoading = true;
    });
    builder.addCase(getSingleData.fulfilled, (state, action) => {
      state.searchData.isLoading = false;
      state.searchData.errorMessage = "";
      state.searchData.data = action.payload;
      state.searchData.isSuccess = true;
    });
    builder.addCase(getSingleData.rejected, (state, action) => {
      state.searchData.isLoading = false;
      state.searchData.errorMessage = action.payload;
      state.searchData.data = {} as ISearchData;
      state.searchData.isSuccess = false;
    });
    builder.addCase(getSingleDatas.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getSingleDatas.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = "";
      state.datas = action.payload;
      state.isSuccess = true;
    });
    builder.addCase(getSingleDatas.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
      state.datas = [];
      state.isSuccess = false;
    });
  },
});

export const { resetDataSlice, resetSearchData, resetSearchDataWithoutData } =
  dataSlice.actions;
