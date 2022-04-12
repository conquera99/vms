import { Field } from 'rc-field-form';
import RCInputNumber from 'rc-input-number';
import { numberFormatter, numberParser } from 'utils/helper';

const Input = ({ value = '', placeholder = '', required = false, type = 'text', ...props }) => {
	return (
		<Field name={props.name} rules={props.rules}>
			{(control, meta) => (
				<div className={`mb-2 ${props.className || ''}`}>
					<label className="block mb-1">
						{props.label}
						{required && <span className="text-red-500">*</span>}
					</label>
					<input
						className="px-4 py-3 mb-1 rounded-lg border w-full text-black border-gray-600"
						value={value}
						placeholder={placeholder || props.label}
						type={type}
						{...props.input}
						{...control}
					/>
					{meta.errors.length > 0 ? (
						<p className="text-red-400">{meta.errors[0]}</p>
					) : null}
				</div>
			)}
		</Field>
	);
};

export default Input;

export const InputNumber = ({ value = '', placeholder = '', required = false, ...props }) => {
	return (
		<Field name={props.name} rules={props.rules}>
			{(control, meta) => (
				<div className={`mb-2 ${props.className}`}>
					<label className="block mb-1">
						{props.label}
						{required && <span className="text-red-500">*</span>}
					</label>
					<RCInputNumber
						// className="px-4 py-2 rounded-md border w-full text-black max-w-lg border-gray-600"
						value={value}
						placeholder={placeholder || props.label}
						formatter={numberFormatter}
						parser={numberParser}
						{...props.input}
						{...control}
					/>
					{meta.errors.length > 0 ? (
						<p className="text-red-400">{meta.errors[0]}</p>
					) : null}
				</div>
			)}
		</Field>
	);
};

export const TextArea = ({
	value = '',
	placeholder = '',
	required = false,
	type = 'text',
	...props
}) => {
	return (
		<Field name={props.name} rules={props.rules}>
			{(control, meta) => (
				<div className={`mb-2 ${props.className || ''}`}>
					<label className="block mb-1">
						{props.label}
						{required && <span className="text-red-500">*</span>}
					</label>
					<textarea
						className="px-4 py-3 mb-1 rounded-lg border w-full text-black border-gray-600"
						value={value}
						placeholder={placeholder || props.label}
						type={type}
						{...props.input}
						{...control}
					/>
					{meta.errors.length > 0 ? (
						<p className="text-red-400">{meta.errors[0]}</p>
					) : null}
				</div>
			)}
		</Field>
	);
};
