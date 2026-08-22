import { useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';

import useOnScreen from 'hooks/useOnScreen';

import fetcher from 'utils/fetcher';
import { DEFAULT_LIMIT } from 'utils/constant';

const getKey = (
	page: number,
	previousPageData: Record<string, any>[] | null,
	pageSize: number,
	url: string,
	param: string | undefined | null = null,
) => {
	if (previousPageData && !previousPageData.length) return null;

	return `${url}?s=${pageSize}&p=${page + 1}${param ? `&${param}` : ''}`;
};

const useListData = ({
	url,
	param,
	show,
	initialData,
}: {
	url: string;
	param?: string;
	show?: number;
	initialData?: Record<string, any>[];
}) => {
	const ref = useRef<HTMLDivElement | null>(null);

	const isVisible = useOnScreen(ref);

	const LIMIT = show ? show : DEFAULT_LIMIT;

	const {
		data: response,
		error,
		size,
		setSize,
		isValidating,
	} = useSWRInfinite((...args) => getKey(...args, LIMIT, url, param), fetcher, {
		fallbackData: initialData ? [initialData] : undefined,
	});

	const data = response ? [].concat(...response) : [];
	const isLoadingInitialData = !response && !error;
	const isLoadingMore =
		isLoadingInitialData || (size > 0 && response && typeof response[size - 1] === 'undefined');
	const isEmpty = response?.[0]?.length === 0;
	const isReachingEnd = isEmpty || response?.[response?.length - 1]?.length < LIMIT;
	const isRefreshing = isValidating && response && response.length === size;

	useEffect(() => {
		if (isVisible && !isReachingEnd && !isRefreshing) {
			setSize((_size: number) => _size + 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isVisible, isRefreshing]);

	return {
		data: data as Record<string, any>[],
		isLoadingInitialData,
		isLoadingMore,
		isEmpty,
		isReachingEnd,
		isRefreshing,
		isValidating,
		setSize,
		error,
		isVisible,
		ref,
	};
};

export default useListData;
