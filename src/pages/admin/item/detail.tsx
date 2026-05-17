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
	const router = useRouter();
	const [form] = Form.useForm();

	const [category, setCategory] = useState<Record<string, any>[]>([]);
	const [totalQty, setTotalQty] = useState(0);
	const [usedQty, setUsedQty] = useState(0);
	const [loading, setLoading] = useState(false);
	const isEditMode = Boolean(router.query.id);

	const onFinish = (values: any) => {
		setLoading(true);

		if (values.date) values.date = dayjs(values.date).toDate();

		axios
			.post('/api/admin/item/save', {
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
		axios.get('/api/admin/item-category?s=10000').then((response) => {
			if (response.data.code === 0) {
				setCategory(response.data.data);
			}
		});

		if (router.query.id) {
			axios.get(`/api/admin/item?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					setTotalQty(response.data.data.totalQty);
					setUsedQty(response.data.data.assignQty);

					form.setFieldsValue(response.data.data);
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation title="VMS: Item Detail" active="admin" access="item" isAdmin>
			<ContainerAdmin>
				<div className="mt-6 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-100 via-white to-amber-50 p-5 shadow-sm md:p-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<Breadcrumb data={breadcrumb} />
							<h1 className="mt-3 text-2xl font-bold text-slate-800">
								{isEditMode ? 'Ubah Item' : 'Tambah Item'}
							</h1>
							<p className="text-sm text-slate-600">
								Lengkapi informasi item agar inventaris tercatat dengan konsisten.
							</p>
						</div>
						<LinkButton
							href="/admin/item"
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
					<Form form={form} onFinish={onFinish} initialValues={{ name: '', desc: '' }}>
						<div className="mb-4">
							<h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
								Informasi Item
							</h2>
							<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
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
								<Input name="desc" label="Keterangan" className="mb-0 md:col-span-2" />
							</div>
						</div>

						{isEditMode && (
							<div className="mb-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
								<p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
									Ringkasan Stok
								</p>
								<div className="mt-2 grid grid-cols-2 gap-3">
									<div className="rounded-lg bg-white px-3 py-2 text-center border border-slate-200">
										<p className="text-xs text-slate-500">Total Qty</p>
										<p className="text-xl font-bold text-slate-800">{totalQty}</p>
									</div>
									<div className="rounded-lg bg-white px-3 py-2 text-center border border-slate-200">
										<p className="text-xs text-slate-500">Qty Ditempatkan</p>
										<p className="text-xl font-bold text-slate-800">{usedQty}</p>
									</div>
								</div>
							</div>
						)}

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
