import dayjs from 'dayjs';
import { CloseOutline } from 'antd-mobile-icons';

import Title from 'components/display/title';
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

	return (
		<Navigation title="VMS: Data Mendiang" active="admin" access="deceased" isAdmin>
			<Container>
				<Title>
					<div className="flex justify-between items-center">
						<Breadcrumb data={breadcrumb} />
						<div className="flex">
							<LinkButton
								href="/admin/deceased"
								size="small"
								buttonType="warning"
								icon={<CloseOutline />}
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
				</Title>

				{isEmpty && <Empty />}

				<div className="p-4">
					<table className="shadow-lg table-auto w-full text-left">
						<thead className="bg-gray-50 uppercase">
							<tr className="border-2">
								<th className="px-4 py-2 border-r-2">#</th>
								<th className="px-4 py-2 border-r-2">NAMA MENDIANG</th>
								<th className="px-4 py-2 border-r-2">LAHIR</th>
								<th className="px-4 py-2 border-r-2">WAFAT</th>
								<th className="px-4 py-2 border-r-2">KELUARGA</th>
								<th className="px-4 py-2 border-r-2">OPSI</th>
							</tr>
						</thead>
						<tbody>
							{data?.map((item: Record<string, any>) => {
								return (
									<tr key={item.id}>
										<td>
											<img
												src={item.image || '/images/buddha-placeholder.png'}
												alt="member-image"
												className="object-cover w-14 h-20 rounded-md"
											/>
										</td>
										<td>ALM. {item.name}</td>
										<td>
											{item.placeOfBirth || '-'}
											<br />
											{item.dateOfBirth
												? dayjs(item.dateOfBirth).format(dateFormat)
												: '-'}
											{item?.birthNotes ? ` (${item.birthNotes})` : ''}
										</td>

										<td>
											{item.placeOfDeath || '-'}
											<br />
											{item.dateOfDeath
												? dayjs(item.dateOfDeath).format(dateFormat)
												: '-'}
											{item?.deathNotes ? ` (${item.deathNotes})` : ''}
										</td>
										<td>{item.family}</td>
										<td>
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
								<td colSpan={8}>
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
			</Container>
		</Navigation>
	);
};

export default Page;
