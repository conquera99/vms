'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarOutline, UserOutline } from 'components/general/antd-icon';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Container from 'components/general/container';
import BlurImage from 'components/display/BlurImage';
import Empty from 'components/display/empty';

export default function CampaignDetailClient({ data }: { data: Record<string, any> }) {
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
		<Navigation
			title={data.title}
			desc={data.desc}
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
							<p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
								{data.desc}
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

						<div className="rounded-2xl border border-slate-100 bg-white p-4 text-slate-700 shadow-sm sm:p-6 lg:p-8">
							<div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
								<h2 className="text-lg font-semibold text-slate-800 sm:text-xl">Peserta</h2>
								<span className="rounded-full bg-[#edf4fa] px-3 py-1 text-xs font-semibold text-[#5d84a9]">
									{participant.length} Orang
								</span>
							</div>

							{participant.length === 0 && <Empty />}

							{participant.length > 0 && (
								<div className="space-y-2">
									{participant.map((item) => (
										<div
											key={`${item.name}-${item.status}`}
											className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 sm:px-4"
										>
											<div className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700 sm:text-base">
												{item.name}
											</div>
											<div className="w-auto text-right">
												<p
													className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${
														item.status === 'P'
															? 'bg-slate-200 text-slate-700'
															: item.status === 'H'
															? 'bg-[#f3deb1]/70 text-[#7d5b26]'
															: 'bg-[#c8dded]/65 text-[#41698e]'
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
							)}
						</div>
					</div>
				</section>
			</Container>
		</Navigation>
	);
}
