import React from "react";
import styles from "./style.module.scss";
import classNames from "classnames";
import { ITopMessage } from "types/components/topMessage.type";

const TopMessage: React.FC<ITopMessage> = ({ children, type }) => {
  const messageClass = classNames(
    styles.message,
    type === "error" && styles.message_error,
    type === "warning" && styles.message_warning
  );
  return <div className={messageClass}>{children}</div>;
};

export default TopMessage;
