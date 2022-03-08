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
import { ContainerAdmin } from 'components/general/container';

import { successMessage } from 'utils/constant';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Album',
		href: '/admin/album',
	},
];

const Page = () => {
	const router = useRouter();
	const [form] = Form.useForm();

	const [loading, setLoading] = useState(false);

	const onFinish = (values: any) => {
		setLoading(true);

		axios
			.post('/api/admin/gallery/album/save', {
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
			axios.get(`/api/admin/gallery/album?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					form.setFieldsValue(response.data.data);
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation title="VMS: Album Detail" active="admin" access="album" isAdmin>
			<ContainerAdmin>
				<Title>
					<div className="flex justify-between items-center">
						<Breadcrumb data={breadcrumb} />
						<LinkButton
							href="/admin/album"
							size="small"
							buttonType="warning"
							icon={<CloseOutline />}
							className="text-base"
						>
							Tutup
						</LinkButton>
					</div>
				</Title>

				<Form form={form} onFinish={onFinish} initialValues={{ name: '' }}>
					<Input
						name="title"
						label="Judul Album"
						required
						rules={[{ required: true, message: 'judul album wajib diisi' }]}
					/>
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
