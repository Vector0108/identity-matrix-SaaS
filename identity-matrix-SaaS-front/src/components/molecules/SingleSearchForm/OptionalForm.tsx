import Button from "components/atoms/Button/Button";
import Input from "components/atoms/Input/Input";
import React from "react";
import { useForm } from "react-hook-form";
import { ISearchDataForm } from "types/data/data.types";
import styles from "./style.module.scss";
import { useAppDispatch } from "store/hooks";
import { getSingleData } from "store/slices/data.slice";

const OptionalForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISearchDataForm>();

  const dispatch = useAppDispatch();

  const save = (data: ISearchDataForm) => {
    dispatch(getSingleData(data));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(save)} className={styles.form}>
      <Input
        type="text"
        name="email"
        errors={errors}
        register={register}
        validationSchema={{
          required: "Email is required",
          pattern: {
            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, // eslint-disable-line
            message: "Invalid email address",
          },
        }}
        placeholder="Email"
      />
      <Input
        type="text"
        name="phone"
        errors={errors}
        register={register}
        validationSchema={{
          pattern: {
            value: /^[0-9]+$/,
            message: "Phone must be only numbers",
          },
          minLength: {
            value: 10,
            message: "Minimum length 10",
          },
        }}
        placeholder="Phone"
      />
      <div className={styles.box_inputs_row}>
        <Input
          type="text"
          name="city"
          errors={errors}
          register={register}
          placeholder="City"
          validationSchema={{
            pattern: {
              value: /^[a-z,A-Z]+$/,
              message: "City must be only letters",
            },
          }}
        />
        <Input
          type="text"
          name="state"
          errors={errors}
          register={register}
          placeholder="State"
          validationSchema={{
            pattern: {
              value: /^[a-z,A-Z]+$/,
              message: "State must be only letters",
            },
          }}
        />
      </div>
      <div className={styles.box_inputs_half}>
        <Input
          type="text"
          name="zip"
          errors={errors}
          register={register}
          placeholder="Zip"
          validationSchema={{
            pattern: {
              value: /^[0-9]+$/,
              message: "Zip must be only numbers",
            },
          }}
        />
      </div>
      <Button>Search</Button>
    </form>
  );
};

export default OptionalForm;
