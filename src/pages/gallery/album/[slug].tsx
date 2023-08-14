import { FC, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import dayjs from 'dayjs';
import Dialog from 'rc-dialog';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Empty from 'components/display/empty';
import Container from 'components/general/container';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';
import BlurImage from 'components/display/BlurImage';

import useListData from 'hooks/useListData';

import { prisma } from 'db';
import { datetimeFormat } from 'utils/constant';
import { LeftOutline, RightOutline } from 'antd-mobile-icons';

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
	const [selectedIndex, setSelectedIndex] = useState(0);

	const openImage = (index: number) => {
		setVisible(true);
		setSelectedIndex(index);
	};

	const closePreview = () => {
		setVisible(false);
	};

	const prev = () => {
		if (selectedIndex > 0) {
			setSelectedIndex((prev) => prev - 1);
		}
	};

	const next = () => {
		if (selectedIndex < data.length - 1) {
			setSelectedIndex((prev) => prev + 1);
		}
	};

	const downloadImg = () => {
		const ext = data[selectedIndex].image.split('.');
		const timestamp = dayjs().unix();

		fetch(data[selectedIndex].image, {
			method: 'GET',
			headers: {},
		})
			.then((response) => {
				response.arrayBuffer().then(function (buffer) {
					const url = window.URL.createObjectURL(new Blob([buffer]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', `${timestamp}.${ext[ext.length - 1]}`);
					document.body.appendChild(link);
					link.click();
				});
			})
			.catch((err) => {
				console.log(err);
			});
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
		<Navigation title={detail.title} desc={detail.title} active="gallery" hideFooter={false}>
			<Container>
				<Title>
					<Breadcrumb data={breadcrumb} />
				</Title>

				<h1 className="text-3xl text-amber-500 font-bold mb-4">{detail.title}</h1>

				{isEmpty && <Empty />}

				<div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
					{isLoadingInitialData && (
						<>
							<ImageSkeleton />
							<ImageSkeleton />
						</>
					)}

					{data?.map((item: Record<string, any>, index) => {
						return (
							<div
								key={item.id}
								className="rounded-lg shadow-md cursor-pointer"
								onClick={() => openImage(index)}
							>
								<BlurImage
									className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8"
									alt={item.altText}
									src={item.image}
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
					<button
						onClick={prev}
						className="absolute top-1/2 text-2xl rounded-full bg-slate-100 p-2 transition-all ml-1 hover:opacity-50"
					>
						<LeftOutline />
					</button>
					<div className="w-full">
						<img
							className="object-contain rounded-md img-modal"
							alt={data[selectedIndex]?.altText}
							src={data[selectedIndex]?.image}
						/>
					</div>
					<button
						onClick={next}
						className="absolute top-1/2 right-0 text-2xl rounded-full bg-slate-100 p-2 transition-all ml-1  hover:opacity-50"
					>
						<RightOutline />
					</button>
					<div className="flex justify-center">
						<button
							onClick={downloadImg}
							className="mt-2 px-4 py-1 bg-slate-100 rounded-md"
						>
							Download
						</button>
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
