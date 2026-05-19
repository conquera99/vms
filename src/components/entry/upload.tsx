import { CloudUploadOutlined } from '@ant-design/icons';
import { Upload as AntUpload } from 'antd';
import { FC } from 'react';

import { CloseOutline } from 'components/general/antd-icon';
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

	const onBeforeUpload = async (file: File) => {
		if (beforeUpload) return beforeUpload(file);
		return false;
	};

	const uploadProps = {
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
					<AntUpload.Dragger
						disabled={disabled}
						beforeUpload={onBeforeUpload}
						showUploadList={false}
						{...uploadProps}
					>
						<CloudUploadOutlined className="mb-2 text-5xl text-gray-400 group-hover:text-gray-600" />
						<a className="text-gray-400 group-hover:text-gray-600">
							Cari file untuk di-upload
						</a>
					</AntUpload.Dragger>
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
