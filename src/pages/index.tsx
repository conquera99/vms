import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Navigation as SwiperNavigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Empty from 'components/display/empty';
import Post from 'components/display/post';
import Container from 'components/general/container';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';
import BlurImage from 'components/display/BlurImage';

import useListData from 'hooks/useListData';
import dayjs from 'dayjs';
import { dateFormat } from 'utils/constant';

const PostSkeleton = () => (
	<div className="block bg-gray-200 animate-pulse rounded-lg my-5 border border-transparent relative">
		<div className="h-60" />
		<div className="p-1">
			<div className="animate-pulse p-4 rounded-lg">
				<div className="w-3/6 bg-gray-400 h-8 mb-2 rounded-md" />
				<div className="w-2/6 bg-gray-400 mb-3 h-3 rounded-md" />
				<div className="w-full bg-gray-400 mb-2 h-4 rounded-md" />
				<div className="w-full bg-gray-400 h-4 rounded-md" />
			</div>
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
		<Navigation active="home">
			<Container>
				<Title>Home</Title>
				<h1>Test ubah</h1>

				{!loading && campaign.length === 0 ? (
					<Empty desc="belum ada banner yang dipublikasi" />
				) : (
					<Swiper modules={[SwiperNavigation]} spaceBetween={50} slidesPerView={1}>
						{loading && (
							<SwiperSlide>
								<PostSkeleton />
							</SwiperSlide>
						)}
						{!loading &&
							campaign.map((item) => (
								<SwiperSlide key={item.id}>
									<Link href={`/campaign/${item.slug}`}>
										<a>
											<BlurImage
												src={item.image}
												alt={item.title}
												className="aspect-w-2 aspect-h-1 md:aspect-w-3 md:aspect-h-1"
											>
												<div className="flex items-end p-1">
													<div className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-lg w-full">
														<h2 className="text-white text-ellipsis overflow-hidden whitespace-nowrap text-xl font-bold leading-tight pr-5">
															{item.title}
														</h2>
														<div className="text-base text-gray-200 font-medium">
															<small className="text-sm text-gray-300">
																{dayjs(item.startDate).format(
																	dateFormat,
																)}
																&nbsp;-&nbsp;
																{dayjs(item.endDate).format(
																	dateFormat,
																)}
															</small>
														</div>
													</div>
												</div>
											</BlurImage>
										</a>
									</Link>
								</SwiperSlide>
							))}
					</Swiper>
				)}

				<br />
				<h2 className="text-indigo-500 font-bold text-2xl">Post</h2>

				{isEmpty && <Empty />}

				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-2">
					{isLoadingInitialData && (
						<>
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
			</Container>
		</Navigation>
	);
};

export default Home;
