import dayjs from 'dayjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import { datetimeFormat } from 'utils/constant';

const Gallery = () => {
	const [data, setData] = useState<Record<string, any>[] | null>(null);

	useEffect(() => {
		fetch('/api/feed')
			.then((raw) => raw.json())
			.then((res) => {
				setData(res.data);
			});
	}, []);

	return (
		<Navigation title="VMS: Galeri" active="gallery">
			<Title>Galeri</Title>

			{data?.map((item) => {
				return (
					<Link key={item.id} href="/">
						<a
							className="block rounded-lg my-5 border border-transparent shadow-md relative transform transition-all duration-300 scale-100 hover:shadow-lg hover:border-blue-400"
							style={{
								background: `url(${item.image}) center`,
								backgroundSize: 'cover',
							}}
						>
							<div className="h-60" />
							<div className="p-1">
								<div className="bg-blue-900/60 backdrop-blur-lg p-4 rounded-lg">
									<h2 className="text-white text-ellipsis overflow-hidden whitespace-nowrap text-xl font-bold leading-tight mb-3 pr-5">
										{item.title}
									</h2>
									<div className="flex w-full items-center text-sm text-gray-200 font-medium">
										<div className="flex-1 flex items-center">
											<div
												className="rounded-full w-10 h-10 mr-3"
												style={{
													background: `url(/logo.png) center`,
													backgroundSize: 'cover',
												}}
											/>
											<div>
												<div>{item.name}</div>
												<small>
													{dayjs(item.timestamp).format(datetimeFormat)}
												</small>
											</div>
										</div>
									</div>
								</div>
							</div>
						</a>
					</Link>
				);
			})}
		</Navigation>
	);
};

export default Gallery;
