import Image from 'next/image';
import { FC, useState } from 'react';

const BlurImage: FC<{ src: string; alt: string; className?: string }> = ({
	src,
	alt,
	className,
}) => {
	const [isLoading, setLoading] = useState(true);

	return (
		<div
			className={`w-full bg-gray-200 rounded-lg overflow-hidden ${
				className || 'aspect-w-2 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8'
			}`}
		>
			<Image
				alt={alt}
				src={src}
				layout="fill"
				objectFit="cover"
				className={`
					group-hover:opacity-75 duration-700 ease-in-out
					${isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-100'}`}
				onLoadingComplete={() => setLoading(false)}
			/>
		</div>
	);
};

export default BlurImage;
