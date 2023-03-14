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
	const [hover, isHover] = useState(false);
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
			{!loading && campaign.length === 0 ? (
				<Empty desc="belum ada banner yang dipublikasi" />
			) : (
				<Swiper>
					{loading && (
						<SwiperSlide>
							<PostSkeleton />
						</SwiperSlide>
					)}
					{!loading &&
						campaign.map((item) => (
							<SwiperSlide
								key={item.id}
								onMouseEnter={() => isHover(true)}
								onMouseLeave={() => isHover(false)}
							>
								<div
									className="aspect-w-2 aspect-h-1 md:aspect-w-3 md:aspect-h-1 overflow-hidden bg-no-repeat bg-cover"
									style={{
										backgroundPosition: '50%',
										backgroundImage: `url(${item.image})`,
									}}
								>
									<div className="flex flex-col justify-end">
										<div className="flex flex-col justify-end z-10 px-4 py-2 sm:px-16 sm:py-6 bg-black/40 border-y-4 border-amber-500 backdrop-blur-sm">
											<h2 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-2 text-ellipsis overflow-hidden whitespace-nowrap">
												{item.title}
											</h2>
											<p className="hidden sm:block leading-relaxed text-white text-medium  text-ellipsis overflow-hidden whitespace-nowrap">
												{item.desc}
											</p>
											<Link key={item.slug} href={`/campaign/${item.slug}`}>
												<button className="mt-2 sm:mt-4 px-4 sm:px-8 py-2 border-2 w-full sm:w-[250px] text-white transform transition-all duration-700 hover:bg-amber-500">
													Lihat Selengkapnya
												</button>
											</Link>
										</div>
									</div>
								</div>
							</SwiperSlide>
						))}
				</Swiper>
			)}
			<Container>
				{/* <Title>Home</Title> */}

				<br />
				<h2 className="text-amber-500 font-bold text-2xl">Post</h2>

				{isEmpty && <Empty />}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
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
			</Container>
		</Navigation>
	);
};

export default Home;
