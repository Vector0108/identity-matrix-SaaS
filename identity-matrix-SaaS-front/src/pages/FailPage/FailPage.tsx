import Button from "components/atoms/Button/Button";
import React from "react";
import styles from "../SuccessPage/style.module.scss";
import SvgIcons from "components/atoms/SvgRender/SvgRender";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "store/hooks";
import { resetPayment } from "store/slices/card.slice";

const FailPage: React.FC<{closeModal: () => void}> = ({closeModal}): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleGoBack = () => {
    dispatch(resetPayment());
    closeModal()
  };
  return (
    <div className={classNames(styles.container, styles.fail)}>
      <div className={styles.box}>
        <SvgIcons iconName="decline" />
        <h3>Failed</h3>
        <p>Unfortunately payment was rejected</p>
        <div className={styles.box_button}>
          <Button onClick={() => handleGoBack()}>Back</Button>
        </div>
      </div>
    </div>
  );
};

export default FailPage;
