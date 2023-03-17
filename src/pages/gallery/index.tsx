import Link from 'next/link';
import { FolderOutline } from 'antd-mobile-icons';
import dayjs from 'dayjs';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Empty from 'components/display/empty';
import Container from 'components/general/container';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';

import useListData from 'hooks/useListData';

const AlbumSkeleton = () => (
	<div className="animate-pulse block rounded-lg bg-gray-200 my-5 border border-transparent relative">
		<div className="p-6 flex items-center">
			<div className="w-8 bg-gray-300 h-8 mr-2 rounded-full" />
			<div className="w-5/6 bg-gray-300 h-8 rounded-md" />
		</div>
	</div>
);

const Gallery = () => {
	const { ref, data, isEmpty, isLoadingInitialData, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/gallery/album',
	});

	return (
		<Navigation title="VMS: Galeri" active="gallery">
			<Container>
				<Title>
					<h2 className="text-amber-500 font-bold text-2xl">Galeri</h2>
				</Title>

				{isEmpty && <Empty />}

				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
					{isLoadingInitialData && (
						<>
							<AlbumSkeleton />
							<AlbumSkeleton />
						</>
					)}

					{data?.map((item: Record<string, any>) => {
						return (
							<Link key={item.slug} href={`/gallery/album/${item.slug}`}>
								<a className="block rounded-lg bg-yellow-50 my-5 border border-transparent shadow-md relative transform transition-all duration-300 scale-100 hover:shadow-lg">
									<div className="p-6 flex items-center">
										<FolderOutline className="text-3xl mr-2" />
										<div>
											<h2 className="text-ellipsis overflow-hidden whitespace-nowrap text-xl font-bold leading-tight pr-5">
												{item.title}
											</h2>
											<small>
												{dayjs(item.createdAt).format('DD MMM YYYY HH:mm')}
											</small>
										</div>
									</div>
								</a>
							</Link>
						);
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

export default Gallery;
