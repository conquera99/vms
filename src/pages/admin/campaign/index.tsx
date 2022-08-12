import { useState } from 'react';
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
				<Title>
					<div className="flex justify-between items-center">
						<Breadcrumb data={breadcrumb} />
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
				</Title>

				{isEmpty && <Empty />}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{data?.map((item: Record<string, any>) => {
						return (
							<List key={item.id}>
								<div className="flex justify-between">
									<div>
										<small className="text-xs text-gray-500">
											ID:&nbsp;{item.id}
										</small>
										<p className="font-bold text-lg">{item.title}</p>
										<div className="flex">
											<div className="mr-5">
												<small className="text-gray-500">Status</small>
												<p className="font-semibold">
													{item.status === 'A'
														? 'Aktif'
														: item.status === 'C'
														? 'Selesai'
														: 'Nonaktif'}
												</p>
											</div>
											<div>
												<small className="text-gray-500">Visibilitas</small>
												<p className="font-semibold">
													{item.visible === 'Y'
														? 'Terpublikasi'
														: 'Internal'}
												</p>
											</div>
										</div>
										<small className="text-xs text-gray-600">
											{dayjs(item.createdAt).format(datetimeFormat)}
										</small>
									</div>
									<div className="flex flex-col justify-between items-end">
										<div>
											<Link href={`/admin/campaign/detail?id=${item.id}`}>
												<a className="text-blue-500 mr-2">edit</a>
											</Link>
											<ConfirmButton
												className="text-red-500"
												confirmText="Yakin untuk menghapus data ini?"
												onClick={() => onRemove(item.id)}
												loading={removeLoading}
											>
												hapus
											</ConfirmButton>
										</div>
										<Link href={`/admin/campaign/participant?id=${item.id}`}>
											<a className="text-gray-700 mr-2 px-2 py-1 bg-blue-100 rounded-md text-sm">
												Atur Peserta
											</a>
										</Link>
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
