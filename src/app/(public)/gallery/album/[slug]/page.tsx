import { prisma } from 'db';
import dayjs from 'dayjs';
import { datetimeFormat } from 'utils/constant';
import AlbumDetailClient from './client';

export async function generateStaticParams() {
	const albums = await prisma.albums.findMany({ select: { slug: true } });
	return albums.map((a) => ({ slug: a.slug }));
}

export default async function AlbumPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const data = await prisma.albums.findFirst({ where: { slug: params.slug } });

    if (!data) {
		return <div>Album not found</div>;
	}

    const detail = {
		...data,
		createdAt: dayjs(data.createdAt).format(datetimeFormat),
		updatedAt: dayjs(data.updatedAt).format(datetimeFormat),
	};

    return <AlbumDetailClient detail={detail} />;
}
