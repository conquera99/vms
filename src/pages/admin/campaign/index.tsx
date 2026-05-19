import { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import { toast } from 'utils/toast';
import { AddOutline, HandPayCircleOutline, LeftOutline } from 'components/general/antd-icon';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Empty from 'components/display/empty';
import Container from 'components/general/container';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';
import { ConfirmButton, LinkButton } from 'components/general/button';

import useListData from 'hooks/useListData';

import { datetimeFormat, successMessage } from 'utils/constant';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Campaign',
		href: '/admin/campaign',
	},
];

const Page = () => {
	const { ref, setSize, data, isEmpty, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/admin/campaign',
	});
	const shownCount = data?.length || 0;
	const activeCount = (data || []).filter((item: Record<string, any>) => item.status === 'A').length;
	const publishedCount = (data || []).filter(
		(item: Record<string, any>) => item.visible === 'Y',
	).length;

	const [removeLoading, setRemoveLoading] = useState(false);

	const onRemove = (id: string) => {
		setRemoveLoading(true);

		axios
			.post('/api/admin/campaign/remove', { id })
			.then((response) => {
				if (response.data.code === 0) {
					toast.success(successMessage);
					setSize(1);
				} else {
					toast.error(response.data.message);
				}
			})
			.finally(() => setRemoveLoading(false));
	};

	return (
		<Navigation title="VMS: Campaign" active="admin" access="campaign" isAdmin>
			<Container>
				<div className="mt-6 overflow-hidden rounded-[2rem] border border-emerald-200/80 bg-linear-to-br from-emerald-50 via-white to-lime-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
						<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
								<HandPayCircleOutline />
								Campaign
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								Program dan Donasi Aktif
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Pantau status campaign, visibilitas publik, dan akses pengelolaan peserta dari
								satu daftar yang lebih rapi.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-80">
							<div className="grid grid-cols-3 gap-3">
								<div className="rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Campaign
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{shownCount}</p>
								</div>
								<div className="rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Aktif
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{activeCount}</p>
								</div>
								<div className="rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Publik
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{publishedCount}</p>
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
									href="/admin/campaign/detail"
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
						title="Belum ada campaign"
						desc="Tambahkan campaign baru untuk mulai mengelola program, donasi, dan peserta."
						action={
							<LinkButton
								href="/admin/campaign/detail"
								size="small"
								buttonType="success"
								icon={<AddOutline />}
							>
								Tambah Campaign
							</LinkButton>
						}
					/>
				)}

				<div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
					{data?.map((item: Record<string, any>) => {
						return (
							<article
								key={item.id}
								className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md md:p-6"
							>
								<div className="flex flex-col gap-5">
									<div className="flex items-start justify-between gap-4">
										<div>
											<div className="flex flex-wrap items-center gap-2">
												<span
													className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
														item.status === 'A'
															? 'bg-emerald-100 text-emerald-700'
															: item.status === 'C'
															? 'bg-sky-100 text-sky-700'
															: 'bg-slate-200 text-slate-700'
													}`}
												>
													{item.status === 'A'
														? 'Aktif'
														: item.status === 'C'
														? 'Selesai'
														: 'Nonaktif'}
												</span>
												<span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-lime-700">
													{item.visible === 'Y' ? 'Terpublikasi' : 'Internal'}
												</span>
											</div>
											<p className="mt-4 text-xl font-bold text-slate-800">{item.title}</p>
											<small className="mt-1 block text-xs text-slate-500">
												{dayjs(item.createdAt).format(datetimeFormat)}
											</small>
										</div>
										<div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
											<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
												Peserta
											</p>
											<p className="mt-1 text-sm font-bold text-slate-800">Kelola terpisah</p>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-3">
										<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
											<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
												Status Program
											</p>
											<p className="mt-2 text-sm font-semibold text-slate-700">
												{item.status === 'A'
													? 'Sedang berjalan'
													: item.status === 'C'
													? 'Sudah selesai'
													: 'Belum diaktifkan'}
											</p>
										</div>
										<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
											<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
												Visibilitas
											</p>
											<p className="mt-2 text-sm font-semibold text-slate-700">
												{item.visible === 'Y' ? 'Dapat dilihat publik' : 'Hanya internal'}
											</p>
										</div>
									</div>

									<div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
										<Link
											href={`/admin/campaign/participant?id=${item.id}`}
											className="rounded-lg border border-emerald-300 px-3 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
										>
											Atur Peserta
										</Link>
										<div className="flex flex-wrap gap-2">
											<Link
												href={`/admin/campaign/detail?id=${item.id}`}
												className="rounded-lg border border-sky-300 px-3 py-1.5 text-sm font-semibold text-sky-600 hover:bg-sky-50"
											>
												Edit
											</Link>
											<ConfirmButton
												className="rounded-lg border border-rose-300 px-3 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
												confirmText="Yakin untuk menghapus data ini?"
												onClick={() => onRemove(item.id)}
												loading={removeLoading}
											>
												Hapus
											</ConfirmButton>
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
