import Image from 'next/image';
import { FC, ReactNode, useState } from 'react';

const BlurImage: FC<{ src: string; alt: string; className?: string; children?: ReactNode }> = ({
	src,
	alt,
	className,
	children,
}) => {
	const [isLoading, setLoading] = useState(true);
	const [aspectRatio, setAspectRatio] = useState(16 / 9);

	return (
		<div
			className={`relative w-full overflow-hidden rounded-lg bg-gray-200 ${
				className || ''
			}`}
			style={{ aspectRatio: `${aspectRatio}` }}
		>
			<Image
				alt={alt}
				src={src}
				layout="fill"
				objectFit="cover"
				className={`
					group-hover:opacity-75 duration-700 ease-in-out
					${isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-100'}`}
				onLoadingComplete={(img) => {
					setLoading(false);
					if (img.naturalWidth && img.naturalHeight) {
						setAspectRatio(img.naturalWidth / img.naturalHeight);
					}
				}}
			/>
			{children}
		</div>
	);
};

export default BlurImage;
