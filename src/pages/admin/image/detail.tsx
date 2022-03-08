import { useEffect, useState } from 'react';
import { CloseOutline, RightOutline } from 'antd-mobile-icons';
import Form from 'rc-field-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Input from 'components/entry/input';
import Button, { LinkButton } from 'components/general/button';
import Upload from 'components/entry/upload';
import Select from 'components/entry/select';
import { ContainerAdmin } from 'components/general/container';

import { successMessage } from 'utils/constant';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Gambar',
		href: '/admin/image',
	},
];

const Page = () => {
	const router = useRouter();
	const [form] = Form.useForm();

	const [album, setAlbum] = useState<Record<string, any>[]>([]);
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [image, setImage] = useState<string | undefined>(undefined);

	const removeImage = () => setFile(null);

	const beforeUpload = (file: File) => {
		setFile(file);
		const img = URL.createObjectURL(file);
		setImage(img);
		return false;
	};

	const onFinish = (values: any) => {
		setLoading(true);

		const formData = new FormData();

		if (router.query.id) formData.append('id', router.query.id as string);

		formData.append('altText', values.altText);
		formData.append('albumId', values.albumId);

		if (file) {
			formData.append('img', file);
		}

		axios
			.post('/api/admin/gallery/image/save', formData)
			.then((response) => {
				if (response.data.code === 0) {
					toast.success(successMessage);
					if (!router.query.id) {
						form.resetFields();
						setFile(null);
						setImage(undefined);
					}
				} else {
					toast.error(response.data.message);
				}
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		axios.get('/api/admin/gallery/album?s=10000').then((response) => {
			if (response.data.code === 0) {
				setAlbum(response.data.data);
			}
		});

		if (router.query.id) {
			axios.get(`/api/admin/gallery/image?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					if (response.data.data.image) {
						setImage(response.data.data.image);
					}

					form.setFieldsValue(response.data.data);
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation title="VMS: Gambar Detail" active="admin" access="image" isAdmin>
			<ContainerAdmin>
				<Title>
					<div className="flex justify-between items-center">
						<Breadcrumb data={breadcrumb} />
						<LinkButton
							href="/admin/image"
							size="small"
							buttonType="warning"
							icon={<CloseOutline />}
							className="text-base"
						>
							Tutup
						</LinkButton>
					</div>
				</Title>

				<Form
					form={form}
					onFinish={onFinish}
					initialValues={{ altText: '', albumId: undefined }}
				>
					<Select
						name="albumId"
						label="Album"
						options={album}
						placeholder="Pilih Album"
						labelKey="title"
						valueKey="id"
						required
						rules={[{ required: true, message: 'album wajib dipilih' }]}
					/>
					<Input name="altText" label="Deskripsi" />
					<Upload
						file={file}
						image={image}
						disabled={!router.query.id ? false : true}
						showPreview={router.query.id ? true : false}
						onRemoveImage={removeImage}
						beforeUpload={beforeUpload}
					/>
					<Button
						type="submit"
						className="w-full"
						buttonType="primary"
						loading={loading}
						icon={<RightOutline />}
						iconLocation="right"
					>
						Simpan
					</Button>
				</Form>
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
