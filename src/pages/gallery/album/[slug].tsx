import { FC, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import dayjs from 'dayjs';

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
	<div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
		<div className="h-52 bg-slate-200 sm:h-60" />
	</div>
);

const Page: FC<{ detail: Record<string, any> }> = ({ detail }) => {
	const { ref, data, isEmpty, isLoadingInitialData, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/gallery/images',
		param: `albumId=${detail.id}`,
	});

	const [visible, setVisible] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const totalImages = data?.length || 0;

	const openImage = (index: number) => {
		if (!data?.[index]?.image) {
			return;
		}
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
		if (selectedIndex < totalImages - 1) {
			setSelectedIndex((prev) => prev + 1);
		}
	};

	const downloadImg = () => {
		if (!data?.[selectedIndex]?.image) {
			return;
		}

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
				<section className="relative mt-4 overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-200/35 backdrop-blur-sm sm:mt-6 sm:p-6 lg:p-8">
					<div className="pointer-events-none absolute -right-16 top-0 h-44 w-44 rounded-full bg-[#f3deb1]/45 blur-3xl" />
					<div className="pointer-events-none absolute -left-16 bottom-2 h-40 w-40 rounded-full bg-[#c8dded]/50 blur-3xl" />

					<Breadcrumb data={breadcrumb} variant="post" />

					<div className="relative z-10 mb-5 sm:mb-7">
						<h1 className="text-3xl font-semibold leading-tight text-slate-800 sm:text-4xl lg:text-5xl">
							{detail.title}
						</h1>
						<p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
							Koleksi dokumentasi kegiatan dalam album ini. Klik gambar untuk melihat
							ukuran penuh.
						</p>
					</div>

					{isEmpty && <Empty />}

					<div className="relative z-10 columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3 xl:columns-4">
						{isLoadingInitialData && (
							<>
								<div className="mb-4 break-inside-avoid sm:mb-5">
									<ImageSkeleton />
								</div>
								<div className="mb-4 break-inside-avoid sm:mb-5">
									<ImageSkeleton />
								</div>
								<div className="mb-4 break-inside-avoid sm:mb-5">
									<ImageSkeleton />
								</div>
								<div className="mb-4 break-inside-avoid sm:mb-5">
									<ImageSkeleton />
								</div>
							</>
						)}

						{data?.map((item: Record<string, any>, index) => {
							return (
								<div key={item.id} className="mb-4 break-inside-avoid sm:mb-5">
									<button
										type="button"
										className="group block w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-lg shadow-slate-200/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/55"
										onClick={() => openImage(index)}
									>
										<BlurImage
											className="rounded-2xl"
											alt={item.altText || `gallery-${index + 1}`}
											src={item.image}
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
										/>
									</button>
								</div>
							);
						})}
					</div>

					<InfiniteScrollTrigger
						triggerRef={ref}
						isLoadingMore={isLoadingMore}
						isReachingEnd={isReachingEnd}
					/>
				</section>

				{visible && totalImages > 0 && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6"
						onClick={closePreview}
					>
						<div
							className="relative w-full max-w-6xl"
							onClick={(event) => event.stopPropagation()}
						>
							<button
								onClick={prev}
								type="button"
								className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/80 bg-white/90 p-2 text-2xl text-slate-700 transition duration-300 hover:bg-[#edf4fa] disabled:cursor-not-allowed disabled:opacity-40"
								disabled={selectedIndex <= 0}
							>
								<LeftOutline />
							</button>
							<div className="w-full overflow-hidden rounded-2xl bg-black/85 p-1">
								<img
									className="max-h-[78vh] w-full rounded-xl object-contain"
									alt={data?.[selectedIndex]?.altText}
									src={data?.[selectedIndex]?.image}
								/>
							</div>
							<button
								onClick={next}
								type="button"
								className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/80 bg-white/90 p-2 text-2xl text-slate-700 transition duration-300 hover:bg-[#edf4fa] disabled:cursor-not-allowed disabled:opacity-40"
								disabled={selectedIndex >= totalImages - 1}
							>
								<RightOutline />
							</button>
							<div className="mt-3 flex items-center justify-center gap-2">
								<span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600">
									{totalImages > 0 ? `${selectedIndex + 1} / ${totalImages}` : '0 / 0'}
								</span>
								<button
									onClick={downloadImg}
									type="button"
									className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-medium text-slate-700 transition duration-300 hover:bg-[#edf4fa]"
									disabled={!data?.[selectedIndex]?.image}
								>
									Download
								</button>
							</div>
						</div>
					</div>
				)}
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
