import dayjs from 'dayjs';
import Link from 'next/link';
import { FC } from 'react';
import { datetimeFormat } from 'utils/constant';
import Image from 'next/image';
import { CalendarOutline, RightOutline } from 'components/general/antd-icon';

interface PostProps {
	data: Record<string, any>;
}

const Post: FC<PostProps> = ({ data }) => {
	return (
		<article className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50">
			<figure className="relative h-48 overflow-hidden sm:h-52">
				<Image
					src={data.image}
					alt={data.title || 'post image'}
					fill
					className="object-cover transition duration-500 group-hover:scale-105"
					sizes="(max-width: 768px) 100vw, 50vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
				<div className="absolute left-3 top-3 z-10">
					<span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-600 backdrop-blur-sm">
						<CalendarOutline className="text-[10px]" />
						{dayjs(data.createdAt).format(datetimeFormat)}
					</span>
				</div>
			</figure>
			<div className="p-4 sm:p-5">
				<h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug text-slate-800 transition group-hover:text-[#7ea7cb]">
					{data.title}
				</h3>
				<p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
					{data.summary}
				</p>
				<Link
					href={`/post/${data.slug}`}
					className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#edf4fa] px-3.5 py-1.5 text-sm font-semibold text-[#5d84a9] transition hover:bg-[#dcebf7]"
				>
					Baca Selengkapnya
					<RightOutline className="text-xs" />
				</Link>
		 </div>
		</article>
	);
};

export default Post;
