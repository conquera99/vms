import dayjs from 'dayjs';
import Link from 'next/link';
import { FC } from 'react';
import { datetimeFormat } from 'utils/constant';
import Image from 'next/image';
import { useState } from 'react';

interface PostProps {
	data: Record<string, any>;
}

const Post: FC<PostProps> = ({ data }) => {
	const [hover, isHover] = useState(false);

	return (
		<Link key={data.slug} href={`/post/${data.slug}`}>
			<article
				className=" hover:bg-blue-700 hover:text-white flex flex-col bg-slate-100 rounded-xl shadow-lg overflow-hidden w-full my-5 border-transparent shadow-md shadow-neutral-400 hover:shadow-neutral-500 relative cursor-pointer transform transition-all duration-700 hover:shadow-lg hover:scale-105"
				onMouseEnter={() => isHover(true)}
				onMouseLeave={() => isHover(false)}
			>
				<figure className="relative w-full h-[268px]">
					<div
						className={
							hover
								? 'absolute top-0 left-0 right-0 bottom-0 bg-black/50 z-[2]'
								: 'absolute top-0 left-0 right-0 bottom-0'
						}
					/>
					<Image
						src={`${data.image}`}
						alt={`${data.image}`}
						layout="fill"
						objectFit="cover"
					/>
				</figure>
				<div className="flex flex-col p-4">
					<h2 className="text-xl text-ellipsis whitespace-nowrap leading-tight font-bold pr-5">
						{data.title}
					</h2>
					<p className="mb-4 font-medium">
						<small className="text-sm">
							{dayjs(data.createdAt).format(datetimeFormat)} WITA
						</small>
					</p>
					<div className="flex w-full mt-2">
						<div
							className="flex-1 h-12 overflow-hidden flex items-start"
							title={data.summary}
						>
							<div>{data.summary}</div>
						</div>
					</div>
				</div>
			</article>
		</Link>
	);
};

export default Post;
