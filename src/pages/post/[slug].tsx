import { FC } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import escapeHtml from 'escape-html';
import dayjs from 'dayjs';
import { CalendarOutline, UserOutline } from 'antd-mobile-icons';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Container from 'components/general/container';

import { prisma } from 'db';
import { datetimeFormat } from 'utils/constant';
import BlurImage from 'components/display/BlurImage';

const Page: FC<{ data: Record<string, any> }> = ({ data }) => {
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

	return (
		<Navigation
			title={data.title}
			desc={data.summary}
			image={data.image}
			active="home"
			hideFooter={false}
		>
			<Container>
				<section className="relative mt-4 overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-200/35 backdrop-blur-sm sm:mt-6 sm:p-6 lg:p-8">
					<div className="pointer-events-none absolute -right-16 top-0 h-44 w-44 rounded-full bg-[#f3deb1]/45 blur-3xl" />
					<div className="pointer-events-none absolute -left-16 bottom-2 h-40 w-40 rounded-full bg-[#c8dded]/50 blur-3xl" />

					<Breadcrumb data={breadcrumb} variant="post" />

					<div className="relative z-10">
						<BlurImage
							src={data.image}
							alt={data.title}
							className="rounded-2xl"
							sizes="(max-width: 640px) 100vw, (max-width: 1280px) 92vw, 1100px"
							preview
						/>

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
									{data.createdBy}
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

		if (node.udnerline) {
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
			return `<h1 class='my-4 text-2xl font-semibold text-slate-800'>${children}</h1>`;
		case 'heading-two':
			return `<h2 class='my-3 text-xl font-semibold text-slate-800'>${children}</h2>`;
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

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [{ params: { slug: 'Perayaan-Magha-Puja-2565-BE-2022' } }],
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

	const data = await prisma.posts.findFirst({ where: { slug: slug as string } });

	if (!data || data?.status !== 'P') {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			data: {
				...data,
				content: serialize(JSON.parse(data.content), true),
				createdAt: dayjs(data.createdAt).format(datetimeFormat),
				updatedAt: dayjs(data.updatedAt).format(datetimeFormat),
			},
		},
	};
};

export default Page;
