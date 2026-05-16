import Link from 'next/link';
import { FC } from 'react';
import { UrlObject } from 'url';

type BreadcrumbVariant = 'default' | 'post';

const Item: FC<{
	title: string;
	href?: string | UrlObject;
	isCurrent?: boolean;
	variant?: BreadcrumbVariant;
}> = ({
	title,
	href,
	isCurrent,
	variant = 'default',
}) => {
	if (variant === 'post') {
		if (isCurrent === true) {
			return (
				<li
					className="truncate text-sm font-semibold text-[#5d84a9]"
					aria-current="page"
				>
					{title}
				</li>
			);
		}

		return (
			<li className="text-sm text-slate-500 transition duration-300 hover:text-[#5d84a9]">
				<Link href={href as string | UrlObject}>{title}</Link>
			</li>
		);
	}

	if (isCurrent === true) {
		return (
			<li
				className="breadcrumb-item active text-amber-500 hover:text-amber-500 mx-2"
				aria-current="page"
			>
				{title}
			</li>
		);
	}

	return (
        <li className="breadcrumb-item text-gray-600">
            <Link
                href={href as string | UrlObject}
                className="text-gray-600 hover:text-amber-500 mx-2">
				{title}
			</Link>
        </li>
    );
};

const Breadcrumb: FC<{ data: Record<string, any>[]; variant?: BreadcrumbVariant }> = ({
	data,
	variant = 'default',
}) => {
	if (variant === 'post') {
		return (
			<nav aria-label="Breadcrumb" className="mb-3 sm:mb-4">
				<ol className="inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
					{data.map((item, index) => {
						const isCurrent = index === data.length - 1;

						return (
							<li key={item.title} className="inline-flex min-w-0 items-center gap-2">
								{index > 0 && (
									<span className="text-xs text-slate-400">/</span>
								)}
								<Item
									title={item.title}
									href={item.href}
									isCurrent={isCurrent}
									variant="post"
								/>
							</li>
						);
					})}
				</ol>
			</nav>
		);
	}

	return (
		<ol className="-ml-2 breadcrumb flex">
			{data.map((item, index) => {
				return (
					<Item
						key={item.title}
						title={item.title}
						href={item.href}
						isCurrent={index === data.length - 1}
						variant={variant}
					/>
				);
			})}
		</ol>
	);
};

export default Breadcrumb;
