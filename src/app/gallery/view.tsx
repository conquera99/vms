'use client';

import Link from 'next/link';
import { FolderOutline } from 'components/general/antd-icon';
import dayjs from 'dayjs';

import Navigation from 'components/navigation';
import Empty from 'components/display/empty';
import Container from 'components/general/container';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';

import useListData from 'hooks/useListData';

const AlbumSkeleton = () => (
	<div className="my-2 block animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
		<div className="flex items-center p-5 sm:p-6">
			<div className="mr-3 h-10 w-10 rounded-xl bg-slate-200" />
			<div className="w-full space-y-2">
				<div className="h-5 w-4/5 rounded-md bg-slate-200" />
				<div className="h-3 w-2/5 rounded-md bg-slate-200" />
			</div>
		</div>
	</div>
);

const GalleryView = ({ initialAlbums }: { initialAlbums: Record<string, any>[] }) => {
	const { ref, data, isEmpty, isLoadingInitialData, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/gallery/album',
		initialData: initialAlbums,
	});

	return (
		<Navigation active="gallery" hideFooter={false}>
			<Container>
				<section className="relative mt-4 overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-200/35 backdrop-blur-sm sm:mt-6 sm:p-6 lg:p-8">
					<div className="pointer-events-none absolute -right-16 top-0 h-44 w-44 rounded-full bg-[#f3deb1]/45 blur-3xl" />
					<div className="pointer-events-none absolute -left-16 bottom-2 h-40 w-40 rounded-full bg-[#c8dded]/50 blur-3xl" />

					<div className="relative z-10 mb-5 sm:mb-7">
						<p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Photo Archive</p>
						<h1 className="text-3xl font-semibold leading-tight text-slate-800 sm:text-4xl lg:text-5xl">
							Galeri
						</h1>
						<p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
							Kumpulan album dokumentasi kegiatan dalam satu tampilan yang lebih bersih dan mudah dijelajahi.
						</p>
					</div>

					{isEmpty && <Empty />}

					<div className="relative z-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
						{isLoadingInitialData && (
							<>
								<AlbumSkeleton />
								<AlbumSkeleton />
								<AlbumSkeleton />
							</>
						)}

						{data?.map((item: Record<string, any>) => {
							return (
								<Link
									key={item.slug}
									href={`/gallery/album/${item.slug}`}
									className="group block overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-lg shadow-slate-200/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/55"
								>
									<div className="flex items-center p-5 sm:p-6">
										<div className="mr-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf4fa] text-[#5d84a9] transition duration-300 group-hover:bg-[#dcebf7] group-hover:text-[#486d92]">
											<FolderOutline className="text-2xl" />
										</div>
										<div className="min-w-0 flex-1">
											<h2 className="truncate pr-2 text-lg font-semibold leading-tight text-slate-800 sm:text-xl">
												{item.title}
											</h2>
											<small className="mt-1 block text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
												{dayjs(item.createdAt).format('DD MMM YYYY HH:mm')}
											</small>
										</div>
									</div>
								</Link>
							);
						})}
					</div>

					<InfiniteScrollTrigger
						triggerRef={ref}
						isLoadingMore={isLoadingMore}
						isReachingEnd={isReachingEnd}
					/>
				</section>
			</Container>
		</Navigation>
	);
};

export default GalleryView;
