import React, { useEffect } from "react";
import styles from "./style.module.scss";
import Input from "../../components/atoms/Input/Input";
import { useForm } from "react-hook-form";
import Button from "../../components/atoms/Button/Button";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { toast } from "react-toastify";
import { resetUpdateUser, updateUserPassword } from "store/slices/user.slice";
import Loading from "components/atoms/Loading/Loading";
import { useNavigate } from "react-router-dom";

const UpdatePasswordPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const isLoading = useAppSelector((state) => state.user.updateUser.isLoading);
  const dispatch = useAppDispatch();

  const save = (data: any) => {
    if(!data.newPassword) {
      toast.error("Password is required")
    } else {
      dispatch(updateUserPassword(data));
    }
  };

  return !isLoading ? (
    <div className={styles.container}>
          <h1>Password settings</h1>
          <div className={styles.container_links}>
            <form
              onSubmit={handleSubmit(save)}
              style={{ width: "100%" }}
            >
              <Input
                type="password"
                name="newPassword"
                errors={errors}
                register={register}
                validationSchema={{
                  pattern: {
                    required: "Password is required",
                    value:
                      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
                    message:
                      "Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character",
                  },
                }}
                placeholder="Password"
              />
              <Button
                style={
                  errors.newPassword ? { border: "1px solid #813efb" } : {}
                }
              >
                Update Password
              </Button>
            </form>
          </div>
        </div>
  ) : (
    <Loading />
  );
};

export default UpdatePasswordPage;
