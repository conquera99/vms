import { LegacyRef, useEffect, useRef } from 'react';
import { AddOutline } from 'antd-mobile-icons';
import useSWRInfinite from 'swr/infinite';
import axios from 'axios';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import Link from 'next/link';

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
import { dateFormat, datetimeFormat, DEFAULT_LIMIT, successMessage } from 'utils/constant';
import { numberFormatter } from 'utils/helper';

const getKey = (page: number, previousPageData: Record<string, any>, pageSize: number) => {
	if (previousPageData?.data && !previousPageData.data.length) return null;

	return `/api/admin/buy-item?s=${pageSize}&p=${page + 1}`;
};

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Beli Item',
		href: '/admin/buy-item',
	},
];

const Home = () => {
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
		axios.post('/api/admin/buy-item/remove', { id }).then((response) => {
			if (response.data.code === 0) {
				toast.success(successMessage);
				setSize(1);
			} else {
				toast.error(response.data.message);
			}
		});
	};

	return (
		<Navigation title="VMS: Data Beli Item" active="admin" access="item_history" isAdmin>
			<Container>
				<Title>
					<div className="flex justify-between items-center">
						<Breadcrumb data={breadcrumb} />
						<LinkButton
							href="/admin/buy-item/detail"
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
							<List key={item.ih_id}>
								<div className="grid grid-cols-12 gap-2">
									<div className="col-span-4 lg:col-span-3 overflow-hidden">
										<div className="bg-slate-100 w-full h-full rounded-lg">
											<img
												src={item.ih_image}
												alt="item-image"
												className="object-cover h-40 rounded-lg"
											/>
										</div>
									</div>

									<div className="col-span-8 lg:col-span-9 flex flex-col justify-between">
										<div>
											<small className="text-xs">ID:&nbsp;{item.ih_id}</small>
											<p className="font-bold text-lg">{item.item_name}</p>
											<div className="text-sm mt-1 mb-3 grid grid-cols-3 gap-2">
												<div>
													<small>Tanggal</small>
													<p>{dayjs(item.ih_date).format(dateFormat)}</p>
												</div>
												<div className="text-right">
													<small>Qty</small>
													<p>{item.ih_qty}</p>
												</div>
												<div className="text-right">
													<small>Harga</small>
													<p>{numberFormatter(item.ih_price)}</p>
												</div>
											</div>
											<small className="text-xs text-gray-600">
												{dayjs(item.createdAt).format(datetimeFormat)}
											</small>
										</div>
										<div className="mt-2 flex justify-between items-center">
											<LinkButton
												size="small"
												buttonType="info"
												href={`/admin/buy-item/detail?id=${item.ih_id}`}
											>
												Lihat
											</LinkButton>
											<Button
												buttonType="danger"
												size="small"
												onClick={() => onRemove(item.ih_id)}
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

export default Home;
