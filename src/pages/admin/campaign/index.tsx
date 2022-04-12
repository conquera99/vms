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
		title: 'Campaign',
		href: '/admin/campaign',
	},
];

const Page = () => {
	const { ref, setSize, data, isEmpty, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/admin/campaign',
	});

	const onRemove = (id: string) => {
		axios.post('/api/admin/campaign/remove', { id }).then((response) => {
			if (response.data.code === 0) {
				toast.success(successMessage);
				setSize(1);
			} else {
				toast.error(response.data.message);
			}
		});
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
										<small className="text-xs">ID:&nbsp;{item.id}</small>
										<p className="font-bold text-lg">{item.title}</p>
										<small className="text-xs text-gray-600">
											{dayjs(item.createdAt).format(datetimeFormat)}
										</small>
									</div>
									<div>
										<Link href={`/admin/campaign/detail?id=${item.id}`}>
											<a className="text-blue-500 mr-2">edit</a>
										</Link>
										<Link href={`/admin/campaign/participant?id=${item.id}`}>
											<a className="text-gray-500 mr-2">atur</a>
										</Link>
										<button
											className="text-red-500"
											onClick={() => onRemove(item.id)}
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
