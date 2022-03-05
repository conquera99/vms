import { LegacyRef, useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Empty from 'components/display/empty';
import Post from 'components/display/post';
import Container from 'components/general/container';
import { Loading } from 'components/general/icon';

import useOnScreen from 'hooks/useOnScreen';

import fetcher from 'utils/fetcher';
import { DEFAULT_LIMIT } from 'utils/constant';

const getKey = (page: number, previousPageData: Record<string, any>, pageSize: number) => {
	if (previousPageData?.data && !previousPageData.data.length) return null;

	return `/api/post?s=${pageSize}&p=${page + 1}`;
};

export default function Home() {
	const ref = useRef() as LegacyRef<HTMLDivElement>;

	const isVisible = useOnScreen(ref);

	const {
		data: response,
		error,
		size,
		setSize,
		isValidating,
	} = useSWRInfinite((...args) => getKey(...args, DEFAULT_LIMIT), fetcher);

	const data = response ? [].concat(...response) : [];
	const isLoadingInitialData = !response && !error;
	const isLoadingMore =
		isLoadingInitialData || (size > 0 && response && typeof response[size - 1] === 'undefined');
	const isEmpty = response?.[0]?.length === 0;
	const isReachingEnd = size === DEFAULT_LIMIT;
	const isRefreshing = isValidating && response && response.length === size;

	useEffect(() => {
		if (isVisible && !isReachingEnd && !isRefreshing) {
			setSize(size + 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isVisible, isRefreshing]);

	return (
		<Navigation active="home">
			<Container>
				<Title>Beranda</Title>

				{isEmpty && <Empty />}

				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-2">
					{data?.map((item: Record<string, any>) => {
						return <Post key={item.id} data={item} />;
					})}
				</div>

				<div ref={ref} className="text-center flex items-center mt-4 justify-center">
					{isLoadingMore ? (
						<Loading />
					) : isReachingEnd ? (
						<p className="text-gray-400">No more data</p>
					) : null}
				</div>
			</Container>
		</Navigation>
	);
}
