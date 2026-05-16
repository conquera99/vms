import { useSession } from 'next-auth/react';
import { FC, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppstoreOutline, FolderOutline, PictureOutline, UserOutline } from 'antd-mobile-icons';
import Link from 'next/link';
import Image from 'next/image';

import type { UrlObject } from 'url';

import BaseNavInterface from 'interfaces/navigation';

import PageHead from 'components/general/page-head';
import Forbidden from 'components/display/forbidden';
import Footer from 'components/navigation/footer';

const ACTIVE_TEXT_COLOR = 'text-slate-800';

const MenuItem: FC<{
	icon?: ReactNode;
	href: string | UrlObject;
	active?: boolean;
	children?: ReactNode;
	title: string;
	className?: string;
}> = ({ icon, className, title, href, active = false, children }) => {
	return (
        <div
			className={`flex-1 group md:items-center md:flex md:h-full md:px-2 ${
				active ? 'md:border-b-2 md:border-slate-100' : ''
			}`}
		>
            <Link
                href={href}
				className={`flex items-end md:items-center justify-center text-center mx-auto px-2 md:px-4 pt-1 w-full ${
                    active ? ACTIVE_TEXT_COLOR : 'text-slate-700'
				} group-hover:text-[#6f97bd] transition-all duration-500 md:group-hover:text-[#6f97bd] md:hover:bg-white/55 md:rounded-lg ${className}`}>

                <span className="px-1 pt-1 pb-1 flex flex-col items-center">
                    {children || (
                        <>
                            <span className="md:hidden">{icon}</span>
                            <span className="block text-xs md:text-base md:font-bold pb-1">
                                {title}
                            </span>
                        </>
                    )}
                </span>

            </Link>
        </div>
    );
};

const Navigation: FC<BaseNavInterface> = ({
	title,
	desc,
	image,
	active,
	access,
	children,
	isSuperAdminOnly,
	isAdmin,
	hideFooter = true,
}) => {
	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status !== 'loading') {
			console.log('-----');
			console.log('isAdmin', isAdmin);
			console.log('router:isReady', router.isReady);
			console.log('access', access);
			console.log('auth:status', status);
			console.log('auth:session', session?.user?.permissions);

			if (isAdmin === true && router.isReady && status === 'unauthenticated') {
				router.push('/');
			}

			if (typeof access !== 'undefined' && !session?.user?.permissions?.[access as string]) {
				router.push('/');
			}
		}
	}, [isAdmin, status, router, access, session?.user?.permissions, router.isReady]);

	// This hook only run once in browser after the component is rendered for the first time.
	// It has same effect as the old componentDidMount lifecycle callback.
	useEffect(() => {
		if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
			navigator.serviceWorker.register('/vsg-worker.js', { scope: '/' }).catch((error) => {
				console.error('Service worker registration failed', error);
			});
		}
	}, []);

	if (isSuperAdminOnly && status === 'authenticated' && session?.user?.username !== 'sysadm') {
		return <Forbidden />;
	}

	return (
		<div className="bg-slate-100">
			<PageHead title={title} desc={desc} image={image} />

			{/* <div className="hidden md:block md:h-16">&nbsp;</div> */}

			<div className="w-full md:pt-16 lg:pt-16 pb-20 min-h-screen app-content">
				{children}
			</div>

			{hideFooter === false && <Footer active={active} />}

			<div
				className="app-nav md:top-0 md:bottom-auto md:border-b md:px-4 z-10 h-16 bottom-0 border-t border-white/60 backdrop-filter backdrop-blur-md right-0 left-0 py-1 fixed"
				style={{
					backgroundImage:
						'linear-gradient(110deg, rgba(190,213,231,0.95) 0%, rgba(247,231,193,0.92) 52%, rgba(242,216,161,0.95) 100%)',
				}}
			>
				<div className="flex h-full md:justify-between md:mx-auto md:max-w-5xl xl:max-w-7xl">
					<Link href="/">
						<div className="hidden md:flex items-center hover:cursor-pointer">
							<Image src="/logo.png" width={45} height={45} alt="logo" />
							<h1 className="ml-2 font-bold text-xl text-slate-800">VSG</h1>
						</div>
					</Link>

					<div className="flex w-full md:w-auto">
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
							className={status === 'authenticated' ? 'md:w-36' : ''}
							title={
								status === 'authenticated'
									? session?.user?.name?.substring(0, 10) || 'Akun'
									: 'Masuk'
							}
							icon={<UserOutline />}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navigation;
