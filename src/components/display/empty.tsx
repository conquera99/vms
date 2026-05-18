import Image from "next/image";
import { FC, ReactNode } from 'react';

const Empty: FC<{ desc?: string; title?: string; action?: ReactNode }> = ({
	desc,
	title,
	action,
}) => {
	return (
		<div className="mt-6 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-amber-50 p-6 shadow-sm md:p-8">
			<div className="text-center">
				<div className="mx-auto mb-4 w-fit rounded-2xl bg-white p-2 shadow-sm">
						<Image
                            src="/images/empty.svg"
							width="250"
							height="150"
                            alt="empty-icon"
                            style={{
                                maxWidth: "100%",
                                height: "auto"
                            }} />
				</div>
				<p className="mb-2 text-center text-2xl font-semibold text-slate-800">
					{title || 'Tidak ada data'}
				</p>
				<p className="mx-auto mb-8 text-center text-sm text-slate-500 md:text-base">
					{desc || 'Tambah data terlebih dahulu agar daftar dapat ditampilkan.'}
				</p>
				{action && <div className="flex justify-center">{action}</div>}
			</div>
		</div>
    );
};

export default Empty;
