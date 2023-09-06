import React, { useEffect } from "react";
import styles from "./style.module.scss";
import Button from "../../components/atoms/Button/Button";
import { useNavigate } from "react-router-dom";
import Input from "components/atoms/Input/Input";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { resetPassword, resetResetPassword } from "store/slices/auth.slice";
import Loading from "components/atoms/Loading/Loading";
import { toast } from "react-toastify";

const ResetPasswordPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();

  const dispatch = useAppDispatch();
  const { isSuccess, isLoading, isError } = useAppSelector(
    (state) => state.auth.resetPassword
  );

  const save = async (data: { email: string }) => {
    dispatch(resetPassword(data.email));
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password Reseted");
      dispatch(resetResetPassword());
      navigate("/signin");
    }
    if (isError) {
      toast.error(isError);
      dispatch(resetResetPassword());
    }
  }, [isSuccess, isError]);
  return (
    <div className={styles.main}>
      <div className={styles.main_container}>
        {isLoading ? (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100vh",
              top: "0",
            }}
          >
            <Loading />
          </div>
        ) : (
          <>
            <img
              src={require("../../assets/png/logo.png")}
              alt="logo"
              className={styles.main_container_logo}
              onClick={() => navigate("/signin")}
            />
            <h1>{isLoading ? "" : "Reset Password"}</h1>
            <form
              onSubmit={handleSubmit(save)}
              className={styles.main_container_form}
            >
              <Input
                type="text"
                name="email"
                errors={errors}
                register={register}
                validationSchema={{
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Invalid email address",
                  },
                }}
                placeholder="Email"
              />
              <Button>Reset Password</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
