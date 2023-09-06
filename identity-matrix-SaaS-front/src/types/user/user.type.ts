export interface IUser {
  _id: string;
  company: string;
  credits: number;
  email: string;
  first: string;
  last: string;
  unlimitedCredits: boolean;
  partner: boolean;
  firstLogin: boolean;
  verifiedEmail: boolean;
  sentEmail: boolean;
}

export interface IUpdateUser {
  isSuccess: boolean;
  isLoading: boolean;
  errorMessage: string | unknown;
  successMessage: string;
}

export interface IUserState {
  isLoading: boolean;
  isSuccess: boolean;
  data: IUser;
  errorMessage: string | unknown;
  updateUser: IUpdateUser;
}
