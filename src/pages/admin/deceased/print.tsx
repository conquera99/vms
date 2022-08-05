import { useEffect, useState } from 'react';
import { CloseOutline } from 'antd-mobile-icons';
import axios from 'axios';
import { useRouter } from 'next/router';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Button, { LinkButton } from 'components/general/button';
import { ContainerAdmin } from 'components/general/container';
import BlurImage from 'components/display/BlurImage';
import dayjs from 'dayjs';
import { dateFormat } from 'utils/constant';

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

const Skeleton = () => (
	<div className="block bg-gray-200 animate-pulse rounded-lg my-5 border border-transparent relative">
		<div className="h-60" />
		<div className="p-1">
			<div className="animate-pulse p-4 rounded-lg">
				<div className="w-3/6 bg-gray-400 h-8 mb-2 rounded-md" />
				<div className="w-2/6 bg-gray-400 mb-3 h-3 rounded-md" />
				<div className="w-full bg-gray-400 mb-2 h-4 rounded-md" />
				<div className="w-full bg-gray-400 h-4 rounded-md" />
			</div>
		</div>
	</div>
);

const Page = () => {
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<Record<string, any> | null>(null);

	useEffect(() => {
		if (router.query.id) {
			setLoading(true);
			axios
				.get(`/api/admin/deceased?id=${router.query.id}`)
				.then((response) => {
					if (response.data.code === 0) {
						setData(response.data.data);
					}
				})
				.finally(() => setLoading(false));
		}
	}, [router.query.id]);

	return (
		<Navigation title="VMS: Mendiang Detail" active="admin" access="deceased" isAdmin>
			<ContainerAdmin>
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

				<div className="print">
					{loading ? (
						<Skeleton />
					) : (
						<div className="print-container p-4">
							<BlurImage
								src={data?.image}
								alt={data?.name}
								className="aspect-w-3 aspect-h-4"
							/>
							<div className="flex items-end">
								<div className="w-full text-center">
									<h2 className="text-7xl font-bold">{data?.name}</h2>
									<div className="grid grid-cols-1">
										<div className="text-xl col-6">
											<p className="font-semibold">
												<span className="font-normal">LAHIR:&nbsp;</span>
												{data?.placeOfBirth || '-'},
												{data?.dateOfBirth
													? dayjs(data?.dateOfBirth).format(dateFormat)
													: '-'}
											</p>
										</div>
										<div className="text-xl col-6">
											<p className="font-semibold">
												<span className="font-normal">WAFAT:&nbsp;</span>
												{data?.placeOfDeath || '-'},
												{data?.dateOfDeath
													? dayjs(data?.dateOfDeath).format(dateFormat)
													: '-'}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
