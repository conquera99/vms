import { FC } from 'react';
import { signOut, useSession } from 'next-auth/react';

import Navigation from 'components/navigation';
import Title from 'components/display/title';

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
				<Desc label="Email">{session?.user?.email}</Desc>
			</div>

			<button
				className="py-2 text-center bg-red-400 w-full text-white rounded-md"
				onClick={onSignOut}
			>
				Sign Out
			</button>
		</Navigation>
	);
};

export default Profile;
