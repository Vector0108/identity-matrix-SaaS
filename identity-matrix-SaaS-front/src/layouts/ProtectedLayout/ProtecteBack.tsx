import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedBack = ({ children }: any) => {
  const token = localStorage.getItem("accessToken");
  return (
    <React.Fragment>{token ? <Navigate to={"/"} /> : children}</React.Fragment>
  );
};

export default ProtectedBack;
