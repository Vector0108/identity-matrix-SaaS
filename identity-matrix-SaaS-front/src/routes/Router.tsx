import { Navigate, Route, Routes, defer } from "react-router-dom";
import Signup from "../pages/Signup/Signup";
import Signin from "../pages/Signin/Signin";
import UpdatePasswordPage from "../pages/UpdatePassword/UpdatePassword";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import ResetPasswordPage from "../pages/ResetPassword/ResetPassword";
import MyAccount from "../pages/MyAccount/MyAccount";
import Home from "../pages/Home/Home";
import AccessDenied from "../pages/AccessDenied/AccessDenied";
import React, { useEffect } from "react";
import Protected from "layouts/ProtectedLayout/ProtectedLayout";
import ProtectedBack from "layouts/ProtectedLayout/ProtecteBack";
import Main from "pages/Main/Main";
import Error from "pages/Error/Error";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getUser } from "store/slices/user.slice";
import ConditionalRoute from "layouts/ProtectedLayout/ConditionalRoute";
import SearchData from "pages/SearchData/SearchData";
import EmailVerify from "pages/EmailVerify/EmailVerify";

const MyRouter: React.FunctionComponent = () => {
  const { data: user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return (
    <Routes>
      <Route
        path="/"
        element={
            <Protected>
              <Home />
            </Protected>
        }
      />
      <Route
        path="/searchData"
        element={
          <Protected>
            <SearchData />
          </Protected>
        }
      />
      <Route
        path="/user/updatePassword"
        element={
          <Protected>
            <UpdatePasswordPage />
          </Protected>
        }
      />
      <Route
        path="/resetPassword"
        element={
          <ProtectedBack>
            <ResetPasswordPage />
          </ProtectedBack>
        }
      />
      <Route
        path="/user/myAccount"
        element={
          <Protected>
            <MyAccount />
          </Protected>
        }
      />
      <Route path="/accessDenied" element={<AccessDenied />} />
      <Route
        path="/signup"
        element={
          <ProtectedBack>
            <Signup />
          </ProtectedBack>
        }
      />
      <Route
        path="/signin"
        element={
          <ProtectedBack>
            <Signin />
          </ProtectedBack>
        }
      />
      <Route
        path="/welcome"
        element={
          <ProtectedBack>
            <Main />
          </ProtectedBack>
        }
      />
      <Route path="/auth/verifyEmail/:token" element={<EmailVerify />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default MyRouter;
