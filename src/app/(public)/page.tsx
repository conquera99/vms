'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Navigation as SwiperNavigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import dayjs from 'dayjs';

import 'swiper/css';
import 'swiper/css/navigation';

import Navigation from 'components/navigation';
import Container from 'components/general/container';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';
import {
	CalendarOutline,
	FolderOutline,
	MailOutline,
	PhoneOutline,
	PictureOutline,
	RightOutline,
	TeamOutline,
} from 'components/general/antd-icon';

import useListData from 'hooks/useListData';
import { datetimeFormat } from 'utils/constant';

const PostSkeleton = () => (
	<div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200/60 bg-white">
		<div className="h-52 bg-slate-100" />
		<div className="space-y-3 p-5">
			<div className="h-3 w-1/4 rounded-full bg-slate-100" />
			<div className="h-5 w-3/4 rounded-md bg-slate-100" />
			<div className="h-3 w-full rounded-md bg-slate-100" />
			<div className="h-3 w-2/3 rounded-md bg-slate-100" />
		</div>
	</div>
);

const BannerSkeleton = () => (
	<div className="animate-pulse">
		<div className="h-[320px] sm:h-[400px] lg:h-[480px] bg-slate-100 rounded-none" />
	</div>
);

export default function Home() {
	const { ref, data, isEmpty, isLoadingInitialData, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/post',
	});

	const [loading, setLoading] = useState(true);
	const [campaign, setCampaign] = useState<Record<string, any>[]>([]);

	useEffect(() => {
		axios
			.get('/api/campaign')
			.then((response) => {
				if (response.data.code === 0) {
					setCampaign(response.data.data);
				}
			})
			.finally(() => setLoading(false));
	}, []);

	return (
		<Navigation active="home" hideFooter={false}>
			{/* Hero Section */}
			<section className="relative">
				{!loading && campaign.length > 0 ? (
					<Swiper
						modules={[SwiperNavigation, Autoplay]}
						spaceBetween={0}
						slidesPerView={1}
						navigation
						autoplay={{ delay: 6000, disableOnInteraction: false }}
						className="hero-swiper"
					>
						{campaign.map((item) => (
							<SwiperSlide key={item.id}>
								<div className="relative h-[320px] sm:h-[400px] lg:h-[600px]">
									<Image
										src={item.image}
										alt={item.title}
										fill
										className="object-cover"
										priority
										sizes="100vw"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/40 to-slate-900/10" />
									<div className="absolute inset-0 flex items-end">
										<div className="w-full p-6">
											<div className="mx-auto max-w-5xl xl:max-w-7xl">
												<h1 className="mb-3 max-w-3xl text-1xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
													{item.title}
												</h1>
												<p className="mb-6 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base lg:text-lg">
													{item.desc}
												</p>
												<Link
													href={`/campaign/${item.slug}`}
													className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-amber-50"
												>
													Lihat Selengkapnya
													<RightOutline />
												</Link>
											</div>
										</div>
									</div>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				) : !loading ? (
					<div className="relative h-[320px] sm:h-[400px] lg:h-[480px] bg-linear-to-br from-[#7ea7cb] via-[#a8c5db] to-[#f2d9a4]">
						<div className="absolute inset-0 flex items-center justify-center px-5">
							<div className="text-center">
								<div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
									<Image src="/logo.png" alt="VSG Logo" width={60} height={60} />
								</div>
								<h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
									Vihara Sasana Graha
								</h1>
								<p className="mx-auto max-w-xl text-base text-white/85 sm:text-lg">
									Nunukan — Tempat bersemi kebajikan, kebersamaan, dan kedamaian.
								</p>
							</div>
						</div>
					</div>
				) : (
					<BannerSkeleton />
				)}
			</section>

			{/* About Quick Info */}
			<section className="relative bg-white">
				<div className="mx-auto max-w-5xl xl:max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{[
							{
								icon: <TeamOutline className="text-2xl" />,
								label: 'Komunitas',
								value: 'Umat Vihara',
								color: 'bg-rose-50 text-rose-600 border-rose-100',
							},
							{
								icon: <CalendarOutline className="text-2xl" />,
								label: 'Kegiatan',
								value: 'Rutin & Bulanan',
								color: 'bg-amber-50 text-amber-600 border-amber-100',
							},
							{
								icon: <FolderOutline className="text-2xl" />,
								label: 'Dokumentasi',
								value: 'Album & Galeri',
								color: 'bg-sky-50 text-sky-600 border-sky-100',
							},
							{
								icon: <PictureOutline className="text-2xl" />,
								label: 'Informasi',
								value: 'Post & Artikel',
								color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
							},
						].map((item, i) => (
							<div
								key={i}
								className={`flex items-center gap-4 rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${item.color}`}
							>
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
									{item.icon}
								</div>
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-60">
										{item.label}
									</p>
									<p className="mt-0.5 text-sm font-bold">{item.value}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Posts Section */}
			<section className="bg-gradient-to-b from-white to-slate-50">
				<Container>
					<div className="py-10 sm:py-14">
						<div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
							<div>
								<p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7ea7cb]">
									Artikel & Pengumuman
								</p>
								<h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
									Post Terbaru
								</h2>
							</div>
							<p className="max-w-sm text-sm text-slate-500">
								Informasi terkini seputar kegiatan dan pengumuman vihara.
							</p>
						</div>

						{isEmpty && (
							<div className="rounded-2xl border border-slate-200/60 bg-white p-8 text-center">
								<p className="text-sm text-slate-400">Belum ada post yang dipublikasikan.</p>
							</div>
						)}

						<div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
							{isLoadingInitialData && (
								<>
									<PostSkeleton />
									<PostSkeleton />
									<PostSkeleton />
								</>
							)}

							{data?.map((item: Record<string, any>) => (
								<article
									key={item.id}
									className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50"
								>
									<figure className="relative h-48 overflow-hidden sm:h-52">
										<Image
											src={item.image}
											alt={item.title}
											fill
											className="object-cover transition duration-500 group-hover:scale-105"
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
										<div className="absolute left-3 top-3 z-10">
											<span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-600 backdrop-blur-sm">
												<CalendarOutline className="text-[10px]" />
												{dayjs(item.createdAt).format('DD MMM YYYY')}
											</span>
										</div>
									</figure>
									<div className="p-4 sm:p-5">
										<h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug text-slate-800 transition group-hover:text-[#7ea7cb]">
											{item.title}
										</h3>
										<p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
											{item.summary}
										</p>
										<Link
											href={`/post/${item.slug}`}
											className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#edf4fa] px-3.5 py-1.5 text-sm font-semibold text-[#5d84a9] transition hover:bg-[#dcebf7]"
										>
											Baca Selengkapnya
											<RightOutline className="text-xs" />
										</Link>
									</div>
								</article>
							))}
						</div>

						<InfiniteScrollTrigger
							triggerRef={ref}
							isLoadingMore={isLoadingMore}
							isReachingEnd={isReachingEnd}
						/>
					</div>
				</Container>
			</section>

			{/* Footer CTA */}
			<section className="bg-white border-t border-slate-100">
				<Container>
					<div className="py-12 sm:py-16">
						<div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#7ea7cb] via-[#8fb3d4] to-[#f2d9a4] p-8 sm:p-12">
							<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
								<div>
									<p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
										Hubungi Kami
									</p>
									<h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
										Vihara Sasana Graha Nunukan
									</h2>
									<p className="mb-6 max-w-md text-sm leading-relaxed text-white/85">
										Kami menerima kunjungan dan partisipasi dari seluruh umat. Jangan
										ragu untuk menghubungi kami.
									</p>
									<div className="space-y-3">
										<div className="flex items-center gap-3 text-sm text-white/90">
											<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
												<PhoneOutline className="text-sm" />
											</div>
											<span>+62 XXX XXXX XXXX</span>
										</div>
										<div className="flex items-center gap-3 text-sm text-white/90">
											<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
												<MailOutline className="text-sm" />
											</div>
											<span>info@vsg.nunukan.net</span>
										</div>
									</div>
								</div>
								<div className="flex justify-center lg:justify-end">
									<div className="rounded-2xl bg-white/15 p-6 backdrop-blur-sm">
										<Image
											src="/logo.png"
											alt="VSG Logo"
											width={120}
											height={120}
											className="drop-shadow-lg"
										/>
										<p className="mt-3 text-center text-sm font-semibold text-white">
											VSG iApp
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Container>
			</section>
		</Navigation>
	);
}
