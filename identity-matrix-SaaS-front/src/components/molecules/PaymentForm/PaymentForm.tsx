import React, { useState } from 'react';
import styles from './style.module.scss';
import {
	CardNumberElement,
	CardCvcElement,
	CardExpiryElement,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js';
import Button from 'components/atoms/Button/Button';
import classNames from 'classnames';
import { IPaymentForm } from 'types/components/payment.type';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
	deleteCard,
	handlePay,
	paySelectedCard,
} from 'store/slices/card.slice';
import Loading from 'components/atoms/Loading/Loading';
import SvgIcons from 'components/atoms/SvgRender/SvgRender';

const PaymentForm: React.FC<IPaymentForm> = ({
	amount,
	paymentLoading,
}: IPaymentForm): JSX.Element => {
	const stripe: any = useStripe();
	const elements: any = useElements();
	const navigate = useNavigate();
	const [cookies] = useCookies(['card']);
	const card = cookies.card;
	const [isSelectedCard, setIsSelectedCard] = useState<string>();
	const [cardType, setCardType] = useState<{
		cardType: string;
		last4: string;
		cardId: string;
	} | null>();
	const [save, setSave] = useState<boolean>(false);
	const [paymentWithoutSelected, setPaymentWithoutSelected] = useState(false);
	const { data, isLoading } = useAppSelector((state) => state.cards);
	const { data: user } = useAppSelector((state) => state.user);
	const isPaymentLoading = useAppSelector(
		(state) => state.cards.payment.isLoading
	);

	const { isLoading: isLoadingDelete } = useAppSelector(
		(state) => state.cards.deleteCard
	);

	const dispatch = useAppDispatch();

	const [cardValidation, setCardValidation] = useState<any>();
	const [dateValidation, setDateValidation] = useState<any>();
	const [cvcValidation, setCvcValidation] = useState<any>();
	const isComplete =
		!isSelectedCard &&
		!(
			cvcValidation?.complete &&
			dateValidation?.complete &&
			cardValidation?.complete &&
			amount
		);
	const disableSelected = !user.partner
		? isComplete
		: amount < 2 && !isComplete;
	const disablePay = !user.partner
		? isComplete || paymentWithoutSelected || amount < 20 || amount > 100000
		: isComplete || paymentWithoutSelected || amount < 2;

	const toggle = (card: any) => {
		if (amount) {
			if (isSelectedCard === card.cardId) {
				setIsSelectedCard('');
				return setCardType(null);
			}
			setCardType(card);
			setIsSelectedCard(card?.cardId);
		}
	};

	const handleSelected = async () => {
		paymentLoading(true);
		dispatch(paySelectedCard({ card, amount, cardType }));
	};

	const deleteCardwithId = (cardId: string) => {
		dispatch(deleteCard(cardId));
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setPaymentWithoutSelected(true);
		const { error } = await stripe.createPaymentMethod({
			type: 'card',
			card: elements.getElement(
				CardCvcElement,
				CardExpiryElement,
				CardNumberElement
			),
		});

		if (!error) {
			const { token } = await stripe.createToken(
				elements.getElement(
					CardCvcElement,
					CardExpiryElement,
					CardNumberElement
				)
			);
			const data = {
				token,
				amount,
				save,
			};
			paymentLoading(true);
			dispatch(handlePay(data));
		}
	};

	return (
		<div
			style={{ display: isPaymentLoading ? 'none' : 'block' }}
			className={classNames(styles.container, {
				[styles.active]: +amount,
				[styles.disabled]: !+amount,
			})}
		>
			{!isLoading ? (
				<>
					<h3>Select payment method</h3>
					{data.map((card, index) => {
						return !isLoadingDelete ? (
							<div
								className={styles.cardItem}
								key={index}
							>
								<div
									key={index}
									onClick={() => toggle(card)}
									className={classNames(styles.card, {
										[styles.card_active]: amount,
										[styles.card_selected]: cardType
											? card.cardId === cardType.cardId
											: null,
									})}
								>
									<span>{card.brand}</span>
									<p>{`************${card.last4}`}</p>
								</div>
								<div
									className={styles.cardItem_delete}
									onClick={() => deleteCardwithId(card.cardId)}
								>
									<SvgIcons iconName="delete" />
								</div>
							</div>
						) : (
							<Loading />
						);
					})}
				</>
			) : (
				<Loading height="100%" />
			)}

			<form
				onSubmit={handleSubmit}
				className={styles.payment_form}
			>
				<h2>Enter your payment details</h2>
				<fieldset
					className={classNames(styles.formGroup, {
						[styles.error]: cardValidation?.error,
					})}
				>
					<div className={styles.formRow}>
						<CardNumberElement
							onChange={(e) => setCardValidation(e)}
							options={{ showIcon: true }}
						/>
					</div>
				</fieldset>
				<div className={styles.group}>
					<fieldset
						className={classNames(styles.formGroup, {
							[styles.error]: dateValidation?.error,
						})}
					>
						<div className={styles.formRow}>
							<CardExpiryElement
								onChange={(e) => setDateValidation(e)}
							/>
						</div>
					</fieldset>
					<fieldset
						className={classNames(styles.formGroup, {
							[styles.error]: cvcValidation?.error,
						})}
					>
						<div className={styles.formRow}>
							<CardCvcElement onChange={(e) => setCvcValidation(e)} />
						</div>
					</fieldset>
				</div>

				<div className={styles.save}>
					<input
						onChange={() => setSave(!save)}
						disabled={isSelectedCard?.length ? true : false}
						type="checkbox"
						name="save"
						id="save"
					/>
					<label htmlFor="save">Save card details</label>
				</div>

				<div className={styles.buttons}>
					<Button
						type="smoke"
						disabled={isComplete || paymentWithoutSelected}
						style={isComplete || paymentWithoutSelected ? {color: 'white'} : {}}
						onClick={() => navigate('/')}
					>
						Cancel
					</Button>
					{isSelectedCard ? (
						<Button
							disabled={disableSelected}
							action="button"
							onClick={handleSelected}
						>
							Pay
						</Button>
					) : (
						<Button disabled={disablePay}>Pay</Button>
					)}
				</div>
			</form>
		</div>
	);
};

export default PaymentForm;
