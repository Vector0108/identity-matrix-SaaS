import React, { useState } from "react";
import styles from "./style.module.scss";
import LocationForm from "./LocationForm";
import EmailForm from "./EmailForm";
import classNames from "classnames";
import LinkedInForm from "./LinkedinForm";

const SingleSearchForms: React.FC = () => {
  const [active, setActive] = useState<number>(0);
  const activeTabClass = classNames(
    styles.box_tabs_active,
    styles.box_tabs_tab
  );
  return (
    <div className={styles.box}>
      <div className={styles.box_tabs}>
        <div
          onClick={() => setActive(0)}
          className={active === 0 ? activeTabClass : styles.box_tabs_tab}
        >
          Email Search
        </div>
        <div
          className={active === 1 ? activeTabClass : styles.box_tabs_tab}
          onClick={() => setActive(1)}
        >
          Name Search
        </div>
        <div
          className={active === 2 ? activeTabClass : styles.box_tabs_tab}
          onClick={() => setActive(2)}
        >
          LinkedIn Search
        </div>
      </div>
      <div className={styles.box_forms}>
        {
          {
            0: <EmailForm />,
            1: <LocationForm />,
            2: <LinkedInForm />
          }[active]
        }
      </div>
    </div>
  );
};

export default SingleSearchForms;
