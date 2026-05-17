import { useEffect, useState } from 'react';
import { CloseOutline, RightOutline } from 'antd-mobile-icons';
import { Form } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'utils/toast';
import dayjs from 'dayjs';

import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import { InputNumber } from 'components/entry/input';
import Button, { LinkButton } from 'components/general/button';
import DatePicker from 'components/entry/date-picker';
import Select from 'components/entry/select';
import Upload from 'components/entry/upload';
import { ContainerAdmin } from 'components/general/container';

import { successMessage } from 'utils/constant';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Beli Item',
		href: '/admin/buy-item',
	},
];

const Page = () => {
	const router = useRouter();
	const [form] = Form.useForm();

	const [item, setItem] = useState<Record<string, any>[]>([]);
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

		if (values.date) values.date = dayjs(values.date).toDate();

		const formData = new FormData();

		if (router.query.id) formData.append('id', router.query.id as string);

		formData.append('itemId', values.itemId);
		formData.append('date', values.date);
		formData.append('price', values.price);
		formData.append('qty', values.qty);

		if (file) {
			formData.append('img', file);
		}

		axios
			.post('/api/admin/buy-item/save', formData)
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
		axios.get('/api/admin/item?s=10000').then((response) => {
			if (response.data.code === 0) {
				setItem(response.data.data);
			}
		});

		if (router.query.id) {
			axios.get(`/api/admin/buy-item?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					if (response.data.data.date) {
						response.data.data.date = dayjs(response.data.data.date);
					}

					if (response.data.data.image) {
						setImage(response.data.data.image);
					}

					form.setFieldsValue(response.data.data);
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation title="VMS: Beli Item Detail" active="admin" access="item_history" isAdmin>
			<ContainerAdmin>
				<div className="mt-6 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-100 via-white to-amber-50 p-5 shadow-sm md:p-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<Breadcrumb data={breadcrumb} />
							<h1 className="mt-3 text-2xl font-bold text-slate-800">
								{isEditMode ? 'Detail Pembelian Item' : 'Tambah Pembelian Item'}
							</h1>
							<p className="text-sm text-slate-600">
								Catat item masuk beserta harga dan bukti transaksi pembelian.
							</p>
						</div>
						<LinkButton
							href="/admin/buy-item"
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
						initialValues={{ itemId: undefined, date: null, price: 0, qty: 0 }}
					>
						<div className="mb-4">
							<h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
								Informasi Pembelian
							</h2>
							<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
								<Select
									options={item}
									name="itemId"
									label="Pilih Item"
									labelKey="name"
									valueKey="id"
									required
									className="mb-0 md:col-span-2"
									rules={[{ required: true, message: 'item harus dipilih' }]}
									disabled={isEditMode}
								/>
								<DatePicker
									name="date"
									label="Tanggal Beli"
									required
									className="mb-0"
									rules={[{ required: true, message: 'tanggal harus dipilih' }]}
									disabled={isEditMode}
								/>
								<InputNumber
									name="qty"
									label="Qty"
									required
									className="mb-0"
									rules={[{ required: true, message: 'qty harus diisi' }]}
									input={{ disabled: isEditMode }}
								/>
								<InputNumber
									name="price"
									label="Harga"
									required
									className="mb-0 md:col-span-2"
									rules={[{ required: true, message: 'harga harus diisi' }]}
									input={{ disabled: isEditMode }}
								/>
							</div>
						</div>

						<div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
							<Upload
								file={file}
								image={image}
								disabled={isEditMode}
								showPreview={isEditMode}
								onRemoveImage={removeImage}
								beforeUpload={beforeUpload}
							/>
						</div>

						{!isEditMode && (
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
