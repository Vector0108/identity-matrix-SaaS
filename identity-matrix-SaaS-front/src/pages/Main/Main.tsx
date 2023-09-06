import React from "react";
import styles from "../Home/style.module.scss";
import Button from "components/atoms/Button/Button";
import { useNavigate } from "react-router-dom";

const Main: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.container}>
        <div className={styles.box}>
          <h1 className={styles.title}>
            Welcome to Identity Matrix Self Serve
          </h1>
          <p className={styles.subtitle}>To get you started please log in.</p>

          <div className={styles.btns}>
            <Button onClick={() => navigate("/signin")}>Log In</Button>
            <Button onClick={() => navigate("/signup")} type="outline">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
