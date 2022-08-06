import { FC, LegacyRef } from 'react';

import { Loading } from 'components/general/icon';

interface InfiniteScrollTriggerProps {
	triggerRef: LegacyRef<HTMLDivElement>;
	isLoadingMore?: boolean;
	isReachingEnd: boolean;
}

const InfiniteScrollTrigger: FC<InfiniteScrollTriggerProps> = ({
	triggerRef,
	isLoadingMore,
	isReachingEnd,
}) => {
	return (
		<div ref={triggerRef} className="text-center flex items-center mt-4 justify-center">
			{isReachingEnd ? (
				<p className="text-gray-400">No more data</p>
			) : isLoadingMore ? (
				<Loading />
			) : null}
		</div>
	);
};

export default InfiniteScrollTrigger;
