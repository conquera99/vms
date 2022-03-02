import { useEffect, useState } from 'react';
import { CloseOutline, RightOutline } from 'antd-mobile-icons';
import Form from 'rc-field-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Descendant } from 'slate';

import Title from 'components/display/title';
import Navigation from 'components/navigation';
import Breadcrumb from 'components/display/breadcrumb';
import Input from 'components/entry/input';
import Button, { LinkButton } from 'components/general/button';
import Upload from 'components/entry/upload';

import { successMessage } from 'utils/constant';
import Select from 'components/entry/select';

const TextEditor = dynamic(() => import('components/entry/text-editor'), { ssr: false });

const breadcrumb = [
	{
		title: 'Admin',
		href: '/admin',
	},
	{
		title: 'Post',
		href: '/admin/post',
	},
];

const slateInitValues: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];

const Page = () => {
	const router = useRouter();
	const [form] = Form.useForm();

	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [image, setImage] = useState<string | undefined>(undefined);

	// text editor
	const [value, setValue] = useState<Descendant[]>(slateInitValues);

	const removeImage = () => setFile(null);

	const beforeUpload = (file: File) => {
		setFile(file);
		const img = URL.createObjectURL(file);
		setImage(img);
		return false;
	};

	const onTextEditorChange = (newValue: Descendant[]) => {
		console.log(newValue);
		setValue(newValue);
	};

	const onFinish = (values: any) => {
		setLoading(true);

		const formData = new FormData();

		if (router.query.id) formData.append('id', router.query.id as string);

		formData.append('title', values.title);
		formData.append('summary', values.summary);
		formData.append('keywords', values.keywords);
		formData.append('status', values.status);
		formData.append('content', JSON.stringify(value));

		if (file) {
			formData.append('img', file);
		}

		axios
			.post('/api/admin/post/save', formData)
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
			axios.get(`/api/admin/post?id=${router.query.id}`).then((response) => {
				if (response.data.code === 0) {
					if (response.data.data.content) {
						response.data.data.content = JSON.parse(response.data.data.content);
						setValue(response.data.data.content);
						console.log(response.data.data.content);
					}

					if (response.data.data.image) {
						setImage(response.data.data.image);
					}

					form.setFieldsValue(response.data.data);
				}
			});
		}
	}, [router.query.id, form]);

	return (
		<Navigation title="VMS: Post Detail" active="admin" access="post" isAdmin>
			<Head>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
				/>
			</Head>
			<Title>
				<div className="flex justify-between items-center">
					<Breadcrumb data={breadcrumb} />
					<LinkButton
						href="/admin/post"
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
				initialValues={{ title: '', summary: '', keywords: '', status: 'D', content: '' }}
			>
				<Input
					name="title"
					label="Judul"
					required
					rules={[{ required: true, message: 'judul wajib diisi' }]}
				/>
				<Input name="summary" label="Deskripsi Singkat" />
				<Input name="keywords" label="Kata Kunci" />
				<Select
					name="status"
					label="Status"
					options={[
						{ label: 'Draft', value: 'D' },
						{ label: 'Terpublikasi', value: 'P' },
						{ label: 'Tersembunyi', value: 'H' },
					]}
					labelKey="label"
					valueKey="value"
				/>
				<TextEditor value={value} onChange={onTextEditorChange} />
				<Upload
					file={file}
					image={image}
					showPreview={router.query.id ? true : false}
					onRemoveImage={removeImage}
					beforeUpload={beforeUpload}
				/>
				<div className="h-8 md:h-12">&nbsp;</div>
				<Button
					type="submit"
					className="fixed bottom-16 md:bottom-20 left-2 right-2 shadow-md"
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
