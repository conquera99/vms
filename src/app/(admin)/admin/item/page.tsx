'use client';

import axios from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import { toast } from 'utils/toast';
import { AddOutline, GiftOutline, LeftOutline } from 'components/general/antd-icon';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Empty from 'components/display/empty';
import Container from 'components/general/container';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';
import { LinkButton } from 'components/general/button';

import useListData from 'hooks/useListData';

import { datetimeFormat, successMessage } from 'utils/constant';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Item',
		href: '/admin/item',
	},
];

const Page = () => {
	const { ref, setSize, data, isEmpty, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/admin/item',
	});
	const shownCount = data?.length || 0;
	const categorizedCount = (data || []).filter((item: Record<string, any>) => Boolean(item.categoryId)).length;

	const onRemove = (id: string) => {
		axios.post('/api/admin/item/remove', { id }).then((response) => {
			if (response.data.code === 0) {
				toast.success(successMessage);
				setSize(1);
			} else {
				toast.error(response.data.message);
			}
		});
	};

	return (
		<Navigation title="VMS: Data Item" active="admin" access="item" isAdmin>
			<Container>
				<div className="overflow-hidden rounded-[2rem] border border-amber-200/80 bg-linear-to-br from-amber-50 via-white to-orange-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
							<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
								<GiftOutline />
								Data Item
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								Inventaris Utama
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Kelola seluruh item inventaris, cek kelengkapan kategorinya, dan masuk ke
								halaman detail dengan alur yang lebih cepat.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-80">
							<div className="grid grid-cols-2 gap-3">
								<div className="rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Item Tampil
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{shownCount}</p>
								</div>
								<div className="rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Berkategori
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{categorizedCount}</p>
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
									href="/admin/item/create"
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
						title="Belum ada item"
						desc="Tambahkan item inventaris agar stok dan lokasi bisa mulai dikelola."
						action={
							<LinkButton
								href="/admin/item/create"
								size="small"
								buttonType="success"
								icon={<AddOutline />}
							>
								Tambah Item
							</LinkButton>
						}
					/>
				)}

				<div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
					{data?.map((item: Record<string, any>) => {
						return (
							<article
								key={item.id}
								className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md md:p-6"
							>
								<div className="flex flex-col gap-5">
									<div className="flex items-start justify-between gap-4">
										<div>
											<span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
											Kode {item.code}
										</span>
											<p className="mt-4 text-xl font-bold text-slate-800">{item.name}</p>
											<small className="mt-1 block text-xs text-slate-500">
											Dibuat {dayjs(item.createdAt).format(datetimeFormat)}
										</small>
									</div>
										<div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-right">
											<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
												Status
											</p>
											<p className="mt-1 text-sm font-bold text-slate-800">
												{item.categoryId ? 'Siap dikelola' : 'Perlu kategori'}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-3">
										<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
											<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
												Kategori
											</p>
											<p className="mt-2 text-sm font-semibold text-slate-700">
												{item.categoryId ? 'Sudah dipilih' : 'Belum dipilih'}
											</p>
										</div>
										<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
											<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
												Aksi
											</p>
											<p className="mt-2 text-sm font-semibold text-slate-700">Kelola detail item</p>
										</div>
									</div>

									<div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
										<Link
											href={`/admin/item/${item.id}`}
											className="rounded-lg border border-sky-300 px-3 py-1.5 text-sm font-semibold text-sky-600 hover:bg-sky-50"
										>
											Edit
										</Link>
										<button
											className="rounded-lg border border-rose-300 px-3 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
											onClick={() => onRemove(item.id)}
										>
											Hapus
										</button>
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
