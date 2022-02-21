import { LegacyRef, useEffect, useRef, useState } from 'react';
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
import { LinkButton } from 'components/general/button';
import { Loading } from 'components/general/icon';
import List from 'components/display/list';

import useOnScreen from 'hooks/useOnScreen';

import fetcher from 'utils/fetcher';
import { datetimeFormat, DEFAULT_LIMIT, successMessage } from 'utils/constant';

const getKey = (page: number, previousPageData: Record<string, any>, pageSize: number) => {
	if (previousPageData?.data && !previousPageData.data.length) return null;

	return `/api/admin/member?s=${pageSize}&p=${page + 1}`;
};

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
							<div className="flex justify-between">
								<div>
									<small className="text-xs">ID:&nbsp;{item.id}</small>
									<p className="font-bold text-lg">{item.name}</p>
									<small className="text-xs text-gray-600">
										{dayjs(item.createdAt).format(datetimeFormat)}
									</small>
								</div>
								<div>
									<Link href={`/admin/member/detail?id=${item.id}`}>
										<a className="text-blue-500 mr-2">edit</a>
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

			<div ref={ref} className="text-center flex items-center mt-4 justify-center">
				{isLoadingMore ? (
					<Loading />
				) : isReachingEnd ? (
					<p className="text-gray-400">No more data</p>
				) : null}
			</div>
		</Navigation>
	);
};

export default Home;
