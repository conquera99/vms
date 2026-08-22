'use client';

import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'utils/toast';
import { AddOutline, LeftOutline, TeamOutline } from 'components/general/antd-icon';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Empty from 'components/display/empty';
import Container from 'components/general/container';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';
import Button, { LinkButton } from 'components/general/button';

import { datetimeFormat, successMessage } from 'utils/constant';
import useListData from 'hooks/useListData';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Anggota',
		href: '/admin/member',
	},
];

const Page = () => {
	const { ref, setSize, data, isEmpty, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/admin/member',
	});
	const shownCount = data?.length || 0;

	const onRemove = (id: string) => {
		axios.post('/api/admin/member/remove', { id }).then((response) => {
			if (response.data.code === 0) {
				toast.success(successMessage);
				setSize(1);
			} else {
				toast.error(response.data.message);
			}
		});
	};

	return (
		<Navigation title="VMS: Data Anggota" active="admin" access="member" isAdmin>
			<Container>
				<div className="rounded-3xl border border-slate-200 bg-linear-to-br from-rose-50 via-white to-sky-50 p-5 shadow-sm md:p-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<Breadcrumb data={breadcrumb} />
							<h1 className="mt-3 text-2xl font-bold text-slate-800">Data Anggota</h1>
							<p className="text-sm text-slate-600">Daftar anggota aktif beserta profil singkat.</p>
						</div>
						<div className="flex w-full flex-col items-end gap-2 md:w-auto">
							<div className="min-w-36 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-rose-900 shadow-sm">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="text-[10px] uppercase tracking-[0.18em] text-rose-600">Total Data</p>
										<p className="mt-1 text-2xl font-black leading-none">{shownCount}</p>
									</div>
									<TeamOutline className="text-xl text-rose-700" />
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
									href="/admin/member/detail"
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
						title="Belum ada anggota"
						desc="Data anggota masih kosong. Tambahkan anggota baru untuk mulai pendataan."
						action={
							<LinkButton
								href="/admin/member/detail"
								size="small"
								buttonType="success"
								icon={<AddOutline />}
							>
								Tambah Anggota
							</LinkButton>
						}
					/>
				)}

				<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
					{data?.map((item: Record<string, any>) => {
						return (
							<article
								key={item.id}
								className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md"
							>
								<div className="grid grid-cols-12 gap-3">
									<div className="col-span-4 lg:col-span-3 overflow-hidden">
										<div className="bg-slate-100 h-28 w-28 rounded-full border border-slate-200 flex items-center justify-center">
											{item.image ? (
												<img
													src={item.image}
													alt="member-image"
													className="object-cover w-28 h-28 rounded-full"
												/>
											) : (
												<div className="text-gray-500">No Image</div>
											)}
										</div>
									</div>

									<div className="col-span-8 lg:col-span-9 flex flex-col justify-between">
										<div>
											<span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
												ID {item.id}
											</span>
											<p className="mt-2 text-lg font-bold text-slate-800">{item.name}</p>
											<small className="text-xs text-slate-500">
												Dibuat {dayjs(item.createdAt).format(datetimeFormat)}
											</small>
										</div>
										<div className="mt-2 flex justify-between items-center">
											<LinkButton
												size="small"
												buttonType="info"
												href={`/admin/member/detail?id=${item.id}`}
											>
												Lihat
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
