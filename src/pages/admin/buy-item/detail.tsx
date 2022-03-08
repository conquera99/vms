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
					if (response.data.data.date)
						response.data.data.date = dayjs(response.data.data.date);

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
						required
						rules={[{ required: true, message: 'item harus dipilih' }]}
						disabled={router.query.id ? true : false}
					/>
					<DatePicker
						name="date"
						label="Tanggal Beli"
						required
						rules={[{ required: true, message: 'tanggal harus dipilih' }]}
						disabled={router.query.id ? true : false}
					/>
					<InputNumber
						name="price"
						label="Harga"
						required
						rules={[{ required: true, message: 'harga harus diisi' }]}
						input={{ disabled: router.query.id ? true : false }}
					/>
					<InputNumber
						name="qty"
						label="Qty"
						required
						rules={[{ required: true, message: 'qty harus diisi' }]}
						input={{ disabled: router.query.id ? true : false }}
					/>
					<Upload
						file={file}
						image={image}
						disabled={!router.query.id ? false : true}
						showPreview={router.query.id ? true : false}
						onRemoveImage={removeImage}
						beforeUpload={beforeUpload}
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
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
