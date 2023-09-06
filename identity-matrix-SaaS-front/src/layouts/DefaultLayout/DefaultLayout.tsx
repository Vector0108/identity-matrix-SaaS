import React from "react";
import Header from "../../components/molecules/Header/Header";

const DefaultLayout: React.FC<any> = ({ children }) => {
  return (
    <>
      <Header loggedIn={false} />
      {children}
    </>
  );
};

export default DefaultLayout;
