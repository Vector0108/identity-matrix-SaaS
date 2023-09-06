export interface ITransaction {
  note: string;
  amount: number;
  type: boolean;
  createdAt: string;
}

export interface ITransactionState {
  isLoading: boolean;
  data: ITransaction[];
  isSuccess: boolean;
  errorMessage: string | unknown;
}
