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
import { InputNumber } from 'components/entry/input';
import Button, { LinkButton } from 'components/general/button';
import DatePicker from 'components/entry/date-picker';
import Select from 'components/entry/select';

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

	const onFinish = (values: any) => {
		setLoading(true);

		if (values.date) values.date = dayjs(values.date).toDate();

		axios
			.post('/api/admin/buy-item/save', {
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
		axios.get('/api/admin/item?s=10000').then((response) => {
			if (response.data.code === 0) {
				setItem(response.data.data);
			}
		});

		if (router.query.id) {
			axios.get(`/api/admin/buy-item?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					if (response.data.data.date)
						response.data.data.date = dayjs(response.data.data.date);

					form.setFieldsValue(response.data.data);
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation active="admin" access="item_history" isAdmin>
			<Title>
				<div className="flex justify-between items-center">
					<Breadcrumb data={breadcrumb} />
					<LinkButton
						href="/admin/buy-item"
						size="small"
						buttonType="warning"
						icon={<CloseOutline />}
						className="text-base"
					>
						Tutup
					</LinkButton>
				</div>
			</Title>

			<Form
				form={form}
				onFinish={onFinish}
				initialValues={{ itemId: undefined, date: null, price: 0, qty: 0 }}
			>
				<Select
					options={item}
					name="itemId"
					label="Pilih Item"
					labelKey="name"
					valueKey="id"
					rules={[{ required: true, message: 'item harus dipilih' }]}
					disabled={router.query.id ? true : false}
				/>
				<DatePicker
					name="date"
					label="Tanggal Beli"
					disabled={router.query.id ? true : false}
				/>
				<InputNumber
					name="price"
					label="Harga"
					input={{ disabled: router.query.id ? true : false }}
				/>
				<InputNumber
					name="qty"
					label="Qty"
					input={{ disabled: router.query.id ? true : false }}
				/>
				{!router.query.id && (
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
				)}
			</Form>
		</Navigation>
	);
};

export default Page;
