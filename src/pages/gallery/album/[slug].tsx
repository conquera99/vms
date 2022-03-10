import { FC, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import dayjs from 'dayjs';
import Image from 'next/image';
import Dialog from 'rc-dialog';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Empty from 'components/display/empty';
import Container from 'components/general/container';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';

import useListData from 'hooks/useListData';

import { prisma } from 'db';
import { datetimeFormat } from 'utils/constant';

const ImageSkeleton = () => (
	<div className="block bg-gray-200 h-full animate-pulse rounded-lg border border-transparent relative">
		<div className="h-60" />
		<div className="h-28" />
	</div>
);

const Page: FC<{ detail: Record<string, any> }> = ({ detail }) => {
	const { ref, data, isEmpty, isLoadingInitialData, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/gallery/images',
		param: `albumId=${detail.id}`,
	});

	const [visible, setVisible] = useState(false);
	const [image, setImage] = useState<Record<string, any> | null>(null);

	const openImage = (item: Record<string, any>) => {
		setVisible(true);
		setImage(item);
	};

	const closePreview = () => {
		setVisible(false);
		setImage(null);
	};

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
					{isLoadingInitialData && (
						<>
							<ImageSkeleton />
							<ImageSkeleton />
						</>
					)}

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

				<InfiniteScrollTrigger
					triggerRef={ref}
					isLoadingMore={isLoadingMore}
					isReachingEnd={isReachingEnd}
				/>

				<Dialog
					visible={visible}
					onClose={closePreview}
					style={{}}
					bodyStyle={{ padding: 0 }}
				>
					<div className="flex justify-center">
						<img
							className="object-contain rounded-md"
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

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [{ params: { slug: 'Magha-Puja-2022' } }],
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug } = params as Record<string, any>;

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
