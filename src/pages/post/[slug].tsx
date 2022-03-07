import { FC } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import escapeHtml from 'escape-html';
import dayjs from 'dayjs';
import Image from 'next/image';
import { CalendarOutline, UserOutline } from 'antd-mobile-icons';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Container from 'components/general/container';

import { prisma } from 'db';
import { datetimeFormat } from 'utils/constant';

const Home: FC<{ data: Record<string, any> }> = ({ data }) => {
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
		<Navigation title={data.title} desc={data.summary} image={data.image} active="home">
			<Container>
				<Title>
					<Breadcrumb data={breadcrumb} />
				</Title>
				<div>
					<Image
						src={data.image}
						className="rounded-md object-cover"
						alt={data.title}
						height={230}
						width={400}
						layout="responsive"
					/>
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
				<div dangerouslySetInnerHTML={{ __html: data.content }} />
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
			return `<blockquote class='my-4'><p>${children}</p></blockquote>`;
		case 'bulleted-list':
			return `<ul class='list-disc list-inside'>${children}</ul>`;
		case 'heading-one':
			return `<h1 class='text-xl my-4'>${children}</h1>`;
		case 'heading-two':
			return `<h2 class='text-lg my-3'>${children}</h2>`;
		case 'list-item':
			return `<li>${children}</li>`;
		case 'numbered-list':
			return `<ol class='list-decimal list-inside'><p>${children}</p></ol>`;
		case 'paragraph':
			return `<p class='my-2'>${children}</p>`;
		case 'link':
			return `<a href="${escapeHtml(node.url)}">${children}</a>`;
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

export default Home;
