import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';
import { IInput } from '../../../types/components/input.type';

const Input: React.FC<IInput> = ({
	name,
	register,
	errors,
	type,
	validationSchema,
	placeholder,
	className,
	value,
	style,
}: IInput): JSX.Element => {
	return (
		<div className={styles.input_container}>
			<input
				id={name}
				name={name}
				type={type}
				{...register(name, validationSchema)}
				className={classNames(className ?? styles.input, {
					[styles.error]: errors[name],
				})}
				placeholder={placeholder}
				value={value}
				style={style}
			/>
			{errors && (
				<span className={styles.error_message}>
					{errors[name]?.message}
				</span>
			)}
		</div>
	);
};

export default Input;
