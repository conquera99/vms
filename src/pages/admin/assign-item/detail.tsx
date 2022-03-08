import { useEffect, useRef, useState } from 'react';
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
import Select from 'components/entry/select';
import { ContainerAdmin } from 'components/general/container';

import { successMessage } from 'utils/constant';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Atur Lokasi',
		href: '/admin/assign-item',
	},
];

const Page = () => {
	const router = useRouter();
	const [form] = Form.useForm();

	const [reset, setReset] = useState(0);

	const [usedQty, setUsedQty] = useState(0);
	const [maxQty, setMaxQty] = useState(0);
	const [item, setItem] = useState<Record<string, any>[]>([]);
	const [location, setLocation] = useState<Record<string, any>[]>([]);
	const [loading, setLoading] = useState(false);

	const onFinish = (values: any) => {
		setLoading(true);

		if (values.date) values.date = dayjs(values.date).toDate();

		axios
			.post('/api/admin/assign-item/save', {
				id: router.query.id || null,
				...values,
			})
			.then((response) => {
				if (response.data.code === 0) {
					toast.success(successMessage);
					setReset((prev) => prev + 1);
					setUsedQty(0);
					setMaxQty(0);
					if (!router.query.id) form.resetFields();
				} else {
					toast.error(response.data.message);
				}
			})
			.finally(() => setLoading(false));
	};

	const onSelect = (_: any, options: Record<string, any>) => {
		setMaxQty(Number(options.totalQty) - Number(options.assignQty));
		setUsedQty(Number(options.assignQty));
	};

	useEffect(() => {
		axios.get('/api/admin/item?s=10000').then((response) => {
			if (response.data.code === 0) {
				setItem(response.data.data);
			}
		});

		axios.get('/api/admin/location?s=10000').then((response) => {
			if (response.data.code === 0) {
				setLocation(response.data.data);
			}
		});
	}, [reset]);

	useEffect(() => {
		if (router.query.locId && router.query.itemId) {
			axios
				.get(
					`/api/admin/assign-item?locId=${router.query.locId}&itemId=${router.query.itemId}`,
				)
				.then((response) => {
					if (response.data.code === 0) {
						form.setFieldsValue(response.data.data);
					}
				});
		}
	}, [router.query.locId, router.query.itemId, form]);

	return (
		<Navigation title="VMS: Atur Lokasi Detail" active="admin" access="item_history" isAdmin>
			<ContainerAdmin>
				<Title>
					<div className="flex justify-between items-center">
						<Breadcrumb data={breadcrumb} />
						<LinkButton
							href="/admin/assign-item"
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
					initialValues={{ itemId: undefined, locId: undefined, qty: 0 }}
				>
					<Select
						options={item}
						name="itemId"
						label="Pilih Item"
						labelKey="name"
						valueKey="id"
						onSelect={onSelect}
						rules={[{ required: true, message: 'item harus dipilih' }]}
						disabled={router.query.locId && router.query.itemId ? true : false}
					/>
					{!router.query.locId && !router.query.itemId && (
						<div className="flex justify-between mb-4">
							<div className="text-center">
								<p className="text-sm">Total Qty</p>
								<p className="text-lg">{maxQty}</p>
							</div>
							<div className="text-center">
								<p className="text-sm">Qty Ditempatkan</p>
								<p className="text-lg">{usedQty}</p>
							</div>
						</div>
					)}
					<Select
						options={location}
						name="locId"
						label="Pilih Lokasi"
						labelKey="name"
						valueKey="id"
						rules={[{ required: true, message: 'lokasi harus dipilih' }]}
						disabled={router.query.locId && router.query.itemId ? true : false}
					/>
					<InputNumber
						name="qty"
						label="Qty"
						min={0}
						max={maxQty}
						input={{
							disabled: router.query.locId && router.query.itemId ? true : false,
						}}
					/>
					{!router.query.locId && !router.query.itemId && (
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
