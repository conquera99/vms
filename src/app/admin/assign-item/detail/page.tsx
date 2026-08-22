'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { AppOutline, CloseOutline, RightOutline } from 'components/general/antd-icon';
import { Form } from 'antd';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { toast } from 'utils/toast';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import { InputNumber } from 'components/entry/input';
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
		title: 'Atur Lokasi',
		href: '/admin/assign-item',
	},
];

const Page = () => {
	const query = useSearchParams()!;
	const [form] = Form.useForm();

	const [reset, setReset] = useState(0);
	const [usedQty, setUsedQty] = useState(0);
	const [maxQty, setMaxQty] = useState(0);
	const [item, setItem] = useState<Record<string, any>[]>([]);
	const [location, setLocation] = useState<Record<string, any>[]>([]);
	const [loading, setLoading] = useState(false);

	const isViewMode = Boolean(query.get('locId') && query.get('itemId'));
	const remainingQty = Math.max(maxQty, 0);

	const onFinish = (values: any) => {
		setLoading(true);

		axios
			.post('/api/admin/assign-item/save', {
				id: query.get('id') || null,
				...values,
			})
			.then((response) => {
				if (response.data.code === 0) {
					toast.success(successMessage);
					setReset((prev) => prev + 1);
					setUsedQty(0);
					setMaxQty(0);
					if (!query.get('id')) form.resetFields();
				} else {
					toast.error(response.data.message);
				}
			})
			.finally(() => setLoading(false));
	};

	const onSelect = (_: any, options: Record<string, any>) => {
		setMaxQty(Number(options.totalQty) - Number(options.assignQty));
		setUsedQty(Number(options.assignQty));
	};

	useEffect(() => {
		axios.get('/api/admin/item?s=10000').then((response) => {
			if (response.data.code === 0) {
				setItem(response.data.data);
			}
		});

		axios.get('/api/admin/location?s=10000').then((response) => {
			if (response.data.code === 0) {
				setLocation(response.data.data);
			}
		});
	}, [reset]);

	useEffect(() => {
		if (query.get('locId') && query.get('itemId')) {
			axios
				.get(`/api/admin/assign-item?locId=${query.get('locId')}&itemId=${query.get('itemId')}`)
				.then((response) => {
					if (response.data.code === 0) {
						form.setFieldsValue(response.data.data);
					}
				});
		}
	}, [query, form]);

	return (
		<Navigation title="VMS: Atur Lokasi Detail" active="admin" access="item_history" isAdmin>
			<ContainerAdmin>
				<div className="mt-6 overflow-hidden rounded-[2rem] border border-cyan-200/80 bg-linear-to-br from-cyan-50 via-white to-sky-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
							<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
								<AppOutline />
								Distribusi Lokasi
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								{isViewMode ? 'Detail Penempatan Item' : 'Tambah Penempatan Item'}
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Atur distribusi item per lokasi dengan tampilan yang memudahkan pengecekan
								kapasitas dan penempatan aktif.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-80">
							<div className="grid grid-cols-3 gap-3">
								<div className="rounded-2xl border border-cyan-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Item
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{item.length}</p>
								</div>
								<div className="rounded-2xl border border-cyan-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Lokasi
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{location.length}</p>
								</div>
								<div className="rounded-2xl border border-cyan-200 bg-white/90 px-4 py-3 text-center shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Sisa Qty
									</p>
									<p className="mt-2 text-2xl font-black text-slate-800">{remainingQty}</p>
								</div>
							</div>
							<LinkButton
								href="/admin/assign-item"
								size="small"
								buttonType="warning"
								icon={<CloseOutline />}
								className="w-full justify-center text-base"
							>
								Kembali
							</LinkButton>
						</div>
					</div>
				</div>

				<div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
					<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
						<Form
							layout="vertical"
							form={form}
							onFinish={onFinish}
							initialValues={{ itemId: undefined, locId: undefined, qty: 0 }}
						>
							<div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-600">
										Form Penempatan
									</p>
									<h2 className="mt-2 text-xl font-bold text-slate-800">Distribusi Item</h2>
									<p className="mt-1 text-sm text-slate-500">
										Tentukan item, lokasi tujuan, dan jumlah yang akan ditempatkan.
									</p>
								</div>
								<div className="rounded-2xl bg-cyan-50 px-4 py-3 text-right">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
										Mode
									</p>
									<p className="mt-1 text-sm font-bold text-slate-800">
										{isViewMode ? 'Lihat Penempatan' : 'Tambah Penempatan'}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Select
									options={item}
									name="itemId"
									label="Pilih Item"
									labelKey="name"
									valueKey="id"
									onSelect={onSelect}
									className="mb-0"
									rules={[{ required: true, message: 'item harus dipilih' }]}
									disabled={isViewMode}
								/>
								<Select
									options={location}
									name="locId"
									label="Pilih Lokasi"
									labelKey="name"
									valueKey="id"
									className="mb-0"
									rules={[{ required: true, message: 'lokasi harus dipilih' }]}
									disabled={isViewMode}
								/>
								<InputNumber
									name="qty"
									label="Qty"
									className="mb-0 md:col-span-2"
									min={0}
									max={maxQty}
									input={{ disabled: isViewMode }}
								/>
							</div>

							{!isViewMode && (
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
							)}
						</Form>
					</div>

					<aside className="space-y-5">
						<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
								Kapasitas Item
							</p>
							<div className="mt-4 space-y-3">
								<div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3">
									<p className="text-xs text-cyan-700">Sisa Qty Tersedia</p>
									<p className="mt-1 text-2xl font-black text-cyan-900">{remainingQty}</p>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
									<p className="text-xs text-slate-500">Qty Sudah Ditempatkan</p>
									<p className="mt-1 text-2xl font-black text-slate-800">{usedQty}</p>
								</div>
							</div>
						</div>

						<div className="rounded-[1.75rem] border border-cyan-200 bg-cyan-50/80 p-5 shadow-sm">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">
								Panduan Penempatan
							</p>
							<ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
								<li>Pilih item lebih dulu untuk memunculkan sisa kapasitas yang relevan.</li>
								<li>Gunakan lokasi yang benar agar perhitungan stok per ruang tetap sesuai.</li>
								<li>Mode lihat dipakai untuk mengecek data penempatan yang sudah tersimpan.</li>
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
