import { useEffect, useState } from 'react';
import { CalendarOutline, CloseOutline, HandPayCircleOutline, PicturesOutline, RightOutline } from 'components/general/antd-icon';
import { Form } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'utils/toast';
import dayjs from 'dayjs';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Input, { TextArea } from 'components/entry/input';
import Button, { LinkButton } from 'components/general/button';
import { ContainerAdmin } from 'components/general/container';
import DatePicker from 'components/entry/date-picker';
import Select from 'components/entry/select';

import { successMessage } from 'utils/constant';
import Upload from 'components/entry/upload';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Campaign',
		href: '/admin/campaign',
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

		if (!values.notes) {
			values.notes = '';
		}

		const formData = new FormData();

		if (router.query.id) formData.append('id', router.query.id as string);

		formData.append('title', values.title);
		formData.append('desc', values.desc);
		formData.append('startDate', values.startDate);
		formData.append('endDate', values.endDate);
		formData.append('notes', values.notes);
		formData.append('status', values.status);
		formData.append('visible', values.visible);

		if (file) {
			formData.append('img', file);
		}

		axios
			.post('/api/admin/campaign/save', formData)
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
			axios.get(`/api/admin/campaign?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					if (response.data.data.startDate)
						response.data.data.startDate = dayjs(response.data.data.startDate);
					if (response.data.data.endDate)
						response.data.data.endDate = dayjs(response.data.data.endDate);

					if (response.data.data.image) {
						setImage(response.data.data.image);
					}

					form.setFieldsValue(response.data.data);
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation title="VMS: Campaign Detail" active="admin" access="campaign" isAdmin>
			<ContainerAdmin>
				<div className="mt-6 overflow-hidden rounded-[2rem] border border-emerald-200/80 bg-linear-to-br from-emerald-50 via-white to-lime-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
						<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
								<HandPayCircleOutline />
								Campaign Editor
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								{isEditMode ? 'Ubah Campaign' : 'Buat Campaign Baru'}
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Atur jadwal, status, visibilitas, dan materi visual campaign dalam satu
								tampilan yang lebih mudah dipantau admin.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-80">
							<div className="grid grid-cols-3 gap-3">
								<div className="rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Mode
									</p>
									<p className="mt-2 text-sm font-black text-slate-800">
										{isEditMode ? 'Edit' : 'Baru'}
									</p>
								</div>
								<div className="rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Gambar
									</p>
									<p className="mt-2 text-sm font-black text-slate-800">
										{image ? 'Siap' : 'Kosong'}
									</p>
								</div>
								<div className="rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Form
									</p>
									<p className="mt-2 text-sm font-black text-slate-800">Campaign</p>
								</div>
							</div>
							<LinkButton
								href="/admin/campaign"
								size="small"
								buttonType="warning"
								icon={<CloseOutline />}
								className="w-full justify-center text-base"
							>
								Kembali ke Campaign
							</LinkButton>
						</div>
					</div>
				</div>

				<div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
					<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
						<Form
							layout="vertical"
							form={form}
							onFinish={onFinish}
							initialValues={{
								title: '',
								desc: '',
								startDate: null,
								endDate: null,
								notes: '',
								status: 'A',
							}}
						>
							<div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">
										Form Campaign
									</p>
									<h2 className="mt-2 text-xl font-bold text-slate-800">Informasi Program</h2>
									<p className="mt-1 text-sm text-slate-500">
										Lengkapi identitas campaign, periode berjalan, dan pengaturan visibilitas.
									</p>
								</div>
								<div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
										Mode
									</p>
									<p className="mt-1 text-sm font-bold text-slate-800">
										{isEditMode ? 'Edit Campaign' : 'Campaign Baru'}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Input
									name="title"
									label="Judul Campaign"
									required
									className="mb-0 md:col-span-2"
									rules={[{ required: true, message: 'judul campaign wajib diisi' }]}
								/>
								<TextArea
									name="desc"
									label="Deskripsi"
									required
									className="mb-0 md:col-span-2"
									rules={[{ required: true, message: 'deskripsi wajib diisi' }]}
								/>
								<DatePicker name="startDate" label="Tanggal Mulai" className="mb-0" />
								<DatePicker name="endDate" label="Tanggal Selesai" className="mb-0" />
								<Select
									name="status"
									label="Status"
									className="mb-0"
									options={[
										{ label: 'Aktif', value: 'A' },
										{ label: 'Selesai', value: 'C' },
										{ label: 'Nonaktif', value: 'N' },
									]}
								/>
								<Select
									name="visible"
									label="Visibilitas"
									className="mb-0"
									options={[
										{ label: 'Terpublish', value: 'Y' },
										{ label: 'Internal', value: 'N' },
									]}
								/>
								<TextArea name="notes" label="Catatan" className="mb-0 md:col-span-2" />
							</div>

							<div className="mt-6 border-t border-slate-100 pt-6">
								<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
									Gambar Campaign
								</p>
								<p className="mt-2 text-sm text-slate-500">
									Unggah visual utama agar campaign lebih mudah dikenali pada halaman publik.
								</p>
								<div className="mt-4">
									<Upload
										file={file}
										image={image}
										showPreview={router.query.id ? true : false}
										onRemoveImage={removeImage}
										beforeUpload={beforeUpload}
									/>
								</div>
							</div>

							<div className="mt-8 flex items-center justify-end border-t border-slate-100 pt-5">
								<Button
									type="submit"
									className="w-full md:w-auto md:min-w-48"
									buttonType="primary"
									loading={loading}
									icon={<RightOutline />}
									iconLocation="right"
								>
									{isEditMode ? 'Simpan Perubahan' : 'Simpan Campaign'}
								</Button>
							</div>
						</Form>
					</div>

					<aside className="space-y-5">
						<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
								Ringkasan Campaign
							</p>
							<div className="mt-4 space-y-3">
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
									<p className="text-xs text-slate-500">Status Awal</p>
									<p className="mt-1 text-lg font-black text-slate-800">Aktif / Selesai / Nonaktif</p>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
									<p className="text-xs text-slate-500">Publikasi</p>
									<p className="mt-1 text-lg font-black text-slate-800">Publik atau Internal</p>
								</div>
								<div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
									<p className="flex items-center gap-2 text-xs text-emerald-700">
										<CalendarOutline />
										Periode Program
									</p>
									<p className="mt-1 text-sm font-bold text-emerald-900">Isi tanggal mulai dan selesai bila tersedia</p>
								</div>
							</div>
						</div>

						<div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm">
							<p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
								<PicturesOutline />
								Panduan Admin
							</p>
							<ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
								<li>Gunakan judul yang langsung menjelaskan program atau tujuan donasi.</li>
								<li>Tetapkan status dan visibilitas dengan jelas agar publikasi tidak keliru.</li>
								<li>Tambahkan gambar utama yang representatif untuk memperkuat identitas campaign.</li>
							</ul>
						</div>
					</aside>
				</div>
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
