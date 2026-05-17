import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'utils/toast';
import { AddOutline, LeftOutline, ShopbagOutline } from 'antd-mobile-icons';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Empty from 'components/display/empty';
import Container from 'components/general/container';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';
import Button, { LinkButton } from 'components/general/button';

import useListData from 'hooks/useListData';

import { dateFormat, datetimeFormat, successMessage } from 'utils/constant';
import { numberFormatter } from 'utils/helper';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Beli Item',
		href: '/admin/buy-item',
	},
];

const Home = () => {
	const { ref, setSize, data, isEmpty, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/admin/buy-item',
	});
	const shownCount = data?.length || 0;
	const totalPurchasedQty = (data || []).reduce(
		(total: number, item: Record<string, any>) => total + Number(item.ih_qty || 0),
		0,
	);

	const onRemove = (id: string) => {
		axios.post('/api/admin/buy-item/remove', { id }).then((response) => {
			if (response.data.code === 0) {
				toast.success(successMessage);
				setSize(1);
			} else {
				toast.error(response.data.message);
			}
		});
	};

	return (
		<Navigation title="VMS: Data Beli Item" active="admin" access="item_history" isAdmin>
			<Container>
				<div className="mt-6 overflow-hidden rounded-[2rem] border border-orange-200/80 bg-linear-to-br from-orange-50 via-white to-amber-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
						<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
								<ShopbagOutline />
								Pembelian Item
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								Riwayat Pembelian Inventaris
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Pantau stok masuk, kuantitas pembelian, dan bukti transaksi dalam satu
								tampilan yang lebih mudah dipindai.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-80">
							<div className="grid grid-cols-2 gap-3">
								<div className="rounded-2xl border border-orange-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Transaksi
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{shownCount}</p>
								</div>
								<div className="rounded-2xl border border-orange-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Total Qty
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{totalPurchasedQty}</p>
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
									href="/admin/buy-item/detail"
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
						title="Belum ada riwayat pembelian"
						desc="Catat pembelian item agar stok masuk dan nilai transaksi bisa dipantau dengan baik."
						action={
							<LinkButton
								href="/admin/buy-item/detail"
								size="small"
								buttonType="success"
								icon={<AddOutline />}
							>
								Tambah Pembelian
							</LinkButton>
						}
					/>
				)}

				<div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
					{data?.map((item: Record<string, any>) => {
						return (
							<article
								key={item.ih_id}
								className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
							>
								<div className="grid grid-cols-1 gap-0 md:grid-cols-[180px_minmax(0,1fr)]">
									<div className="border-b border-slate-100 bg-slate-50 md:border-b-0 md:border-r">
										<div className="flex h-full min-h-52 items-center justify-center p-4">
											{item.ih_image ? (
												<img
													src={item.ih_image}
													alt="item-image"
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
												<span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">
													Transaksi #{item.ih_id}
												</span>
												<small className="text-xs text-slate-500">
													{dayjs(item.createdAt).format(datetimeFormat)}
												</small>
											</div>
											<p className="mt-4 text-xl font-bold text-slate-800">{item.item_name}</p>
											<div className="mt-4 grid grid-cols-3 gap-3">
												<div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
													<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
														Tanggal
													</p>
													<p className="mt-2 text-sm font-semibold text-slate-700">
														{dayjs(item.ih_date).format(dateFormat)}
													</p>
												</div>
												<div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-right">
													<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
														Qty
													</p>
													<p className="mt-2 text-lg font-black text-slate-800">{item.ih_qty}</p>
												</div>
												<div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-right">
													<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
														Harga
													</p>
													<p className="mt-2 text-sm font-bold text-slate-800">
														{numberFormatter(item.ih_price)}
													</p>
												</div>
											</div>
										</div>
										<div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
											<LinkButton
												size="small"
												buttonType="info"
												href={`/admin/buy-item/detail?id=${item.ih_id}`}
											>
												Lihat Detail
											</LinkButton>
											<Button
												buttonType="danger"
												size="small"
												onClick={() => onRemove(item.ih_id)}
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

export default Home;
