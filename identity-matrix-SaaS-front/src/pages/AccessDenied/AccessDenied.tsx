import React from 'react';
import styles from './style.module.scss';
import { Link } from 'react-router-dom';
import SvgIcons from '../../components/atoms/SvgRender/SvgRender';

const AccessDenied: React.FC = (): JSX.Element => {
	return (
		<div className={styles.container}>
			<div className={styles.container_elements}>
				<div className={styles.container_elements_icon}>
					<SvgIcons iconName="lock" />
				</div>
				<h1>Access Denied</h1>
				<p>A site membership is required to view this page.</p>
				<p>
					Please <Link to={'/signup'}> Sign up </Link>
					or <Link to={'/signin'}> Log in</Link>.
				</p>
			</div>
		</div>
	);
};

export default AccessDenied;
