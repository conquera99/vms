'use client';

import { useSession } from 'next-auth/react';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppstoreOutline, FolderOutline, PictureOutline, UserOutline } from 'components/general/antd-icon';
import Link from 'next/link';
import Image from "next/image";
import { toast } from 'utils/toast';

import Forbidden from 'components/display/forbidden';
import Footer from 'components/navigation/footer';

const ACTIVE_TEXT_COLOR = 'text-slate-800';
const SW_UPDATE_TOAST_ID = 'sw-update-toast';
const PWA_BANNER_DISMISSED_KEY = 'pwa-install-banner-dismissed';

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;
}

const MenuItem: FC<{
	icon?: ReactNode;
	href: string;
	active?: boolean;
	children?: ReactNode;
	title: string;
	className?: string;
}> = ({ icon, className, title, href, active = false, children }) => {
	return (
		<div
			className={`flex flex-1 items-center group md:h-full md:px-2 ${
				active ? 'md:border-b-2 md:border-slate-100' : ''
			}`}
		>
            <Link
                href={href}
				className={`flex h-full items-center justify-center text-center mx-auto px-2 md:px-4 w-full ${
                    active ? ACTIVE_TEXT_COLOR : 'text-slate-700'
				} group-hover:text-[#6f97bd] transition-all duration-500 md:group-hover:text-[#6f97bd] md:hover:bg-white/55 md:rounded-lg ${className}`}>

				<span className="flex flex-col items-center px-1 py-0.5">
                    {children || (
                        <>
                            <span className="md:hidden">{icon}</span>
							<span className="block text-xs md:text-base md:font-bold">
                                {title}
                            </span>
                        </>
                    )}
                </span>

            </Link>
        </div>
    );
};

export interface NavigationProps {
	title?: string;
	desc?: string;
	image?: string;
	active?: string;
	access?: string;
	children?: ReactNode;
	isSuperAdminOnly?: boolean;
	isAdmin?: boolean;
	hideFooter?: boolean;
}

const Navigation: FC<NavigationProps> = ({
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
	const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
	const [showInstallBanner, setShowInstallBanner] = useState(false);

	useEffect(() => {
		if (status !== 'loading') {
			if (isAdmin === true && status === 'unauthenticated') {
				router.push('/');
			}

			if (typeof access !== 'undefined' && !session?.user?.permissions?.[access as string]) {
				router.push('/');
			}
		}
	}, [isAdmin, status, router, access, session?.user?.permissions]);

	useEffect(() => {
		if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
			return;
		}

		if (process.env.NODE_ENV !== 'production') {
			navigator.serviceWorker
				.getRegistrations()
				.then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
				.catch(() => undefined);

			if ('caches' in window) {
				caches
					.keys()
					.then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
					.catch(() => undefined);
			}

			return;
		}

		let reloaded = false;

		const onControllerChange = () => {
			if (reloaded) {
				return;
			}

			reloaded = true;
			window.location.reload();
		};

		navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

		const askForUpdate = (registration: ServiceWorkerRegistration) => {
			if (!registration.waiting || toast.isActive(SW_UPDATE_TOAST_ID)) {
				return;
			}

			toast.info(
				<div className="flex flex-col gap-2">
					<p className="text-sm">Versi baru aplikasi tersedia.</p>
					<button
						type="button"
						className="self-start rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
						onClick={() => {
							registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
							toast.dismiss(SW_UPDATE_TOAST_ID);
						}}
					>
						Muat Ulang
					</button>
				</div>,
				{
					autoClose: false,
					closeOnClick: false,
					draggable: false,
					toastId: SW_UPDATE_TOAST_ID,
				},
			);
		};

		navigator.serviceWorker
			.register('/vsg-worker.js', { scope: '/' })
			.then((registration) => {
				askForUpdate(registration);

				registration.addEventListener('updatefound', () => {
					const installingWorker = registration.installing;

					if (!installingWorker) {
						return;
					}

					installingWorker.addEventListener('statechange', () => {
						if (
							installingWorker.state === 'installed' &&
							navigator.serviceWorker.controller
						) {
							askForUpdate(registration);
						}
					});
				});
			})
			.catch((error) => {
				console.error('Service worker registration failed', error);
			});

		return () => {
			navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
		};
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const isStandalone =
			window.matchMedia('(display-mode: standalone)').matches ||
			window.matchMedia('(display-mode: fullscreen)').matches ||
			('standalone' in window.navigator &&
				Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone));

		if (isStandalone) {
			setShowInstallBanner(false);
			return;
		}

		const dismissed = window.localStorage.getItem(PWA_BANNER_DISMISSED_KEY) === 'true';

		const onBeforeInstallPrompt = (event: Event) => {
			event.preventDefault();
			setInstallPromptEvent(event as BeforeInstallPromptEvent);

			if (!dismissed) {
				setShowInstallBanner(true);
			}
		};

		const onAppInstalled = () => {
			setInstallPromptEvent(null);
			setShowInstallBanner(false);
			window.localStorage.removeItem(PWA_BANNER_DISMISSED_KEY);
		};

		window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
		window.addEventListener('appinstalled', onAppInstalled);

		return () => {
			window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
			window.removeEventListener('appinstalled', onAppInstalled);
		};
	}, []);

	const onDismissInstallBanner = () => {
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(PWA_BANNER_DISMISSED_KEY, 'true');
		}

		setShowInstallBanner(false);
	};

	const onInstallApp = async () => {
		if (!installPromptEvent) {
			return;
		}

		await installPromptEvent.prompt();
		const choice = await installPromptEvent.userChoice;

		setInstallPromptEvent(null);
		setShowInstallBanner(false);

		if (typeof window === 'undefined') {
			return;
		}

		if (choice.outcome === 'dismissed') {
			window.localStorage.setItem(PWA_BANNER_DISMISSED_KEY, 'true');
			return;
		}

		window.localStorage.removeItem(PWA_BANNER_DISMISSED_KEY);
	};

	if (isSuperAdminOnly && status === 'authenticated' && session?.user?.username !== 'sysadm') {
		return <Forbidden />;
	}

	return (
        <div className="bg-slate-100">
            {showInstallBanner && installPromptEvent && (
				<div className="fixed bottom-24 left-3 right-3 z-40 md:bottom-auto md:left-4 md:right-4 md:top-20">
					<div className="mx-auto flex max-w-5xl items-start justify-between gap-3 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl shadow-slate-400/20 backdrop-blur-md">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
								PWA
							</p>
							<h2 className="mt-1 text-base font-semibold text-slate-800">
								Install VSG app
							</h2>
							<p className="mt-1 text-sm leading-relaxed text-slate-600">
								Pasang aplikasi ini agar bisa dibuka lebih cepat dan dipakai offline.
							</p>
						</div>
						<div className="flex shrink-0 items-center gap-2">
							<button
								type="button"
								onClick={onDismissInstallBanner}
								className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
							>
								Nanti
							</button>
							<button
								type="button"
								onClick={onInstallApp}
								className="rounded-xl border border-[#c8dded] bg-[#edf4fa] px-3 py-2 text-sm font-semibold text-[#486d92] transition hover:bg-[#dcebf7]"
							>
								Install
							</button>
						</div>
					</div>
				</div>
			)}
			<div className="w-full md:pt-16 lg:pt-16 pb-24 md:pb-20 min-h-screen app-content">
				{children}
			</div>
            {hideFooter === false && <Footer active={active} />}
            <div
				className="app-nav fixed bottom-3 left-3 right-3 z-10 h-16 rounded-2xl border border-white/70 px-1 shadow-xl shadow-slate-400/20 backdrop-filter backdrop-blur-md md:top-0 md:bottom-auto md:left-0 md:right-0 md:rounded-none md:border-t-0 md:border-b md:border-white/60 md:px-4 md:shadow-none"
				style={{
					backgroundImage:
						'linear-gradient(110deg, rgba(190,213,231,0.95) 0%, rgba(247,231,193,0.92) 52%, rgba(242,216,161,0.95) 100%)',
				}}
			>
				<div className="flex h-full items-center md:justify-between md:mx-auto md:max-w-5xl xl:max-w-7xl">
					<Link href="/">
						<div className="hidden md:flex items-center hover:cursor-pointer">
							<Image
                                src="/logo.png"
                                width={45}
                                height={45}
                                alt="logo"
								sizes="45px"
                                style={{
                                    maxWidth: "100%",
                                    height: "auto"
                                }} />
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
							active={active === 'paritta'}
							href="/paritta"
							title="Paritta"
							icon={<span className="text-sm">♪</span>}
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
