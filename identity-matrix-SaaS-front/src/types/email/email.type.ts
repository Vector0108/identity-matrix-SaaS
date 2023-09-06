export interface IEmailState {
  isLoading: boolean;
  isSuccess: boolean;
  errorMessage: string | unknown;
  successMessage: string;
  sendAgain: sendAgain;
}

export interface sendAgain {
  isLoading: boolean;
  isSuccess: boolean;
  errorMessage: string | unknown;
  successMessage: string;
}
