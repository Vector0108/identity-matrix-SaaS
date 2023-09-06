import Button from "components/atoms/Button/Button";
import Input from "components/atoms/Input/Input";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ISearchDataForm } from "types/data/data.types";
import styles from "./style.module.scss";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  getSingleData,
  getSingleDatas,
  resetSearchData,
} from "store/slices/data.slice";
import Loading from "components/atoms/Loading/Loading";
import { toast } from "react-toastify";
import HorizontalTable from "../HorizontalTable/HorizontalTable";
import { prepareForTable } from "utils/workWithData";

const LocationForm: React.FC = () => {
  const [sentData, setSentData] = useState<ISearchDataForm>(
    {} as ISearchDataForm
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<ISearchDataForm>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const dispatch = useAppDispatch();
  const {
    isLoading,
    data,
    errorMessage: error,
    isSuccess,
  } = useAppSelector((state) => state.data.searchData);

  const save = (data: ISearchDataForm) => {
    if ((data.city && data.state) || data.zip) {
      dispatch(getSingleData(data));
      setSentData(data)
      reset();
    }
  };

  const form = watch();
  useEffect(() => {
    const valid = (form.city && form.state) || form.zip;
    if (!valid && (errors.firstName || errors.lastName)) {
      setErrorMessage("City/State or Zip is required");
    } else {
      setErrorMessage("");
    }
  }, [form]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Data successfuly added to your list");
      dispatch(getSingleDatas({}));
      dispatch(resetSearchData());
    } else if (error) {
      toast.error(String(error));
      dispatch(resetSearchData());
    }
  }, [isSuccess, error]);

  return !isLoading && !isSuccess && !data.status ? (
    <form onSubmit={handleSubmit(save)} className={styles.form}>
      <div className={styles.box_inputs_row}>
        <Input
          type="text"
          name="firstName"
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
      <p className={styles.error}>{errorMessage}</p>
      <Button>Search</Button>
    </form>
  ) : !isLoading && data.status ? (
    <div className={styles.horizontalData}>
      <HorizontalTable data={prepareForTable({...data.data, ...sentData})} />
      <Button type="primary" onClick={() => dispatch(resetSearchData())}>
        Search Again
      </Button>
    </div>
  ) : (
    <Loading height="50%" />
  );
};

export default LocationForm;
