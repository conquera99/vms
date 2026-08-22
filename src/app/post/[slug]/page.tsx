import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import escapeHtml from 'escape-html';
import dayjs from 'dayjs';
import { CalendarOutline, UserOutline } from 'components/general/antd-icon';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Container from 'components/general/container';

import { prisma } from 'db';
import { SITE_URL, datetimeFormat } from 'utils/constant';
import BlurImage from 'components/display/BlurImage';

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params;

	const data = await getPost(slug);

	if (!data) {
		notFound();
	}

	const breadcrumb = [
		{
			title: 'Home',
			href: '/',
		},
		{
			title: `Post`,
			href: `/post/${data.slug}`,
		},
	];

	const articleJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: data.title,
		description: data.summary ?? undefined,
		image: data.image ? [data.image] : undefined,
		datePublished: data.publishedAt,
		dateModified: data.modifiedAt,
		author: { '@type': 'Person', name: data.authorName ?? data.createdBy },
		publisher: {
			'@type': 'Organization',
			name: 'VSG',
			logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
		},
		mainEntityOfPage: `${SITE_URL}/post/${data.slug}`,
		inLanguage: 'id',
	};

	const breadcrumbJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
			{ '@type': 'ListItem', position: 2, name: data.title, item: `${SITE_URL}/post/${data.slug}` },
		],
	};

	return (
		<Navigation
			title={data.title}
			desc={data.summary ?? undefined}
			image={data.image ?? undefined}
			active="home"
			hideFooter={false}
		>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
			<Container>
				<section className="relative mt-4 overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-200/35 backdrop-blur-sm sm:mt-6 sm:p-6 lg:p-8">
					<div className="pointer-events-none absolute -right-16 top-0 h-44 w-44 rounded-full bg-[#f3deb1]/45 blur-3xl" />
					<div className="pointer-events-none absolute -left-16 bottom-2 h-40 w-40 rounded-full bg-[#c8dded]/50 blur-3xl" />

					<Breadcrumb data={breadcrumb} variant="post" />

					<div className="relative z-10">
						{data.image && (
							<BlurImage
								src={data.image}
								alt={data.title}
								className="rounded-2xl"
								sizes="(max-width: 640px) 100vw, (max-width: 1280px) 92vw, 1100px"
								preview
							/>
						)}

						<div className="my-5 sm:my-6">
							<h1 className="text-3xl font-semibold leading-tight text-slate-800 sm:text-4xl lg:text-5xl">
								{data.title}
							</h1>
							<p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
								{data.summary}
							</p>
							<div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
								<div className="inline-flex items-center rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs font-medium text-slate-600 sm:text-sm">
									<UserOutline className="mr-2" />
									{data.authorName ?? data.createdBy}
								</div>
								<div className="inline-flex items-center rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs font-medium text-slate-600 sm:text-sm">
									<CalendarOutline className="mr-2" />
									{data.createdAt}
								</div>
							</div>
						</div>

						<article
							className="rounded-2xl border border-slate-100 bg-white p-4 text-slate-700 shadow-sm sm:p-6 lg:p-8"
							dangerouslySetInnerHTML={{ __html: data.content }}
						/>
					</div>
				</section>
			</Container>
		</Navigation>
	);
};

const serialize = (node: any, first = false) => {
	if (typeof node.text !== 'undefined') {
		let string = escapeHtml(node.text);

		if (node.bold) {
			string = `<strong>${string}</strong>`;
		}

		if (node.code) {
			string = `<code>${string}</code>`;
		}

		if (node.italic) {
			string = `<em>${string}</em>`;
		}

		if (node.underline) {
			string = `<u>${string}</u>`;
		}

		return string;
	}

	const children = first
		? node.map((n: any) => serialize(n)).join('')
		: node.children.map((n: any) => serialize(n)).join('');

	switch (node.type) {
		case 'block-quote':
			return `<blockquote class='my-4 border-l-2 border-[#c8dded] pl-3 italic text-slate-500'><p>${children}</p></blockquote>`;
		case 'bulleted-list':
			return `<ul class='my-3 list-inside list-disc space-y-1'>${children}</ul>`;
		case 'heading-one':
			return `<h2 class='my-4 text-2xl font-semibold text-slate-800'>${children}</h2>`;
		case 'heading-two':
			return `<h3 class='my-3 text-xl font-semibold text-slate-800'>${children}</h3>`;
		case 'list-item':
			return `<li>${children}</li>`;
		case 'numbered-list':
			return `<ol class='my-3 list-inside list-decimal space-y-1'><p>${children}</p></ol>`;
		case 'paragraph':
			return `<p class='my-3 leading-relaxed'>${children}</p>`;
		case 'link':
			return `<a href="${escapeHtml(node.url)}" class='font-medium text-[#5d84a9] underline decoration-[#c8dded] underline-offset-4 hover:text-[#486d92]'>${children}</a>`;
		default:
			return children;
	}
};

async function getPost(slug: string) {
	const data = await prisma.posts.findFirst({ where: { slug } });

	if (!data || data?.status !== 'P') {
		return null;
	}

	const author = data.createdBy
		? await prisma.user.findUnique({
				where: { id: data.createdBy },
				select: { name: true },
			})
		: null;

	return {
		...data,
		content: serialize(JSON.parse(data.content), true),
		createdAt: dayjs(data.createdAt).format(datetimeFormat),
		updatedAt: dayjs(data.updatedAt).format(datetimeFormat),
		publishedAt: data.createdAt.toISOString(),
		modifiedAt: data.updatedAt.toISOString(),
		authorName: author?.name ?? null,
	};
}

export async function generateStaticParams() {
	return [{ slug: 'Perayaan-Magha-Puja-2565-BE-2022' }];
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const data = await getPost(slug);

	if (!data) return {};

	return {
		title: data.title,
		description: data.summary ?? undefined,
		keywords: data.keywords ?? undefined,
		alternates: {
			canonical: `/post/${data.slug}`,
		},
		openGraph: {
			type: 'article',
			title: data.title,
			description: data.summary ?? undefined,
			url: `/post/${data.slug}`,
			publishedTime: data.publishedAt,
			modifiedTime: data.modifiedAt,
			authors: [data.authorName ?? data.createdBy],
			images: [data.image || '/og-default.png'],
		},
		twitter: {
			card: 'summary_large_image',
			title: data.title,
			description: data.summary ?? undefined,
			images: [data.image || '/og-default.png'],
		},
	};
}

export default Page;
