import { Field } from 'rc-field-form';
import Picker from 'rc-picker';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import locale from 'rc-picker/lib/locale/en_US';

const DatePicker = ({ ...props }) => (
	<Field name={props.name} rules={props.rules}>
		{(control, meta) => (
			<div className={`mb-2 ${props.className}`}>
				{props.label && (
					<label htmlFor={props.id || props.name} className="mb-1 block">
						{props.label}
					</label>
				)}
				<Picker
					locale={locale}
					placeholder={props.placeholder || props.label}
					generateConfig={dayjsGenerateConfig}
					className="text-black"
					format="DD MMM YYYY"
					disabled={props.disabled}
					{...control}
				/>
				{meta.errors?.length > 0 && meta.errors.join(',') !== '' && (
					<span className="text-light-red text-sm">{meta.errors.join(',')}</span>
				)}
			</div>
		)}
	</Field>
);

export default DatePicker;
