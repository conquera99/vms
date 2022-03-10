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

import useListData from 'hooks/useListData';

import { datetimeFormat, successMessage } from 'utils/constant';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Post',
		href: '/admin/post',
	},
];

const status: Record<string, string> = {
	D: 'Draft',
	P: 'Terpublikasi',
	H: 'Tersembunyi',
};

const Page = () => {
	const { ref, setSize, data, isEmpty, isLoadingMore, isReachingEnd } = useListData({
		url: '/api/admin/post',
	});

	const onRemove = (id: string) => {
		axios.post('/api/post/member/remove', { id }).then((response) => {
			if (response.data.code === 0) {
				toast.success(successMessage);
				setSize(1);
			} else {
				toast.error(response.data.message);
			}
		});
	};

	return (
		<Navigation title="VMS: Data Post" active="admin" access="post" isAdmin>
			<Container>
				<Title>
					<div className="flex justify-between items-center">
						<Breadcrumb data={breadcrumb} />
						<LinkButton
							href="/admin/post/detail"
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

				<div className="grid grid-cols-1 gap-4">
					{data?.map((item: Record<string, any>) => {
						return (
							<List key={item.id}>
								<div className="grid grid-cols-12 gap-2">
									<div className="col-span-4 lg:col-span-3 overflow-hidden">
										<div className="bg-slate-100 w-24 h-32 md:w-36 md:h-36 rounded-lg flex items-center justify-center">
											{item.image ? (
												<img
													src={item.image}
													alt="post-image"
													className="object-cover w-24 h-32 md:w-36 md:h-36 rounded-lg"
												/>
											) : (
												<div className="text-gray-500">No Image</div>
											)}
										</div>
									</div>

									<div className="col-span-8 lg:col-span-9 flex flex-col justify-between">
										<div>
											<p className="font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis">
												{item.title}
											</p>
											<p className="text-sm mb-2 text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
												{item.summary}
											</p>
											<small className="text-xs text-gray-600">
												{dayjs(item.createdAt).format(datetimeFormat)}
												&nbsp;|&nbsp;
												{status[item.status]}
											</small>
										</div>
										<div className="mt-2 flex justify-between items-center">
											<div className="flex">
												<LinkButton
													size="small"
													buttonType="info"
													className="mr-2"
													href={`/admin/post/detail?id=${item.id}`}
												>
													Lihat
												</LinkButton>
												<LinkButton
													size="small"
													href={`/post/${item.slug}`}
												>
													Buka
												</LinkButton>
											</div>
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
