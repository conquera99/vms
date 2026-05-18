import dayjs from 'dayjs';
import Link from 'next/link';
import { FC } from 'react';
import { datetimeFormat } from 'utils/constant';
import Image from "next/image";

interface PostProps {
	data: Record<string, any>;
}

const Post: FC<PostProps> = ({ data }) => {
	return (
        <article
			className="group my-2 w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-lg shadow-slate-200/35 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/55"
		>
            <figure className="relative h-52 w-full overflow-hidden sm:h-60">
				<div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
				<Image
                    src={`${data.image}`}
                    alt={data.title || 'post image'}
                    className="transition duration-500 group-hover:scale-105"
                    fill
					sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                        objectFit: "cover"
                    }} />
				<div className="absolute left-3 top-3 z-3 rounded-full border border-white/70 bg-white/85 px-3 py-1 text-[11px] font-semibold tracking-wide text-slate-600 backdrop-blur-sm">
					{dayjs(data.createdAt).format(datetimeFormat)} WITA
				</div>
			</figure>
            <div className="flex flex-col p-4 sm:p-5">
				<h2 className="mb-2 text-xl font-semibold leading-tight text-slate-800 transition duration-300 group-hover:text-[#6f97bd] sm:text-[1.35rem]">
					{data.title}
				</h2>
				<p className="mb-4 max-h-20 overflow-hidden text-sm leading-relaxed text-slate-600 sm:text-[0.95rem]">
					{data.summary}
				</p>

				<div className="mt-auto flex w-full items-center justify-between gap-3 border-t border-slate-100 pt-3">
					<small className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
						Artikel
					</small>
					<Link key={data.slug} href={`/post/${data.slug}`}>
						<span className="inline-flex min-h-9 items-center justify-center rounded-lg bg-[#edf4fa] px-3 py-1 text-sm font-semibold text-[#5d84a9] transition duration-300 hover:bg-[#dcebf7]">
							Lihat Selengkapnya
						</span>
					</Link>
				</div>
			</div>
        </article>
    );
};

export default Post;
