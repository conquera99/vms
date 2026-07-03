'use client';

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
	LoopOutline,
	PayCircleOutline,
	PicturesOutline,
	ShopbagOutline,
	TagOutline,
	TeamOutline,
	UserAddOutline,
	UserContactOutline,
} from 'components/general/antd-icon';

import Navigation from 'components/navigation';
import Container from 'components/general/container';

type CountState = {
	location: number;
	itemCategory: number;
	item: number;
	member: number;
	user: number;
	permission: number;
	campaign: number;
	post: number;
	album: number;
	image: number;
	deceased: number;
};

type Tone = 'sun' | 'sea' | 'forest' | 'rose' | 'slate';

const toneClass: Record<Tone, { border: string; icon: string; chip: string }> = {
	sun: {
		border: 'border-amber-300/70 hover:border-amber-500',
		icon: 'bg-amber-100 text-amber-700',
		chip: 'bg-amber-100 text-amber-700',
	},
	sea: {
		border: 'border-cyan-300/70 hover:border-cyan-500',
		icon: 'bg-cyan-100 text-cyan-700',
		chip: 'bg-cyan-100 text-cyan-700',
	},
	forest: {
		border: 'border-emerald-300/70 hover:border-emerald-500',
		icon: 'bg-emerald-100 text-emerald-700',
		chip: 'bg-emerald-100 text-emerald-700',
	},
	rose: {
		border: 'border-rose-300/70 hover:border-rose-500',
		icon: 'bg-rose-100 text-rose-700',
		chip: 'bg-rose-100 text-rose-700',
	},
	slate: {
		border: 'border-slate-300/70 hover:border-slate-500',
		icon: 'bg-slate-200 text-slate-700',
		chip: 'bg-slate-200 text-slate-700',
	},
};

type DashboardCard = {
	key: string;
	href: string | UrlObject;
	title: string;
	desc: string;
	icon: ReactNode;
	visible: boolean;
	tone: Tone;
	count?: number;
	countLabel?: string;
};

const Card: FC<{
	href: string | UrlObject;
	title: string;
	desc: string;
	icon: ReactNode;
	tone: Tone;
	extra?: ReactNode;
}> = ({ href, title, icon, tone, extra, desc }) => {
	const palette = toneClass[tone];

	return (
		<Link
			href={href}
			scroll={false}
			className={`group relative overflow-hidden rounded-2xl border bg-white/90 p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl ${palette.border}`}
		>
			<div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-100/70 transition duration-300 group-hover:scale-110" />
			<div className="relative flex items-center justify-between gap-4">
				<div className="flex min-w-0 items-start gap-4">
					<div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${palette.icon}`}>
						{icon}
					</div>
					<div className="min-w-0">
						<h2 className="truncate text-base font-semibold text-slate-800">{title}</h2>
						<p className="mt-1 text-sm text-slate-500">{desc}</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					{extra}
					<span className="text-lg text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700">
						→
					</span>
				</div>
			</div>
		</Link>
	);
};

const CountInfo: FC<{ value?: number; desc?: string; tone: Tone }> = ({ value, desc, tone }) => {
	const palette = toneClass[tone];

	return (
		<div className={`rounded-xl px-3 py-2 text-center ${palette.chip}`}>
			<p className="text-lg font-semibold leading-none">{value ?? 0}</p>
			<small className="text-[11px] uppercase tracking-wide">{desc}</small>
		</div>
	);
};

const Section: FC<{
	title: string;
	desc: string;
	cards: DashboardCard[];
}> = ({ title, desc, cards }) => {
	if (cards.length === 0) {
		return null;
	}

	return (
		<section className="mt-8 rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm backdrop-blur-sm md:p-6">
			<div className="mb-4 flex items-end justify-between gap-4">
				<div>
					<h3 className="text-xl font-bold text-slate-800">{title}</h3>
					<p className="text-sm text-slate-500">{desc}</p>
				</div>
				<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
					{cards.length} menu
				</span>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{cards.map((item) => (
					<Card
						key={item.key}
						href={item.href}
						title={item.title}
						desc={item.desc}
						icon={item.icon}
						tone={item.tone}
						extra={
							item.countLabel ? (
								<CountInfo value={item.count} desc={item.countLabel} tone={item.tone} />
							) : undefined
						}
					/>
				))}
			</div>
		</section>
	);
};

const AdminHome = () => {
	const { data: session } = useSession();
	const permissions = session?.user?.permissions || {};
	const isSysAdm = session?.user?.id === 'sysadm';

	const [count, setCount] = useState<CountState>({
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
		deceased: 0,
	});

	useEffect(() => {
		axios.get('/api/admin').then((response) => {
			if (response.data.code === 0) {
				setCount(response.data.data);
			}
		});
	}, []);

	const dataCards: DashboardCard[] = [
		{
			key: 'location',
			href: '/admin/location',
			title: 'Lokasi',
			desc: 'Data-data lokasi item',
			icon: <LocationOutline />,
			visible: permissions.location === true,
			tone: 'sea',
			count: count.location,
			countLabel: 'Lokasi',
		},
		{
			key: 'item-category',
			href: '/admin/item-category',
			title: 'Kategori Item',
			desc: 'Data-data kategori item',
			icon: <TagOutline />,
			visible: permissions.item_category === true,
			tone: 'forest',
			count: count.itemCategory,
			countLabel: 'Kategori',
		},
		{
			key: 'item',
			href: '/admin/item',
			title: 'Item',
			desc: 'Data-data item',
			icon: <GiftOutline />,
			visible: permissions.item === true,
			tone: 'sun',
			count: count.item,
			countLabel: 'Item',
		},
		{
			key: 'member',
			href: '/admin/member',
			title: 'Anggota',
			desc: 'Data-data umat vihara',
			icon: <TeamOutline />,
			visible: permissions.member === true,
			tone: 'rose',
			count: count.member,
			countLabel: 'Orang',
		},
		{
			key: 'deceased',
			href: '/admin/deceased',
			title: 'Mendiang',
			desc: 'Data-data mendiang',
			icon: <LoopOutline />,
			visible: permissions.deceased === true,
			tone: 'slate',
			count: count.deceased,
			countLabel: 'Orang',
		},
	];

	const itemCards: DashboardCard[] = [
		{
			key: 'buy-item',
			href: '/admin/buy-item',
			title: 'Beli Item',
			desc: 'Tambah jumlah item',
			icon: <ShopbagOutline />,
			visible: permissions.item_history === true,
			tone: 'sun',
		},
		{
			key: 'assign-item',
			href: '/admin/assign-item',
			title: 'Atur Lokasi',
			desc: 'Atur dan ubah lokasi item',
			icon: <AppOutline />,
			visible: permissions.item_location === true,
			tone: 'sea',
		},
	];

	const contentCards: DashboardCard[] = [
		{
			key: 'post',
			href: '/admin/post',
			title: 'Post',
			desc: 'Atur dan buat post',
			icon: <ContentOutline />,
			visible: permissions.post === true,
			tone: 'rose',
			count: count.post,
			countLabel: 'Post',
		},
		{
			key: 'campaign',
			href: '/admin/campaign',
			title: 'Campaign',
			desc: 'Atur dan buat campaign/donasi',
			icon: <HandPayCircleOutline />,
			visible: permissions.campaign === true,
			tone: 'forest',
			count: count.campaign,
			countLabel: 'Campaign',
		},
		{
			key: 'album',
			href: '/admin/album',
			title: 'Album',
			desc: 'Atur dan buat album',
			icon: <FolderOutline />,
			visible: permissions.album === true,
			tone: 'sea',
			count: count.album,
			countLabel: 'Album',
		},
		{
			key: 'image',
			href: '/admin/image',
			title: 'Gambar',
			desc: 'Atur dan unggah gambar',
			icon: <PicturesOutline />,
			visible: permissions.image === true,
			tone: 'sun',
			count: count.image,
			countLabel: 'Gambar',
		},
	];

	const adminCards: DashboardCard[] = [
		{
			key: 'user',
			href: '/admin/user',
			title: 'User',
			desc: 'Atur data pengguna',
			icon: <UserAddOutline />,
			visible: isSysAdm,
			tone: 'rose',
			count: count.user,
			countLabel: 'User',
		},
		{
			key: 'permission',
			href: '/admin/permission',
			title: 'Hak Akses',
			desc: 'Atur data hak akses',
			icon: <CollectMoneyOutline />,
			visible: isSysAdm,
			tone: 'sun',
			count: count.permission,
			countLabel: 'Akses',
		},
		{
			key: 'organization',
			href: '#',
			title: 'Organisasi',
			desc: 'Atur data organisasi',
			icon: <GlobalOutline />,
			visible: permissions.organization === true,
			tone: 'sea',
			count: 0,
			countLabel: 'Data',
		},
		{
			key: 'period',
			href: '#',
			title: 'Periode',
			desc: 'Atur periode organisasi',
			icon: <CalendarOutline />,
			visible: permissions.period === true,
			tone: 'slate',
			count: 0,
			countLabel: 'Data',
		},
		{
			key: 'structure',
			href: '#',
			title: 'Struktur Organisasi',
			desc: 'Atur struktur organisasi',
			icon: <UserContactOutline />,
			visible: permissions.org_structure === true,
			tone: 'forest',
		},
		{
			key: 'financial',
			href: '#',
			title: 'Keuangan',
			desc: 'Atur data keuangan',
			icon: <PayCircleOutline />,
			visible: permissions.financial === true,
			tone: 'rose',
			count: 0,
			countLabel: 'Data',
		},
	];

	const reportCards: DashboardCard[] = [
		{
			key: 'report-item',
			href: '#',
			title: 'Laporan Lokasi Item',
			desc: 'Laporan jumlah dan lokasi item',
			icon: <HistogramOutline />,
			visible: permissions.report_item === true,
			tone: 'sea',
		},
		{
			key: 'report-financial',
			href: '#',
			title: 'Laporan Keuangan',
			desc: 'Laporan keluar masuk dana',
			icon: <HistogramOutline />,
			visible: permissions.report_financial === true,
			tone: 'forest',
		},
	];

	const visibleDataCards = dataCards.filter((card) => card.visible);
	const visibleItemCards = itemCards.filter((card) => card.visible);
	const visibleContentCards = contentCards.filter((card) => card.visible);
	const visibleAdminCards = adminCards.filter((card) => card.visible);
	const visibleReportCards = reportCards.filter((card) => card.visible);

	const totalVisibleMenus =
		visibleDataCards.length +
		visibleItemCards.length +
		visibleContentCards.length +
		visibleAdminCards.length +
		visibleReportCards.length;

	return (
		<Navigation title="VMS: Menu Admin" active="admin" isAdmin>
			<Container>
				<div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-orange-100 via-amber-50 to-cyan-50 p-6 shadow-lg md:p-8 mt-6">
					<div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-amber-200/60 blur-2xl" />
					<div className="absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-cyan-200/70 blur-2xl" />
					<div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
						<div>
							<p className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
								Dashboard Admin
							</p>
							<h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
								Administrator Menu
							</h2>
							<p className="mt-3 max-w-xl text-sm text-slate-600 md:text-base">
								Kelola data operasional vihara, pantau ringkasan konten, dan akses fitur sesuai hak pengguna.
							</p>

							<div className="mt-5 flex flex-wrap gap-2">
								<span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
									{totalVisibleMenus} Menu Tersedia
								</span>
								<span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
									{isSysAdm ? 'System Administrator' : session?.user?.name || 'Administrator'}
								</span>
							</div>
						</div>

						<div className="mx-auto w-full max-w-sm rounded-2xl border border-white/70 bg-white/70 p-4 shadow">
							<Image
								src="/images/welcome.svg"
								width={360}
								height={220}
								alt="welcome-image"
								style={{
									maxWidth: '100%',
									height: 'auto',
									width: '100%',
								}}
							/>
						</div>
					</div>
				</div>

				{totalVisibleMenus === 0 && (
					<div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-6 text-center text-amber-800">
						<h3 className="text-lg font-bold">Belum ada menu yang dapat diakses</h3>
						<p className="mt-1 text-sm">
							Silakan hubungi administrator untuk mendapatkan hak akses sesuai kebutuhan.
						</p>
					</div>
				)}
				<Section
					title="Data-data"
					desc="Master data inti untuk operasional vihara"
					cards={visibleDataCards}
				/>
				<Section
					title="Atur Item"
					desc="Pembelian item dan penempatan per lokasi"
					cards={visibleItemCards}
				/>
				<Section
					title="Konten"
					desc="Kelola post, campaign, album, dan media"
					cards={visibleContentCards}
				/>
				<Section
					title="Administrasi"
					desc="Pengaturan pengguna, akses, dan struktur organisasi"
					cards={visibleAdminCards}
				/>
				<Section
					title="Laporan"
					desc="Ringkasan dan analisis data penting"
					cards={visibleReportCards}
				/>
			</Container>
		</Navigation>
	);
};

export default AdminHome;
