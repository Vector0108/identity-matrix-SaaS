import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import SvgIcons from "components/atoms/SvgRender/SvgRender";
import classNames from "classnames";
import Button from "components/atoms/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { resetEmailState, verifyEmail } from "store/slices/email.slice";
import Loading from "components/atoms/Loading/Loading";

const EmailVerify: React.FC = () => {
  const [iconType, setIconType] = useState<string>("received");
  const { isSuccess, errorMessage, successMessage, isLoading } = useAppSelector(
    (state) => state.email
  );
  const navigate = useNavigate();
  const { token } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(verifyEmail(token || ""));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setIconType("decline");
    } else if (successMessage) {
      setIconType("received");
    }
  }, [isSuccess]);
  return isLoading ? (
    <Loading />
  ) : (
    <div className={classNames(styles.container, styles.success)}>
      <div className={styles.box}>
        <SvgIcons iconName={iconType} />
        <h3>{errorMessage ? "Error" : "Success"}</h3>
        <p>{String(errorMessage) || successMessage}</p>
        <div>
          <Button
            onClick={() => {
              navigate("/");
              dispatch(resetEmailState());
            }}
          >
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
