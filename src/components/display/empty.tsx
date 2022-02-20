import Image from 'next/image';

const Empty = () => {
	return (
		<div className="rounded-lg bg-slate-100">
			<div className="text-center px-6 py-4">
				<div className="py-8">
					<div className="mb-4">
						<Image src="/images/empty.svg" width="250" height="150" alt="empty-icon" />
					</div>
					<p className="text-2xl text-gray-800 font-medium mb-2">Tidak ada data</p>
					<p className="text-gray-500 max-w-xs mx-auto mb-6">
						tambah data terlebih dahulu agar data dapat ditampilkan
					</p>
				</div>
			</div>
		</div>
	);
};

export default Empty;
