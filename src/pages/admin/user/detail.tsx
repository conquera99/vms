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
import Select from 'components/entry/select';
import { ContainerAdmin } from 'components/general/container';

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

	const [permission, setPermisison] = useState<Record<string, string>[]>([]);
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
					if (!router.query.id) form.resetFields();
				} else {
					toast.error(response.data.message);
				}
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		if (router.query.id) {
			axios.get('/api/admin/permission?s=1000').then((response) => {
				if (response.data.code === 0) {
					setPermisison(response.data.data);
				}
			});

			axios.get(`/api/admin/user?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					delete response.data.data.password;

					form.setFieldsValue(response.data.data);

					form.setFieldsValue({ access: response.data.permissions });
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation title="VMS: User Detail" active="admin" isAdmin isSuperAdminOnly>
			<ContainerAdmin>
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
					initialValues={{
						name: '',
						username: '',
						password: '',
						email: '',
						access: undefined,
					}}
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
						type="password"
						rules={
							!router.query.id && [
								{ required: true, message: 'password wajib diisi' },
							]
						}
					/>
					<Input name="email" type="email" label="Email" />
					{router.query.id && (
						<Select
							name="access"
							label="Hak Akses"
							mode="multiple"
							options={permission}
							placeholder="Pilih Hak Akses"
							labelKey="name"
							valueKey="name"
						/>
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
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
