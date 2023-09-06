import React from "react";
import styles from "./style.module.scss";
import { useAppSelector } from "store/hooks";
import Icon from '../../../assets/png/coins.png';

const Balance: React.FC = () => {
  const { data: user } = useAppSelector((state) => state.user);
  return (
    <div className={styles.balance}>
      <div className={styles.item}>
        <img src={Icon} alt="" className={styles.item_icon} />
        <p>Balance</p>
      </div>
      <p className={styles.balance_credits}>{user.credits || 0}</p>
    </div>
  );
};

export default Balance