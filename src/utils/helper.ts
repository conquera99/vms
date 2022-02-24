import { DefaultOptionType } from 'rc-select/lib/Select';

export const selectFilter = (input: string, option: DefaultOptionType | undefined): boolean =>
	(option?.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0;

export const formatNumber = (
	value: number,
	locale = 'en-ID',
	options: Record<string, unknown> = { style: 'decimal' },
): string => new Intl.NumberFormat(locale, options).format(value);

export const numberFormatter = (value: number | undefined): string =>
	value && !Number.isNaN(Number(value)) ? formatNumber(value) : '0';

export const numberParser = (value: string | undefined, locale: 'en' | 'id' = 'en'): number => {
	if (locale === 'en') {
		return value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0;
	}

	return value ? Number(value.replace(/\$\s?|(\.*)/g, '').replace(',', '.')) : 0;
};
