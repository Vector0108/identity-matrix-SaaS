import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import style from "./style.module.scss";
import Input from "../../components/atoms/Input/Input";
import Logo from "../../assets/iamges/logo.png";
import Button from "../../components/atoms/Button/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { ISignupData } from "types/auth/auth.type";
import Cookies from "js-cookie";
import { resetSignIn, resetSignUp, signUp } from "store/slices/auth.slice";
import { useAppDispatch, useAppSelector } from "store/hooks";
import Loading from "components/atoms/Loading/Loading";
const baseURL: string = process.env.REACT_APP_BASE_URL || "";

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignupData>();
  const { isLoading, successMessage, errorMessage } = useAppSelector(
    (state) => state.auth.signUp
  );

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSignUp = async (data: ISignupData) => {
    dispatch(signUp(data));
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(resetSignUp());
      dispatch(resetSignIn());
      navigate("/signin");
    }
    if (errorMessage) {
      toast.error(String(errorMessage));
      dispatch(resetSignUp());
    }
  }, [successMessage, errorMessage]);

  return !isLoading ? (
    <div className={style.signup_container}>
      <div className={style.logo}>
        <img
          className={style.img}
          src={Logo}
          alt="logo"
          onClick={() => navigate("/welcome")}
        />
      </div>
      <div className={style.form_wrapper}>
        <form onSubmit={handleSubmit(handleSignUp)} className={style.form}>
          <h1 className={style.title}>Create an Account</h1>
          <div className={style.inputs}>
            <div className={style.inputs_row}>
              <Input
                type="text"
                name="first"
                errors={errors}
                register={register}
                validationSchema={{
                  required: "First name is required",
                  pattern: {
                    value: /^[a-z,A-Z]+$/,
                    message: "Name must be only letters",
                  },
                }}
                placeholder="First Name"
              />
              <Input
                type="text"
                name="last"
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
              name="company"
              errors={errors}
              register={register}
              validationSchema={{
                required: "Company is required",
              }}
              placeholder="Company"
            />
            <Input
              type="password"
              name="password"
              errors={errors}
              register={register}
              validationSchema={{
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
                  message:
                    "Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character",
                },
              }}
              placeholder="Password"
            />
          </div>
          <div className={style.button_wrapper}>
            <Button type="secondary">Create account</Button>
          </div>
          <p className={style.desc}>
            Have an account?
            <Link to={"/signin"} className={style.link}>
              {" "}
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Signup;
