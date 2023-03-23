import { useSession } from 'next-auth/react';
import { FC, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppstoreOutline, FolderOutline, PictureOutline, UserOutline } from 'antd-mobile-icons';
import { FaFacebook, FaYoutube, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { Workbox } from 'workbox-window';
import Link from 'next/link';
import Image from 'next/image';

import type { UrlObject } from 'url';

import BaseNavInterface from 'interfaces/navigation';

import PageHead from 'components/general/page-head';
import Forbidden from 'components/display/forbidden';

const ACTIVE_TEXT_COLOR = 'text-slate-100';
const ACTIVE_TEXT_COLOR_FOOTER = 'text-amber-500';

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
			<Link href={href}>
				<a
					className={`flex items-end md:items-center justify-center text-center mx-auto px-2 md:px-4 pt-1 w-full ${
						active ? ACTIVE_TEXT_COLOR : 'text-slate-700'
					} group-hover:text-amber-500 transition-all duration-500 md:group-hover:text-amber-500 md:hover:bg-zinc-200 md:rounded-lg ${className}`}
				>
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
				</a>
			</Link>
		</div>
	);
};

const MenuItemFooter: FC<{
	href: string | UrlObject;
	active?: boolean;
	children?: ReactNode;
	title: string;
	className?: string;
}> = ({ className, title, href, active = false, children }) => {
	return (
		<div>
			<Link href={href}>
				{children || (
					<a
						className={`${
							active ? ACTIVE_TEXT_COLOR_FOOTER : 'text-gray-600'
						} hover:text-amber-500`}
					>
						{title}
					</a>
				)}
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
		if (
			typeof window !== 'undefined' &&
			'serviceWorker' in navigator
			// window.workbox !== undefined
		) {
			// const wb = window.workbox;
			const wb = new Workbox('/vsg-worker.js');

			// add event listeners to handle any of PWA lifecycle event
			// https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
			wb.addEventListener('installed', (_event: any) => {
				// console.log(`Event ${event.type} is triggered.`);
				// console.log(event);
			});

			wb.addEventListener('controlling', (_event: any) => {
				// console.log(`Event ${event.type} is triggered.`);
				// console.log(event);
			});

			wb.addEventListener('activated', (_event: any) => {
				// console.log(`Event ${event.type} is triggered.`);
				// console.log(event);
			});

			// A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
			// NOTE: MUST set skipWaiting to false in next.config.js pwa object
			// https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
			const promptNewVersionAvailable = (_event: any) => {
				// `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
				// When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
				// You may want to customize the UI prompt accordingly.
				if (confirm('A newer version of this web app is available, reload to update?')) {
					wb.addEventListener('controlling', (_event: any) => {
						window.location.reload();
					});

					// Send a message to the waiting service worker, instructing it to activate.
					wb.messageSW({ type: 'SKIP_WAITING' });
				} else {
					// console.log(
					//     'User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time.',
					// );
				}
			};

			wb.addEventListener('waiting', promptNewVersionAvailable);
			// wb.addEventListener('externalwaiting', promptNewVersionAvailable);

			// ISSUE - this is not working as expected, why?
			// I could only make message event listenser work when I manually add this listenser into sw.js file
			wb.addEventListener('message', (_event: any) => {
				// console.log(`Event ${event.type} is triggered.`);
				// console.log(event);
			});

			/*
                wb.addEventListener('redundant', event => {
                    console.log(`Event ${event.type} is triggered.`)
                    console.log(event)
                })
                wb.addEventListener('externalinstalled', event => {
                    console.log(`Event ${event.type} is triggered.`)
                    console.log(event)
                })
                wb.addEventListener('externalactivated', event => {
                    console.log(`Event ${event.type} is triggered.`)
                    console.log(event)
                })
            */

			// never forget to call register as auto register is turned off in next.config.js
			wb.register();
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
			<footer className="text-gray-600 body-font pb-16 md:pb-0">
				<div className="container px-12 py-12 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col border-t-2 border-amber-500">
					<div className="flex-shrink-0 md:mx-0 mx-auto text-center md:text-left lg:w-1/3 md:w-1/2 w-full px-4">
						<a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
							<Link href="/">
								<div className="hidden md:flex items-center hover:cursor-pointer">
									<Image src="/logo.png" width={60} height={60} alt="logo" />
									<h1 className="ml-2 font-bold text-2xl">VSG</h1>
								</div>
							</Link>
						</a>
					</div>
					<div className="lg:w-1/3 md:w-full w-full px-4">
						<h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
							MENU
						</h2>
						<nav className="list-none mb-10">
							<MenuItemFooter active={active === 'home'} href="/" title="Beranda" />
							<MenuItemFooter
								active={active === 'gallery'}
								href="/gallery"
								title="Galeri"
							/>
						</nav>
					</div>
					<div className="lg:w-1/3 md:w-full w-full px-4">
						<h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
							Kontak Kami
						</h2>
						<div className="list-none mb-10">
							<p className="text-gray-600 hover:text-gray-800">Alamat</p>
							<p className="text-gray-600 hover:text-gray-800">
								Jl. Cut Nyak Dien RT. 15, Kel. Nunukan Tengah
								<br />
								Kab. Nunukan, Kalimantan Utara
							</p>
							<br />
							<p className="text-gray-600 hover:text-gray-800">Email</p>
							<p className="text-gray-600 hover:text-gray-800">vsg@gmail.com</p>
						</div>
					</div>
				</div>
				<div className="bg-amber-500">
					<div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
						<p className="text-zinc-100 text-sm text-center sm:text-left">
							© 2022 Benny —
							<a
								href="https://twitter.com"
								rel="noopener noreferrer"
								className="text-zinc-100 ml-1"
								target="_blank"
							>
								@conquera99
							</a>
						</p>
						<span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
							<a
								href="https://www.facebook.com/vsg.nunukan"
								rel="noopener noreferrer"
								className="text-zinc-100 ml-3"
								target="_blank"
							>
								<FaFacebook />
							</a>
							<a
								href="https://www.youtube.com/@vsg.nunukan"
								rel="noopener noreferrer"
								className="text-zinc-100 ml-3"
								target="_blank"
							>
								<FaYoutube />
							</a>
							<a
								href="https://www.instagram.com/vsg.nunukan/"
								rel="noopener noreferrer"
								className="text-zinc-100 ml-3"
								target="_blank"
							>
								<FaInstagram />
							</a>
							<a
								href="#"
								rel="noopener noreferrer"
								className="text-zinc-100 ml-3"
								target="_blank"
							>
								<FaWhatsapp />
							</a>
						</span>
					</div>
				</div>
			</footer>

			<div className="app-nav md:top-0 md:bottom-auto md:border-b md:px-4 z-10 h-16 bottom-0 border-t bg-amber-500 md:bg-amber-500/80  backdrop-filter backdrop-blur-md right-0 left-0 py-1 fixed">
				<div className="flex h-full md:justify-between md:mx-auto md:max-w-5xl xl:max-w-7xl">
					<Link href="/">
						<div className="hidden md:flex items-center hover:cursor-pointer">
							<Image src="/logo.png" width={45} height={45} alt="logo" />
							<h1 className="ml-2 font-bold text-xl">VSG</h1>
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
