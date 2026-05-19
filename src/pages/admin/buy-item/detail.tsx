import { useEffect, useState } from 'react';
import { CloseOutline, RightOutline, ShopbagOutline } from 'components/general/antd-icon';
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
				<div className="mt-6 overflow-hidden rounded-[2rem] border border-amber-200/80 bg-linear-to-br from-orange-50 via-white to-amber-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
							<Breadcrumb data={breadcrumb} />
							<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
								<ShopbagOutline />
								Pembelian Stok
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								{isEditMode ? 'Detail Pembelian Item' : 'Tambah Pembelian Item'}
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Catat stok masuk, harga pembelian, dan bukti visual agar histori barang
								lebih lengkap dan mudah diaudit.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:min-w-72">
							<div className="grid grid-cols-2 gap-3">
								<div className="rounded-2xl border border-orange-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Mode
									</p>
									<p className="mt-2 text-sm font-bold text-slate-800">
										{isEditMode ? 'Lihat Riwayat' : 'Input Baru'}
									</p>
								</div>
								<div className="rounded-2xl border border-orange-200 bg-white/90 px-4 py-3 shadow-sm">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Item Aktif
									</p>
									<p className="mt-2 text-sm font-bold text-slate-800">{item.length}</p>
								</div>
							</div>
							<LinkButton
								href="/admin/buy-item"
								size="small"
								buttonType="warning"
								icon={<CloseOutline />}
								className="w-full justify-center text-base"
							>
								Kembali ke Riwayat
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
							initialValues={{ itemId: undefined, date: null, price: 0, qty: 0 }}
						>
							<div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-600">
										Form Pembelian
									</p>
									<h2 className="mt-2 text-xl font-bold text-slate-800">Informasi Transaksi</h2>
									<p className="mt-1 text-sm text-slate-500">
										Semua data di bawah ini akan disimpan sebagai histori stok masuk.
									</p>
								</div>
								<div className="rounded-2xl bg-orange-50 px-4 py-3 text-right">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">
										Status
									</p>
									<p className="mt-1 text-sm font-bold text-slate-800">
										{isEditMode ? 'Terkunci' : 'Siap Disimpan'}
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

							<div className="mt-6 rounded-[1.5rem] border border-dashed border-orange-200 bg-orange-50/70 px-4 py-4">
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
						<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm mb-5">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
								Panduan Cepat
							</p>
							<ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
								<li>Pilih item yang benar sebelum mencatat kuantitas pembelian.</li>
								<li>Gunakan tanggal transaksi aktual agar histori stok tetap akurat.</li>
								<li>Lampirkan bukti gambar untuk memudahkan verifikasi saat audit.</li>
							</ul>
						</div>

						<div className="rounded-[1.75rem] border border-orange-200 bg-orange-50/80 p-5 shadow-sm">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700">
								Kondisi Halaman
							</p>
							<div className="mt-4 space-y-3">
								<div className="rounded-2xl border border-orange-200 bg-white/90 px-4 py-3">
									<p className="text-xs text-slate-500">Form</p>
									<p className="mt-1 text-base font-bold text-slate-800">
										{isEditMode ? 'Mode lihat transaksi' : 'Mode tambah pembelian'}
									</p>
								</div>
								<div className="rounded-2xl border border-orange-200 bg-white/90 px-4 py-3">
									<p className="text-xs text-slate-500">Referensi Item</p>
									<p className="mt-1 text-base font-bold text-slate-800">{item.length} item tersedia</p>
								</div>
							</div>
						</div>
					</aside>
				</div>
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
