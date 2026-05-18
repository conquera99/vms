import { useEffect, useState } from 'react';
import { CloseOutline, RightOutline } from 'antd-mobile-icons';
import { Form } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'utils/toast';
import dayjs from 'dayjs';

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
	const isEditMode = Boolean(router.query.id);

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
				<div className="mt-6 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-100 via-white to-amber-50 p-5 shadow-sm md:p-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<Breadcrumb data={breadcrumb} />
							<h1 className="mt-3 text-2xl font-bold text-slate-800">
								{isEditMode ? 'Ubah Data Anggota' : 'Tambah Data Anggota'}
							</h1>
							<p className="text-sm text-slate-600">
								Lengkapi identitas anggota untuk kebutuhan administrasi dan komunikasi.
							</p>
						</div>
						<LinkButton
							href="/admin/member"
							size="small"
							buttonType="warning"
							icon={<CloseOutline />}
							className="text-base"
						>
							Kembali
						</LinkButton>
					</div>
				</div>

				<div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
					<Form
						layout="vertical"
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
						<div className="mb-4">
							<h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
								Informasi Pribadi
							</h2>
							<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
								<Input
									name="name"
									label="Nama Lengkap"
									required
									className="mb-0 md:col-span-2"
									rules={[{ required: true, message: 'nama lengkap wajib diisi' }]}
								/>
								<DatePicker name="dateOfBirth" label="Tanggal Lahir" className="mb-0" />
								<Input name="address" label="Alamat" className="mb-0 md:col-span-2" />
							</div>
						</div>

						<div className="mb-4">
							<h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
								Kontak
							</h2>
							<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
								<Input name="phone" label="Nomor Telepon/HP" className="mb-0" />
								<Input name="email" type="email" label="Email" className="mb-0" />
							</div>
						</div>

						<div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
							<Upload
								file={file}
								image={image}
								showPreview={router.query.id ? true : false}
								onRemoveImage={removeImage}
								beforeUpload={beforeUpload}
							/>
						</div>

						<div className="mt-6 flex items-center justify-end border-t border-slate-100 pt-4">
							<Button
								type="submit"
								className="w-full md:w-auto md:min-w-40"
								buttonType="primary"
								loading={loading}
								icon={<RightOutline />}
								iconLocation="right"
							>
								{isEditMode ? 'Simpan Perubahan' : 'Simpan Data'}
							</Button>
						</div>
					</Form>
				</div>
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
