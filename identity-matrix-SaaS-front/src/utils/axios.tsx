import axios, { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "store/hooks";
import {
  logout,
  resetAuthSlice
} from "store/slices/auth.slice";
import { resetCardSlice } from "store/slices/card.slice";
import { resetListSlice } from "store/slices/list.slice";
import {
  resetTransactionsSlice,
  resetUpdateUser,
} from "store/slices/transactions.slice";
import { resetUser } from "store/slices/user.slice";
const baseUrl = process.env.REACT_APP_BASE_URL;
interface Props {
  children: any;
}

function getLocalAccessToken() {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken;
}

const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": process.env.REACT_APP_CLIENT_URL
  },
});

interface Props {
  children: any;
}

instance.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const AxiosInterceptor: React.FC<Props> = ({ children }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isSet, setIsSet] = useState(false);
  useEffect(() => {
    setIsSet(true);
    const resInterceptor = (response: AxiosResponse) => {
      return response;
    };
    const errInterceptor = (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        dispatch(logout());
        dispatch(resetAuthSlice());
        dispatch(resetCardSlice());
        dispatch(resetListSlice());
        dispatch(resetTransactionsSlice());
        dispatch(resetUpdateUser());
        navigate("/signin");
        toast.error("Sign in to continue");
      } else if (error.response && error.response.status === 403) {
        dispatch(logout());
        dispatch(resetAuthSlice());
        dispatch(resetCardSlice());
        dispatch(resetListSlice());
        dispatch(resetTransactionsSlice());
        dispatch(resetUser());
        dispatch(resetUpdateUser());
        navigate("/signin");
        toast.error("Something went wrong");
      }
      return Promise.reject(error);
    };
    const interceptor = instance.interceptors.response.use(
      resInterceptor,
      errInterceptor
    );
    return () => instance.interceptors.response.eject(interceptor);
  }, []);
  return isSet && children;
};
export default instance;
