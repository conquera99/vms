'use client';

import { useEffect, useState } from 'react';
import { CloseOutline, GiftOutline, RightOutline } from 'components/general/antd-icon';
import { Form } from 'antd';
import axios from 'axios';
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
		title: 'Item',
		href: '/admin/item',
	},
];

const Page = () => {
	const [form] = Form.useForm();

	const [category, setCategory] = useState<Record<string, any>[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		axios.get('/api/admin/item-category?s=10000').then((response) => {
			if (response.data.code === 0) {
				setCategory(response.data.data);
			}
		});
	}, []);

	const onFinish = (values: any) => {
		setLoading(true);

		axios
			.post('/api/admin/item/save', {
				...values,
			})
			.then((response) => {
				if (response.data.code === 0) {
					toast.success(successMessage);
					form.resetFields();
				} else {
					toast.error(response.data.message);
				}
			})
			.finally(() => setLoading(false));
	};

	return (
		<Navigation title="VMS: Item Detail" active="admin" access="item" isAdmin>
			<ContainerAdmin>
				<div className="mt-6 overflow-hidden rounded-[2rem] border border-amber-200/80 bg-linear-to-br from-amber-50 via-white to-orange-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
							<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
								<GiftOutline />
								Item Inventory
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								Tambah Item
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Simpan identitas item, kategorinya, dan ringkasan stok dalam satu tampilan
								yang lebih mudah dipantau oleh admin.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-72">
							<div className="grid grid-cols-3 gap-3">
								<div className="rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Kategori
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{category.length}</p>
								</div>
								<div className="rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Ditempatkan
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">0</p>
								</div>
								<div className="rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Tersedia
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">0</p>
								</div>
							</div>
							<LinkButton
								href="/admin/item"
								size="small"
								buttonType="warning"
								icon={<CloseOutline />}
								className="w-full justify-center text-base"
							>
								Kembali ke Data Item
							</LinkButton>
						</div>
					</div>
				</div>

				<div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
					<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
						<Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ name: '', desc: '' }}>
							<div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
										Form Item
									</p>
									<h2 className="mt-2 text-xl font-bold text-slate-800">Informasi Utama</h2>
									<p className="mt-1 text-sm text-slate-500">
										Isi data inti item agar inventaris mudah dicari dan dikelompokkan.
									</p>
								</div>
								<div className="rounded-2xl bg-amber-50 px-4 py-3 text-right">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
										Mode
									</p>
									<p className="mt-1 text-sm font-bold text-slate-800">
										Item Baru
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Input
									name="name"
									label="Nama Item"
									required
									className="mb-0"
									rules={[{ required: true, message: 'nama item wajib diisi' }]}
								/>
								<Select
									options={category}
									name="categoryId"
									label="Pilih Kategori"
									labelKey="name"
									valueKey="id"
									className="mb-0"
									rules={[{ required: true, message: 'kategori harus dipilih' }]}
								/>
								<Input
									name="desc"
									label="Keterangan"
									className="mb-0 md:col-span-2"
									input={{ style: { minHeight: 112 } }}
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
								Simpan Data
							</Button>
						</div>
						</Form>
					</div>

					<aside className="space-y-5">
						<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
								Ringkasan Stok
							</p>
							<div className="mt-4 space-y-3">
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
									<p className="text-xs text-slate-500">Total Qty</p>
									<p className="mt-1 text-2xl font-black text-slate-800">0</p>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
									<p className="text-xs text-slate-500">Qty Ditempatkan</p>
									<p className="mt-1 text-2xl font-black text-slate-800">0</p>
								</div>
								<div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
									<p className="text-xs text-emerald-700">Sisa Tersedia</p>
									<p className="mt-1 text-2xl font-black text-emerald-900">0</p>
								</div>
							</div>
						</div>

						<div className="rounded-[1.75rem] border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
								Catatan Admin
							</p>
							<ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
								<li>Gunakan nama item yang mudah dikenali oleh tim inventaris.</li>
								<li>Pilih kategori yang tepat agar pelacakan stok dan laporan lebih rapi.</li>
								<li>Periksa sisa stok sebelum menambah penempatan ke lokasi tertentu.</li>
							</ul>
						</div>
					</aside>
				</div>
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
