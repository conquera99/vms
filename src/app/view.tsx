'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Navigation as SwiperNavigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import Navigation from 'components/navigation';
import Empty from 'components/display/empty';
import Post from 'components/display/post';
import Container from 'components/general/container';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';

import useListData from 'hooks/useListData';

const PostSkeleton = () => (
	<div className="relative my-4 block animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
		<div className="h-44 bg-slate-200 sm:h-56" />
		<div className="space-y-3 p-4 sm:p-5">
			<div className="h-6 w-3/5 rounded-md bg-slate-200" />
			<div className="h-3 w-1/3 rounded-md bg-slate-200" />
			<div className="h-4 w-full rounded-md bg-slate-200" />
			<div className="h-4 w-5/6 rounded-md bg-slate-200" />
		</div>
	</div>
);

const HomeView: FC<{
	initialCampaigns: Record<string, any>[];
	initialPosts: Record<string, any>[];
}> = ({ initialCampaigns, initialPosts }) => {
	const { ref, data, isEmpty, isLoadingInitialData, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/post',
		initialData: initialPosts,
	});

	return (
		<Navigation active="home" hideFooter={false}>
			<section className="relative overflow-hidden px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
				<div className="pointer-events-none absolute -right-16 -top-10 h-48 w-48 rounded-full bg-[#f3deb1]/50 blur-3xl sm:h-64 sm:w-64" />
				<div className="pointer-events-none absolute -left-20 top-28 h-44 w-44 rounded-full bg-[#c8dded]/55 blur-3xl sm:h-56 sm:w-56" />
				{initialCampaigns.length === 0 ? (
					<div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-8">
						<Empty desc="belum ada banner yang dipublikasi" />
					</div>
				) : (
					<div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/85 shadow-xl shadow-slate-200/40 backdrop-blur-sm">
					<div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-r from-[#c8dded]/60 via-[#f4e3bd]/55 to-[#d7e6f2]/60" />
						<Swiper
							modules={[SwiperNavigation]}
							spaceBetween={16}
							slidesPerView={1}
							navigation={true}
						>
							{initialCampaigns.map((item) => (
								<SwiperSlide key={item.id}>
									<div
										className="relative flex min-h-[280px] items-end bg-cover bg-center bg-no-repeat sm:min-h-[360px] lg:min-h-[460px]"
										style={{
											backgroundImage: `url(${item.image})`,
										}}
									>
										<div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-transparent" />
										<div className="relative z-10 w-full px-4 py-6 sm:px-8 sm:py-9 lg:px-12 lg:py-12">
											<p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">Campaign Highlight</p>
											<h2 className="mb-3 max-w-3xl text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-5xl">
												{item.title}
											</h2>
											<p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">{item.desc}</p>
											<Link
												href={`/campaign/${item.slug}`}
												className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition duration-300 hover:bg-[#f4e3bd] sm:mt-6"
											>
												Lihat Selengkapnya
											</Link>
										</div>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				)}
			</section>
			<Container>
				<section className="mt-8 rounded-3xl border border-white/70 bg-white/75 p-4 shadow-xl shadow-slate-200/35 backdrop-blur-sm sm:mt-10 sm:p-6 lg:p-8">
					<div className="mb-5 flex items-end justify-between gap-3 sm:mb-7">
						<div>
							<p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Latest Updates</p>
							<h2 className="text-2xl font-semibold text-slate-800 sm:text-3xl">Post Terbaru</h2>
						</div>
					</div>

					{isEmpty && <Empty />}

					<div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
						{isLoadingInitialData && (
							<>
								<PostSkeleton />
								<PostSkeleton />
								<PostSkeleton />
							</>
						)}

						{data?.map((item: Record<string, any>) => {
							return <Post key={item.id} data={item} />;
						})}
					</div>

					<InfiniteScrollTrigger
						triggerRef={ref}
						isLoadingMore={isLoadingMore}
						isReachingEnd={isReachingEnd}
					/>
				</section>
			</Container>
		</Navigation>
	);
};

export default HomeView;
