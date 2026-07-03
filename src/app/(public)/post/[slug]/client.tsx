'use client';

import { CalendarOutline, UserOutline } from 'components/general/antd-icon';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Container from 'components/general/container';
import BlurImage from 'components/display/BlurImage';

export default function PostDetailClient({ data }: { data: Record<string, any> }) {
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
}
