import { prisma } from 'db';
import dayjs from 'dayjs';
import { dateFormat, datetimeFormat } from 'utils/constant';
import CampaignDetailClient from './client';

export async function generateStaticParams() {
	const campaigns = await prisma.campaign.findMany({ where: { status: 'A' }, select: { slug: true } });
	return campaigns.map((c) => ({ slug: c.slug }));
}

export default async function CampaignPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const data = await prisma.campaign.findFirst({ where: { slug: params.slug } });

    if (!data || data?.status !== 'A') {
		return <div>Campaign not found</div>;
	}

    const campaignData = {
		...data,
		startDate: data.startDate ? dayjs(data.startDate).format(dateFormat) : '-',
		endDate: data.endDate ? dayjs(data.endDate).format(dateFormat) : '-',
		createdAt: dayjs(data.createdAt).format(datetimeFormat),
		updatedAt: dayjs(data.updatedAt).format(datetimeFormat),
	};

    return <CampaignDetailClient data={campaignData} />;
}
