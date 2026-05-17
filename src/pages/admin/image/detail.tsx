import { useEffect, useState } from 'react';
import { CloseOutline, FolderOutline, PicturesOutline, RightOutline } from 'antd-mobile-icons';
import { Form } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'utils/toast';

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
				<div className="mt-6 overflow-hidden rounded-[2rem] border border-amber-200/80 bg-linear-to-br from-amber-50 via-white to-yellow-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
						<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
								<PicturesOutline />
								Image Editor
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								{isEditMode ? 'Ubah Gambar' : 'Unggah Gambar Baru'}
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Kelola aset gambar, hubungkan ke album, dan rapikan deskripsi agar koleksi
								visual lebih mudah digunakan di seluruh konten.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-80">
							<div className="grid grid-cols-3 gap-3">
								<div className="rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Mode
									</p>
									<p className="mt-2 text-sm font-black text-slate-800">{isEditMode ? 'Edit' : 'Baru'}</p>
								</div>
								<div className="rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Album
									</p>
									<p className="mt-2 text-sm font-black text-slate-800">{album.length}</p>
								</div>
								<div className="rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										File
									</p>
									<p className="mt-2 text-sm font-black text-slate-800">{image ? 'Siap' : 'Kosong'}</p>
								</div>
							</div>
							<LinkButton
								href="/admin/image"
								size="small"
								buttonType="warning"
								icon={<CloseOutline />}
								className="w-full justify-center text-base"
							>
								Kembali ke Gambar
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
							initialValues={{ altText: '', albumId: undefined }}
						>
							<div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
										Form Gambar
									</p>
									<h2 className="mt-2 text-xl font-bold text-slate-800">Informasi Aset Visual</h2>
									<p className="mt-1 text-sm text-slate-500">
										Hubungkan gambar ke album yang tepat dan lengkapi deskripsinya.
									</p>
								</div>
								<div className="rounded-2xl bg-amber-50 px-4 py-3 text-right">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
										Mode
									</p>
									<p className="mt-1 text-sm font-bold text-slate-800">
										{isEditMode ? 'Edit Gambar' : 'Unggah Baru'}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Select
									name="albumId"
									label="Album"
									options={album}
									placeholder="Pilih Album"
									labelKey="title"
									valueKey="id"
									required
									className="mb-0"
									rules={[{ required: true, message: 'album wajib dipilih' }]}
								/>
								<Input name="altText" label="Deskripsi" className="mb-0" />
							</div>

							<div className="mt-6 border-t border-slate-100 pt-6">
								<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
									Upload File
								</p>
								<p className="mt-2 text-sm text-slate-500">
									Unggah gambar saat membuat data baru. Pada mode edit, file tetap terkunci sesuai perilaku saat ini.
								</p>
								<div className="mt-4">
									<Upload
										file={file}
										image={image}
										disabled={!router.query.id ? false : true}
										showPreview={router.query.id ? true : false}
										onRemoveImage={removeImage}
										beforeUpload={beforeUpload}
									/>
								</div>
							</div>

							<div className="mt-8 flex items-center justify-end border-t border-slate-100 pt-5">
								<Button
									type="submit"
									className="w-full md:w-auto md:min-w-40"
									buttonType="primary"
									loading={loading}
									icon={<RightOutline />}
									iconLocation="right"
								>
									{isEditMode ? 'Simpan Perubahan' : 'Simpan Gambar'}
								</Button>
							</div>
						</Form>
					</div>

					<aside className="space-y-5">
						<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
								Ringkasan Aset
							</p>
							<div className="mt-4 space-y-3">
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
									<p className="text-xs text-slate-500">Album Tersedia</p>
									<p className="mt-1 text-2xl font-black text-slate-800">{album.length}</p>
								</div>
								<div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
									<p className="text-xs text-amber-700">Alt Text</p>
									<p className="mt-1 text-lg font-black text-amber-900">Bantu aksesibilitas dan pencarian</p>
								</div>
							</div>
						</div>

						<div className="rounded-[1.75rem] border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
							<p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
								<FolderOutline />
								Panduan Media
							</p>
							<ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
								<li>Pilih album yang paling relevan supaya dokumentasi tidak tercecer.</li>
								<li>Isi deskripsi singkat yang menjelaskan isi visual gambar secara jelas.</li>
								<li>Mode edit tetap mempertahankan perilaku lama: file gambar tidak diganti dari layar ini.</li>
							</ul>
						</div>
					</aside>
				</div>
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
