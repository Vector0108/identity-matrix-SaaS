import React, {useState} from 'react';
import { ISliderInput } from 'types/components/input.type';
import styles from './style.module.scss';

const SliderInput: React.FC<ISliderInput> = ({
	min,
	max,
	step,
   value,
   onChange
}: ISliderInput) => {
	return (
		<div className={styles.range_box}>
			<input
				id="month-price"
				type="range"
				min={min}
				max={max}
            onChange={onChange}
            value={value}
            step={step}
			/>
			<span className={styles.range_box_min}>{min}</span>
			<span className={styles.range_box_max}>{max}</span>
		</div>
	);
};

export default SliderInput;
