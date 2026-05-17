import axios from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import { toast } from 'utils/toast';
import { AddOutline, LeftOutline, LocationOutline } from 'antd-mobile-icons';

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
		title: 'Lokasi',
		href: '/admin/location',
	},
];

const Page = () => {
	const { ref, setSize, data, isEmpty, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/admin/location',
	});
	const shownCount = data?.length || 0;

	const onRemove = (id: string) => {
		axios.post('/api/admin/location/remove', { id }).then((response) => {
			if (response.data.code === 0) {
				toast.success(successMessage);
				setSize(1);
			} else {
				toast.error(response.data.message);
			}
		});
	};

	return (
        <Navigation title="VMS: Data Lokasi" active="admin" access="location" isAdmin>
            <Container>
				<div className="mt-6 rounded-3xl border border-slate-200 bg-linear-to-br from-cyan-50 via-white to-amber-50 p-5 shadow-sm md:p-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<Breadcrumb data={breadcrumb} />
							<h1 className="mt-3 text-2xl font-bold text-slate-800">Data Lokasi</h1>
							<p className="text-sm text-slate-600">Kelola lokasi penyimpanan item vihara.</p>
						</div>
						<div className="flex w-full flex-col items-end gap-2 md:w-auto">
							<div className="min-w-36 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-2 text-cyan-900 shadow-sm">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="text-[10px] uppercase tracking-[0.18em] text-cyan-600">Total Data</p>
										<p className="mt-1 text-2xl font-black leading-none">{shownCount}</p>
									</div>
									<LocationOutline className="text-xl text-cyan-700" />
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
									href="/admin/location/detail"
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
						title="Belum ada lokasi"
						desc="Tambahkan lokasi baru untuk mulai mengelola penyimpanan item vihara."
						action={
							<LinkButton
								href="/admin/location/detail"
								size="small"
								buttonType="success"
								icon={<AddOutline />}
							>
								Tambah Lokasi
							</LinkButton>
						}
					/>
				)}

				<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
					{data?.map((item: Record<string, any>) => {
						return (
                            <article
								key={item.id}
								className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-md"
							>
								<div className="flex items-start justify-between gap-3">
									<div>
										<span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-700">
											ID {item.code}
										</span>
										<p className="mt-3 text-lg font-bold text-slate-800">{item.name}</p>
										<small className="text-xs text-slate-500">
											Dibuat {dayjs(item.createdAt).format(datetimeFormat)}
										</small>
									</div>
									<div className="flex shrink-0 gap-2 text-sm">
										<Link
                                            href={`/admin/location/detail?id=${item.id}`}
                                            className="rounded-lg border border-sky-300 px-2 py-1 font-semibold text-sky-600 hover:bg-sky-50">
											Edit
										</Link>
										<button
											className="rounded-lg border border-rose-300 px-2 py-1 font-semibold text-rose-600 hover:bg-rose-50"
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
