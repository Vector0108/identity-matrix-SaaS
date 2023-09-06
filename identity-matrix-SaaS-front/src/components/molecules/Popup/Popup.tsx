import React, { Children, useEffect } from "react";
import styles from "./style.module.scss";
import { IPopup } from "types/components/popup.type";
import classNames from "classnames";
import Button from "components/atoms/Button/Button";

const Popup: React.FC<IPopup> = ({
  onClose,
  text,
  style,
  className,
  bodyClass,
  buttonText,
  type,
  children,
}) => {
  const [closeAnimation, setCloseAnimation] = React.useState<boolean>(false);
  const popupClass = classNames(className, styles.popup);
  const popupBodyClass = classNames(
    bodyClass,
    styles.popup_body,
    closeAnimation && styles.closeAnimation
  );

  const handleClose = () => {
    setCloseAnimation(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return type === "message" ? (
    <div className={popupClass} style={style}>
      <div className={popupBodyClass}>
        <p>{text}</p>
        <Button onClick={handleClose}>{buttonText ?? "OK !"}</Button>
      </div>
    </div>
  ) : (
    <div className={popupClass} style={style}>
      <div className={popupBodyClass}>
        <div className={styles.wrapper}>
          {children}
          {buttonText !== "" && (
            <Button onClick={handleClose}>{buttonText}</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
