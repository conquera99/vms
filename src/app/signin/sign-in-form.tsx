'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Form } from 'antd';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import Input from 'components/entry/input';
import Button from 'components/general/button';
import { RightOutline } from 'components/general/antd-icon';

const SignInForm = () => {
	const searchParams = useSearchParams();
	const errorParam = searchParams?.get('error');
	const [form] = Form.useForm();

	const [loading, setLoading] = useState(false);

	const onFinish = (values: any) => {
		setLoading(true);
		signIn('credentials', { username: values.username, password: values.password }).finally(() =>
			setLoading(false),
		);
	};

	const errorMessage = typeof errorParam === 'string' ? errorParam.replace(/_/g, ' ') : '';

	return (
		<div className="relative min-h-screen overflow-hidden py-10 sm:px-6 lg:px-8">
			<div className="pointer-events-none absolute -right-20 -top-8 h-52 w-52 rounded-full bg-[#f3deb1]/45 blur-3xl sm:h-72 sm:w-72" />
			<div className="pointer-events-none absolute -left-20 bottom-6 h-48 w-48 rounded-full bg-[#c8dded]/55 blur-3xl sm:h-64 sm:w-64" />

			<div className="relative mx-auto w-full max-w-md">
				<div className="mb-5 text-center sm:mb-6">
					<Link href="/">
						<Image
							className="mx-auto"
							src="/logo.png"
							alt="Vsg-Logo"
							width={82}
							height={82}
							sizes="82px"
							style={{
								maxWidth: '100%',
								height: 'auto',
							}}
						/>
					</Link>
				</div>

				<div className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 p-5 shadow-xl shadow-slate-200/35 backdrop-blur-sm sm:p-7">
					<div className="mb-5 sm:mb-6">
						<p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
							Account
						</p>
						<h1 className="text-2xl font-semibold leading-tight text-slate-800 sm:text-3xl">
							Sign In
						</h1>
						<p className="mt-2 text-sm leading-relaxed text-slate-600">
							Masuk dengan akun yang sudah terdaftar untuk melanjutkan.
						</p>
					</div>

					<Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ username: '', password: '' }}>
						<Input name="username" label="Username" input={{ autoComplete: 'username' }} />
						<Input
							name="password"
							type="password"
							label="Password"
							input={{ autoComplete: 'current-password' }}
						/>

						<div className="p-2">
							{errorMessage ? (
								<p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-500">
									{errorMessage}
								</p>
							) : null}
						</div>

						<Button
							icon={<RightOutline />}
							iconLocation="right"
							buttonType="primary"
							className="w-full"
							type="submit"
							loading={loading}
						>
							Masuk
						</Button>

						<Link
							href="/"
							className="mt-3 block text-center text-sm font-medium text-[#5d84a9] transition hover:text-[#486d92]"
						>
							Kembali
						</Link>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default SignInForm;
