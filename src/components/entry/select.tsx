import { Field } from 'rc-field-form';
import InputSelect from 'rc-select';

import { selectFilter } from 'utils/helper';

const { Option } = InputSelect;

const Select = ({
	value = '',
	placeholder = '',
	valueKey = 'value',
	labelKey = 'label',
	label = '',
	...props
}) => {
	const containerId = `select-container-${props.name}`;

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

	return (
		<Field name={props.name} rules={props.rules}>
			{(control, meta) => (
				<div id={containerId} className={`mb-2 ${props.className}`}>
					<label className="block">{label}</label>
					<InputSelect
						className="px-4 py-3 bg-white rounded-md border w-full text-black border-gray-600"
						value={value}
						placeholder={placeholder || props.label}
						getPopupContainer={() =>
							document.getElementById(containerId) as HTMLElement
						}
						showSearch={props.showSearch || true}
						allowClear
						filterOption={selectFilter}
						dropdownAlign={{
							offset: [-16, 10],
						}}
						dropdownStyle={{
							zIndex: 1051,
						}}
						onSelect={onSelect}
						mode={props.mode}
						{...control}
					>
						{props.options?.length > 0 &&
							props.options.map((item: Record<string, any>) => (
								<Option key={item[valueKey] || item} value={item[valueKey] || item}>
									{item[labelKey] || item}
								</Option>
							))}
					</InputSelect>
					{meta.errors.length > 0 ? (
						<p className="text-red-400">{meta.errors[0]}</p>
					) : null}
				</div>
			)}
		</Field>
	);
};

export default Select;
