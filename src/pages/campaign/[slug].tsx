import { FC, useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import dayjs from 'dayjs';
import axios from 'axios';
import { CalendarOutline, UserOutline } from 'antd-mobile-icons';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Container from 'components/general/container';
import BlurImage from 'components/display/BlurImage';
import Empty from 'components/display/empty';

import { prisma } from 'db';
import { dateFormat, datetimeFormat } from 'utils/constant';

const Page: FC<{ data: Record<string, any> }> = ({ data }) => {
	const breadcrumb = [
		{
			title: 'Home',
			href: '/',
		},
		{
			title: 'Campaign',
			href: `/campaign/${data.slug}`,
		},
	];

	const [participant, setParticipant] = useState<Record<string, any>[]>([]);

	useEffect(() => {
		axios.get(`/api/campaign/participant?id=${data.id}`).then((response) => {
			if (response.data.code === 0) {
				setParticipant(response.data.data);
			}
		});
	}, [data.id]);

	return (
		<Navigation title={data.title} desc={data.desc} image={data.image} active="home" hideFooter={false}>
			<Container>
				<Title>
					<Breadcrumb data={breadcrumb} />
				</Title>
				<div>
					<BlurImage src={data.image} alt={data.title} />
					<div className="my-5">
						<h1 className="text-3xl text-indigo-500 font-bold">{data.title}</h1>
						<div className="flex">
							<div className="flex mb-2 mr-5">
								<UserOutline className="mr-2" />
								{data.createdBy}
							</div>
							<div className="flex">
								<CalendarOutline className="mr-2" />
								{data.createdAt}
							</div>
						</div>
					</div>
				</div>
				<div className="whitespace-pre-line">{data.desc}</div>

				<div className="mt-4">
					<h2 className="text-lg font-bold mb-2">Perserta</h2>
					{participant.length === 0 && <Empty />}
					{participant.length > 0 &&
						participant.map((item) => (
							<div
								key={`${item.name}-${item.status}`}
								className="flex items-center justify-between border-b mb-2 py-2 last:border-none"
							>
								<div className="w-6/12">{item.name}</div>
								<div className="text-center w-3/12 px-2">
									<p
										className={`text-xs font-bold py-1 px-2 rounded-md ${
											item.status === 'P'
												? 'bg-slate-300'
												: item.status === 'H'
												? 'bg-orange-200'
												: 'bg-green-200'
										}`}
									>
										{item.status === 'P'
											? 'PENDING'
											: item.status === 'H'
											? 'SEBAGIAN'
											: 'FULL'}
									</p>
								</div>
							</div>
						))}
				</div>
			</Container>
		</Navigation>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [{ params: { slug: 'spanduk' } }],
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug } = params as Record<string, any>;

	// redirect
	if (!slug) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const data = await prisma.campaign.findFirst({ where: { slug: slug as string } });

	if (!data || data?.status !== 'A') {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			data: {
				...data,
				startDate: data.startDate ? dayjs(data.startDate).format(dateFormat) : '-',
				endDate: data.endDate ? dayjs(data.endDate).format(dateFormat) : '-',
				createdAt: dayjs(data.createdAt).format(datetimeFormat),
				updatedAt: dayjs(data.updatedAt).format(datetimeFormat),
			},
		},
	};
};

export default Page;
