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
				<Swiper
					navigation={true}
					modules={[SwiperNavigation]}
					spaceBetween={50}
					slidesPerView={1}
				>
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
								/>
								<div className="container mx-auto px-10 md:px-12 xl:px-16">
									<div className="text-center text-gray-800">
										<div
											className="block rounded-lg  py-8 md:py-12 px-4 md:px-12 lg:px-12 border-2 border-amber-500  shadow-lg shadow-neutral-400 hover:shadow-neutral-500 my-6 mt-[-50px] md:mt-[-100px] lg:mt-[-130px]"
											style={{
												background: 'hsla(0, 0%, 100%, 0.7)',
												backdropFilter: 'blur(30px)',
											}}
										>
											<h2 className="text-2xl md:text-3xl xl:text-5xl font-bold tracking-tight text-black text-ellipsis overflow-hidden whitespace-nowrap leading-tight pr-5 mb-8">
												{item.title}
											</h2>
											<div className="text-base text-slate-800 font-medium">
												<small className="text-sm text-slate-700">
													{dayjs(item.startDate).format(dateFormat)}
													&nbsp;-&nbsp;
													{dayjs(item.endDate).format(dateFormat)}
												</small>
											</div>
											<Link key={item.slug} href={`/campaign/${item.slug}`}>
												<a
													className="inline-block px-7 py-3 text-white font-medium text-sm leading-snug bg-transparent text-amber-500 font-medium text-xs leading-tight uppercase rounded hover:text-amber-600 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-0 active:bg-gray-200 transition duration-500 ease-in-out"
													data-mdb-ripple="true"
													data-mdb-ripple-color="light"
													href="#!"
													role="button"
												>
													Lihat Selengkapnya
												</a>
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
