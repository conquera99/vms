import { LegacyRef, useEffect, useRef } from 'react';
import { AddOutline } from 'antd-mobile-icons';
import useSWRInfinite from 'swr/infinite';
import axios from 'axios';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Empty from 'components/display/empty';
import Button, { LinkButton } from 'components/general/button';
import { Loading } from 'components/general/icon';
import List from 'components/display/list';
import Container from 'components/general/container';

import useOnScreen from 'hooks/useOnScreen';

import fetcher from 'utils/fetcher';
import { datetimeFormat, DEFAULT_LIMIT, successMessage } from 'utils/constant';

const getKey = (page: number, previousPageData: Record<string, any>, pageSize: number) => {
	if (previousPageData?.data && !previousPageData.data.length) return null;

	return `/api/admin/gallery/image?s=${pageSize}&p=${page + 1}`;
};

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Gambar',
		href: '/admin/image',
	},
];

const Page = () => {
	const ref = useRef() as LegacyRef<HTMLDivElement>;

	const isVisible = useOnScreen(ref);

	const {
		data: response,
		error,
		size,
		setSize,
		isValidating,
	} = useSWRInfinite((...args) => getKey(...args, DEFAULT_LIMIT), fetcher);

	const data = response ? [].concat(...response) : [];
	const isLoadingInitialData = !response && !error;
	const isLoadingMore =
		isLoadingInitialData || (size > 0 && response && typeof response[size - 1] === 'undefined');
	const isEmpty = response?.[0]?.length === 0;
	const isReachingEnd = size === DEFAULT_LIMIT;
	const isRefreshing = isValidating && response && response.length === size;

	useEffect(() => {
		if (isVisible && !isReachingEnd && !isRefreshing) {
			setSize(size + 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isVisible, isRefreshing]);

	const onRemove = (id: string) => {
		axios.post('/api/admin/gallery/image/remove', { id }).then((response) => {
			if (response.data.code === 0) {
				toast.success(successMessage);
				setSize(1);
			} else {
				toast.error(response.data.message);
			}
		});
	};

	return (
		<Navigation title="VMS: Data Gambar" active="admin" access="image" isAdmin>
			<Container>
				<Title>
					<div className="flex justify-between items-center">
						<Breadcrumb data={breadcrumb} />
						<LinkButton
							href="/admin/image/detail"
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
										<div className="bg-slate-100 w-28 h-28 rounded-lg flex items-center justify-center">
											{item.image ? (
												<img
													src={item.image}
													alt="member-image"
													className="object-cover w-28 h-28 rounded-lg"
												/>
											) : (
												<div className="text-gray-500">No Image</div>
											)}
										</div>
									</div>

									<div className="col-span-8 lg:col-span-9 flex flex-col justify-between">
										<div>
											<small className="text-xs">ID:&nbsp;{item.id}</small>
											<p className="font-bold text-lg">{item.altText}</p>
											<small className="text-xs text-gray-600">
												{dayjs(item.createdAt).format(datetimeFormat)}
											</small>
										</div>
										<div className="mt-2 flex justify-between items-center">
											<LinkButton
												size="small"
												buttonType="info"
												href={`/admin/image/detail?id=${item.id}`}
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

				<div ref={ref} className="text-center flex items-center mt-4 justify-center">
					{isLoadingMore ? (
						<Loading />
					) : isReachingEnd ? (
						<p className="text-gray-400">No more data</p>
					) : null}
				</div>
			</Container>
		</Navigation>
	);
};

export default Page;
