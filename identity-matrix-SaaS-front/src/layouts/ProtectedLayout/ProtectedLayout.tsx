import Header from "components/molecules/Header/Header";
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { logout, resetAuthSlice } from "store/slices/auth.slice";
import { resetCardSlice } from "store/slices/card.slice";
import { resetListSlice } from "store/slices/list.slice";
import {
  resetTransactionsSlice,
  resetUpdateUser,
} from "store/slices/transactions.slice";
import TopMessage from "components/atoms/TopMessage/TopMessage";
import { resetSendAgain, sendEmailAgain } from "store/slices/email.slice";
import { toast } from "react-toastify";
import { getUser } from "store/slices/user.slice";

const Protected: React.FC<any> = ({ children }: any) => {
  const { data: user } = useAppSelector((state) => state.user);
  const { isSuccess, errorMessage, successMessage, isLoading } = useAppSelector(
    (state) => state.email.sendAgain
  );
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("accessToken");
  let decodedToken: any;
  try {
    decodedToken = jwt_decode(token || "");
    if (Date.now() > decodedToken.exp * 1000) {
      decodedToken = false;
      localStorage.removeItem("accessToken");
      dispatch(logout());
      dispatch(resetAuthSlice());
      dispatch(resetCardSlice());
      dispatch(resetListSlice());
      dispatch(resetTransactionsSlice());
      dispatch(resetUpdateUser());
    }
  } catch (e) {
    decodedToken = false;
    dispatch(logout());
    dispatch(resetAuthSlice());
    dispatch(resetCardSlice());
    dispatch(resetListSlice());
    dispatch(resetTransactionsSlice());
    dispatch(resetUpdateUser());
    localStorage.removeItem("accessToken");
  }
  const childrenWithProps = React.Children.map(children, (child) => {
    if (typeof child.type !== "string") {
      return React.cloneElement(child, { decodedToken });
    }
    return child;
  });

  const handleSendAgain = () => {
    if (token && !user.sentEmail) dispatch(sendEmailAgain(token));
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(String(errorMessage));
      dispatch(getUser());
      dispatch(resetSendAgain());
    } else if (successMessage) {
      toast.success(successMessage);
      dispatch(getUser());
      dispatch(resetSendAgain());
    }
  }, [isSuccess]);

  return (
    <React.Fragment>
      <Header loggedIn={true} token={token || ""} />
      {user._id && !user.verifiedEmail && (
        <TopMessage type="warning">
          <p>
            Please verify your email. Please Check Your Email.{" "}
            { isLoading ? (
              <span
                style={{
                  textDecoration: "underline #4253ff",
                  color: "#4253ff",
                }}
              >
                Please wait...
              </span>
            ) : !user.sentEmail ? (
              <span
                style={{
                  textDecoration: "underline #4253ff",
                  color: "#4253ff",
                  cursor: "pointer",
                }}
                onClick={handleSendAgain}
              >
                Send again
              </span>
            ) : (
              <p></p>
            )}
          </p>
        </TopMessage>
      )}
      {decodedToken ? childrenWithProps : <Navigate to={"/welcome"} />}
    </React.Fragment>
  );
};

export default Protected;
