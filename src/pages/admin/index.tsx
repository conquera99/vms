import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { UrlObject } from 'url';
import { AppOutline, LocationOutline, TagOutline, TeamOutline } from 'antd-mobile-icons';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Image from 'next/image';

const Card: FC<{
	href: string | UrlObject;
	title?: string;
	desc?: string;
	icon?: ReactNode;
	extra?: ReactNode;
}> = ({ href, title, icon, extra, desc }) => {
	return (
		<Link href={href}>
			<a className="flex justify-between items-center group py-4 px-6 rounded-lg border border-white hover:border-indigo-500 shadow-lg bg-white">
				<div className="group-hover:text-indigo-500 flex">
					{icon}
					<div className="ml-4 text-gray-600 group-hover:text-indigo-400">
						<h2>{title}</h2>
						<small className="text-gray-400 group-hover:text-indigo-300">{desc}</small>
					</div>
				</div>
				<div>{extra}</div>
			</a>
		</Link>
	);
};

const CountInfo: FC<{ value?: number; desc?: string }> = ({ value, desc }) => {
	return (
		<div className="w-20 text-center group-hover:text-indigo-500">
			<p className="text-lg">{value}</p>
			<small className="text-gray-400 group-hover:text-indigo-400">{desc}</small>
		</div>
	);
};

const AdminHome = () => {
	return (
		<Navigation active="admin">
			<Title>Administrator</Title>
			<div className="p-4 mb-4">
				<Image src="/images/welcome.svg" width="500" height="250" alt="welcome-image" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card
					href="/location"
					icon={<LocationOutline className="text-4xl" />}
					title="Lokasi"
					desc="data-data lokasi item"
					extra={<CountInfo value={5} desc="Lokasi" />}
				/>
				<Card
					href="/item-category"
					icon={<TagOutline className="text-4xl" />}
					title="Kategori Item"
					desc="data-data kategori item"
					extra={<CountInfo value={25} desc="Kategori" />}
				/>
				<Card
					href="/item"
					icon={<AppOutline className="text-4xl" />}
					title="Item"
					desc="data-data item dan detailnya"
					extra={<CountInfo value={102} desc="Item" />}
				/>
				<Card
					href="/member"
					icon={<TeamOutline className="text-4xl" />}
					title="Anggota"
					desc="data-data umat vihara"
					extra={<CountInfo value={200} desc="Orang" />}
				/>
			</div>
		</Navigation>
	);
};

export default AdminHome;
