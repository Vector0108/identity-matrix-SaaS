import React from "react";
import styles from "./style.module.scss";
import Button from "components/atoms/Button/Button";
import { useNavigate } from "react-router-dom";

const Error: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    } else {
      navigate("/welcome");
    }
  };
  return (
    <div className={styles.container}>
      <h1>404</h1>
      <p>Page not found</p>
      <Button onClick={() => handleClick()}>Go Home</Button>
    </div>
  );
};

export default Error;
