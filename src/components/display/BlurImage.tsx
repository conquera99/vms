import Image from 'next/image';
import { FC, ReactNode, useState } from 'react';

const BlurImage: FC<{
	src: string;
	alt: string;
	className?: string;
	children?: ReactNode;
	sizes?: string;
	preview?: boolean;
}> = ({ src, alt, className, children, sizes, preview = false }) => {
	const [isLoading, setLoading] = useState(true);
	const [aspectRatio, setAspectRatio] = useState(16 / 9);
	const [visible, setVisible] = useState(false);
	const resolvedSizes =
		sizes ||
		'(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 40vw, 33vw';

	return (
		<>
			<div
				className={`relative w-full overflow-hidden rounded-lg bg-gray-200 ${
					preview ? 'cursor-zoom-in' : ''
				} ${className || ''}`}
				style={{ aspectRatio: `${aspectRatio}` }}
				onClick={preview ? () => setVisible(true) : undefined}
			>
				<Image
					alt={alt}
					src={src}
					className={`
					group-hover:opacity-75 duration-700 ease-in-out
					${isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-100'}`}
					onLoad={(event) => {
						setLoading(false);
						const image = event.currentTarget;
						if (image.naturalWidth && image.naturalHeight) {
							setAspectRatio(image.naturalWidth / image.naturalHeight);
						}
					}}
					fill
					sizes={resolvedSizes}
					style={{
						objectFit: 'cover',
					}}
					loading="eager"
				/>
				{children}
			</div>
			{preview && visible && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6"
					onClick={() => setVisible(false)}
				>
					<div className="w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
						<div className="w-full overflow-hidden rounded-2xl bg-black/85 p-1">
							<img
								className="max-h-[82vh] w-full rounded-xl object-contain"
								alt={alt}
								src={src}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default BlurImage;
