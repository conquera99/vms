import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'utils/toast';
import { AddOutline, LeftOutline, PicturesOutline } from 'components/general/antd-icon';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Empty from 'components/display/empty';
import Container from 'components/general/container';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';
import Button, { LinkButton } from 'components/general/button';

import useListData from 'hooks/useListData';

import { datetimeFormat, successMessage } from 'utils/constant';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Gambar',
		href: '/admin/image',
	},
];

const Page = () => {
	const { ref, setSize, data, isEmpty, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/admin/gallery/image',
	});
	const shownCount = data?.length || 0;
	const withAltTextCount = (data || []).filter(
		(item: Record<string, any>) => Boolean(item.altText && String(item.altText).trim()),
	).length;

	const onRemove = (id: string) => {
		axios.post('/api/admin/gallery/image/remove', { id }).then((response) => {
			if (response.data.code === 0) {
				toast.success(successMessage);
				setSize(1);
			} else {
				toast.error(response.data.message);
			}
		});
	};

	return (
		<Navigation title="VMS: Data Gambar" active="admin" access="image" isAdmin>
			<Container>
				<div className="overflow-hidden rounded-[2rem] border border-amber-200/80 bg-linear-to-br from-amber-50 via-white to-yellow-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
						<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
								<PicturesOutline />
								Gambar
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								Perpustakaan Visual
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Kelola aset gambar, rapikan alt text, dan buka detail file lebih cepat dari satu
								daftar visual.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-80">
							<div className="grid grid-cols-2 gap-3">
								<div className="rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Gambar
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{shownCount}</p>
								</div>
								<div className="rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Alt Text
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{withAltTextCount}</p>
								</div>
							</div>
							<div className="flex flex-wrap items-center justify-end gap-2">
								<LinkButton
									href="/admin"
									size="small"
									buttonType="info"
									icon={<LeftOutline />}
									className="text-base"
								>
									Admin
								</LinkButton>
								<LinkButton
									href="/admin/image/detail"
									size="small"
									buttonType="success"
									icon={<AddOutline />}
									className="text-base"
								>
									Tambah
								</LinkButton>
							</div>
						</div>
					</div>
				</div>

				{isEmpty && (
					<Empty
						title="Belum ada gambar"
						desc="Unggah gambar baru untuk mulai membangun perpustakaan visual konten."
						action={
							<LinkButton
								href="/admin/image/detail"
								size="small"
								buttonType="success"
								icon={<AddOutline />}
							>
								Tambah Gambar
							</LinkButton>
						}
					/>
				)}

				<div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
					{data?.map((item: Record<string, any>) => {
						return (
							<article
								key={item.id}
								className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
							>
								<div className="grid grid-cols-1 gap-0 md:grid-cols-[180px_minmax(0,1fr)]">
									<div className="border-b border-slate-100 bg-slate-50 md:border-b-0 md:border-r">
										<div className="flex h-full min-h-56 items-center justify-center p-4">
											{item.image ? (
												<img
													src={item.image}
													alt="member-image"
													className="h-44 w-full rounded-2xl object-cover"
												/>
											) : (
												<div className="flex h-44 w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm font-medium text-slate-400">
													No Image
												</div>
											)}
										</div>
									</div>

									<div className="flex flex-col justify-between p-5 md:p-6">
										<div>
											<div className="flex flex-wrap items-center justify-between gap-3">
												<span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
													Gambar #{item.id}
												</span>
												<small className="text-xs text-slate-500">
													{dayjs(item.createdAt).format(datetimeFormat)}
												</small>
											</div>
											<p className="mt-4 line-clamp-2 text-xl font-bold text-slate-800">
												{item.altText || 'Belum ada alt text'}
											</p>
											<div className="mt-4 grid grid-cols-2 gap-3">
												<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
													<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
														Aksesibilitas
													</p>
													<p className="mt-2 text-sm font-semibold text-slate-700">
														{item.altText ? 'Alt text terisi' : 'Perlu dilengkapi'}
													</p>
												</div>
												<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
													<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
														Peran
													</p>
													<p className="mt-2 text-sm font-semibold text-slate-700">Aset visual konten</p>
												</div>
											</div>
										</div>
										<div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
											<LinkButton
												size="small"
												buttonType="info"
												href={`/admin/image/detail?id=${item.id}`}
											>
												Lihat Detail
											</LinkButton>
											<Button
												buttonType="danger"
												size="small"
												onClick={() => onRemove(item.id)}
											>
												Hapus
											</Button>
										</div>
									</div>
								</div>
							</article>
						);
					})}
				</div>

				<InfiniteScrollTrigger
					triggerRef={ref}
					isLoadingMore={isLoadingMore}
					isReachingEnd={isReachingEnd}
				/>
			</Container>
		</Navigation>
	);
};

export default Page;
