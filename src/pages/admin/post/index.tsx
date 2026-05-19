import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'utils/toast';
import { AddOutline, ContentOutline, LeftOutline } from 'components/general/antd-icon';

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
		title: 'Post',
		href: '/admin/post',
	},
];

const status: Record<string, string> = {
	D: 'Draft',
	P: 'Terpublikasi',
	H: 'Tersembunyi',
};

const Page = () => {
	const { ref, setSize, data, isEmpty, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/admin/post',
	});
	const shownCount = data?.length || 0;
	const publishedCount = (data || []).filter(
		(item: Record<string, any>) => item.status === 'P',
	).length;
	const draftCount = (data || []).filter((item: Record<string, any>) => item.status === 'D').length;

	const onRemove = (id: string) => {
		axios.post('/api/post/member/remove', { id }).then((response) => {
			if (response.data.code === 0) {
				toast.success(successMessage);
				setSize(1);
			} else {
				toast.error(response.data.message);
			}
		});
	};

	return (
		<Navigation title="VMS: Data Post" active="admin" access="post" isAdmin>
			<Container>
				<div className="overflow-hidden rounded-[2rem] border border-rose-200/80 bg-linear-to-br from-rose-50 via-white to-orange-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
						<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
								<ContentOutline />
								Kelola Konten
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								Daftar Post dan Publikasi
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Kelola draft, konten terbit, dan ringkasan editorial dari satu halaman yang
								lebih mudah dipindai.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-80">
							<div className="grid grid-cols-3 gap-3">
								<div className="rounded-2xl border border-rose-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Post
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{shownCount}</p>
								</div>
								<div className="rounded-2xl border border-rose-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Terbit
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{publishedCount}</p>
								</div>
								<div className="rounded-2xl border border-rose-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Draft
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{draftCount}</p>
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
									href="/admin/post/detail"
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
						title="Belum ada post"
						desc="Tambahkan post baru untuk mulai mengelola konten dan publikasi dari panel admin."
						action={
							<LinkButton
								href="/admin/post/detail"
								size="small"
								buttonType="success"
								icon={<AddOutline />}
							>
								Tambah Post
							</LinkButton>
						}
					/>
				)}

				<div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
					{data?.map((item: Record<string, any>) => {
						return (
							<article
								key={item.id}
								className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md"
							>
								<div className="grid grid-cols-1 gap-0 md:grid-cols-[200px_minmax(0,1fr)]">
									<div className="border-b border-slate-100 bg-slate-50 md:border-b-0 md:border-r">
										<div className="flex h-full min-h-60 items-center justify-center p-4">
											{item.image ? (
												<img
													src={item.image}
													alt="post-image"
													className="h-52 w-full rounded-2xl object-cover"
												/>
											) : (
												<div className="flex h-52 w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm font-medium text-slate-400">
													No Image
												</div>
											)}
										</div>
									</div>

									<div className="flex flex-col justify-between p-5 md:p-6">
										<div>
											<div className="flex flex-wrap items-center justify-between gap-3">
												<span
													className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
														item.status === 'P'
															? 'bg-emerald-100 text-emerald-700'
															: item.status === 'H'
															? 'bg-slate-200 text-slate-700'
															: 'bg-amber-100 text-amber-700'
													}`}
												>
													{status[item.status]}
												</span>
												<small className="text-xs text-slate-500">
													{dayjs(item.createdAt).format(datetimeFormat)}
												</small>
											</div>
											<p className="mt-4 line-clamp-2 text-xl font-bold text-slate-800">
												{item.title}
											</p>
											<p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
												{item.summary || 'Belum ada ringkasan singkat untuk post ini.'}
											</p>
											<div className="mt-4 grid grid-cols-2 gap-3">
												<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
													<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
														Slug
													</p>
													<p className="mt-2 truncate text-sm font-semibold text-slate-700">
														/{item.slug}
													</p>
												</div>
												<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
													<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
														Mode
													</p>
													<p className="mt-2 text-sm font-semibold text-slate-700">
														{item.status === 'P' ? 'Siap dibaca publik' : 'Masih di ruang admin'}
													</p>
												</div>
											</div>
										</div>
										<div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
											<div className="flex flex-wrap gap-2">
												<LinkButton
													size="small"
													buttonType="info"
													href={`/admin/post/detail?id=${item.id}`}
												>
													Lihat Detail
												</LinkButton>
												<LinkButton
													size="small"
													href={`/post/${item.slug}`}
												>
													Buka
												</LinkButton>
											</div>
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
