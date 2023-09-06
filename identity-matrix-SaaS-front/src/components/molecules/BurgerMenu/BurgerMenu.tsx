import React, { useEffect, useState } from 'react';
import styles from './style.module.scss';
import { Link } from 'react-router-dom';
import SvgIcons from '../../atoms/SvgRender/SvgRender';
import Button from 'components/atoms/Button/Button';
import { useAppSelector } from 'store/hooks';
import Popup from '../Popup/Popup';
import Credits from 'pages/Credits/Credits';

const BurgerMenu: React.FC = () => {
	const [open, setOpen] = useState(false);
	const { data } = useAppSelector((state) => state.user);
	const [showBuyCredits, setShowBuyCredits] = useState<boolean>(false);
	const closeModal = () => {
		setShowBuyCredits(false)
	 }
	 const isPaymentSuccess = useAppSelector(
		(state) => state.cards.payment.isSuccess
	 );
	 const isPaymentError = useAppSelector(
		(state) => state.cards.payment.errorMessage
	 );
  
	useEffect(() => {
		if (open === true) {
			document.body.style.position = 'fixed';
		} else {
			document.body.style.position = 'relative';
		}
	}, [open]);

	const toggleMenu = () => {
		setOpen(!open);
	};
	return (
		<div className={styles.burger}>
			<button
				className={styles.burger_openBtn}
				onClick={toggleMenu}
			>
				<div className={styles.burger_openBtn_lines}>
					<div className={styles.burger_openBtn_lines_line}></div>
					<div className={styles.burger_openBtn_lines_line}></div>
					<div className={styles.burger_openBtn_lines_line}></div>
				</div>
			</button>
			<div
				className={`${styles.burger_menu} ${
					open ? styles.open : styles.close
				}`}
			>
				<button
					className={styles.burger_menu_closeBtn}
					onClick={toggleMenu}
				>
					<SvgIcons iconName="close" />
				</button>
				<div className={styles.burger_menu_items}>
					<Link
						to="/"
						aria-label="To Home Page"
						onClick={toggleMenu}
					>
						Home
					</Link>
					<Link
						to="/user/myAccount"
						aria-label="To Team Page"
						onClick={toggleMenu}
					>
						My Account
					</Link>
					<Link
						to={'/user/transactions'}
						onClick={toggleMenu}
					>
						Transactions
					</Link>
					<Link
						to={'/searchData'}
						onClick={toggleMenu}
						>
						Single Search
					</Link>
						{!data.unlimitedCredits && (
					  <>
						 <Button type='smoke' onClick={() =>{ setShowBuyCredits(true)}}>
							Buy Credits
						 </Button>
						 {showBuyCredits && (
							<Popup
							  onClose={closeModal}
							  type="modal"
							  buttonText={!isPaymentSuccess && !isPaymentError ? "Close" : ''}
							  bodyClass={styles.burger_popup }
							  className={styles.wrapper}
							>
							  <Credits closeModal={closeModal}/>
							</Popup>
						 )}
					  </>
					)}
				</div>
			</div>
		</div>
	);
};

export default BurgerMenu;
