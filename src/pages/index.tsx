import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Empty from 'components/display/empty';
import Post from 'components/display/post';
import Container from 'components/general/container';

import useListData from 'hooks/useListData';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';

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

	return (
		<Navigation active="home">
			<Container>
				<Title>Beranda</Title>

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
