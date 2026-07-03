import { prisma } from 'db';
import dayjs from 'dayjs';
import escapeHtml from 'escape-html';
import { datetimeFormat } from 'utils/constant';
import PostDetailClient from './client';

export async function generateStaticParams() {
	const posts = await prisma.posts.findMany({ where: { status: 'P' }, select: { slug: true } });
	return posts.map((p) => ({ slug: p.slug }));
}

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

export default async function PostPage({ params }: { params: { slug: string } }) {
	const data = await prisma.posts.findFirst({ where: { slug: params.slug } });

	if (!data || data?.status !== 'P') {
		return <div>Post not found</div>;
	}

	const postData = {
		...data,
		content: serialize(JSON.parse(data.content), true),
		createdAt: dayjs(data.createdAt).format(datetimeFormat),
		updatedAt: dayjs(data.updatedAt).format(datetimeFormat),
	};

	return <PostDetailClient data={postData} />;
}
