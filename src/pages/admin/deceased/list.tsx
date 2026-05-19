import dayjs from 'dayjs';
import { LeftOutline, LoopOutline } from 'components/general/antd-icon';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Empty from 'components/display/empty';
import Container from 'components/general/container';
import InfiniteScrollTrigger from 'components/general/infinite-scroll-trigger';
import Button, { LinkButton } from 'components/general/button';

import { dateFormat } from 'utils/constant';
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
	const { ref, data, isEmpty, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/admin/deceased/list-by-family',
		show: 100,
	});
	const shownCount = data?.length || 0;

	return (
		<Navigation title="VMS: Data Mendiang" active="admin" access="deceased" isAdmin>
			<Container>
				<div className="mt-6 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-100 via-white to-amber-50 p-5 shadow-sm md:p-6 print-hide">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<Breadcrumb data={breadcrumb} />
							<h1 className="mt-3 text-2xl font-bold text-slate-800">Data Mendiang (Tabel)</h1>
							<p className="text-sm text-slate-600">Mode tabel untuk rekap keluarga dan cetak massal.</p>
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
									href="/admin/deceased"
									size="small"
									buttonType="warning"
									icon={<LeftOutline />}
									className="text-base mr-2"
								>
									Tutup
								</LinkButton>
								<Button
									onClick={() => window.print()}
									size="small"
									buttonType="info"
									className="text-base"
								>
									Cetak
								</Button>
							</div>
						</div>
					</div>
				</div>

				{isEmpty && <Empty />}

				<div className="p-4">
					<div className="space-y-3 md:hidden print-hide">
						{data?.map((item: Record<string, any>) => {
							return (
								<article
									key={item.id}
									className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
								>
									<div className="flex gap-3">
										<img
											src={item.image || '/images/buddha-placeholder.png'}
											alt="member-image"
											className="h-20 w-14 rounded-md object-cover"
										/>
										<div className="min-w-0 flex-1">
											<p className="text-sm text-slate-500">ALM.</p>
											<p className="truncate text-base font-bold text-slate-800">{item.name}</p>
											<p className="mt-1 text-xs text-slate-500">Keluarga: {item.family || '-'}</p>
										</div>
									</div>

									<div className="mt-3 grid grid-cols-2 gap-2 text-xs">
										<div className="rounded-lg bg-slate-50 p-2">
											<p className="font-semibold text-slate-500">Lahir</p>
											<p className="mt-1 text-slate-700">{item.placeOfBirth || '-'}</p>
											<p className="text-slate-700">
												{item.dateOfBirth ? dayjs(item.dateOfBirth).format(dateFormat) : '-'}
												{item?.birthNotes ? ` (${item.birthNotes})` : ''}
											</p>
										</div>
										<div className="rounded-lg bg-slate-50 p-2">
											<p className="font-semibold text-slate-500">Wafat</p>
											<p className="mt-1 text-slate-700">{item.placeOfDeath || '-'}</p>
											<p className="text-slate-700">
												{item.dateOfDeath ? dayjs(item.dateOfDeath).format(dateFormat) : '-'}
												{item?.deathNotes ? ` (${item.deathNotes})` : ''}
											</p>
										</div>
									</div>

									<div className="mt-3 flex justify-end">
										<LinkButton
											size="small"
											buttonType="info"
											href={`/admin/deceased/print?id=${item.id}`}
										>
											Cetak
										</LinkButton>
									</div>
								</article>
							);
						})}
					</div>

					<div className="hidden md:block print-show">
						<div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
							<table className="w-full min-w-[900px] table-auto border-collapse text-left text-sm">
								<thead className="bg-slate-50 text-xs tracking-wide text-slate-500">
									<tr>
										<th className="w-24 px-4 py-3 font-semibold">Foto</th>
										<th className="px-4 py-3 font-semibold">Nama Mendiang</th>
										<th className="px-4 py-3 font-semibold">Lahir</th>
										<th className="px-4 py-3 font-semibold">Wafat</th>
										<th className="px-4 py-3 font-semibold">Keluarga</th>
										<th className="px-4 py-3 font-semibold print-hide">Opsi</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{data?.map((item: Record<string, any>) => {
										return (
											<tr key={item.id} className="align-top transition hover:bg-slate-50/70">
												<td className="px-4 py-3">
													<img
														src={item.image || '/images/buddha-placeholder.png'}
														alt="member-image"
														className="h-16 w-12 rounded-md object-cover ring-1 ring-slate-200"
													/>
												</td>
												<td className="px-4 py-3 text-slate-700">
													<p className="font-semibold text-slate-800">ALM. {item.name}</p>
												</td>
												<td className="px-4 py-3 text-slate-700">
													<p>{item.placeOfBirth || '-'}</p>
													<p className="text-xs text-slate-500">
														{item.dateOfBirth ? dayjs(item.dateOfBirth).format(dateFormat) : '-'}
														{item?.birthNotes ? ` (${item.birthNotes})` : ''}
													</p>
												</td>
												<td className="px-4 py-3 text-slate-700">
													<p>{item.placeOfDeath || '-'}</p>
													<p className="text-xs text-slate-500">
														{item.dateOfDeath ? dayjs(item.dateOfDeath).format(dateFormat) : '-'}
														{item?.deathNotes ? ` (${item.deathNotes})` : ''}
													</p>
												</td>
												<td className="px-4 py-3">
													<span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
														{item.family || '-'}
													</span>
												</td>
												<td className="px-4 py-3 print-hide">
													<LinkButton
														size="small"
														buttonType="info"
														href={`/admin/deceased/print?id=${item.id}`}
													>
														Cetak
													</LinkButton>
												</td>
											</tr>
										);
									})}
								</tbody>
								<tfoot className="print-hide">
									<tr>
										<td colSpan={6} className="px-4 py-3">
											<InfiniteScrollTrigger
												triggerRef={ref}
												isLoadingMore={isLoadingMore}
												isReachingEnd={isReachingEnd}
											/>
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
				</div>
			</Container>
		</Navigation>
	);
};

export default Page;
