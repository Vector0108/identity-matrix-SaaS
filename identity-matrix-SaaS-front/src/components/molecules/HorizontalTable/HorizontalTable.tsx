import React from "react";
import styles from "./style.module.scss";
import Table from "components/atoms/Table/Table";

const HorizontalTable: React.FC<any> = ({ data }) => {
  return (
    <Table className={styles.table}>
      <tbody>
      {Object.keys(data).map((key, index) => (
          <tr key={index}>
            <td style={{fontWeight: 'bold'}}>{key}</td>
            <td>{data[key]}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default HorizontalTable;
