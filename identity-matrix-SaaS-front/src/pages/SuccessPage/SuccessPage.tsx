import Button from "components/atoms/Button/Button";
import React from "react";
import styles from "./style.module.scss";
import SvgIcons from "components/atoms/SvgRender/SvgRender";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

const SuccessPage: React.FC<{closeModal: () => void}> = ({closeModal}): JSX.Element => {
  const navigate = useNavigate();
  return (
    <div className={classNames(styles.container, styles.success)}>
      <div className={styles.box}>
        <SvgIcons iconName="received" />
        <h3>Success</h3>
        <p>Your payment has been successfully received</p>
        <div>
          <Button onClick={closeModal}>Finish</Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
