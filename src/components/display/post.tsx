import dayjs from 'dayjs';
import Link from 'next/link';
import { FC } from 'react';
import { datetimeFormat } from 'utils/constant';

interface PostProps {
	data: Record<string, any>;
}

const Post: FC<PostProps> = ({ data }) => {
	return (
		<Link key={data.slug} href={`/post/${data.slug}`}>
			<a
				className="block rounded-lg my-5 border border-transparent shadow-md shadow-neutral-400 hover:shadow-neutral-500 relative transform transition-all duration-700 hover:shadow-lg"
				style={{
					background: `url(${data.image}) center`,
					backgroundSize: 'cover',
				}}
			>
				<div className="h-60" />
				<div className="p-1">
					<div className="bg-slate-900/60 backdrop-blur-lg p-4 rounded-lg">
						<h2 className="text-white text-ellipsis overflow-hidden whitespace-nowrap text-xl font-bold leading-tight pr-5">
							{data.title}
						</h2>
						<div className="text-base text-gray-200 font-medium">
							<small className="text-sm text-gray-300">
								{dayjs(data.createdAt).format(datetimeFormat)} WITA
							</small>
							<div className="flex w-full mt-2">
								<div className="flex-1 h-14 overflow-hidden flex items-center">
									<div>{data.summary}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</a>
		</Link>
	);
};

export default Post;
