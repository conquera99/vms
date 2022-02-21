import { useEffect, useState } from 'react';
import { CloseOutline, RightOutline } from 'antd-mobile-icons';
import Form from 'rc-field-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

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
		title: 'User',
		href: '/admin/user',
	},
];

const Page = () => {
	const router = useRouter();
	const [form] = Form.useForm();

	const [loading, setLoading] = useState(false);

	const onFinish = (values: any) => {
		setLoading(true);

		axios
			.post('/api/admin/user/save', {
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
			axios.get(`/api/admin/user?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					delete response.data.data.password;

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
						href="/admin/user"
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
				initialValues={{ name: '', username: '', password: '', email: '' }}
			>
				<Input
					name="name"
					label="Nama Lengkap"
					required
					rules={[{ required: true, message: 'nama lengkap wajib diisi' }]}
				/>
				<Input
					name="username"
					label="Username"
					required
					rules={[{ required: true, message: 'username wajib diisi' }]}
				/>
				<Input
					name="password"
					label="Password"
					required={!router.query.id}
					rules={
						!router.query.id && [{ required: true, message: 'password wajib diisi' }]
					}
				/>
				<Input name="email" type="email" label="Email" />
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
