export interface IAuthState {
  isLoading: boolean;
  errorMessage: string;
  isSuccess: boolean;
  logout: ILogout;
  resetPassword: ILogout;
  signUp: ISignUp;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface ILogout {
  isSuccess: boolean;
  isLoading: boolean;
  isError: null | string;
}

export interface ISignupData {
  email: string;
  password: string;
  first: string;
  last: string;
  company: string;
}

export interface ISignUp {
  isLoading: boolean;
  isSuccess: boolean;
  successMessage: string;
  errorMessage: string | unknown;
}
