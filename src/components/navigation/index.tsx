import { useSession } from 'next-auth/react';
import { FC, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AppstoreOutline, FolderOutline, PictureOutline, UserOutline } from 'antd-mobile-icons';
import { Workbox } from 'workbox-window';

import type { UrlObject } from 'url';

import BaseNavInterface from 'interfaces/navigation';

import PageHead from 'components/general/page-head';
import Forbidden from 'components/display/forbidden';

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

const Navigation: FC<BaseNavInterface> = ({
	title,
	desc,
	active,
	access,
	children,
	isSuperAdminOnly,
	isAdmin,
}) => {
	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
		if (isAdmin === true && router.isReady && status === 'unauthenticated') {
			router.push('/');
		}

		if (typeof access !== 'undefined' && !session?.user?.permissions?.[access as string]) {
			router.push('/');
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

	if (isSuperAdminOnly && status === 'authenticated' && session.user.username !== 'sysadm') {
		return <Forbidden />;
	}

	return (
		<div className="bg-white">
			<PageHead title={title} desc={desc} />

			<div className="px-4 pt-16 pb-20 min-h-screen">{children}</div>

			<div className="bottom-0 border-t bg-white/50 backdrop-filter backdrop-blur-md right-0 left-0 py-1 md:py-2 fixed md:px-7">
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
						title={
							status === 'authenticated'
								? session.user.name?.substring(0, 10) || 'Akun'
								: 'Masuk'
						}
						icon={<UserOutline />}
					/>
				</div>
			</div>
		</div>
	);
};

export default Navigation;
