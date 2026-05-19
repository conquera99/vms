import axios from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import { toast } from 'utils/toast';
import { AddOutline, AppOutline, LeftOutline } from 'components/general/antd-icon';

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
		title: 'Atur Lokasi',
		href: '/admin/assign-item',
	},
];

const Page = () => {
	const { ref, setSize, data, isEmpty, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/admin/assign-item',
	});
	const shownCount = data?.length || 0;
	const totalAssignedQty = (data || []).reduce(
		(total: number, item: Record<string, any>) => total + Number(item.il_qty || 0),
		0,
	);

	const onRemove = (locId: string, itemId: string) => {
		axios.post('/api/admin/assign-item/remove', { locId, itemId }).then((response) => {
			if (response.data.code === 0) {
				toast.success(successMessage);
				setSize(1);
			} else {
				toast.error(response.data.message);
			}
		});
	};

	return (
		<Navigation title="VMS: Data Lokasi Item" active="admin" access="item_history" isAdmin>
			<Container>
				<div className="mt-6 overflow-hidden rounded-[2rem] border border-cyan-200/80 bg-linear-to-br from-cyan-50 via-white to-sky-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
						<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
								<AppOutline />
								Penempatan Item
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								Distribusi Inventaris per Lokasi
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Lihat persebaran item di setiap lokasi dan cek penempatan aktif tanpa harus
								masuk ke halaman detail satu per satu.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-80">
							<div className="grid grid-cols-2 gap-3">
								<div className="rounded-2xl border border-cyan-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Penempatan
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{shownCount}</p>
								</div>
								<div className="rounded-2xl border border-cyan-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Total Qty
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{totalAssignedQty}</p>
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
									href="/admin/assign-item/detail"
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
						title="Belum ada penempatan item"
						desc="Tambahkan penempatan agar distribusi inventaris per lokasi mulai tercatat."
						action={
							<LinkButton
								href="/admin/assign-item/detail"
								size="small"
								buttonType="success"
								icon={<AddOutline />}
							>
								Tambah Penempatan
							</LinkButton>
						}
					/>
				)}

				<div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
					{data?.map((item: Record<string, any>) => {
						return (
							<article
								key={item.il_code}
								className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md md:p-6"
							>
								<div className="flex flex-col gap-5">
									<div className="flex items-start justify-between gap-4">
										<div>
											<span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
												Penempatan {item.il_code}
											</span>
											<p className="mt-4 text-xl font-bold text-slate-800">{item.item_name}</p>
											<small className="mt-1 block text-xs text-slate-500">
												{dayjs(item.createdAt).format(datetimeFormat)}
											</small>
										</div>
										<div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-right">
											<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
												Qty
											</p>
											<p className="mt-1 text-2xl font-black text-cyan-900">{item.il_qty}</p>
										</div>
									</div>

									<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
										<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
											<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
												Lokasi
											</p>
											<p className="mt-2 text-sm font-semibold text-slate-700">{item.loc_name}</p>
										</div>
										<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
											<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
												Status
											</p>
											<p className="mt-2 text-sm font-semibold text-slate-700">Aktif di lokasi</p>
										</div>
									</div>

									<div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
										<Link
											href={`/admin/assign-item/detail?locId=${item.il_loc_id}&itemId=${item.item_id}`}
											className="rounded-lg border border-sky-300 px-3 py-1.5 text-sm font-semibold text-sky-600 hover:bg-sky-50"
										>
											Lihat
										</Link>
										<button
											className="rounded-lg border border-rose-300 px-3 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
											onClick={() => onRemove(item.il_loc_id, item.item_id)}
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
