import React from "react";
import styles from "./styles.module.scss";
import { IButton } from "../../../types/components/button.type";
import classNames from "classnames";

const Button: React.FC<IButton> = ({
  onClick,
  type,
  className,
  style,
  children,
  disabled,
  action,
}) => {
  const buttonClass = classNames(
    styles.button,
    type === "secondary" && styles.button_secondary,
    type === "outline" && styles.button_outline,
    type === "smoke" && styles.button_smoke,
    type === "white" && styles.button_white,
    className
  );
  return (
    <button
      onClick={onClick}
      className={buttonClass}
      style={style}
      disabled={disabled}
      type={action}
    >
      {children}
    </button>
  );
};

export default Button;
