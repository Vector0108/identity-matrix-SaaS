export interface IListItem {
  name: string;
  downloadURL: string;
  createdAt: string;
  loading?: boolean;
}

export interface IUpload {
  isLoading: boolean;
  errorMessage: string;
  isSuccess: boolean;
}

export interface IListState {
  isLoading: boolean;
  lists: IListItem[];
  errorMessage: string;
  isSuccess: boolean;
  uploadData: IUpload;
}
