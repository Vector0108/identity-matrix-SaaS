import React, { useEffect } from "react";
import styles from "./style.module.scss";
import Button from "../../components/atoms/Button/Button";
import { useForm } from "react-hook-form";
import Input from "../../components/atoms/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  getUser,
  resetUpdateUser,
  updateUser,
  updateUserPassword,
} from "store/slices/user.slice";
import { toast } from "react-toastify";
import Loading from "components/atoms/Loading/Loading";
import UpdatePasswordPage from "pages/UpdatePassword/UpdatePassword";
import Transactions from "components/molecules/Transactions/Transactions";
import Balance from "components/atoms/Balance/Balance";

const MyAccount: React.FC = () => {
  const { isSuccess, data } = useAppSelector((state) => state.user);
  const updated = useAppSelector((state) => state.user.updateUser.isSuccess);
  const successMessage = useAppSelector(
    (state) => state.user.updateUser.successMessage
  );
  const errorMessage = useAppSelector(
    (state) => state.user.updateUser.errorMessage
  );
  const isLoading = useAppSelector((state) => state.user.updateUser.isLoading);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onBlur",
  });

  const save = (newData: any) => {
    if (
      data.email === newData.email &&
      data.first === newData.name &&
      data.last === newData.lastName
    ) {
      return;
    }
    if (
      data.email === newData.email &&
      data.first !== newData.name &&
      data.last !== newData.lastName
    ) {
      dispatch(updateUser({ name: newData.name, lastName: newData.lastName }));
    } else if (
      data.email === newData.email &&
      data.first === newData.name &&
      data.last !== newData.lastName
    ) {
      dispatch(updateUser({ lastName: newData.lastName }));
    } else if (
      data.email !== newData.email &&
      data.first === newData.name &&
      data.last === newData.lastName
    ) {
      dispatch(updateUser({ email: newData.email }));
    } else if (
      data.email === newData.email &&
      data.first !== newData.name &&
      data.last === newData.lastName
    ) {
      dispatch(updateUser({ name: newData.name }));
    } else {
      dispatch(updateUser(newData));
    }
  };

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setValue("name", data.first);
      setValue("email", data.email);
      setValue("lastName", data.last);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (updated && successMessage) {
      toast.success(successMessage);
      dispatch(resetUpdateUser());
    }
    if (errorMessage) {
      toast.error(String(errorMessage));
      dispatch(resetUpdateUser());
    }
  }, [updated, errorMessage, successMessage]);

  return !isLoading ? (
    <div className={styles.main}>
      <div className={styles.main_container}>
        <h1 className={styles.main_container_title}>My Account</h1>
        <div className={styles.seperator} />
        <form
          className={styles.main_container_details}
          onSubmit={handleSubmit(save)}
        >
          <div className={styles.main_container_details_inputs}>
            <div className={styles.main_container_details_inputs}>
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
              <Input
                type="text"
                name="name"
                errors={errors}
                register={register}
                validationSchema={{
                  required: "Name is required",
                  pattern: {
                    value: /^[a-z,A-Z]+$/,
                    message: "Name must be only letters",
                  },
                }}
                placeholder="Name"
              />
              <Input
                type="text"
                name="lastName"
                errors={errors}
                register={register}
                validationSchema={{
                  required: "Last name is required",
                  pattern: {
                    value: /^[a-z,A-Z]+$/,
                    message: "Last name must be only letters",
                  },
                }}
                placeholder="Last Name"
              />
            </div>
            <div className={styles.main_container_details_actions}>
              <Button onClick={() => handleSubmit(save)}>Save Changes</Button>
              <Button onClick={() => navigate("/")} type="smoke">
                Cancel
              </Button>
            </div>
          </div>
        </form>
        <div className={styles.main_container_details}>
          <UpdatePasswordPage />
        </div>
      </div>
      <div className={styles.balance}>
        <div className={styles.balance_box}>
          <h1>Transactions</h1>
          <Balance />
        </div>
        <Transactions />
      </div>
    </div>
  ) : (
    <div style={{ position: "absolute", width: "100%", height: "100vh" }}>
      <Loading />
    </div>
  );
};

export default MyAccount;
