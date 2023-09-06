import axios from "../../../utils/axios";
import Button from "components/atoms/Button/Button";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Popup from "../Popup/Popup";
import styles from './style.module.scss'
import Loading from "components/atoms/Loading/Loading";
const baseUrl = process.env.REACT_APP_BASE_URL;

const AzureBlobDownloader: React.FC<{
  blobName: string;
  loading?: boolean;
}> = ({ blobName, loading }) => {
  const [showPopup, setShowPopup] = useState(false);
  const downloadFile = (content: any, fileName: any) => {
    const blob = new Blob([content], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const downloadBlob = async () => {
    try {
      const resp = await axios.post(
        `${baseUrl}data/downloadBlob`,
        {
          blobName: blobName.substring(blobName.lastIndexOf("/") + 1),
        },
        {
          withCredentials: true,
        }
      );
      downloadFile(
        resp.data,
        blobName.substring(blobName.lastIndexOf("/") + 1)
      );
    } catch (err: any) {
      toast.error(err.response.data);
    }
  };

  useEffect(() => {
    if (!loading) {
      setShowPopup(false)
    }
  },[loading])

  return (
    <div>
      <Button
        type="primary"
        onClick={() => (!loading ? downloadBlob() : setShowPopup(true))}
      >
        Download File
      </Button>
      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          type="modal"
          bodyClass={styles.popup}
          buttonText="Close"
        >
          <p>Your data is still processing</p>
          <Loading height='max-content'/>
        </Popup>
      )}
    </div>
  );
};

export default AzureBlobDownloader;
