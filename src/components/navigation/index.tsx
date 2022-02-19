import { useSession } from 'next-auth/react';
import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { AppstoreOutline, FolderOutline, PictureOutline, UserOutline } from 'antd-mobile-icons';

import type { UrlObject } from 'url';
import BaseNavInterface from 'interfaces/navigation';

import PageHead from 'components/general/page-head';

const ACTIVE_TEXT_COLOR = 'text-indigo-500';

const MenuItem: FC<{
	icon?: ReactNode;
	href: string | UrlObject;
	active?: boolean;
	title: string;
}> = ({ icon, title, href, active = false, children }) => {
	return (
		<div className="flex-1 group">
			<Link href={href}>
				<a
					className={`flex items-end justify-center text-center mx-auto px-2 md:px-4 pt-1 w-full text-gray-400 ${
						active ? ACTIVE_TEXT_COLOR : ''
					} group-hover:text-indigo-500`}
				>
					<span className="px-1 pt-1 pb-1 flex flex-col items-center">
						{children || (
							<>
								{icon}
								<span className="block text-xs pb-1">{title}</span>
							</>
						)}
					</span>
				</a>
			</Link>
		</div>
	);
};

const Navigation: FC<BaseNavInterface> = ({ title, desc, active, children }) => {
	const { status } = useSession();

	return (
		<div>
			<PageHead title={title} desc={desc} />

			<div className="px-4 pt-16 pb-20 min-h-screen">{children}</div>

			<div className="bottom-2 shadow-md mx-2 rounded-lg right-0 left-0 fixed md:px-7 bg-white">
				<div className="flex">
					<MenuItem
						active={active === 'home'}
						href="/"
						title="Beranda"
						icon={<AppstoreOutline />}
					/>
					<MenuItem
						active={active === 'gallery'}
						href="/gallery"
						title="Galeri"
						icon={<PictureOutline />}
					/>
					{status === 'authenticated' && (
						<MenuItem
							active={active === 'admin'}
							href="/admin"
							title="Admin"
							icon={<FolderOutline />}
						/>
					)}
					<MenuItem
						active={active === 'account'}
						href={status === 'authenticated' ? '/profile' : '/signin'}
						title={status === 'authenticated' ? 'Akun' : 'Masuk'}
						icon={<UserOutline />}
					/>
				</div>
			</div>
		</div>
	);
};

export default Navigation;
