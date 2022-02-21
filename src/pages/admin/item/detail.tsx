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
					form.resetFields();
				} else {
					toast.error(response.data.message);
				}
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		if (router.query.id) {
			axios.get(`/api/admin/item?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					if (response.data.data.dateOfBirth)
						response.data.data.dateOfBirth = dayjs(response.data.data.dateOfBirth);

					form.setFieldsValue(response.data.data);
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation active="admin" isAdmin>
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
				<Input name="desc" label="Keterangan" />
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
