import { FC, LegacyRef, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import dayjs from 'dayjs';
import Image from 'next/image';
import useSWRInfinite from 'swr/infinite';
import Dialog from 'rc-dialog';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Empty from 'components/display/empty';
import Container from 'components/general/container';
import { Loading } from 'components/general/icon';

import useOnScreen from 'hooks/useOnScreen';

import { prisma } from 'db';
import { datetimeFormat } from 'utils/constant';
import fetcher from 'utils/fetcher';
import { DEFAULT_LIMIT } from 'utils/constant';

const getKey = (
	page: number,
	previousPageData: Record<string, any>,
	pageSize: number,
	albumId: string,
) => {
	if (previousPageData?.data && !previousPageData.data.length) return null;

	return `/api/gallery/images?s=${pageSize}&p=${page + 1}&albumId=${albumId}`;
};

const Page: FC<{ detail: Record<string, any> }> = ({ detail }) => {
	const ref = useRef() as LegacyRef<HTMLDivElement>;

	const isVisible = useOnScreen(ref);

	const [visible, setVisible] = useState(false);
	const [image, setImage] = useState<Record<string, any> | null>(null);

	const {
		data: response,
		error,
		size,
		setSize,
		isValidating,
	} = useSWRInfinite((...args) => getKey(...args, DEFAULT_LIMIT, detail.id), fetcher);

	const data = response ? [].concat(...response) : [];
	const isLoadingInitialData = !response && !error;
	const isLoadingMore =
		isLoadingInitialData || (size > 0 && response && typeof response[size - 1] === 'undefined');
	const isEmpty = response?.[0]?.length === 0;
	const isReachingEnd = size === DEFAULT_LIMIT;
	const isRefreshing = isValidating && response && response.length === size;

	const openImage = (item: Record<string, any>) => {
		setVisible(true);
		setImage(item);
	};

	const closePreview = () => {
		setVisible(false);
		setImage(null);
	};

	useEffect(() => {
		if (isVisible && !isReachingEnd && !isRefreshing) {
			setSize(size + 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isVisible, isRefreshing]);

	const breadcrumb = [
		{
			title: 'Home',
			href: '/',
		},
		{
			title: 'Gallery',
			href: '/gallery',
		},
		{
			title: `Album`,
			href: `/gallery/album/${detail.slug}`,
		},
	];

	return (
		<Navigation title={detail.title} desc={detail.title} active="gallery">
			<Container>
				<Title>
					<Breadcrumb data={breadcrumb} />
				</Title>

				<h1 className="text-3xl text-indigo-500 font-bold mb-4">{detail.title}</h1>

				{isEmpty && <Empty />}

				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
					{data?.map((item: Record<string, any>) => {
						return (
							<div
								key={item.id}
								className="rounded-lg shadow-md cursor-pointer"
								onClick={() => openImage(item)}
							>
								<Image
									className="rounded-lg object-cover"
									alt={item.altText}
									src={item.image}
									layout="responsive"
									width={300}
									height={300}
								/>
							</div>
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

				<Dialog
					visible={visible}
					onClose={closePreview}
					style={{}}
					bodyStyle={{ padding: 0 }}
				>
					<div>
						<img
							className="rounded-md"
							alt={image?.altText}
							src={image?.image}
							style={{ minHeight: 'calc(100vh - 50px)' }}
						/>
					</div>
				</Dialog>
			</Container>
		</Navigation>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { slug } = query;

	// redirect
	if (!slug) {
		return {
			redirect: {
				destination: '/gallery',
				permanent: false,
			},
		};
	}

	const data = await prisma.albums.findFirst({ where: { slug: slug as string } });

	if (!data) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			detail: {
				...data,
				createdAt: dayjs(data.createdAt).format(datetimeFormat),
				updatedAt: dayjs(data.updatedAt).format(datetimeFormat),
			},
		},
	};
};
export default Page;
