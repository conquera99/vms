import { AnchorHTMLAttributes, ButtonHTMLAttributes, FC, ReactNode, useState } from 'react';
import Link from 'next/link';
import { UrlObject } from 'url';
import Tooltip from 'rc-tooltip';

import { Loading } from 'components/general/icon';

interface BaseButtonProps {
	icon?: ReactNode;
	loading?: boolean;
	iconLocation?: 'left' | 'right';
	buttonType?: 'general' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
	size?: 'small' | 'normal';
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseButtonProps {}

interface LinkButtonProps
	extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
		BaseButtonProps {
	href: string | UrlObject;
}

interface ConfirmButtonProps extends ButtonProps {
	confirmTitle?: string;
	confirmText?: string;
	loading?: boolean;
}

const buttonTypeClass = {
	general: 'border-gray-400 hover:bg-gray-400 hover:text-white',
	danger: 'bg-red-500 text-white border-red-500 hover:bg-white hover:text-red-500',
	primary: 'bg-indigo-500 text-white border-indigo-500 hover:bg-white hover:text-indigo-500',
	warning:
		'bg-yellow-300 text-black border-yellow-300 hover:bg-white hover:border-yellow-500 hover:text-yellow-500',
	success: 'bg-green-500 text-white border-green-500 hover:bg-white hover:text-green-500',
	info: 'bg-blue-200 text-black border-blue-200 hover:bg-white hover:text-blue-400',
};

const sizeClass = {
	normal: 'px-6 py-3',
	small: 'px-3 py-1',
};

const defaultButtonClass =
	'transition-all font-semibold duration-200 disabled:opacity-75 flex items-center justify-center rounded-lg border';

const Button: FC<ButtonProps> = ({
	type,
	icon,
	loading,
	children,
	disabled,
	className,
	iconLocation = 'left',
	buttonType = 'general',
	size = 'normal',
	...rest
}) => {
	return (
		<button
			type={type || 'button'}
			className={`${defaultButtonClass} ${buttonTypeClass[buttonType]} ${sizeClass[size]} ${className}`}
			disabled={loading === true ? true : disabled}
			{...rest}
		>
			{iconLocation === 'left' && (loading ? <Loading /> : icon)}
			&nbsp;{children}&nbsp;
			{iconLocation === 'right' && (loading ? <Loading /> : icon)}
		</button>
	);
};

export default Button;

export const LinkButton: FC<LinkButtonProps> = ({
	href,
	loading,
	children,
	icon,
	className,
	buttonType = 'general',
	iconLocation = 'left',
	size = 'normal',
	...rest
}) => {
	return (
		<Link href={href}>
			<a
				className={`${defaultButtonClass} ${buttonTypeClass[buttonType]} ${sizeClass[size]} ${className}`}
				{...rest}
			>
				{iconLocation === 'left' && (loading ? <Loading /> : icon)}
				{children}
				{iconLocation === 'right' && (loading ? <Loading /> : icon)}
			</a>
		</Link>
	);
};

export const ConfirmButton: FC<ConfirmButtonProps> = ({
	className,
	confirmTitle,
	confirmText,
	loading,
	children,
	onClick,
}) => {
	const [visible, setVisible] = useState(false);

	const onCancel = () => {
		setVisible(false);
	};

	return (
		<Tooltip
			visible={visible}
			animation="zoom"
			placement="left"
			trigger="click"
			destroyTooltipOnHide={true}
			onVisibleChange={setVisible}
			overlay={
				<div className="bg-white shadow-md rounded-md p-4">
					<div>
						<p className="font-bold text-base">{confirmTitle || 'Warning!'}</p>
						<span className="text-sm">{confirmText}</span>
					</div>
					<div className="flex justify-end mt-2">
						<button onClick={onCancel} disabled={loading} className="px-4 py-1">
							Tidak
						</button>
						<button
							onClick={onClick}
							className={`${defaultButtonClass} ${buttonTypeClass.primary} ${sizeClass.small}`}
							disabled={loading}
						>
							{loading ? <Loading /> : null}&nbsp;Ya
						</button>
					</div>
				</div>
			}
		>
			<button className={className} type="button">
				{children}
			</button>
		</Tooltip>
	);
};
