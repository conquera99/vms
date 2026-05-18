import type { CSSProperties } from 'react';
import { Form, Select as AntdSelect } from 'antd';

import { selectFilter } from 'utils/helper';

const selectRootStyle: CSSProperties = {
	width: '100%',
	minHeight: 48,
	fontSize: '0.95rem',
};

const selectSemanticStyles = {
	root: {
		borderRadius: '.5rem',
		border: '1px solid #dbe5ee',
		background: 'rgba(255, 255, 255, 0.92)',
		boxShadow: '0 10px 30px rgba(148, 163, 184, 0.08)',
		paddingInline: 14,
		minHeight: 48,
		transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
	} satisfies CSSProperties,
	placeholder: {
		fontSize: '0.95rem',
		color: '#94a3b8',
	} satisfies CSSProperties,
	popup: {
		root: {
			border: '1px solid #dbe5ee',
			borderRadius: 18,
			background: 'rgba(255, 255, 255, 0.97)',
			boxShadow: '0 20px 45px rgba(148, 163, 184, 0.16)',
		} satisfies CSSProperties,
		listItem: {
			padding: '8px 16px',
		} satisfies CSSProperties,
	},
};

const Select = ({
	value = '',
	placeholder = '',
	valueKey = 'value',
	labelKey = 'label',
	label = '',
	required = false,
	...props
}) => {
	const formItemClassName = ['app-form-item', props.className].filter(Boolean).join(' ');
	const controlClassName = ['app-control', 'app-select-control'].join(' ');

	const onSelect = (value: string) => {
		if (props.onSelect) {
			let SelectedData = null;
			for (let i = 0; i < props.options.length; i++) {
				if (value === props.options[i][valueKey]) {
					SelectedData = props.options[i];
					break;
				}
			}

			props.onSelect(value, SelectedData);
		}
	};

	const options = (props.options || []).map((item: Record<string, any>) => ({
		value: item[valueKey] || item,
		label: item[labelKey] || item,
	}));

	const filterOption = (input: string, option?: { label?: string }) =>
		selectFilter(input, option);

	return (
		<Form.Item
			className={formItemClassName}
			name={props.name}
			rules={props.rules}
			label={label || undefined}
			required={required}
		>
			<AntdSelect
				className={controlClassName}
				style={selectRootStyle}
				styles={selectSemanticStyles}
				variant="outlined"
				value={value}
				placeholder={placeholder || label}
				showSearch={props.showSearch ?? true}
				allowClear
				filterOption={filterOption}
				onSelect={onSelect}
				mode={props.mode}
				disabled={props.disabled}
				options={options}
			/>
		</Form.Item>
	);
};

export default Select;
