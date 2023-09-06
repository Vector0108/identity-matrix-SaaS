export interface IInput {
	type: string;
	placeholder?: string;
	name: string;
	register?: any;
	errors?: any;
	validationSchema?: any;
	label?: any;
	className?: string;
	value?:string;
	style?: React.CSSProperties
}

export interface ISliderInput {
	min: number;
	max: number;
	step?: number;
	value: number;
	onChange: (e:any)=>void;
}