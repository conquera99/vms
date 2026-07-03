'use client';

import { useState } from 'react';
import { CloseOutline, RightOutline } from 'components/general/antd-icon';
import { Form } from 'antd';
import axios from 'axios';
import { toast } from 'utils/toast';

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
		title: 'Campaign',
		href: '/admin/campaign',
	},
];

const Page = () => {
	const [form] = Form.useForm();

	const [loading, setLoading] = useState(false);

	const onFinish = (values: any) => {
		setLoading(true);

		axios
			.post('/api/admin/campaign/save', {
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

	return (
		<Navigation title="VMS: Campaign Detail" active="admin" access="campaign" isAdmin>
			<ContainerAdmin>
				<div className="mt-6 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-100 via-white to-amber-50 p-5 shadow-sm md:p-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<Breadcrumb data={breadcrumb} />
							<h1 className="mt-3 text-2xl font-bold text-slate-800">
								Tambah Campaign
							</h1>
							<p className="text-sm text-slate-600">
								Tambahkan campaign baru untuk kegiatan donasi vihara.
							</p>
						</div>
						<LinkButton
							href="/admin/campaign"
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
					<Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ name: '' }}>
						<div className="grid grid-cols-1 gap-3">
							<Input
								name="name"
								label="Nama Campaign"
								required
								className="mb-0"
								rules={[{ required: true, message: 'nama campaign wajib diisi' }]}
							/>
						</div>
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
					</Form>
				</div>
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
