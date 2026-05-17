import { useEffect, useState } from 'react';
import { CloseOutline, GlobalOutline, RightOutline, TagOutline } from 'antd-mobile-icons';
import { Form } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'utils/toast';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Input from 'components/entry/input';
import Button, { LinkButton } from 'components/general/button';
import { ContainerAdmin } from 'components/general/container';

import { successMessage } from 'utils/constant';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Hak Akses',
		href: '/admin/permission',
	},
];

const Page = () => {
	const router = useRouter();
	const [form] = Form.useForm();

	const [loading, setLoading] = useState(false);
	const isEditMode = Boolean(router.query.id);

	const onFinish = (values: any) => {
		setLoading(true);

		axios
			.post('/api/admin/permission/save', {
				id: router.query.id || null,
				...values,
			})
			.then((response) => {
				if (response.data.code === 0) {
					toast.success(successMessage);
					if (!router.query.id) form.resetFields();
				} else {
					toast.error(response.data.message);
				}
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		if (router.query.id) {
			axios.get(`/api/admin/permission?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					form.setFieldsValue(response.data.data);
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation title="VMS: Hak Akses Detail" active="admin" isAdmin isSuperAdminOnly>
			<ContainerAdmin>
				<div className="mt-6 overflow-hidden rounded-[2rem] border border-cyan-200/80 bg-linear-to-br from-cyan-50 via-white to-sky-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
						<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
								<GlobalOutline />
								Permission Editor
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								{isEditMode ? 'Ubah Hak Akses' : 'Tambah Hak Akses'}
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Buat nama izin yang konsisten agar pengelolaan fitur admin dan pembagian akses
								tetap rapi.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-72">
							<div className="grid grid-cols-2 gap-3">
								<div className="rounded-2xl border border-cyan-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Mode
									</p>
									<p className="mt-2 text-sm font-black text-slate-800">{isEditMode ? 'Edit' : 'Baru'}</p>
								</div>
								<div className="rounded-2xl border border-cyan-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Tipe
									</p>
									<p className="mt-2 text-sm font-black text-slate-800">Permission</p>
								</div>
							</div>
							<LinkButton
								href="/admin/permission"
								size="small"
								buttonType="warning"
								icon={<CloseOutline />}
								className="w-full justify-center text-base"
							>
								Kembali ke Hak Akses
							</LinkButton>
						</div>
					</div>
				</div>

				<div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
					<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
						<Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ name: '' }}>
							<div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-600">
										Form Hak Akses
									</p>
									<h2 className="mt-2 text-xl font-bold text-slate-800">Identitas Permission</h2>
									<p className="mt-1 text-sm text-slate-500">
										Gunakan nama izin yang ringkas, konsisten, dan mudah dipetakan ke fitur.
									</p>
								</div>
								<div className="rounded-2xl bg-cyan-50 px-4 py-3 text-right">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
										Mode
									</p>
									<p className="mt-1 text-sm font-bold text-slate-800">
										{isEditMode ? 'Edit Permission' : 'Permission Baru'}
									</p>
								</div>
							</div>

							<Input
								name="name"
								label="Nama Hak Akses"
								required
								className="mb-0"
								rules={[{ required: true, message: 'nama akses wajib diisi' }]}
							/>

							<div className="mt-8 flex items-center justify-end border-t border-slate-100 pt-5">
								<Button
									type="submit"
									className="w-full md:w-auto md:min-w-44"
									buttonType="primary"
									loading={loading}
									icon={<RightOutline />}
									iconLocation="right"
								>
									{isEditMode ? 'Simpan Perubahan' : 'Simpan Hak Akses'}
								</Button>
							</div>
						</Form>
					</div>

					<aside className="space-y-5">
						<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
								Ringkasan Permission
							</p>
							<div className="mt-4 space-y-3">
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
									<p className="text-xs text-slate-500">Fungsi</p>
									<p className="mt-1 text-lg font-black text-slate-800">Kontrol menu dan fitur</p>
								</div>
								<div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3">
									<p className="text-xs text-cyan-700">Pemakaian</p>
									<p className="mt-1 text-lg font-black text-cyan-900">Dipilih pada data user</p>
								</div>
							</div>
						</div>

						<div className="rounded-[1.75rem] border border-cyan-200 bg-cyan-50/80 p-5 shadow-sm">
							<p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
								<TagOutline />
								Panduan Penamaan
							</p>
							<ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
								<li>Pakai nama yang singkat dan langsung mewakili fitur atau modul.</li>
								<li>Gunakan pola penamaan konsisten agar mudah dipilih di form user.</li>
								<li>Hindari membuat akses yang maknanya tumpang tindih dengan izin lain.</li>
							</ul>
						</div>
					</aside>
				</div>
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
