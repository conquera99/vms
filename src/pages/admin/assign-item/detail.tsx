import { useEffect, useState } from 'react';
import { CloseOutline, RightOutline } from 'antd-mobile-icons';
import { Form } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
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
	const router = useRouter();
	const [form] = Form.useForm();

	const [reset, setReset] = useState(0);
	const [usedQty, setUsedQty] = useState(0);
	const [maxQty, setMaxQty] = useState(0);
	const [item, setItem] = useState<Record<string, any>[]>([]);
	const [location, setLocation] = useState<Record<string, any>[]>([]);
	const [loading, setLoading] = useState(false);

	const isViewMode = Boolean(router.query.locId && router.query.itemId);

	const onFinish = (values: any) => {
		setLoading(true);

		axios
			.post('/api/admin/assign-item/save', {
				id: router.query.id || null,
				...values,
			})
			.then((response) => {
				if (response.data.code === 0) {
					toast.success(successMessage);
					setReset((prev) => prev + 1);
					setUsedQty(0);
					setMaxQty(0);
					if (!router.query.id) form.resetFields();
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
		if (router.query.locId && router.query.itemId) {
			axios
				.get(`/api/admin/assign-item?locId=${router.query.locId}&itemId=${router.query.itemId}`)
				.then((response) => {
					if (response.data.code === 0) {
						form.setFieldsValue(response.data.data);
					}
				});
		}
	}, [router.query.locId, router.query.itemId, form]);

	return (
		<Navigation title="VMS: Atur Lokasi Detail" active="admin" access="item_history" isAdmin>
			<ContainerAdmin>
				<div className="mt-6 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-100 via-white to-amber-50 p-5 shadow-sm md:p-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<Breadcrumb data={breadcrumb} />
							<h1 className="mt-3 text-2xl font-bold text-slate-800">
								{isViewMode ? 'Detail Penempatan Item' : 'Tambah Penempatan Item'}
							</h1>
							<p className="text-sm text-slate-600">
								Atur lokasi penempatan item agar distribusi inventaris tetap akurat.
							</p>
						</div>
						<LinkButton
							href="/admin/assign-item"
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
						initialValues={{ itemId: undefined, locId: undefined, qty: 0 }}
					>
						<div className="mb-4">
							<h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
								Informasi Penempatan
							</h2>
							<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
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
						</div>

						{!isViewMode && (
							<div className="mb-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
								<p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
									Kapasitas Item
								</p>
								<div className="mt-2 grid grid-cols-2 gap-3">
									<div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center">
										<p className="text-xs text-slate-500">Sisa Qty Tersedia</p>
										<p className="text-xl font-bold text-slate-800">{maxQty}</p>
									</div>
									<div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center">
										<p className="text-xs text-slate-500">Qty Sudah Ditempatkan</p>
										<p className="text-xl font-bold text-slate-800">{usedQty}</p>
									</div>
								</div>
							</div>
						)}

						{!isViewMode && (
							<div className="mt-6 flex items-center justify-end border-t border-slate-100 pt-4">
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
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
