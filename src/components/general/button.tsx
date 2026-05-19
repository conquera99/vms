import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, FC, ReactNode } from 'react';
import { Button as AntButton, Popconfirm } from 'antd';
import Link from 'next/link';
import { UrlObject } from 'url';

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
	general: 'border-gray-300 text-slate-700 hover:!border-gray-400 hover:!text-slate-900',
	danger:
		'!bg-red-500 !text-white !border-red-500 hover:!bg-white hover:!text-red-500',
	primary:
		'!bg-indigo-500 !text-white !border-indigo-500 hover:!bg-white hover:!text-indigo-500',
	warning:
		'!bg-yellow-300 !text-black !border-yellow-300 hover:!bg-white hover:!border-yellow-500 hover:!text-yellow-500',
	success:
		'!bg-green-500 !text-white !border-green-500 hover:!bg-white hover:!text-green-500',
	info:
		'!bg-blue-200 !text-black !border-blue-200 hover:!bg-white hover:!text-blue-400',
} as const;

const sizeClass = {
	normal: 'middle',
	small: 'small',
} as const;

const sizeStyle = {
	normal: {
		minHeight: '2.75rem',
		paddingBlock: '0.55rem',
		paddingInline: '1.5rem',
	},
	small: {
		minHeight: '2rem',
		paddingBlock: '0.35rem',
		paddingInline: '0.9rem',
	},
} as const;

const defaultButtonClass =
	'app-button !inline-flex !items-center !justify-center gap-2 !rounded-lg !font-semibold !shadow-none transition-all duration-200 disabled:opacity-75';

const renderContent = ({
	children,
	icon,
	iconLocation,
	loading,
}: Pick<ButtonProps, 'children' | 'icon' | 'iconLocation' | 'loading'>) => {
	const iconNode = !loading && icon ? <span className="inline-flex">{icon}</span> : null;

	return (
		<span className="inline-flex items-center justify-center gap-2 align-middle">
			{iconLocation === 'left' && iconNode}
			{children ? <span className="inline-flex items-center">{children}</span> : null}
			{iconLocation === 'right' && iconNode}
		</span>
	);
};

const getButtonClasses = ({
	buttonType,
	className,
}: Pick<BaseButtonProps, 'buttonType'> & { className?: string }) =>
	`${defaultButtonClass} ${buttonTypeClass[buttonType || 'general']} ${className || ''}`.trim();

const getButtonStyle = ({
	size,
	style,
}: {
	size: BaseButtonProps['size'];
	style?: CSSProperties;
}): CSSProperties => ({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	verticalAlign: 'middle',
	height: 'auto',
	lineHeight: 1.2,
	borderWidth: 1,
	...sizeStyle[size || 'normal'],
	...style,
});

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
	style,
	...rest
}) => {
	return (
		<AntButton
			htmlType={type || 'button'}
			loading={loading}
			disabled={loading === true ? true : disabled}
			size={sizeClass[size]}
			className={getButtonClasses({ buttonType, className })}
			style={getButtonStyle({ size, style })}
			{...rest}
		>
			{renderContent({ children, icon, iconLocation, loading })}
		</AntButton>
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
	style,
	...rest
}) => {
	return (
		<Link href={href} legacyBehavior passHref>
			<AntButton
				loading={loading}
				size={sizeClass[size]}
				className={getButtonClasses({ buttonType, className })}
				style={getButtonStyle({ size, style })}
				{...rest}
			>
				{renderContent({ children, icon, iconLocation, loading })}
			</AntButton>
		</Link>
	);
};

export const ConfirmButton: FC<ConfirmButtonProps> = ({
	className,
	confirmTitle,
	confirmText,
	loading,
	children,
	icon,
	iconLocation = 'left',
	buttonType = 'general',
	size = 'normal',
	type,
	disabled,
	onClick,
	style,
	...rest
}) => {
	return (
		<Popconfirm
			placement="left"
			title={confirmTitle || 'Warning!'}
			description={confirmText}
			onConfirm={onClick}
			okText="Ya"
			cancelText="Tidak"
			okButtonProps={{ loading }}
		>
			<AntButton
				htmlType={type || 'button'}
				disabled={loading === true ? true : disabled}
				size={sizeClass[size]}
				className={getButtonClasses({ buttonType, className })}
				style={getButtonStyle({ size, style })}
				{...rest}
			>
				{renderContent({ children, icon, iconLocation, loading })}
			</AntButton>
		</Popconfirm>
	);
};
