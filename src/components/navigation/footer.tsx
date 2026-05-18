import Image from "next/image";
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { UrlObject } from 'url';
import { FaFacebook, FaYoutube, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const ACTIVE_TEXT_COLOR_FOOTER = 'text-slate-900';

const MenuItemFooter: FC<{
	href: string | UrlObject;
	active?: boolean;
	children?: ReactNode;
	title: string;
}> = ({ title, href, active = false, children }) => {
	return (
		<div>
			<Link
				href={href}
				className={
					children
						? ''
						: `${
								active ? ACTIVE_TEXT_COLOR_FOOTER : 'text-slate-600'
							} hover:text-[#6f97bd]`
				}
			>
				{children || title}
			</Link>
		</div>
	);
};

const Footer: FC<{ active?: string }> = ({ active }) => {
	const socialLinks = [
		{
			href: 'https://www.facebook.com/vsg.nunukan',
			label: 'Facebook',
			icon: <FaFacebook />,
		},
		{
			href: 'https://www.youtube.com/@vsg.nunukan',
			label: 'YouTube',
			icon: <FaYoutube />,
		},
		{
			href: 'https://www.instagram.com/vsg.nunukan/',
			label: 'Instagram',
			icon: <FaInstagram />,
		},
		{
			href: '#',
			label: 'WhatsApp',
			icon: <FaWhatsapp />,
		},
	];

	return (
        <footer className="pb-16 text-slate-600 md:pb-0">
            <div className="mx-auto mt-12 max-w-5xl px-4 pb-8 pt-10 xl:max-w-7xl">
				<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/85 shadow-xl shadow-slate-200/35 backdrop-blur-sm">
					<div className="pointer-events-none h-1.5 w-full bg-linear-to-r from-[#c8dded]/90 via-[#f4e3bd]/85 to-[#d7e6f2]/90" />
					<div className="grid gap-8 px-5 py-8 sm:px-8 sm:py-10 md:grid-cols-3 md:gap-6 lg:px-12">
						<div className="text-center md:text-left">
					<Link
						href="/"
						className="inline-flex items-center justify-center font-semibold text-slate-900 md:justify-start"
					>
						<div className="flex items-center">
							<Image
                                src="/logo.png"
                                width={60}
                                height={60}
                                alt="logo"
								sizes="60px"
                                style={{
                                    maxWidth: "100%",
                                    height: "auto"
                                }} />
							<h1 className="ml-2 text-2xl font-bold">VSG</h1>
						</div>
					</Link>
							<p className="mt-3 text-sm leading-relaxed text-slate-500">
								Vihara Sasana Graha, Nunukan
							</p>
						</div>

						<div>
							<h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
								Menu
							</h2>
							<nav className="space-y-2 text-sm font-medium">
								<MenuItemFooter active={active === 'home'} href="/" title="Beranda" />
								<MenuItemFooter
									active={active === 'gallery'}
									href="/gallery"
									title="Galeri"
								/>
							</nav>
						</div>

						<div>
							<h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
								Kontak
							</h2>
							<p className="text-sm leading-relaxed text-slate-600">
							Jl. Cut Nyak Dien RT. 15, Kel. Nunukan Tengah
								<br />
								Kab. Nunukan, Kalimantan Utara
							</p>
							<p className="mt-3 text-sm text-slate-600">vsg@gmail.com</p>
							<div className="mt-4 flex flex-wrap items-center gap-2">
								{socialLinks.map((item) => (
									<a
										key={item.label}
										href={item.href}
										rel="noopener noreferrer"
										target="_blank"
										aria-label={item.label}
										className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition duration-300 hover:border-[#c8dded] hover:bg-[#edf4fa] hover:text-[#6f97bd]"
									>
										{item.icon}
									</a>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="border-t border-slate-200 px-5 py-4 sm:px-8 lg:px-12">
					<p className="text-center text-xs text-slate-500 sm:text-left">
						© 2026 VSG. All rights reserved.
					</p>
				</div>
			</div>
        </footer>
    );
};

export default Footer;
