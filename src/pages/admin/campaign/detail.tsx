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
import Input, { TextArea } from 'components/entry/input';
import Button, { LinkButton } from 'components/general/button';
import { ContainerAdmin } from 'components/general/container';
import DatePicker from 'components/entry/date-picker';
import Select from 'components/entry/select';

import { successMessage } from 'utils/constant';
import Upload from 'components/entry/upload';

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
	const router = useRouter();
	const [form] = Form.useForm();

	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [image, setImage] = useState<string | undefined>(undefined);

	const removeImage = () => setFile(null);

	const beforeUpload = (file: File) => {
		setFile(file);
		const img = URL.createObjectURL(file);
		setImage(img);
		return false;
	};

	const onFinish = (values: any) => {
		setLoading(true);

		if (!values.notes) {
			values.notes = '';
		}

		const formData = new FormData();

		if (router.query.id) formData.append('id', router.query.id as string);

		formData.append('title', values.title);
		formData.append('desc', values.desc);
		formData.append('startDate', values.startDate);
		formData.append('endDate', values.endDate);
		formData.append('notes', values.notes);
		formData.append('status', values.status);
		formData.append('visible', values.visible);

		if (file) {
			formData.append('img', file);
		}

		axios
			.post('/api/admin/campaign/save', formData)
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
		if (router.query.id) {
			axios.get(`/api/admin/campaign?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					if (response.data.data.startDate)
						response.data.data.startDate = dayjs(response.data.data.startDate);
					if (response.data.data.endDate)
						response.data.data.endDate = dayjs(response.data.data.endDate);

					if (response.data.data.image) {
						setImage(response.data.data.image);
					}

					form.setFieldsValue(response.data.data);
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation title="VMS: Campaign Detail" active="admin" access="item_category" isAdmin>
			<ContainerAdmin>
				<Title>
					<div className="flex justify-between items-center">
						<Breadcrumb data={breadcrumb} />
						<LinkButton
							href="/admin/campaign"
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
						title: '',
						desc: '',
						startDate: null,
						endDate: null,
						notes: '',
						status: 'A',
					}}
				>
					<Input
						name="title"
						label="Judul Campaign"
						required
						rules={[{ required: true, message: 'judul campaign wajib diisi' }]}
					/>
					<TextArea
						name="desc"
						label="Deskripsi"
						required
						rules={[{ required: true, message: 'deskripsi wajib diisi' }]}
					/>
					<DatePicker name="startDate" label="Tanggal Mulai" />
					<DatePicker name="endDate" label="Tanggal Selesai" />
					<TextArea name="notes" label="Catatan" />
					<Select
						name="status"
						label="Status"
						options={[
							{ label: 'Aktif', value: 'A' },
							{ label: 'Selesai', value: 'C' },
							{ label: 'Nonaktif', value: 'N' },
						]}
					/>
					<Select
						name="visible"
						label="Visibilitas"
						options={[
							{ label: 'Terpublish', value: 'Y' },
							{ label: 'Internal', value: 'N' },
						]}
					/>
					<Upload
						file={file}
						image={image}
						showPreview={router.query.id ? true : false}
						onRemoveImage={removeImage}
						beforeUpload={beforeUpload}
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
