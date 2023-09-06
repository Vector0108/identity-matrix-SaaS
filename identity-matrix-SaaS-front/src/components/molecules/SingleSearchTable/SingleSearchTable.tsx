import React from 'react';
import styles from './style.module.scss';
import Table from 'components/atoms/Table/Table';
import Loading from 'components/atoms/Loading/Loading';
import { ISearchDataForm } from 'types/data/data.types';

const SingleSearchTable: React.FC<{
	isLoading?: boolean;
	isSuccess?: boolean;
	data: ISearchDataForm[];
}> = ({ isLoading=false, isSuccess=true, data }) => {
	return (
		<div className={styles.table}>
			{isLoading ? (
				<Loading height="40vh" />
			) : isSuccess && data.length ? (
				<Table>
					<thead>
						<tr>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Email</th>
							<th>Phone</th>
							<th>Alternate Phone</th>
							<th>City</th>
							<th>State</th>
							<th>Country</th>
							<th>Zip</th>
						</tr>
					</thead>
					<tbody>
						{data.map((e: any) => {
							return (
								<tr key={e._id}>
									<td>{e.firstName || '-'}</td>
									<td>{e.lastName || '-'}</td>
									<td>{e.email || '-'}</td>
									<td>{e.phone || '-'}</td>
									<td>{e.altPhone || '-'}</td>
									<td>{e.city || '-'}</td>
									<td>{e.state || '-'}</td>
									<td>{e.country || '-'}</td>
									<td>{e.zip || '-'}</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			) : (
				<p>You currently have no data</p>
			)}
		</div>
	);
};

export default SingleSearchTable;
