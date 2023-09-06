import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { IHeader } from "../../../types/components/header.type";
import Button from "../../atoms/Button/Button";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { logout, reset, resetAuthSlice } from "store/slices/auth.slice";
import { getUser, resetUser } from "store/slices/user.slice";
import SvgIcons from "components/atoms/SvgRender/SvgRender";
import { resetCardSlice } from "store/slices/card.slice";
import { resetListSlice } from "store/slices/list.slice";
import {
  resetTransactionsSlice,
  resetUpdateUser,
} from "store/slices/transactions.slice";
import { resetDataSlice } from "store/slices/data.slice";
import Popup from "../Popup/Popup";
import Credits from "pages/Credits/Credits";

const Header: React.FC<any> = ({ loggedIn, token }) => {
  const [showBuyCredits, setShowBuyCredits] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isSuccess } = useAppSelector((state) => state.auth.logout);
  const { data } = useAppSelector((state) => state.user);
  const isPaymentSuccess = useAppSelector(
    (state) => state.cards.payment.isSuccess
  );
  const isPaymentError = useAppSelector(
    (state) => state.cards.payment.errorMessage
  );

  const closeModal = () => {
    setShowBuyCredits(false)
  }
  useEffect(() => {
    if (isSuccess) {
      navigate("/signin");
      dispatch(reset());
    }
  }, [isSuccess]);
  useEffect(() => {
    if (token) {
      dispatch(getUser());
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.header_container}>
      <Link to={"/"}>
        <img
          src={require("../../../assets/png/logo.png")}
          className={styles.header_logo}
          alt="logo"
        />
      </Link>
      {loggedIn ? (
        <>
          <nav className={styles.header_nav}>
            {!data.unlimitedCredits && (
              <>
                <Button onClick={() => setShowBuyCredits(true)}>
                  Buy Credits
                </Button>
                {showBuyCredits && (
                  <Popup
                    onClose={closeModal}
                    type="modal"
                    buttonText={!isPaymentSuccess && !isPaymentError ? "Close" : ''}
                    bodyClass={styles.header_nav_popup}
                  >
                    <Credits closeModal={closeModal}/>
                  </Popup>
                )}
              </>
            )}
            <Button type="smoke" onClick={() => navigate("/user/myAccount")}>
              Account Settings
            </Button>
            <Button type="smoke" onClick={() => {
                dispatch(logout());
                dispatch(resetAuthSlice());
                dispatch(resetCardSlice());
                dispatch(resetListSlice());
                dispatch(resetTransactionsSlice());
                dispatch(resetUpdateUser());
                dispatch(resetUser());
                navigate("/signin");
              }}>
            Log out
            </Button>
          </nav>
          <div className={styles.header_nav_burger}>
            <BurgerMenu />
          </div>
        </>
      ) : (
        <nav className={styles.header_nav}>
          <Button type="primary" onClick={() => navigate("/signin")}>
            Log In
          </Button>
          <Button type="primary" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </nav>
      )}
      </div>
    </header>
  );
};

export default Header;
