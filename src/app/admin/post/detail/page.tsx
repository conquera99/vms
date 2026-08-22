'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import {
	CloseOutline,
	ContentOutline,
	PicturesOutline,
	RightOutline,
	TagOutline,
} from 'components/general/antd-icon';
import { Form } from 'antd';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { toast } from 'utils/toast';
import dynamic from 'next/dynamic';
import { Descendant } from 'slate';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Input from 'components/entry/input';
import Button, { LinkButton } from 'components/general/button';
import Upload from 'components/entry/upload';
import Select from 'components/entry/select';
import { ContainerAdmin } from 'components/general/container';

import { successMessage } from 'utils/constant';

const TextEditor = dynamic(() => import('components/entry/text-editor'), { ssr: false });

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Post',
		href: '/admin/post',
	},
];

const slateInitValues: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];

const Page = () => {
	const query = useSearchParams()!;
	const [form] = Form.useForm();

	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [image, setImage] = useState<string | undefined>(undefined);
	const isEditMode = Boolean(query.get('id'));

	// text editor
	const [value, setValue] = useState<Descendant[]>(slateInitValues);

	const removeImage = () => setFile(null);

	const beforeUpload = (file: File) => {
		setFile(file);
		const img = URL.createObjectURL(file);
		setImage(img);
		return false;
	};

	const onTextEditorChange = (newValue: Descendant[]) => {
		setValue(newValue);
	};

	const onFinish = (values: any) => {
		setLoading(true);

		const formData = new FormData();

		if (query.get('id')) formData.append('id', query.get('id') as string);

		formData.append('title', values.title);
		formData.append('summary', values.summary);
		formData.append('keywords', values.keywords);
		formData.append('status', values.status);
		formData.append('content', JSON.stringify(value));

		if (file) {
			formData.append('img', file);
		}

		axios
			.post('/api/admin/post/save', formData)
			.then((response) => {
				if (response.data.code === 0) {
					toast.success(successMessage);
					if (!query.get('id')) {
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
		if (query.get('id')) {
			axios.get(`/api/admin/post?id=${query.get('id')}`).then((response) => {
				if (response.data.code === 0) {
					if (response.data.data.content) {
						response.data.data.content = JSON.parse(response.data.data.content);
						setValue(response.data.data.content);
					}

					if (response.data.data.image) {
						setImage(response.data.data.image);
					}

					form.setFieldsValue(response.data.data);
				}
			});
		}
	}, [query, form]);

	return (
		<Navigation title="VMS: Post Detail" active="admin" access="post" isAdmin>
			<ContainerAdmin>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
					precedence="default"
				/>
				<div className="mt-6 overflow-hidden rounded-[2rem] border border-rose-200/80 bg-linear-to-br from-rose-50 via-white to-orange-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
						<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
								<ContentOutline />
								Post Editor
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								{isEditMode ? 'Ubah Post' : 'Tulis Post Baru'}
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Kelola judul, ringkasan, status publikasi, isi artikel, dan visual utama dari
								satu workspace editorial yang lebih jelas.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-80">
							<div className="grid grid-cols-3 gap-3">
								<div className="rounded-2xl border border-rose-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Mode
									</p>
									<p className="mt-2 text-sm font-black text-slate-800">{isEditMode ? 'Edit' : 'Baru'}</p>
								</div>
								<div className="rounded-2xl border border-rose-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Visual
									</p>
									<p className="mt-2 text-sm font-black text-slate-800">{image ? 'Siap' : 'Kosong'}</p>
								</div>
								<div className="rounded-2xl border border-rose-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Status
									</p>
									<p className="mt-2 text-sm font-black text-slate-800">Draft/Publik</p>
								</div>
							</div>
							<LinkButton
								href="/admin/post"
								size="small"
								buttonType="warning"
								icon={<CloseOutline />}
								className="w-full justify-center text-base"
							>
								Kembali ke Post
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
								summary: '',
								keywords: '',
								status: 'D',
								content: '',
							}}
						>
							<div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-600">
										Form Post
									</p>
									<h2 className="mt-2 text-xl font-bold text-slate-800">Informasi Editorial</h2>
									<p className="mt-1 text-sm text-slate-500">
										Isi metadata dasar dan status publikasi sebelum menyusun isi lengkap artikel.
									</p>
								</div>
								<div className="rounded-2xl bg-rose-50 px-4 py-3 text-right">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700">
										Mode
									</p>
									<p className="mt-1 text-sm font-bold text-slate-800">
										{isEditMode ? 'Edit Post' : 'Post Baru'}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Input
									name="title"
									label="Judul"
									required
									className="mb-0 md:col-span-2"
									rules={[{ required: true, message: 'judul wajib diisi' }]}
								/>
								<Input name="summary" label="Deskripsi Singkat" className="mb-0 md:col-span-2" />
								<Input name="keywords" label="Kata Kunci" className="mb-0" />
								<Select
									name="status"
									label="Status"
									className="mb-0"
									options={[
										{ label: 'Draft', value: 'D' },
										{ label: 'Terpublikasi', value: 'P' },
										{ label: 'Tersembunyi', value: 'H' },
									]}
									labelKey="label"
									valueKey="value"
								/>
							</div>

							<div className="mt-6 border-t border-slate-100 pt-6">
								<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
									Isi Artikel
								</p>
								<p className="mt-2 text-sm text-slate-500">
									Gunakan editor untuk menyusun isi post dengan struktur yang siap dipublikasikan.
								</p>
								<div className="mt-4">
									<TextEditor value={value} onChange={onTextEditorChange} />
								</div>
							</div>

							<div className="mt-6 border-t border-slate-100 pt-6">
								<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
									Visual Utama
								</p>
								<p className="mt-2 text-sm text-slate-500">
									Tambahkan gambar utama untuk memperkuat tampilan post pada daftar dan halaman publik.
								</p>
								<div className="mt-4">
									<Upload
										file={file}
										image={image}
										showPreview={query.get('id') ? true : false}
										onRemoveImage={removeImage}
										beforeUpload={beforeUpload}
									/>
								</div>
							</div>

							<div className="mt-8 flex items-center justify-end border-t border-slate-100 pt-5">
								<Button
									type="submit"
									className="w-full md:w-auto md:min-w-44"
									buttonType="primary"
									loading={loading}
									icon={<RightOutline />}
									iconLocation="right"
								>
									{isEditMode ? 'Simpan Perubahan' : 'Simpan Post'}
								</Button>
							</div>
						</Form>
					</div>

					<aside className="space-y-5">
						<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
								Ringkasan Editorial
							</p>
							<div className="mt-4 space-y-3">
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
									<p className="text-xs text-slate-500">Status</p>
									<p className="mt-1 text-lg font-black text-slate-800">Draft, Publik, atau Tersembunyi</p>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
									<p className="text-xs text-slate-500">SEO Dasar</p>
									<p className="mt-1 text-lg font-black text-slate-800">Judul, ringkasan, kata kunci</p>
								</div>
								<div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
									<p className="text-xs text-rose-700">Visual</p>
									<p className="mt-1 text-lg font-black text-rose-900">Gambar utama post</p>
								</div>
							</div>
						</div>

						<div className="rounded-[1.75rem] border border-rose-200 bg-rose-50/80 p-5 shadow-sm">
							<p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
								<PicturesOutline />
								Panduan Penulisan
							</p>
							<ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
								<li>Buat judul yang spesifik agar mudah dipahami dari daftar post.</li>
								<li>Gunakan ringkasan singkat untuk memberi konteks sebelum pembaca membuka detail.</li>
								<li>Lengkapi kata kunci dan visual utama agar distribusi konten lebih rapi.</li>
							</ul>
						</div>

						<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
							<p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
								<TagOutline />
								Checklist Publikasi
							</p>
							<ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
								<li>Pastikan isi editor sudah final sebelum ubah status ke terpublikasi.</li>
								<li>Periksa kembali slug hasil sistem lewat preview setelah post tersimpan.</li>
								<li>Gunakan status tersembunyi bila konten perlu disimpan tanpa tampil publik.</li>
							</ul>
						</div>
					</aside>
				</div>
			</ContainerAdmin>
		</Navigation>
	);
};

export default function PageWrapper() {
	return (
		<Suspense fallback={null}>
			<Page />
		</Suspense>
	);
}
