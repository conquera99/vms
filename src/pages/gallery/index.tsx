import Link from 'next/link';
import { FolderOutline } from 'antd-mobile-icons';
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

	return `/api/gallery/album?s=${pageSize}&p=${page + 1}`;
};

const Gallery = () => {
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
		<Navigation title="VMS: Galeri" active="gallery">
			<Title>Galeri</Title>

			{isEmpty && <Empty />}

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
				{data?.map((item: Record<string, any>) => {
					return (
						<Link key={item.slug} href={`/gallery/album/${item.slug}`}>
							<a className="block rounded-lg bg-yellow-50 my-5 border border-transparent shadow-md relative transform transition-all duration-300 scale-100 hover:shadow-lg">
								<div className="p-6 flex items-center">
									<FolderOutline className="text-3xl mr-2" />
									<h2 className="text-ellipsis overflow-hidden whitespace-nowrap text-xl font-bold leading-tight pr-5">
										{item.title}
									</h2>
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
};

export default Gallery;
