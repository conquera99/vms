import Link from 'next/link';
import { LegacyRef, useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Empty from 'components/display/empty';
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
			<Title>Beranda</Title>

			{isEmpty && <Empty />}

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
				{data?.map((item: Record<string, any>) => {
					return (
						<Link key={item.slug} href={`/post/${item.slug}`}>
							<a
								className="block rounded-lg my-5 border border-transparent shadow-md relative transform transition-all duration-300 scale-100 hover:shadow-lg hover:border-red-400"
								style={{
									background: `url(${item.image}) center`,
									backgroundSize: 'cover',
								}}
							>
								<div className="h-60" />
								<div className="p-1">
									<div className="bg-red-900/60 backdrop-blur-lg p-4 rounded-lg">
										<h2 className="text-white text-ellipsis overflow-hidden whitespace-nowrap text-xl font-bold leading-tight mb-2 pr-5">
											{item.title}
										</h2>
										<div className="flex w-full items-center text-sm text-gray-200 font-medium">
											<div className="flex-1 flex items-center">
												<div>{item.summary}</div>
											</div>
										</div>
									</div>
								</div>
							</a>
						</Link>
					);
				})}
			</div>

			<div ref={ref} className="text-center flex items-center mt-4 justify-center">
				{isLoadingMore ? (
					<Loading />
				) : isReachingEnd ? (
					<p className="text-gray-400">No more data</p>
				) : null}
			</div>
		</Navigation>
	);
}
