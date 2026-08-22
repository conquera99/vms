import Link from 'next/link';

export default function NotFound() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
			<p className="text-5xl font-semibold text-slate-700">404</p>
			<p className="text-slate-500">Halaman tidak ditemukan</p>
			<Link
				href="/"
				className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-[#7ea7cb] px-6 text-sm font-medium text-white transition-colors hover:bg-[#6b96bf]"
			>
				Kembali ke Beranda
			</Link>
		</main>
	);
}
