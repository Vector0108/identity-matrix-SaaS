import React, { ReactNode } from "react";
import styles from './style.module.scss'
import classNames from "classnames";

const Table:React.FC<{children: ReactNode, className?:string}> = ({children, className}) => {
  const tableClass = classNames(styles.table_wrapper, className)
  return <div className={tableClass}>
   <table>
      {children}
   </table>
  </div>;
};

export default Table;
