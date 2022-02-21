import type { GetServerSidePropsContext, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getSession, getCsrfToken, signIn } from 'next-auth/react';
import Form from 'rc-field-form';
import { useRouter } from 'next/router';

import PageHead from 'components/general/page-head';
import Input from 'components/entry/input';
import Button from 'components/general/button';
import { RightOutline } from 'antd-mobile-icons';
import { useState } from 'react';

const SignIn: NextPage<{ csrfToken: string | undefined }> = ({ csrfToken }) => {
	const router = useRouter();
	const [form] = Form.useForm();

	const [loading, setLoading] = useState(false);

	const onFinish = (values: any) => {
		setLoading(true);
		signIn('credentials', { username: values.username, password: values.password }).finally(
			() => setLoading(false),
		);
	};

	return (
		<div>
			<div className="min-h-screen  flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				<PageHead title="Sign In" />
				<div className="sm:mx-auto sm:w-full sm:max-w-md text-center py-4">
					<Link href="/">
						<a>
							<Image
								className="h-16 mx-auto"
								src="/logo.png"
								alt="Vsg-Logo"
								width={100}
								height={100}
							/>
						</a>
					</Link>
				</div>
				<div className="flex flex-col justify-center sm:px-6 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
						<h1 className="text-xl font-bold leading-7 text-indigo-500 sm:leading-9 sm:truncate">
							Sign In
						</h1>
						<h2>Sign in with an existing account, or create new account.</h2>
					</div>
					<div className="mt-1 sm:mx-auto sm:w-full sm:max-w-md">
						<div className="py-8 px-4 mx-2 rounded-sm sm:px-10">
							<Form
								form={form}
								onFinish={onFinish}
								initialValues={{ username: '', password: '', csrfToken }}
							>
								<Input name="csrfToken" type="hidden" />
								<Input name="username" label="Username" />
								<Input name="password" type="password" label="Password" />
								<span className="text-red-400">{router.query.error}</span>
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
								<Link href="/">
									<a className="block mt-2 text-sm text-blue-400 text-center">
										Kembali
									</a>
								</Link>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getSession(context);

	console.log('client-session', session);

	if (session) {
		return { redirect: { permanent: false, destination: '/' } };
	}

	const csrfToken = await getCsrfToken({ req: context.req });

	return {
		props: { csrfToken },
	};
}

export default SignIn;
