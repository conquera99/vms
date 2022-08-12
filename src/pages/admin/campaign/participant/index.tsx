import { useCallback, useEffect, useRef, useState } from 'react';
import { CloseOutline, RightOutline, SendOutline } from 'antd-mobile-icons';
import Form from 'rc-field-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import copy from 'clipboard-copy';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Input, { InputNumber, TextArea } from 'components/entry/input';
import Button, { LinkButton } from 'components/general/button';
import { ContainerAdmin } from 'components/general/container';

import { dateFormat, successMessage } from 'utils/constant';
import Empty from 'components/display/empty';
import Select from 'components/entry/select';
import { formatNumber } from 'utils/helper';
import BlurImage from 'components/display/BlurImage';

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Campaign',
		href: '/admin/campaign',
	},
	{
		title: 'Data',
		href: '/admin/campaign',
	},
];

const Page = () => {
	const router = useRouter();
	const [form] = Form.useForm();

	const scrollRef = useRef(null);
	const inputRef = useRef(null);

	const [loading, setLoading] = useState(false);
	const [copyLoading, setCopyLoading] = useState(false);

	const [isEdit, setIsEdit] = useState<null | number>(null);
	const [campaign, setCampaign] = useState<Record<string, any>>({});
	const [total, setTotal] = useState(0);
	const [participant, setParticipant] = useState<Record<string, any>[]>([]);

	const onFinish = (values: any) => {
		setLoading(true);

		if (isEdit !== null) {
			values.seq = isEdit;
		}

		axios
			.post('/api/admin/campaign/participant/save', {
				id: router.query.id || null,
				...values,
			})
			.then((response) => {
				if (response.data.code === 0) {
					toast.success(successMessage);

					form.resetFields();

					loadParticipant();

					setIsEdit(null);
				} else {
					toast.error(response.data.message);
				}
			})
			.finally(() => setLoading(false));
	};

	const copyForWA = () => {
		if (campaign?.desc) {
			setCopyLoading(true);

			let participants = participant.map(
				(item, index) => `${index + 1}. ${item.name} ${item.status === 'F' ? '(L)' : ''}`,
			);

			copy(`${campaign.desc}\n\nPeserta:\n${participants.join('\n')}`);

			toast.info('data copied');

			setCopyLoading(false);
		}
	};

	const onEdit = (item: Record<string, any>) => {
		setIsEdit(item.seq);
		form.setFieldsValue(item);
		(scrollRef?.current as unknown as HTMLDivElement)?.scrollIntoView?.();
		(inputRef?.current as unknown as HTMLDivElement)?.focus?.();
	};

	const onRemove = (seq: number) => {
		axios
			.post('/api/admin/campaign/participant/remove', { id: router.query.id as string, seq })
			.then((response) => {
				if (response.data.code === 0) {
					toast.success(successMessage);
					loadParticipant();
				} else {
					toast.error(response.data.message);
				}
			});
	};

	const loadParticipant = useCallback(() => {
		axios.get(`/api/admin/campaign/participant?id=${router.query.id}`).then((response) => {
			if (response.data.code === 0) {
				setParticipant(response.data.data);
				setTotal(response.data.total);
			}
		});
	}, [router.query.id]);

	useEffect(() => {
		if (router.query.id) {
			axios.get(`/api/admin/campaign?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					if (response.data.data.startDate)
						response.data.data.startDate = dayjs(response.data.data.startDate).format(
							dateFormat,
						);
					if (response.data.data.endDate)
						response.data.data.endDate = dayjs(response.data.data.endDate).format(
							dateFormat,
						);

					setCampaign(response.data.data);
				}
			});

			loadParticipant();
		}
	}, [router.query.id, loadParticipant]);

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

				<div className="p-4 rounded-md shadow-md mb-4 border border-gray-200">
					{campaign.image ? (
						<BlurImage
							src={campaign.image}
							alt={'banner'}
							className="aspect-w-2 aspect-h-1 md:aspect-w-3 md:aspect-h-1"
						/>
					) : null}
					<div className="mb-2">
						<small className="text-gray-500">Judul</small>
						<p>{campaign.title}</p>
					</div>
					<div className="mb-2">
						<small className="text-gray-500">Periode</small>
						<p>
							{campaign.startDate} - {campaign.endDate}
						</p>
					</div>
					<div className="mb-2">
						<small className="text-gray-500">Deskripsi</small>
						<p className="whitespace-pre-line">{campaign.desc}</p>
					</div>
					<div className="mb-2">
						<small className="text-gray-500">Total</small>
						<p className="whitespace-pre-line">{formatNumber(total)}</p>
					</div>

					<div ref={scrollRef} />
					<div>
						<small className="text-gray-500">Opsi</small>
						<div className="mt-1 flex items-center">
							<button
								onClick={copyForWA}
								className="text-sm bg-blue-100 px-2 py-1 rounded-md mr-2"
								disabled={copyLoading}
							>
								Copy untuk WA
							</button>
							<a
								href={`/campaign/${campaign.slug}`}
								target="_blank"
								rel="noreferrer"
								className="flex items-center"
							>
								<SendOutline className="text-xl" />
								&nbsp; Buka Link
							</a>
						</div>
					</div>
				</div>

				<Form
					form={form}
					onFinish={onFinish}
					initialValues={{
						name: '',
						desc: '',
						value: '',
						status: 'P',
					}}
				>
					<Input
						input={{ ref: inputRef }}
						name="name"
						label="Nama"
						required
						rules={[{ required: true, message: 'nama wajib diisi' }]}
					/>
					<InputNumber name="value" label="Nilai" />
					<Input name="group" label="Group/Paket" />
					<TextArea name="desc" label="Deskripsi" />
					<Select
						name="status"
						label="Status"
						options={[
							{ value: 'P', label: 'Pending' },
							{ value: 'H', label: 'Bayar Sebagian' },
							{ value: 'F', label: 'Bayar Full' },
						]}
					/>
					<Button
						type="submit"
						className="w-full"
						buttonType="primary"
						loading={loading}
						icon={<RightOutline />}
						iconLocation="right"
					>
						{isEdit === null ? 'Tambah' : 'Simpan'}
					</Button>
				</Form>

				<div className="mt-4">
					<h2 className="text-lg font-bold mb-2">Perserta</h2>
					{participant.length === 0 && <Empty />}
					{participant.length > 0 &&
						participant.map((item) => (
							<div
								key={`${item.campaignId}-${item.seq}`}
								className="flex items-center justify-between border-b mb-2 py-2 last:border-none"
							>
								<div className="w-5/12 md:w-7/12">
									{item.name}
									<p className="text-sm">{formatNumber(item.value)}</p>
									<div className="text-sm text-gray-400">
										Group/Paket: <b>{item.group || '-'}</b>
									</div>
									<div className="text-sm text-gray-400">
										Catatan: <b>{item.desc || '-'}</b>
									</div>
								</div>
								<div className="text-center w-4/12 md:w-3/12 px-2">
									<p
										className={`text-xs font-bold py-1 px-2 rounded-md ${
											item.status === 'P'
												? 'bg-slate-300'
												: item.status === 'H'
												? 'bg-orange-200'
												: 'bg-green-200'
										}`}
									>
										{item.status === 'P'
											? 'PENDING'
											: item.status === 'H'
											? 'SEBAGIAN'
											: 'FULL'}
									</p>
								</div>
								<div className="w-3/12 md:w-2/12 text-right">
									<button
										className="text-blue-500 mr-3"
										onClick={() => onEdit(item)}
									>
										edit
									</button>
									<button
										className="text-red-500"
										onClick={() => onRemove(item.seq)}
									>
										hapus
									</button>
								</div>
							</div>
						))}
				</div>
			</ContainerAdmin>
		</Navigation>
	);
};

export default Page;
