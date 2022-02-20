import { useSession } from 'next-auth/react';
import { FC, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
					className={`flex items-end justify-center text-center mx-auto px-2 md:px-4 pt-1 w-full ${
						active ? ACTIVE_TEXT_COLOR : 'text-gray-400'
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

const Navigation: FC<BaseNavInterface> = ({ title, desc, active, children, isAdmin }) => {
	const router = useRouter();
	const { status } = useSession();

	useEffect(() => {
		if (isAdmin === true && router.isReady && status === 'unauthenticated') {
			router.push('/');
		}
	}, [isAdmin, status, router, router.isReady]);

	return (
		<div className="bg-white">
			<PageHead title={title} desc={desc} />

			<div className="px-4 pt-16 pb-20 min-h-screen">{children}</div>

			<div className="bottom-0 bg-white/60 backdrop-filter backdrop-blur-md rounded-lg right-0 left-0 py-1 md:py-2 fixed md:px-7">
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
