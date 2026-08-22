import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import dayjs from 'dayjs';

import { prisma } from 'db';
import { dateFormat, datetimeFormat } from 'utils/constant';

import Page from './view';

async function getCampaign(slug: string) {
	const data = await prisma.campaign.findFirst({ where: { slug } });

	if (!data || data?.status !== 'A') {
		return null;
	}

	return {
		...data,
		startDate: data.startDate ? dayjs(data.startDate).format(dateFormat) : '-',
		endDate: data.endDate ? dayjs(data.endDate).format(dateFormat) : '-',
		createdAt: dayjs(data.createdAt).format(datetimeFormat),
		updatedAt: dayjs(data.updatedAt).format(datetimeFormat),
	};
}

export async function generateStaticParams() {
	return [{ slug: 'spanduk' }];
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const data = await getCampaign(slug);

	if (!data) return {};

	return {
		title: data.title,
		description: data.desc,
		alternates: {
			canonical: `/campaign/${data.slug}`,
		},
		openGraph: {
			title: data.title,
			description: data.desc,
			url: `/campaign/${data.slug}`,
			images: [data.image || '/og-default.png'],
		},
		twitter: {
			card: 'summary_large_image',
			title: data.title,
			description: data.desc,
			images: [data.image || '/og-default.png'],
		},
	};
}

export default async function CampaignPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const data = await getCampaign(slug);

	if (!data) {
		notFound();
	}

	return <Page data={data} />;
}
