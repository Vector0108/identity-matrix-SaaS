import React, { useEffect } from 'react';
import styles from './style.module.scss';
import Icon from '../../assets/png/coins.png';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getTransactions } from 'store/slices/transactions.slice';
import Loading from 'components/atoms/Loading/Loading';
import { getUser } from 'store/slices/user.slice';
import Table from 'components/atoms/Table/Table';
import Balance from 'components/atoms/Balance/Balance';

const Transactions: React.FC = () => {
	const dispatch = useAppDispatch();
	const { data, errorMessage, isLoading } = useAppSelector(
		(state) => state.transactions
	);
	const { credits } = useAppSelector((state) => state.user.data);

	useEffect(() => {
		dispatch(getTransactions());
		dispatch(getUser());
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.elements}>
				<div>
					<Table className={styles.elements_table}>
						<thead>
							<tr>
								<th>Credits</th>
								<th>Date</th>
								<th>Notes</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<tr>
									<td></td>
									<td>
										<Loading height="100%" />
									</td>
									<td></td>
								</tr>
							) : errorMessage ? (
								<tr>
									<td></td>
									<td>Not Found</td>
									<td></td>
								</tr>
							) : (
								data.map((transaction, index) => {
									return (
										<tr key={index}>
											<td
												style={{
													color: transaction.type
														? 'green'
														: 'red',
												}}
											>
												{transaction.type
													? `+${transaction.amount}`
													: `-${transaction.amount}`}
											</td>
											<td>
												{new Date(
													transaction.createdAt
												).toLocaleDateString('en-GB')}
											</td>
											<td>{transaction.note}</td>
										</tr>
									);
								})
							)}
						</tbody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default Transactions;
