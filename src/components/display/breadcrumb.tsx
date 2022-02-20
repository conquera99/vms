import Link from 'next/link';
import { FC } from 'react';
import { UrlObject } from 'url';

const Item: FC<{ title: string; href?: string | UrlObject; isCurrent?: boolean }> = ({
	title,
	href,
	isCurrent,
}) => {
	if (isCurrent === true) {
		return (
			<li
				className="breadcrumb-item active text-indigo-500 hover:text-indigo-500 mx-2"
				aria-current="page"
			>
				{title}
			</li>
		);
	}

	return (
		<li className="breadcrumb-item text-gray-600">
			<Link href={href as string | UrlObject}>
				<a className="text-gray-600 hover:text-indigo-500 mr-2">{title}</a>
			</Link>
		</li>
	);
};

const Breadcrumb: FC<{ data: Record<string, any>[] }> = ({ data }) => {
	return (
		<ol className="breadcrumb flex">
			{data.map((item, index) => {
				return (
					<Item
						key={item.title}
						title={item.title}
						href={item.href}
						isCurrent={index === data.length - 1}
					/>
				);
			})}
		</ol>
	);
};

export default Breadcrumb;
