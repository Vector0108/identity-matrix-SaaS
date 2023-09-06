import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import style from "../Signup/style.module.scss";
import Logo from "../../assets/iamges/logo.png";
import Input from "../../components/atoms/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/atoms/Button/Button";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { resetAuthSlice, signIn } from "store/slices/auth.slice";
import { ILoginData, ISignupData } from "types/auth/auth.type";
import Loading from "components/atoms/Loading/Loading";
const baseURL: string = process.env.REACT_APP_BASE_URL || "";

const Signin: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginData>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, isSuccess, errorMessage } = useAppSelector(
    (state) => state.auth
  );

  const save = async (data: ILoginData) => {
    dispatch(signIn(data));
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (isSuccess && token) {
      navigate("/");
      dispatch(resetAuthSlice())
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(resetAuthSlice())
    }
  }, [isSuccess, errorMessage]);

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
        <form onSubmit={handleSubmit(save)} className={style.form}>
          <h1 className={style.title}>Log In to Identity Matrix</h1>
          <div className={style.inputs}>
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
              type="password"
              name="password"
              errors={errors}
              register={register}
              validationSchema={{
                required: "Password is required",
              }}
              placeholder="Password"
            />
          </div>
          <div className={style.button_wrapper}>
            <Button type="secondary">Sign In</Button>
          </div>
          <p className={style.desc}>
            Don't have an account?
            <Link to={"/signup"} className={style.link}>
              {" "}
              Sign Up
            </Link>
          </p>
          <Link to={"/resetPassword"} className={style.linkForgot}>
            {" "}
            Forgot Password ?
          </Link>
        </form>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Signin;
