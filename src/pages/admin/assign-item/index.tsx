import axios from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { AddOutline } from 'antd-mobile-icons';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Empty from 'components/display/empty';
import List from 'components/display/list';
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
				<Title>
					<div className="flex justify-between items-center">
						<Breadcrumb data={breadcrumb} />
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
				</Title>

				{isEmpty && <Empty />}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{data?.map((item: Record<string, any>) => {
						return (
							<List key={item.il_code}>
								<div className="flex justify-between">
									<div>
										<small className="text-xs">ID:&nbsp;{item.il_code}</small>
										<p className="font-bold text-lg">{item.item_name}</p>
										<div className="text-sm mt-1 mb-3 grid grid-cols-3 gap-2">
											<div>
												<small>Lokasi</small>
												<p>{item.loc_name}</p>
											</div>
											<div className="text-right">
												<small>Qty</small>
												<p>{item.il_qty}</p>
											</div>
										</div>
										<small className="text-xs text-gray-600">
											{dayjs(item.createdAt).format(datetimeFormat)}
										</small>
									</div>
									<div>
										<Link
											href={`/admin/assign-item/detail?locId=${item.il_loc_id}&itemId=${item.item_id}`}
										>
											<a className="text-blue-500 mr-2">lihat</a>
										</Link>
										<button
											className="text-red-500"
											onClick={() => onRemove(item.il_loc_id, item.item_id)}
										>
											hapus
										</button>
									</div>
								</div>
							</List>
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
