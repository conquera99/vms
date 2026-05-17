import { useEffect, useState } from 'react';
import { CloseOutline, RightOutline } from 'antd-mobile-icons';
import Form from 'rc-field-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
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
		title: 'Mendiang',
		href: '/admin/deceased',
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
		if (values.dateOfDeath) values.date = dayjs(values.dateOfDeath).toDate();

		const formData = new FormData();

		if (router.query.id) formData.append('id', router.query.id as string);

		formData.append('name', values.name);
		formData.append('placeOfBirth', values.placeOfBirth);
		formData.append('placeOfDeath', values.placeOfDeath);
		formData.append('dateOfBirth', values.dateOfBirth);
		formData.append('dateOfDeath', values.dateOfDeath);
		formData.append('deathNotes', values.deathNotes);
		formData.append('birthNotes', values.birthNotes);
		formData.append('family', values.family);

		if (file) {
			formData.append('img', file);
		}

		axios
			.post('/api/admin/deceased/save', formData)
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
			axios.get(`/api/admin/deceased?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					if (response.data.data.dateOfBirth)
						response.data.data.dateOfBirth = dayjs(response.data.data.dateOfBirth);

					if (response.data.data.dateOfDeath)
						response.data.data.dateOfDeath = dayjs(response.data.data.dateOfDeath);

					if (response.data.data.image) {
						setImage(response.data.data.image);
					}

					form.setFieldsValue(response.data.data);
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation title="VMS: Mendiang Detail" active="admin" access="deceased" isAdmin>
			<ContainerAdmin>
				<div className="mt-6 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-100 via-white to-amber-50 p-5 shadow-sm md:p-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<Breadcrumb data={breadcrumb} />
							<h1 className="mt-3 text-2xl font-bold text-slate-800">
								{isEditMode ? 'Ubah Data Mendiang' : 'Tambah Data Mendiang'}
							</h1>
							<p className="text-sm text-slate-600">
								Susun data kelahiran, wafat, dan keluarga untuk dokumentasi yang rapi.
							</p>
						</div>
						<LinkButton
							href="/admin/deceased"
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
						form={form}
						onFinish={onFinish}
						initialValues={{
							name: '',
							dateOfBirth: null,
							dateOfDeath: null,
							placeOfBirth: '',
							placeOfDeath: '',
							birthNotes: '',
							deathNotes: '',
							family: '',
						}}
					>
						<div className="mb-4">
							<h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
								Identitas
							</h2>
							<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
								<Input
									name="name"
									label="Nama Lengkap"
									required
									className="mb-0 md:col-span-2"
									rules={[{ required: true, message: 'nama lengkap wajib diisi' }]}
								/>
								<Input name="family" label="Keluarga" className="mb-0" />
							</div>
						</div>

						<div className="mb-4">
							<h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
								Informasi Lahir
							</h2>
							<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
								<Input name="placeOfBirth" label="Tempat Lahir" className="mb-0" />
								<DatePicker
									name="dateOfBirth"
									allowClear
									label="Tanggal Lahir"
									className="mb-0"
								/>
								<Input name="birthNotes" label="Catatan Lahir" className="mb-0 md:col-span-2" />
							</div>
						</div>

						<div className="mb-4">
							<h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
								Informasi Wafat
							</h2>
							<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
								<Input name="placeOfDeath" label="Tempat Wafat" className="mb-0" />
								<DatePicker
									name="dateOfDeath"
									allowClear
									label="Tanggal Wafat"
									className="mb-0"
								/>
								<Input name="deathNotes" label="Catatan Wafat" className="mb-0 md:col-span-2" />
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
