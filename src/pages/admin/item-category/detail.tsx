import { useEffect, useState } from 'react';
import { CloseOutline, RightOutline, TagOutline } from 'components/general/antd-icon';
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
		title: 'Kategori',
		href: '/admin/item-category',
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
			.post('/api/admin/item-category/save', {
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
			axios.get(`/api/admin/item-category?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					form.setFieldsValue(response.data.data);
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation title="VMS: Kategori Detail" active="admin" access="item_category" isAdmin>
			<ContainerAdmin>
				<div className="mt-6 overflow-hidden rounded-[2rem] border border-emerald-200/80 bg-linear-to-br from-emerald-50 via-white to-cyan-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
							<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
								<TagOutline />
								Kategori Item
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								{isEditMode ? 'Ubah Kategori Item' : 'Tambah Kategori Item'}
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Tentukan label kategori yang jelas agar seluruh data inventaris lebih mudah
								ditelusuri dan disaring.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-72">
							<div className="rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 shadow-sm">
								<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
									Mode
								</p>
								<p className="mt-2 text-sm font-bold text-slate-800">
									{isEditMode ? 'Edit Kategori' : 'Kategori Baru'}
								</p>
							</div>
							<LinkButton
								href="/admin/item-category"
								size="small"
								buttonType="warning"
								icon={<CloseOutline />}
								className="w-full justify-center text-base"
							>
								Kembali ke Kategori
							</LinkButton>
						</div>
					</div>
				</div>

				<div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
					<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
						<Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ name: '' }}>
							<div className="mb-6 border-b border-slate-100 pb-4">
								<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">
									Identitas Kategori
								</p>
								<h2 className="mt-2 text-xl font-bold text-slate-800">Data Utama</h2>
								<p className="mt-1 text-sm text-slate-500">
									Gunakan nama kategori yang singkat namun deskriptif.
								</p>
							</div>

							<div className="grid grid-cols-1 gap-3">
							<Input
								name="name"
								label="Nama Kategori"
								required
								className="mb-0"
								rules={[{ required: true, message: 'nama kategori wajib diisi' }]}
							/>
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
								{isEditMode ? 'Simpan Perubahan' : 'Simpan Data'}
							</Button>
							</div>
						</Form>
					</div>

					<aside className="space-y-5">
						<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
								Tips Penamaan
							</p>
							<ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
								<li>Gunakan istilah yang mudah dipahami oleh tim inventaris.</li>
								<li>Hindari nama kategori yang terlalu mirip agar tidak membingungkan.</li>
								<li>Pastikan kategori tetap relevan untuk item baru berikutnya.</li>
							</ul>
						</div>
					</aside>
				</div>
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
