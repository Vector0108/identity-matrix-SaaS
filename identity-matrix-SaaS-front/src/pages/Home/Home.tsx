import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import style from "./style.module.scss";
import ListItem from "components/molecules/ListItem/ListItem";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getLists, resetUploadData, uploadData } from "store/slices/list.slice";
import Loading from "components/atoms/Loading/Loading";
import { toast } from "react-toastify";
import { disableFirstLogin, getUser } from "store/slices/user.slice";
import classNames from "classnames";
import AzureBlobDownloader from "components/molecules/AzureDownload/AzureDownload";
import Popup from "components/molecules/Popup/Popup";
import { getSingleDatas, resetDataSlice } from "store/slices/data.slice";
import { debounce } from "utils/debounce";
import SingleSearchTable from "components/molecules/SingleSearchTable/SingleSearchTable";
import Balance from "components/atoms/Balance/Balance";
import SingleSearchForms from "components/molecules/SingleSearchForm/SingleSearchForms";

const templateLink =
  "https://middlewarexdevxstorage.blob.core.windows.net/dev/template.csv";

const Home: React.FC<any> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { lists, errorMessage, isLoading, isSuccess } = useAppSelector(
    (state) => state.lists
  );
  const { isSuccess: userIsSuccess, data: user } = useAppSelector(
    (state) => state.user
  );
  const successUpload = useAppSelector(
    (state) => state.lists.uploadData.isSuccess
  );
  const errorUpload = useAppSelector(
    (state) => state.lists.uploadData.errorMessage
  );

  const handleCloseModal = () => {
    setOpen(false);
    dispatch(disableFirstLogin());
  };

  const {
    datas,
    isSuccess: datasIsSuccess,
    isLoading: datasIsLoading,
  } = useAppSelector((state) => state.data);

  const [loadingUpload, setLoadingUpload] = useState(false);
  const dispatch = useAppDispatch();

  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!user.credits) {
      return toast.error("Please check your balance");
    }
    const data = new FormData();
    if (e.target.files) {
      setLoadingUpload(true);
      data.append("csv", e.target.files[0]);
      dispatch(uploadData(data));
    }
  };

  useEffect(() => {
    if (userIsSuccess) {
      dispatch(getLists());
      dispatch(getSingleDatas({}));
      if (user.firstLogin) setOpen(true);
    }
    return () => {
      dispatch(resetDataSlice());
    };
  }, [userIsSuccess]); // eslint-disable-line

  useEffect(() => {
    return () => {
      dispatch(resetDataSlice());
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    if (successUpload) {
      toast.success("Uploaded successfuly");
      setLoadingUpload(false);
      dispatch(getLists());
      dispatch(getUser());
      dispatch(resetUploadData());
    }
    if (errorUpload) {
      toast.error(errorUpload);
      setLoadingUpload(false);
      dispatch(resetUploadData());
    }
  }, [successUpload, errorUpload]); // eslint-disable-line

  const search = (text: string) => {
    dispatch(getSingleDatas({ search: text }));
  };

  const optimizedSearch = useCallback(debounce(search), []); // eslint-disable-line

  return (
    <div className={style.container}>
      {open && (
        <Popup
          onClose={handleCloseModal}
          text="You have 10 free Credits!"
          buttonText="Close"
          type="message"
        />
      )}
      <div className={style.box_row}>
        <div className={style.box}>
          <div className={style.box_cont}>
            <div className={style.btn_templ}>
              <p>Template:</p>
              <AzureBlobDownloader blobName={`${templateLink}`} />
            </div>

            <div className={style.btn_templ_buttons}>
              <Balance />
              <div className={style.btn_cont}>
                <label
                  htmlFor="file"
                  className={classNames(style.btn, {
                    [style.btn_disable]: loadingUpload,
                  })}
                >
                  Upload
                </label>
                <input
                  id="file"
                  type="file"
                  accept=".csv"
                  onChange={handleUploadFile}
                  onClick={(event: any) => (event.target.value = null)}
                  disabled={loadingUpload}
                />
              </div>
            </div>
          </div>
          <div className={style.lists_cont}>
            <div className={style.lists_cont_item}>
              {isLoading || loadingUpload ? (
                <Loading height="45vh" />
              ) : isSuccess ? (
                lists.map((list, index) => {
                  return (
                    <ListItem
                      loading={list?.loading}
                      createdAt={list.createdAt}
                      downloadURL={list.downloadURL}
                      name={list.name}
                      key={index + Date.now()}
                    />
                  );
                })
              ) : (
                errorMessage && <p>You currently have no lists</p>
              )}
            </div>
          </div>
        </div>
        <div className={style.box_single}>
          <h2 className={style.second_box_title}>Single Search Options</h2>
          <div className={style.second_box_search}>
            <SingleSearchForms />
          </div>
        </div>
      </div>

      <div className={style.second_box}>
        <h3 className={style.second_box_title}>Single Search Results</h3>
        <div className={style.second_box_search}>
          <input
            placeholder="Search..."
            onChange={(e) => optimizedSearch(e.target.value)}
          />
        </div>
        <SingleSearchTable
          isLoading={datasIsLoading}
          isSuccess={datasIsSuccess}
          data={datas}
        />
      </div>
    </div>
  );
};

export default Home;
