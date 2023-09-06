import React from "react";
import styles from "./style.module.scss";

const Loading: React.FC<any> = ({ height, background }) => {
  return (
    <div
      className={styles.spinner_container}
      style={{
        height: height || "100vh",
        background: background || "transparent",
      }}
    >
      <div className={styles.loading_spinner}></div>
    </div>
  );
};

export default Loading;
