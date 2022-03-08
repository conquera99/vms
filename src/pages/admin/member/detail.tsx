import { useEffect, useState } from 'react';
import { CloseOutline, RightOutline } from 'antd-mobile-icons';
import Form from 'rc-field-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Input from 'components/entry/input';
import Button, { LinkButton } from 'components/general/button';
import DatePicker from 'components/entry/date-picker';
import Upload from 'components/entry/upload';
import { ContainerAdmin } from 'components/general/container';

import { successMessage } from 'utils/constant';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Anggota',
		href: '/admin/member',
	},
];

const Page = () => {
	const router = useRouter();
	const [form] = Form.useForm();

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

		if (values.dateOfBirth) values.date = dayjs(values.dateOfBirth).toDate();

		const formData = new FormData();

		if (router.query.id) formData.append('id', router.query.id as string);

		formData.append('name', values.name);
		formData.append('dateOfBirth', values.dateOfBirth);
		formData.append('address', values.address);
		formData.append('phone', values.phone);
		formData.append('email', values.email);

		if (file) {
			formData.append('img', file);
		}

		axios
			.post('/api/admin/member/save', formData)
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
		if (router.query.id) {
			axios.get(`/api/admin/member?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					if (response.data.data.dateOfBirth)
						response.data.data.dateOfBirth = dayjs(response.data.data.dateOfBirth);

					if (response.data.data.image) {
						setImage(response.data.data.image);
					}

					form.setFieldsValue(response.data.data);
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation title="VMS: Anggota Detail" active="admin" access="member" isAdmin>
			<ContainerAdmin>
				<Title>
					<div className="flex justify-between items-center">
						<Breadcrumb data={breadcrumb} />
						<LinkButton
							href="/admin/member"
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
					initialValues={{
						name: '',
						dateOfBirth: null,
						address: '',
						phone: '',
						email: '',
					}}
				>
					<Input
						name="name"
						label="Nama Lengkap"
						required
						rules={[{ required: true, message: 'nama lengkap wajib diisi' }]}
					/>
					<DatePicker name="dateOfBirth" label="Tanggal Lahir" />
					<Input name="address" label="Alamat" />
					<Input name="phone" label="Nomor Telepon/HP" />
					<Input name="email" type="email" label="Email" />
					<Upload
						file={file}
						image={image}
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
