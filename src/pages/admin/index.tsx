import Link from 'next/link';
import { FC, ReactNode, useEffect, useState } from 'react';
import { UrlObject } from 'url';
import {
	AppOutline,
	GiftOutline,
	HistogramOutline,
	LocationOutline,
	ShopbagOutline,
	TagOutline,
	TeamOutline,
} from 'antd-mobile-icons';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Image from 'next/image';
import axios from 'axios';

const Card: FC<{
	href: string | UrlObject;
	title?: string;
	desc?: string;
	icon?: ReactNode;
	extra?: ReactNode;
}> = ({ href, title, icon, extra, desc }) => {
	return (
		<Link href={href} scroll={false}>
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
	const [count, setCount] = useState({ location: 0, itemCategory: 0, item: 0, member: 0 });

	useEffect(() => {
		axios.get('/api/admin').then((response) => {
			if (response.data.code === 0) {
				setCount(response.data.data);
			}
		});
	}, []);

	return (
		<Navigation active="admin" isAdmin>
			<Title>Administrator</Title>
			<div className="p-4 mb-4 text-center">
				<Image src="/images/welcome.svg" width="200" height="100" alt="welcome-image" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<h3 className="font-bold text-lg">Data-data</h3>
				<Card
					href="/admin/location"
					icon={<LocationOutline className="text-4xl" />}
					title="Lokasi"
					desc="data-data lokasi item"
					extra={<CountInfo value={count.location} desc="Lokasi" />}
				/>
				<Card
					href="/admin/item-category"
					icon={<TagOutline className="text-4xl" />}
					title="Kategori Item"
					desc="data-data kategori item"
					extra={<CountInfo value={count.itemCategory} desc="Kategori" />}
				/>
				<Card
					href="/admin/item"
					icon={<GiftOutline className="text-4xl" />}
					title="Item"
					desc="data-data item"
					extra={<CountInfo value={count.item} desc="Item" />}
				/>
				<Card
					href="/admin/member"
					icon={<TeamOutline className="text-4xl" />}
					title="Anggota"
					desc="data-data umat vihara"
					extra={<CountInfo value={count.member} desc="Orang" />}
				/>
				<h3 className="font-bold text-lg">Atur Item</h3>
				<Card
					href="#"
					icon={<ShopbagOutline className="text-4xl" />}
					title="Beli Item"
					desc="tambah jumlah item"
				/>
				<Card
					href="#"
					icon={<AppOutline className="text-4xl" />}
					title="Lokasi Item"
					desc="atur dan ubah lokasi item"
				/>
				<h3 className="font-bold text-lg">Laporan</h3>
				<Card
					href="#"
					icon={<HistogramOutline className="text-4xl" />}
					title="Laporan Lokasi Item"
					desc="laporan jumlah dan lokasi item"
				/>
			</div>
		</Navigation>
	);
};

export default AdminHome;
