import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import axios1 from "axios";
import { ICardState } from "types/card/card.types";

const baseUrl = process.env.REACT_APP_BASE_URL;

const initialState: ICardState = {
  isLoading: false,
  data: [],
  isSuccess: false,
  errorMessage: "",
  payment: {
    isLoading: false,
    successMessage: "",
    isSuccess: false,
    errorMessage: "",
  },
  deleteCard: {
    isLoading: false,
    successMessage: "",
    isSuccess: false,
    errorMessage: "",
  },
};

export const getCards = createAsyncThunk(
  "card/getCards",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${baseUrl}user/cards`, {
        withCredentials: true,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const paySelectedCard = createAsyncThunk(
  "card/payWithSelected",
  async (data: any, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseUrl}payment/createPayment`,
        { token: data.card, amount: data.amount, cardDetails: data.cardType },
        {
          withCredentials: true,
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const deleteCard = createAsyncThunk(
  "card/deleteCard",
  async (data: any, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseUrl}payment/deleteCard`,
        { cardId: data },
        {
          withCredentials: true,
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const handlePay = createAsyncThunk(
  "card/handlePay",
  async (data: any, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseUrl}payment/createPayment`,
        {
          token: data.token,
          amount: data.amount,
          cardDetails: data.save
            ? {
                cardType: data.token.card.brand,
                last4: data.token.card.last4,
                cardId: data.token.card.id,
              }
            : null,
        },
        {
          withCredentials: true,
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    resetPayment: (state) => {
      state.payment.errorMessage = "";
      state.payment.successMessage = "";
      state.payment.isLoading = false;
      state.payment.isSuccess = false;
    },
    resetDeleteCard: (state) => {
      state.deleteCard.errorMessage = "";
      state.deleteCard.isLoading = false;
      state.deleteCard.isSuccess = false;
      state.deleteCard.errorMessage = "";
    },
    resetCardSlice: (state) => {
      state.isLoading = false;
      state.data = [];
      state.isSuccess = false;
      state.errorMessage = "";
      state.payment.isLoading = false;
      state.payment.successMessage = "";
      state.payment.isSuccess = false;
      state.payment.errorMessage = "";
      state.deleteCard.isLoading = false;
      state.deleteCard.successMessage = "";
      state.deleteCard.isSuccess = false;
      state.deleteCard.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCards.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getCards.fulfilled, (state, action) => {
      state.isLoading = false;
      state.errorMessage = "";
      state.data = action.payload;
      state.isSuccess = true;
    });
    builder.addCase(getCards.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
      state.data = [];
      state.isSuccess = false;
    });
    builder.addCase(paySelectedCard.pending, (state, action) => {
      state.payment.isLoading = true;
    });
    builder.addCase(paySelectedCard.fulfilled, (state, action) => {
      state.payment.isLoading = false;
      state.payment.errorMessage = "";
      state.payment.successMessage = action.payload;
      state.payment.isSuccess = true;
    });
    builder.addCase(paySelectedCard.rejected, (state, action) => {
      state.payment.isLoading = false;
      state.payment.errorMessage = action.payload;
      state.payment.successMessage = "";
      state.payment.isSuccess = false;
    });
    builder.addCase(handlePay.pending, (state, action) => {
      state.payment.isLoading = true;
    });
    builder.addCase(handlePay.fulfilled, (state, action) => {
      state.payment.isLoading = false;
      state.payment.errorMessage = "";
      state.payment.successMessage = action.payload.status === "Unlimited" ? action.payload.status : action.payload;
      state.payment.isSuccess = true;
    });
    builder.addCase(handlePay.rejected, (state, action) => {
      state.payment.isLoading = false;
      state.payment.errorMessage = action.payload;
      state.payment.successMessage = "";
      state.payment.isSuccess = false;
    });
    builder.addCase(deleteCard.pending, (state, action) => {
      state.deleteCard.isLoading = true;
    });
    builder.addCase(deleteCard.fulfilled, (state, action) => {
      state.deleteCard.isLoading = false;
      state.deleteCard.errorMessage = "";
      state.deleteCard.successMessage = action.payload;
      state.deleteCard.isSuccess = true;
    });
    builder.addCase(deleteCard.rejected, (state, action) => {
      state.deleteCard.isLoading = false;
      state.deleteCard.errorMessage = action.payload;
      state.deleteCard.successMessage = "";
      state.deleteCard.isSuccess = false;
    });
  },
});

export const { resetPayment, resetDeleteCard, resetCardSlice } = cardSlice.actions;
