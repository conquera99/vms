import { FC } from 'react';
import { signOut, useSession } from 'next-auth/react';

import Navigation from 'components/navigation';
import Title from 'components/display/title';
import Button from 'components/general/button';
import { LeftOutline } from 'antd-mobile-icons';

const Desc: FC<{ label: string; value?: string }> = ({ label, children, value }) => {
	return (
		<div className="mb-4">
			<span className="text-gray-500">{label}</span>
			<p className="font-bold text-lg">{children || value}</p>
		</div>
	);
};

const Profile = () => {
	const { data: session } = useSession();

	const onSignOut = () => signOut({ redirect: true, callbackUrl: '/' });

	return (
		<Navigation active="account">
			<Title>Profile</Title>

			<div className="bg-blue-50 p-6 rounded-lg mb-4">
				<Desc label="Name">{session?.user?.name}</Desc>
				<Desc label="Username">{session?.user?.username || '-'}</Desc>
				<Desc label="Email">{session?.user?.email || '-'}</Desc>
			</div>

			<Button
				icon={<LeftOutline />}
				buttonType="danger"
				className="w-full"
				onClick={onSignOut}
			>
				Sign Out
			</Button>
		</Navigation>
	);
};

export default Profile;
