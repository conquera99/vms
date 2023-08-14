import Image from 'next/image';
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { UrlObject } from 'url';
import { FaFacebook, FaYoutube, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const ACTIVE_TEXT_COLOR_FOOTER = 'text-amber-500';

const MenuItemFooter: FC<{
	href: string | UrlObject;
	active?: boolean;
	children?: ReactNode;
	title: string;
}> = ({ title, href, active = false, children }) => {
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

const Footer: FC<{ active?: string }> = ({ active }) => {
	return (
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
	);
};

export default Footer;
