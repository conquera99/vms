import { useEffect, useState } from 'react';
import { CloseOutline, RightOutline } from 'antd-mobile-icons';
import Form from 'rc-field-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Input from 'components/entry/input';
import Button, { LinkButton } from 'components/general/button';

import { successMessage } from 'utils/constant';
import Select from 'components/entry/select';

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
			<Title>
				<div className="flex justify-between items-center">
					<Breadcrumb data={breadcrumb} />
					<LinkButton
						href="/admin/item"
						size="small"
						buttonType="warning"
						icon={<CloseOutline />}
						className="text-base"
					>
						Tutup
					</LinkButton>
				</div>
			</Title>

			<Form form={form} onFinish={onFinish} initialValues={{ name: '', desc: '' }}>
				<Input
					name="name"
					label="Nama Item"
					required
					rules={[{ required: true, message: 'nama item wajib diisi' }]}
				/>
				<Select
					options={category}
					name="categoryId"
					label="Pilih Kategori"
					labelKey="name"
					valueKey="id"
					rules={[{ required: true, message: 'kategori harus dipilih' }]}
				/>
				<Input name="desc" label="Keterangan" />

				{router.query.id && (
					<div className="flex justify-between mb-4">
						<div className="text-center">
							<p className="text-sm">Total Qty</p>
							<p className="text-lg">{totalQty}</p>
						</div>
						<div className="text-center">
							<p className="text-sm">Qty Ditempatkan</p>
							<p className="text-lg">{usedQty}</p>
						</div>
					</div>
				)}

				<Button
					type="submit"
					className="w-full"
					buttonType="primary"
					loading={loading}
					icon={<RightOutline />}
					iconLocation="right"
				>
					Simpan
				</Button>
			</Form>
		</Navigation>
	);
};

export default Page;
