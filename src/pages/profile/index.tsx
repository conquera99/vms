import { FC, ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { LeftOutline, MailOutline, UserContactOutline } from 'antd-mobile-icons';

import Navigation from 'components/navigation';
import Button from 'components/general/button';
import Container from 'components/general/container';

const Desc: FC<{ label: string; value?: string; children?: ReactNode }> = ({
	label,
	children,
	value,
}) => {
	return (
		<div className="mb-4">
			<span className="text-gray-500">{label}</span>
			<p className="font-bold text-lg">{children || value}</p>
		</div>
	);
};

const Profile = () => {
	const { data: session } = useSession();
	const profileName = session?.user?.name || 'Pengguna VMS';
	const username = session?.user?.username || '-';
	const email = session?.user?.email || '-';

	const onSignOut = () => signOut({ redirect: true, callbackUrl: '/' });

	return (
		<Navigation title="VMS: Profile" active="account" hideFooter={false}>
			<Container>
				<div className="mt-6 overflow-hidden rounded-[2rem] border border-sky-200/80 bg-linear-to-br from-sky-50 via-white to-cyan-50 shadow-sm">
					<div className="flex flex-col gap-6 p-6 md:p-7 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
							<div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
								<UserContactOutline />
								Akun Saya
							</div>
							<h1 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
								{profileName}
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
								Lihat identitas akun yang sedang aktif dan keluar dari sesi dengan cepat saat
								perlu berpindah pengguna.
							</p>
						</div>
						<div className="grid grid-cols-2 gap-3 sm:min-w-72">
							<div className="rounded-2xl border border-sky-200 bg-white/90 px-4 py-3 shadow-sm">
								<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
									Username
								</p>
								<p className="mt-2 text-lg font-black text-slate-800">{username}</p>
							</div>
							<div className="rounded-2xl border border-sky-200 bg-white/90 px-4 py-3 shadow-sm">
								<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
									Status
								</p>
								<p className="mt-2 text-lg font-black text-slate-800">Aktif</p>
							</div>
						</div>
					</div>
				</div>


				<div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
					<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
						<div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
							<div>
								<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600">
									Informasi Profil
								</p>
								<h2 className="mt-2 text-xl font-bold text-slate-800">Detail Akun</h2>
								<p className="mt-1 text-sm text-slate-500">
									Data berikut diambil dari sesi akun yang sedang digunakan.
								</p>
							</div>
							<div className="rounded-2xl bg-sky-50 px-4 py-3 text-right">
								<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
									Sesi
								</p>
								<p className="mt-1 text-sm font-bold text-slate-800">Masih masuk</p>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
								<Desc label="Name">{profileName}</Desc>
							</div>
							<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
								<Desc label="Username">{username}</Desc>
							</div>
							<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 md:col-span-2">
								<Desc label="Email">{email}</Desc>
							</div>
						</div>
					</div>

					<aside className="space-y-5">
						<div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
								Akses Cepat
							</p>
							<div className="mt-4 space-y-3">
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
									<p className="flex items-center gap-2 text-xs text-slate-500">
										<UserContactOutline />
										Akun aktif
									</p>
									<p className="mt-1 text-lg font-black text-slate-800">{username}</p>
								</div>
								<div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3">
									<p className="flex items-center gap-2 text-xs text-sky-700">
										<MailOutline />
										Kontak
									</p>
									<p className="mt-1 text-sm font-bold text-sky-900 break-all">{email}</p>
								</div>
							</div>
						</div>

						<div className="rounded-[1.75rem] border border-rose-200 bg-rose-50/80 p-5 shadow-sm">
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
								Keluar Sesi
							</p>
							<p className="mt-3 text-sm leading-relaxed text-slate-600">
								Gunakan tombol ini untuk keluar dari akun aktif dan kembali ke halaman utama.
							</p>
							<div className="mt-4">
								<Button
									icon={<LeftOutline />}
									buttonType="danger"
									className="w-full"
									onClick={onSignOut}
								>
									Sign Out
								</Button>
							</div>
						</div>
					</aside>
				</div>
			</Container>
		</Navigation>
	);
};

export default Profile;
