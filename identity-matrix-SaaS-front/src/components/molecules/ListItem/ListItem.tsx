import React from "react";
import "./style.scss";
import { IListItem } from "types/components/listItem.type";
import AzureBlobDownloader from "../AzureDownload/AzureDownload";

const ListItem: React.FC<IListItem> = ({ createdAt, downloadURL, name, loading }) => {
  return (
    <div className="container">
      <ul className="responsive-table">
        <li className="table-row">
          <div className="col col-1" data-label="Name">
            {name}
          </div>
          <div className="col col-2" data-label="Date">
            {new Date(createdAt).toLocaleDateString("en-GB")}
          </div>
          <div className="col col-3" data-label="Download">
            <AzureBlobDownloader blobName={downloadURL} loading={loading} />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ListItem;
