import { useEffect, useState } from 'react';
import axios from 'axios';
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

const BannerSkeleton = () => (
	<div className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white">
		<div className="h-56 bg-slate-200 sm:h-72 lg:h-96" />
		<div className="space-y-3 p-4 sm:p-6">
			<div className="h-7 w-2/3 rounded-md bg-slate-200" />
			<div className="h-4 w-5/6 rounded-md bg-slate-200" />
			<div className="h-10 w-40 rounded-xl bg-slate-200" />
		</div>
	</div>
);

const Home = () => {
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
			<section className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
				{!loading && campaign.length === 0 ? (
					<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
						<Empty desc="belum ada banner yang dipublikasi" />
					</div>
				) : (
					<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
						<Swiper
							modules={[SwiperNavigation]}
							spaceBetween={16}
							slidesPerView={1}
							navigation={true}
						>
							{loading && (
								<SwiperSlide>
									<BannerSkeleton />
								</SwiperSlide>
							)}
							{!loading &&
								campaign.map((item) => (
									<SwiperSlide key={item.id}>
										<div
											className="relative flex min-h-[260px] items-end bg-cover bg-center bg-no-repeat sm:min-h-[340px] lg:min-h-[420px]"
											style={{
												backgroundImage: `url(${item.image})`,
											}}
										>
											<div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-transparent" />
											<div className="relative z-10 w-full px-4 py-5 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
												<p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-white/80">Campaign</p>
												<h2 className="mb-3 text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
													{item.title}
												</h2>
												<p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">{item.desc}</p>
												<Link
													href={`/campaign/${item.slug}`}
													className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-amber-300 sm:mt-6"
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
				<section className="mt-8 pb-2 sm:mt-10">
					<div className="mb-5 flex items-end justify-between gap-3 sm:mb-7">
						<div>
							<p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Latest Updates</p>
							<h2 className="text-2xl font-semibold text-slate-800 sm:text-3xl">Post</h2>
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

export default Home;
