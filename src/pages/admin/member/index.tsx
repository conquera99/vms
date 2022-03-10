import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { AddOutline } from 'antd-mobile-icons';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Empty from 'components/display/empty';
import List from 'components/display/list';
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
				<Title>
					<div className="flex justify-between items-center">
						<Breadcrumb data={breadcrumb} />
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
				</Title>

				{isEmpty && <Empty />}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{data?.map((item: Record<string, any>) => {
						return (
							<List key={item.id}>
								<div className="grid grid-cols-12 gap-2">
									<div className="col-span-4 lg:col-span-3 overflow-hidden">
										<div className="bg-slate-100 w-28 h-28 rounded-full flex items-center justify-center">
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
											<small className="text-xs">ID:&nbsp;{item.id}</small>
											<p className="font-bold text-lg">{item.name}</p>
											<small className="text-xs text-gray-600">
												{dayjs(item.createdAt).format(datetimeFormat)}
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
												hapus
											</Button>
										</div>
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
