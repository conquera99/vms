import { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { AddOutline, LeftOutline, LoopOutline, UnorderedListOutline } from 'antd-mobile-icons';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Empty from 'components/display/empty';
import Container from 'components/general/container';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';
import { ConfirmButton, LinkButton } from 'components/general/button';

import { dateFormat, datetimeFormat, successMessage } from 'utils/constant';
import useListData from 'hooks/useListData';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Mendiang',
		href: '/admin/deceased',
	},
];

const Page = () => {
	const { ref, setSize, data, isEmpty, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/admin/deceased',
		show: 20,
	});
	const shownCount = data?.length || 0;

	const [removeLoading, setRemoveLoading] = useState(false);

	const onRemove = (id: string) => {
		setRemoveLoading(true);

		axios
			.post('/api/admin/deceased/remove', { id })
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
		<Navigation title="VMS: Data Mendiang" active="admin" access="deceased" isAdmin>
			<Container>
				<div className="mt-6 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-100 via-white to-amber-50 p-5 shadow-sm md:p-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<Breadcrumb data={breadcrumb} />
							<h1 className="mt-3 text-2xl font-bold text-slate-800">Data Mendiang</h1>
							<p className="text-sm text-slate-600">Pendataan mendiang untuk dokumentasi vihara.</p>
						</div>
						<div className="flex w-full flex-col items-end gap-2 md:w-auto">
							<div className="min-w-36 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-amber-900 shadow-sm">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="text-[10px] uppercase tracking-[0.18em] text-amber-600">Total Data</p>
										<p className="mt-1 text-2xl font-black leading-none">{shownCount}</p>
									</div>
									<LoopOutline className="text-xl text-amber-700" />
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
									href="/admin/deceased/list"
									size="small"
									buttonType="info"
									icon={<UnorderedListOutline />}
									className="text-base"
								>
									Tabel
								</LinkButton>
								<LinkButton
									href="/admin/deceased/detail"
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

				{isEmpty ? (
					<Empty
						title="Belum ada data mendiang"
						desc="Tambahkan data mendiang untuk mulai dokumentasi riwayat umat."
						action={
							<LinkButton
								href="/admin/deceased/detail"
								size="small"
								buttonType="success"
								icon={<AddOutline />}
							>
								Tambah Data
							</LinkButton>
						}
					/>
				) : (
					<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
						{data?.map((item: Record<string, any>) => {
							return (
								<article
									key={item.id}
									className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
								>
									<div className="grid grid-cols-12 gap-2">
										<div className="col-span-4 lg:col-span-3 overflow-hidden">
											<div className="bg-slate-100 w-28 h-40 rounded-md border border-slate-200 flex items-center justify-center">
												<img
													src={
														item.image ||
														'/images/buddha-placeholder.png'
													}
													alt="deceased-image"
													className="object-cover w-28 h-40 rounded-md"
												/>
											</div>
										</div>

										<div className="col-span-8 lg:col-span-9 flex flex-col justify-between">
											<div>
												<span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
													ID {item.id}
												</span>
												<p className="font-bold text-lg mt-2 text-slate-800">
													ALM. {item.name}
												</p>
												<div className="mt-1 grid grid-cols-2 gap-2 text-sm">
													<div className="col-6">
														<small className="text-slate-500">Lahir</small>
														<p>
															{item.placeOfBirth || '-'},
															{item.dateOfBirth
																? dayjs(item.dateOfBirth).format(
																		dateFormat,
																  )
																: '-'}
															{item?.birthNotes
																? ` (${item.birthNotes})`
																: ''}
														</p>
													</div>
													<div className="col-6">
														<small className="text-slate-500">Wafat</small>
														<p>
															{item.placeOfDeath || '-'},
															{item.dateOfDeath
																? dayjs(item.dateOfDeath).format(
																		dateFormat,
																  )
																: '-'}
															{item?.deathNotes
																? ` (${item.deathNotes})`
																: ''}
														</p>
													</div>
												</div>
												<small className="text-xs text-slate-500">
													Dibuat {dayjs(item.createdAt).format(datetimeFormat)}
												</small>
											</div>
											<div className="mt-2 flex justify-between items-center">
												<div className="flex">
													<LinkButton
														size="small"
														buttonType="info"
														className="mr-2"
														href={`/admin/deceased/detail?id=${item.id}`}
													>
														Lihat
													</LinkButton>
													<LinkButton
														size="small"
														buttonType="info"
														href={`/admin/deceased/print?id=${item.id}`}
													>
														Cetak
													</LinkButton>
												</div>
												<ConfirmButton
													className="text-red-500"
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
				)}

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
