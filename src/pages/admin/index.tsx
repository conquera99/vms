import Link from 'next/link';
import { FC, ReactNode, useEffect, useState } from 'react';
import { UrlObject } from 'url';
import {
	AppOutline,
	CalendarOutline,
	CollectMoneyOutline,
	GiftOutline,
	GlobalOutline,
	HistogramOutline,
	LocationOutline,
	PayCircleOutline,
	ShopbagOutline,
	TagOutline,
	TeamOutline,
	UserAddOutline,
	UserContactOutline,
} from 'antd-mobile-icons';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Image from 'next/image';
import axios from 'axios';
import { useSession } from 'next-auth/react';

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
	const { data: session } = useSession();

	const [count, setCount] = useState({
		location: 0,
		itemCategory: 0,
		item: 0,
		member: 0,
		user: 0,
		permission: 0,
	});

	useEffect(() => {
		axios.get('/api/admin').then((response) => {
			if (response.data.code === 0) {
				setCount(response.data.data);
			}
		});
	}, []);

	console.log(session);

	return (
		<Navigation active="admin" isAdmin>
			<Title>Administrator</Title>
			<div className="p-4 mb-4 text-center">
				<Image src="/images/welcome.svg" width="200" height="100" alt="welcome-image" />
			</div>

			{(session?.user?.permissions?.location === true ||
				session?.user?.permissions?.item_category === true ||
				session?.user?.permissions?.item === true ||
				session?.user?.permissions?.member === true) && (
				<h3 className="font-bold text-lg">Data-data</h3>
			)}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{session?.user?.permissions?.location === true && (
					<Card
						href="/admin/location"
						icon={<LocationOutline className="text-4xl" />}
						title="Lokasi"
						desc="data-data lokasi item"
						extra={<CountInfo value={count.location} desc="Lokasi" />}
					/>
				)}
				{session?.user?.permissions?.item_category === true && (
					<Card
						href="/admin/item-category"
						icon={<TagOutline className="text-4xl" />}
						title="Kategori Item"
						desc="data-data kategori item"
						extra={<CountInfo value={count.itemCategory} desc="Kategori" />}
					/>
				)}
				{session?.user?.permissions?.item === true && (
					<Card
						href="/admin/item"
						icon={<GiftOutline className="text-4xl" />}
						title="Item"
						desc="data-data item"
						extra={<CountInfo value={count.item} desc="Item" />}
					/>
				)}
				{session?.user?.permissions?.member === true && (
					<Card
						href="/admin/member"
						icon={<TeamOutline className="text-4xl" />}
						title="Anggota"
						desc="data-data umat vihara"
						extra={<CountInfo value={count.member} desc="Orang" />}
					/>
				)}
			</div>

			{(session?.user?.permissions?.item_history === true ||
				session?.user?.permissions?.item_location === true) && (
				<h3 className="font-bold text-lg my-3">Atur Item</h3>
			)}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{session?.user?.permissions?.item_history === true && (
					<Card
						href="#"
						icon={<ShopbagOutline className="text-4xl" />}
						title="Beli Item"
						desc="tambah jumlah item"
					/>
				)}
				{session?.user?.permissions?.item_location === true && (
					<Card
						href="#"
						icon={<AppOutline className="text-4xl" />}
						title="Lokasi Item"
						desc="atur dan ubah lokasi item"
					/>
				)}
			</div>

			{(session?.user?.id === 'sysadm' ||
				session?.user?.permissions?.organization === true ||
				session?.user?.permissions?.period === true ||
				session?.user?.permissions?.org_structure === true ||
				session?.user?.permissions?.financial === true) && (
				<h3 className="font-bold text-lg my-3">Administrasi</h3>
			)}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{session?.user?.id === 'sysadm' && (
					<>
						<Card
							href="/admin/user"
							icon={<UserAddOutline className="text-4xl" />}
							title="User"
							desc="atur data pengguna"
							extra={<CountInfo value={count.user} desc="User" />}
						/>
						<Card
							href="/admin/permission"
							icon={<CollectMoneyOutline className="text-4xl" />}
							title="Hak Akses"
							desc="atur data hak akses"
							extra={<CountInfo value={count.permission} desc="Akses" />}
						/>
					</>
				)}
				{session?.user?.permissions?.organization === true && (
					<Card
						href="#"
						icon={<GlobalOutline className="text-4xl" />}
						title="Organisasi"
						desc="atur data organisasi"
						extra={<CountInfo value={0} desc="Data" />}
					/>
				)}
				{session?.user?.permissions?.period === true && (
					<Card
						href="#"
						icon={<CalendarOutline className="text-4xl" />}
						title="Periode"
						desc="atur periode organisasi"
						extra={<CountInfo value={0} desc="Data" />}
					/>
				)}
				{session?.user?.permissions?.org_structure === true && (
					<Card
						href="#"
						icon={<UserContactOutline className="text-4xl" />}
						title="Struktur Organisasi"
						desc="atur struktur organisasi"
					/>
				)}
				{session?.user?.permissions?.financial === true && (
					<Card
						href="#"
						icon={<PayCircleOutline className="text-4xl" />}
						title="Keuangan"
						desc="atur data keuangan"
						extra={<CountInfo value={0} desc="Data" />}
					/>
				)}
			</div>

			{(session?.user?.permissions?.report_item === true ||
				session?.user?.permissions?.report_financial === true) && (
				<h3 className="font-bold text-lg my-3">Laporan</h3>
			)}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{session?.user?.permissions?.report_item === true && (
					<Card
						href="#"
						icon={<HistogramOutline className="text-4xl" />}
						title="Laporan Lokasi Item"
						desc="laporan jumlah dan lokasi item"
					/>
				)}
				{session?.user?.permissions?.report_financial === true && (
					<Card
						href="#"
						icon={<HistogramOutline className="text-4xl" />}
						title="Laporan Keuangan"
						desc="laporan keluar masuk dana"
					/>
				)}
			</div>
		</Navigation>
	);
};

export default AdminHome;
