import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { resetDataSlice } from 'store/slices/data.slice';
import Button from 'components/atoms/Button/Button';
import Loading from 'components/atoms/Loading/Loading';
import { toast } from 'react-toastify';
import { getUser } from 'store/slices/user.slice';
import { useNavigate } from 'react-router-dom';
import SingleSearchTable from 'components/molecules/SingleSearchTable/SingleSearchTable';
import styles from './style.module.scss';
import SingleSearchForms from 'components/molecules/SingleSearchForm/SingleSearchForms';

const SearchData: React.FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { isLoading, isSuccess, errorMessage, searchData } = useAppSelector(
		(state) => state.data
	);

	useEffect(() => {
		if (errorMessage) {
			toast.error(String(errorMessage));
			dispatch(resetDataSlice());
		}
		if (searchData.data.status) {
			dispatch(getUser());
		}
	}, [errorMessage, isSuccess]);

	return (
		<div className={styles.container}>
			<div className={styles.container_items}>
				{!searchData.isLoading ? (
					!searchData.isSuccess ? (
						<>
							<h1>Single Data Search</h1>
							<SingleSearchForms />
						</>
					) : (
						<>
							{searchData.data.status ? (
								<>
									<h1>Single Data Search</h1>
									<div className={styles.table}>
										<SingleSearchTable data={[searchData.data.data]} />
										<p className={styles.table_desc}>
											*All results will be saved on home page
										</p>
										<div className={styles.btns}>
											<Button
												type="smoke"
												className={styles.btn}
												onClick={() => navigate('/')}
											>
												Home
											</Button>
											<Button
												className={styles.btn}
												onClick={() => dispatch(resetDataSlice())}
											>
												Search Again
											</Button>
										</div>
									</div>
								</>
							) : (
								<div className={styles.result}>
									<h1>No results</h1>
									<Button
										style={{ width: 'max-content' }}
										onClick={() => dispatch(resetDataSlice())}
									>
										Back
									</Button>
								</div>
							)}
						</>
					)
				) : (
					<Loading height="100%"></Loading>
				)}
			</div>
		</div>
	);
};

export default SearchData;
