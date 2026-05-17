import { useEffect, useState } from 'react';
import { CloseOutline, RightOutline, TagOutline, UserContactOutline } from 'antd-mobile-icons';
import { Form } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'utils/toast';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Input from 'components/entry/input';
import Button, { LinkButton } from 'components/general/button';
import Select from 'components/entry/select';
import { ContainerAdmin } from 'components/general/container';

import { successMessage } from 'utils/constant';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'User',
		href: '/admin/user',
	},
];

const Page = () => {
	const router = useRouter();
	const [form] = Form.useForm();

	const [permission, setPermisison] = useState<Record<string, string>[]>([]);
	const [loading, setLoading] = useState(false);
	const isEditMode = Boolean(router.query.id);

	const onFinish = (values: any) => {
		setLoading(true);

		axios
			.post('/api/admin/user/save', {
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
			axios.get('/api/admin/permission?s=1000').then((response) => {
				if (response.data.code === 0) {
					setPermisison(response.data.data);
				}
			});

			axios.get(`/api/admin/user?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					delete response.data.data.password;

					form.setFieldsValue(response.data.data);

					form.setFieldsValue({ access: response.data.permissions });
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation title="VMS: User Detail" active="admin" isAdmin isSuperAdminOnly>
			<ContainerAdmin>
				<div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-300/80 bg-linear-to-br from-slate-100 via-white to-sky-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
						<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
								<UserContactOutline />
								User Admin
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								{isEditMode ? 'Ubah User' : 'Tambah User Baru'}
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Kelola identitas akun, kredensial dasar, dan hak akses admin dari satu tampilan
								yang lebih rapi.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-80">
							<div className="grid grid-cols-3 gap-3">
								<div className="rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Mode
									</p>
									<p className="mt-2 text-sm font-black text-slate-800">{isEditMode ? 'Edit' : 'Baru'}</p>
								</div>
								<div className="rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Akses
									</p>
									<p className="mt-2 text-sm font-black text-slate-800">{isEditMode ? 'Aktif' : 'Nanti'}</p>
								</div>
								<div className="rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Role
									</p>
									<p className="mt-2 text-sm font-black text-slate-800">Admin</p>
								</div>
							</div>
							<LinkButton
								href="/admin/user"
								size="small"
								buttonType="warning"
								icon={<CloseOutline />}
								className="w-full justify-center text-base"
							>
								Kembali ke User
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
								name: '',
								username: '',
								password: '',
								email: '',
								access: undefined,
							}}
						>
							<div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
										Form User
									</p>
									<h2 className="mt-2 text-xl font-bold text-slate-800">Informasi Akun</h2>
									<p className="mt-1 text-sm text-slate-500">
										Isi data login dan identitas dasar untuk akun admin sistem.
									</p>
								</div>
								<div className="rounded-2xl bg-slate-100 px-4 py-3 text-right">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
										Mode
									</p>
									<p className="mt-1 text-sm font-bold text-slate-800">
										{isEditMode ? 'Edit User' : 'User Baru'}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Input
									name="name"
									label="Nama Lengkap"
									required
									className="mb-0 md:col-span-2"
									rules={[{ required: true, message: 'nama lengkap wajib diisi' }]}
								/>
								<Input
									name="username"
									label="Username"
									required
									className="mb-0"
									rules={[{ required: true, message: 'username wajib diisi' }]}
								/>
								<Input name="email" type="email" label="Email" className="mb-0" />
								<Input
									name="password"
									label="Password"
									required={!router.query.id}
									type="password"
									className="mb-0 md:col-span-2"
									rules={
										!router.query.id && [{ required: true, message: 'password wajib diisi' }]
									}
								/>
								{router.query.id && (
									<Select
										name="access"
										label="Hak Akses"
										mode="multiple"
										options={permission}
										placeholder="Pilih Hak Akses"
										labelKey="name"
										valueKey="name"
										className="mb-0 md:col-span-2"
									/>
								)}
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
									{isEditMode ? 'Simpan Perubahan' : 'Simpan User'}
								</Button>
							</div>
						</Form>
					</div>

					<aside className="space-y-5">
						<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
								Ringkasan User
							</p>
							<div className="mt-4 space-y-3">
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
									<p className="text-xs text-slate-500">Login</p>
									<p className="mt-1 text-lg font-black text-slate-800">Username dan password</p>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
									<p className="text-xs text-slate-500">Akses</p>
									<p className="mt-1 text-lg font-black text-slate-800">
										{isEditMode ? `${permission.length} opsi tersedia` : 'Diatur setelah dibuat'}
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-[1.75rem] border border-slate-300 bg-slate-100/80 p-5 shadow-sm">
							<p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700">
								<TagOutline />
								Catatan Admin
							</p>
							<ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
								<li>Gunakan username yang konsisten dan mudah dikenali oleh tim admin.</li>
								<li>Password wajib diisi saat membuat akun baru, lalu dapat diubah saat edit bila perlu.</li>
								<li>Hak akses hanya tersedia pada mode edit sesuai alur sistem yang ada sekarang.</li>
							</ul>
						</div>
					</aside>
				</div>
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
