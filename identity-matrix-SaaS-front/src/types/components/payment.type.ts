import { Dispatch, SetStateAction } from "react";

export interface IPaymentForm {
  amount: number;
  paymentLoading: Dispatch<SetStateAction<boolean>>;
  isPaymentLoading: boolean;
}
