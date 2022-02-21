import Image from 'next/image';
import Link from 'next/link';

const Forbidden = () => {
	return (
		<div className="rounded-lg bg-slate-100 h-screen">
			<div className="text-center px-6 py-4">
				<div className="py-8">
					<div className="mb-4">
						<Image
							src="/images/forbidden.svg"
							width="250"
							height="150"
							alt="forbidden-icon"
						/>
					</div>
					<p className="text-2xl text-gray-800 font-medium mb-2">Tidak ada akses</p>
					<p className="text-gray-500 max-w-xs mx-auto mb-6">
						anda tidak memiliki akses untuk melihat halaman/data ini
					</p>

					<Link href="/">
						<a className="text-blue-500">Kembali ke Beranda</a>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Forbidden;
