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
  resetSearchDataWithoutData,
} from "store/slices/data.slice";
import Loading from "components/atoms/Loading/Loading";
import { toast } from "react-toastify";
import HorizontalTable from "../HorizontalTable/HorizontalTable";
import { prepareForTable } from "utils/workWithData";

const EmailForm: React.FC = () => {
	const [sentData, setSentData] = useState<ISearchDataForm>({} as ISearchDataForm)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISearchDataForm>();
  const { isLoading, data, errorMessage, isSuccess } = useAppSelector(
    (state) => state.data.searchData
  );
  const dispatch = useAppDispatch();

  const save = (data: ISearchDataForm) => {
    dispatch(getSingleData(data));
	setSentData(data)
    reset();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Data successfuly added to your list");
      dispatch(getSingleDatas({}));
      dispatch(resetSearchDataWithoutData());
    } else if (errorMessage) {
      toast.error(String(errorMessage));
      dispatch(resetSearchDataWithoutData());
    }
  }, [isSuccess, errorMessage]);

  useEffect(() => {
	return () => {
		dispatch(resetSearchData())
	}
  },[])


  return !isLoading && !isSuccess && !data.status ? (
    <form onSubmit={handleSubmit(save)} className={styles.form}>
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
      <Button>Search</Button>
    </form>
  ) : !isLoading && data.status ? (
    <div className={styles.horizontalData}>
      <HorizontalTable data={prepareForTable({...data.data, ...sentData})} />
	  <Button type="primary" onClick={() => dispatch(resetSearchData())}>Search Again</Button>
    </div>
  ) : (
    <Loading height="50%" />
  );
};

export default EmailForm;
