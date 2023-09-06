import React, { useEffect, useState } from 'react';
import styles from './style.module.scss';
import PaymentForm from 'components/molecules/PaymentForm/PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from 'utils/getStripe';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import Loading from 'components/atoms/Loading/Loading';
import {
	getCards,
	resetCardSlice,
	resetDeleteCard,
	resetPayment,
} from 'store/slices/card.slice';
import SuccessPage from 'pages/SuccessPage/SuccessPage';
import FailPage from 'pages/FailPage/FailPage';
import { toast } from 'react-toastify';
import { getUser } from 'store/slices/user.slice';
import SliderInput from 'components/atoms/SliderInput/SliderInput';

const Credits: React.FC<{closeModal: () => void}> = ({closeModal}): JSX.Element => {
  const [amount, setAmount] = useState<number>(0);
  const [pageLoading, setPageIsLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const isPaymentSuccess = useAppSelector(
    (state) => state.cards.payment.isSuccess
  );
  const paymentSuccessMessage = useAppSelector(
    (state) => state.cards.payment.successMessage
  );
  const isPaymentError = useAppSelector(
    (state) => state.cards.payment.errorMessage
  );
  const isCardsLoading = useAppSelector((state) => state.cards.isLoading);
  const {
    isLoading: cardLoading,
    isSuccess: cardDeleteSuccess,
    errorMessage,
    successMessage,
  } = useAppSelector((state) => state.cards.deleteCard);
  const { data: user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const amountOptions: Array<{ value: number; price: number }> = [
    { value: 20, price: 15 },
    { value: 50, price: 35 },
    { value: 100, price: 60 },
    { value: 500, price: 300 },
    { value: 1000, price: 500 },
    { value: 5000, price: 2400 },
    { value: 10000, price: 4600 },
    { value: 50000, price: 21000 },
    { value: 100000, price: 40000 },
  ];

	const handleInputChange = (event: any) => {
		const value = event.target.value;
		setAmount(value);

		const numericValue = parseFloat(value);

		if (isNaN(numericValue)) {
			setValidationMessage('Invalid input. Please enter a valid number.');
		} else if (numericValue < 2) {
			setValidationMessage('Value must be at least 2.');
		} else {
			setValidationMessage('');
		}

		if (!user.partner) {
			if (numericValue < 20) {
				setValidationMessage('Value must be at least 20.');
			} else if (numericValue > 100000) {
				setValidationMessage('Value must be less than 100,000.');
			} else {
				setValidationMessage('');
			}
		}
	};

	useEffect(() => {
		dispatch(getCards());
	}, []);

	useEffect(() => {
		if (cardDeleteSuccess) {
			toast.success(successMessage);
			dispatch(getCards());
			dispatch(resetDeleteCard());
		}
		if (errorMessage) {
			toast.error(String(errorMessage));
			dispatch(getCards());
			dispatch(resetDeleteCard());
		}
	}, [cardDeleteSuccess, errorMessage]);

	useEffect(() => {
		if (isCardsLoading) {
			setPageIsLoading(false);
		}
	}, [isCardsLoading]);

	useEffect(() => {
		if (paymentSuccessMessage === 'Unlimited') {
			toast.success('You have Unlimited Credits');
			setPaymentLoading(false);
			dispatch(resetCardSlice());
		}
	}, [isPaymentSuccess, paymentSuccessMessage]);

	useEffect(() => {
		return () => {
			setPaymentLoading(false);
			dispatch(getUser());
			dispatch(resetPayment());
		};
	}, []);

	return isPaymentSuccess && paymentSuccessMessage !== 'Unlimited' ? (
		<SuccessPage closeModal={closeModal} />
	) : isPaymentError ? (
		<FailPage closeModal={closeModal} />
	) : !isCardsLoading && !pageLoading && !paymentLoading && !cardLoading ? (
		<div className={styles.container}>
			<div className={styles.container_elements}>
				<div className={styles.container_select}>
					<h1>Purchase Credits Here</h1>
					<p>Credits are charged only for successfully enriched records</p>
					{!user.partner ? (
						<div className={styles.input_container}>
							<SliderInput
								min={20}
								max={100000}
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
							/>
							<div className={styles.input_container_result}>
								<div className={styles.input_container_result_credits}>
									<input
										className={styles.input_container_result_input}
										type="number"
										id="numericInput"
										step="1"
										min={20}
										max={100000}
										value={amount}
										onChange={handleInputChange}
									/>
									<p>Credits</p>
									<p className={styles.input_container_error}>
										{validationMessage}
									</p>
								</div>
								<div>=</div>
								<div className={styles.input_container_result_price}>
									<p>{amount * 0.5}</p>
									<p>$</p>
								</div>
							</div>
						</div>
					) : (
						<div className={styles.container_select_inputBox}>
							<label htmlFor="numericInput">Credits :</label>
							<div className={styles.container_select_inputBox_box}>
								<input
									className={styles.container_select_inbutBox_input}
									type="number"
									id="numericInput"
									step="1"
									min="2"
									value={amount}
									onChange={handleInputChange}
								/>
								<span> = {amount * 0.25} $ </span>
							</div>
							<p
								className={
									styles.container_select_inbutBox_error_message
								}
							>
								{validationMessage}
							</p>
						</div>
					)}
				</div>
				<div className={styles.container_payment}>
					<Elements stripe={getStripe()}>
						<PaymentForm
							amount={amount}
							paymentLoading={setPaymentLoading}
							isPaymentLoading={paymentLoading}
						/>
					</Elements>
				</div>
			</div>
		</div>
	) : (
		<div
      style={{ width: "100%", top: "0" }}
    >
      <Loading height={"100%"} />
    </div>
	);
};

export default Credits;
