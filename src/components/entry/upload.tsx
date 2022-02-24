import { CloseOutline } from 'antd-mobile-icons';
import { FC } from 'react';
import RCUpload from 'rc-upload';
import { RcFile } from 'rc-upload/lib/interface';

import Button from 'components/general/button';

interface UploadProps {
	file: File | null;
	image?: string | undefined;
	accept?: string | undefined;
	disabled?: boolean;
	showPreview?: boolean;
	onRemoveImage: () => void;
	beforeUpload: (file: any) => void;
}

const Upload: FC<UploadProps> = ({
	file,
	image,
	accept,
	disabled,
	showPreview,
	onRemoveImage,
	beforeUpload,
}) => {
	const removeImage = () => {
		if (onRemoveImage) {
			onRemoveImage();
		}
	};

	const onBeforeUpload = async (file: RcFile) => {
		if (beforeUpload) return beforeUpload(file);
	};

	const uploadProps = {
		type: 'drag',
		accept: accept || '.png,.jpeg,.jpg',
	};

	return (
		<div className="my-2">
			<p className="mb-1">Upload Gambar</p>
			<div>
				{file ? (
					<div className="flex flex-row items-stretch">
						<img src={image} className="w-52 md:w-96" alt="preview" />
						<div className="ml-5">
							<small>Nama</small>
							<p>{file.name}</p>
							<small>Ukuran</small>
							<p>{file.size / 1000} Kb</p>
							<small>Jenis</small>
							<p>{file.type}</p>
							<Button
								onClick={removeImage}
								buttonType="danger"
								className="mt-2"
								size="small"
								icon={<CloseOutline />}
							>
								remove
							</Button>
						</div>
					</div>
				) : (
					<RCUpload
						className="group transition-all duration-500 bg-slate-100 cursor-pointer p-5 rounded-lg flex flex-col items-center justify-center"
						disabled={disabled}
						beforeUpload={onBeforeUpload}
						{...uploadProps}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-12 h-12 text-gray-400 mb-2 group-hover:text-gray-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							/>
						</svg>
						<a className="text-gray-400 group-hover:text-gray-600">
							Cari file untuk di-upload
						</a>
					</RCUpload>
				)}
				{showPreview && (
					<div className="mt-4">
						<p>Preview</p>
						{image ? (
							<img
								src={image}
								className="w-52 md:w-96 rounded-lg shadow-md"
								alt="preview"
							/>
						) : (
							<div className="w-50 h-50 bg-slate-300 text-gray-500 rounded-lg p-5 text-center">
								Tidak ada gambar
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Upload;
