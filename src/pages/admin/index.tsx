import { FC, ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { UrlObject } from 'url';
import {
	AppOutline,
	CalendarOutline,
	CollectMoneyOutline,
	ContentOutline,
	FolderOutline,
	GiftOutline,
	GlobalOutline,
	HandPayCircleOutline,
	HistogramOutline,
	LocationOutline,
	PayCircleOutline,
	PicturesOutline,
	ShopbagOutline,
	TagOutline,
	TeamOutline,
	UserAddOutline,
	UserContactOutline,
} from 'antd-mobile-icons';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Container from 'components/general/container';

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
		campaign: 0,
		post: 0,
		album: 0,
		image: 0,
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
		<Navigation title="VMS: Menu Admin" active="admin" isAdmin>
			<Container>
				<Title>Administrator Menu</Title>
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
							href="/admin/buy-item"
							icon={<ShopbagOutline className="text-4xl" />}
							title="Beli Item"
							desc="tambah jumlah item"
						/>
					)}
					{session?.user?.permissions?.item_location === true && (
						<Card
							href="/admin/assign-item"
							icon={<AppOutline className="text-4xl" />}
							title="Atur Lokasi"
							desc="atur dan ubah lokasi item"
						/>
					)}
				</div>

				{(session?.user?.permissions?.album === true ||
					session?.user?.permissions?.post === true ||
					session?.user?.permissions?.image === true) && (
					<h3 className="font-bold text-lg my-3">Konten</h3>
				)}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{session?.user?.permissions?.post === true && (
						<Card
							href="/admin/post"
							icon={<ContentOutline className="text-4xl" />}
							title="Post"
							desc="atur dan buat post"
							extra={<CountInfo value={count.post} desc="Post" />}
						/>
					)}
					{session?.user?.permissions?.campaign === true && (
						<Card
							href="/admin/campaign"
							icon={<HandPayCircleOutline className="text-4xl" />}
							title="Campaign"
							desc="atur dan buat campaign/donasi"
							extra={<CountInfo value={count.campaign} desc="Campaign" />}
						/>
					)}
					{session?.user?.permissions?.album === true && (
						<Card
							href="/admin/album"
							icon={<FolderOutline className="text-4xl" />}
							title="Album"
							desc="atur dan buat album"
							extra={<CountInfo value={count.album} desc="Album" />}
						/>
					)}
					{session?.user?.permissions?.image === true && (
						<Card
							href="/admin/image"
							icon={<PicturesOutline className="text-4xl" />}
							title="Gambar"
							desc="atur dan unggah gambar"
							extra={<CountInfo value={count.image} desc="Gambar" />}
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
			</Container>
		</Navigation>
	);
};

export default AdminHome;
