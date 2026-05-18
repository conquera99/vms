import type { CSSProperties } from 'react';
import { DatePicker as AntDatePicker, Form } from 'antd';

const datePickerStyle: CSSProperties = {
	width: '100%',
	minHeight: 48,
	borderRadius: '.5rem',
	border: '1px solid #dbe5ee',
	background: 'rgba(255, 255, 255, 0.92)',
	boxShadow: '0 10px 30px rgba(148, 163, 184, 0.08)',
	paddingInline: 14,
	fontSize: '0.95rem',
	transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
};

const datePickerStyles = {
	root: datePickerStyle,
	input: {
		fontSize: '0.95rem',
	} satisfies CSSProperties,
	popup: {
		root: {
			border: '1px solid #dbe5ee',
			borderRadius: 18,
			background: 'rgba(255, 255, 255, 0.97)',
			boxShadow: '0 20px 45px rgba(148, 163, 184, 0.16)',
		} satisfies CSSProperties,
	},
};

const DatePicker = ({ required = false, allowClear = false, ...props }) => {
	const formItemClassName = ['app-form-item', props.className].filter(Boolean).join(' ');
	const controlClassName = ['app-control', 'app-date-picker'].join(' ');

	return (
		<Form.Item
			className={formItemClassName}
			name={props.name}
			rules={props.rules}
			label={props.label}
			required={required}
		>
			<AntDatePicker
				className={controlClassName}
				style={datePickerStyle}
				styles={datePickerStyles}
				variant="outlined"
				placeholder={props.placeholder || props.label}
				format="DD MMM YYYY"
				disabled={props.disabled}
				allowClear={allowClear}
			/>
		</Form.Item>
	);
};

export default DatePicker;
