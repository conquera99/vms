import type { CSSProperties } from 'react';
import { Form, Input as AntInput, InputNumber as AntInputNumber } from 'antd';
import { numberFormatter, numberParser } from 'utils/helper';

const baseControlStyle: CSSProperties = {
	borderRadius: '.5rem',
	border: '1px solid #dbe5ee',
	background: 'rgba(255, 255, 255, 0.92)',
	boxShadow: '0 10px 30px rgba(148, 163, 184, 0.08)',
	minHeight: 48,
	paddingInline: 14,
	fontSize: '0.95rem',
	transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
};

const baseTextAreaStyle: CSSProperties = {
	...baseControlStyle,
	minHeight: 120,
	paddingTop: 12,
	paddingBottom: 12,
	resize: 'vertical',
};

const Input = ({ value = '', placeholder = '', required = false, type = 'text', ...props }) => {
	const { className: inputClassName, style: inputStyle, ...inputProps } = props.input || {};
	const formItemClassName = ['app-form-item', props.className].filter(Boolean).join(' ');
	const controlClassName = ['app-control', inputClassName].filter(Boolean).join(' ');

	return (
		<Form.Item
			className={formItemClassName}
			name={props.name}
			rules={props.rules}
			label={props.label}
			required={required}
			hidden={type === 'hidden'}
		>
			<AntInput
				className={controlClassName}
				style={{ ...baseControlStyle, ...inputStyle }}
				variant="outlined"
				value={value}
				placeholder={placeholder || props.label}
				type={type}
				{...inputProps}
			/>
		</Form.Item>
	);
};

export default Input;

export const InputNumber = ({ value = '', placeholder = '', required = false, ...props }) => {
	const { className: inputClassName, style: inputStyle, ...inputProps } = props.input || {};
	const formItemClassName = ['app-form-item', props.className].filter(Boolean).join(' ');
	const controlClassName = ['app-control', inputClassName].filter(Boolean).join(' ');

	return (
		<Form.Item
			className={formItemClassName}
			name={props.name}
			rules={props.rules}
			label={props.label}
			required={required}
		>
			<AntInputNumber
				className={controlClassName}
				style={{ ...baseControlStyle, width: '100%', ...inputStyle }}
				variant="outlined"
				value={value}
				placeholder={placeholder || props.label}
				formatter={numberFormatter}
				parser={numberParser}
				{...inputProps}
			/>
		</Form.Item>
	);
};

export const TextArea = ({
	value = '',
	placeholder = '',
	required = false,
	type = 'text',
	...props
}) => {
	const { className: inputClassName, style: inputStyle, ...inputProps } = props.input || {};
	const formItemClassName = ['app-form-item', props.className].filter(Boolean).join(' ');
	const controlClassName = ['app-control', 'app-textarea-control', inputClassName]
		.filter(Boolean)
		.join(' ');

	return (
		<Form.Item
			className={formItemClassName}
			name={props.name}
			rules={props.rules}
			label={props.label}
			required={required}
		>
			<AntInput.TextArea
				className={controlClassName}
				style={{ ...baseTextAreaStyle, ...inputStyle }}
				variant="outlined"
				value={value}
				placeholder={placeholder || props.label}
				{...inputProps}
			/>
		</Form.Item>
	);
};
