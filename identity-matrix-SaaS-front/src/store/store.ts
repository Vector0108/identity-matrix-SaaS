import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/auth.slice";
import { listsSlice } from "./slices/list.slice";
import { userSlice } from "./slices/user.slice";
import { transactionSlice } from "./slices/transactions.slice";
import { cardSlice } from "./slices/card.slice";
import { dataSlice } from "./slices/data.slice";
import { emailSlice } from "./slices/email.slice";

const reducer = combineReducers({
  auth: authSlice.reducer,
  lists: listsSlice.reducer,
  user: userSlice.reducer,
  transactions: transactionSlice.reducer,
  cards: cardSlice.reducer,
  data: dataSlice.reducer,
  email: emailSlice.reducer,
});

const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
