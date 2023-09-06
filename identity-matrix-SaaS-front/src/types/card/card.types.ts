export interface ICard {
  brand: string;
  last4: string;
  cardId: string;
}

export interface IPayment {
  isLoading: boolean;
  successMessage: string;
  isSuccess: boolean;
  errorMessage: string | unknown;
}

export interface ICardState {
  isLoading: boolean;
  data: ICard[];
  isSuccess: boolean;
  errorMessage: string | unknown;
  payment: IPayment;
  deleteCard: IDeleteCard;
}

export interface IDeleteCard {
  isLoading: boolean;
  successMessage: string;
  isSuccess: boolean;
  errorMessage: string | unknown;
}
