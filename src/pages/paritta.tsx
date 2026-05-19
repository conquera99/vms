import {
	PauseOutlined,
	RedoOutlined,
	StepBackwardOutlined,
	StepForwardOutlined,
	StopOutlined,
	CaretRightFilled,
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

import Navigation from 'components/navigation';
import Container from 'components/general/container';

type Track = {
	title: string;
	src: string;
};

type LoopMode = 'off' | 'all' | 'one';

const TRACKS: Track[] = [
	{ title: '01. Namakara Gatha', src: '/sounds/paritta/01-namakara-gatha.mp4' },
	{ title: '02. Puja Gatha', src: '/sounds/paritta/02-puja-gatha.mp4' },
	{ title: '03. Pubbabhaganamakara', src: '/sounds/paritta/03-pubbabhaganamakara.mp4' },
	{ title: '04. Saranagamana Patha', src: '/sounds/paritta/04-saranagamana-patha.mp4' },
	{ title: '05. Pancasila', src: '/sounds/paritta/05-pancasila.mp4' },
	{ title: '06. Buddhanussati', src: '/sounds/paritta/06-buddhanussati.mp4' },
	{ title: '07. Dhammanussati', src: '/sounds/paritta/07-dhammanussati.mp4' },
	{ title: '08. Sanghanussati', src: '/sounds/paritta/08-sanghanussati.mp4' },
	{ title: '09. Saccakiriya Gatha', src: '/sounds/paritta/09-saccakiriya-gatha.mp4' },
	{ title: '10. Mangala Sutta', src: '/sounds/paritta/10-mangala-sutta.mp4' },
	{ title: '11. Karaniya Metta Sutta', src: '/sounds/paritta/11-karaniya-metta-sutta.mp4' },
	{ title: '12. Brahmavihara Pharanaa', src: '/sounds/paritta/12-brahmavihara-pharana.mp4' },
	{ title: '13. Abhinhapaccavekkahana', src: '/sounds/paritta/13-abhinhapaccavekkahana.mp4' },
	{
		title: '14. Aradhana Tisarana Pancasila',
		src: '/sounds/paritta/14-aradhana-tisarana-pancasila.mp4',
	},
	{ title: '15. Aradhana Dhammadesana', src: '/sounds/paritta/15-aradhana-dhammadesana.mp4' },
	{ title: '16. Ettavatta', src: '/sounds/paritta/16-ettavatta.mp4' },
];

const formatTime = (seconds: number) => {
	if (!Number.isFinite(seconds)) {
		return '00:00';
	}

	const mins = Math.floor(seconds / 60)
		.toString()
		.padStart(2, '0');
	const secs = Math.floor(seconds % 60)
		.toString()
		.padStart(2, '0');

	return `${mins}:${secs}`;
};

const ParittaPage = () => {
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [loopMode, setLoopMode] = useState<LoopMode>('all');

	const currentTrack = TRACKS[currentIndex];
	const loopButtonLabel = `Loop: ${loopMode}`;

	const selectTrack = (index: number, autoPlay = true) => {
		setCurrentIndex(index);
		setShouldAutoPlay(autoPlay);
	};

	const onPrev = () => {
		const index = currentIndex > 0 ? currentIndex - 1 : TRACKS.length - 1;
		selectTrack(index, true);
	};

	const onNext = () => {
		const index = currentIndex < TRACKS.length - 1 ? currentIndex + 1 : 0;
		selectTrack(index, true);
	};

	const onToggleLoop = () => {
		setLoopMode((prev) => {
			if (prev === 'off') {
				return 'all';
			}

			if (prev === 'all') {
				return 'one';
			}

			return 'off';
		});
	};

	const onEnded = () => {
		const audio = audioRef.current;
		if (!audio) {
			return;
		}

		if (loopMode === 'one') {
			audio.currentTime = 0;
			audio
				.play()
				.then(() => setIsPlaying(true))
				.catch(() => setIsPlaying(false));
			return;
		}

		if (loopMode === 'all') {
			onNext();
			return;
		}

		if (currentIndex < TRACKS.length - 1) {
			setCurrentIndex((prev) => prev + 1);
			setShouldAutoPlay(true);
			return;
		}

		setIsPlaying(false);
	};

	const onPlayPause = async () => {
		const audio = audioRef.current;
		if (!audio) {
			return;
		}

		if (audio.paused) {
			try {
				await audio.play();
				setIsPlaying(true);
			} catch {
				setIsPlaying(false);
			}
			return;
		}

		audio.pause();
		setIsPlaying(false);
	};

	const onStop = () => {
		const audio = audioRef.current;
		if (!audio) {
			return;
		}

		audio.pause();
		audio.currentTime = 0;
		setCurrentTime(0);
		setIsPlaying(false);
	};

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) {
			return;
		}

		audio.load();
		setCurrentTime(0);

		if (!shouldAutoPlay) {
			setIsPlaying(false);
			return;
		}

		audio
			.play()
			.then(() => setIsPlaying(true))
			.catch(() => setIsPlaying(false));

		setShouldAutoPlay(false);
	}, [currentIndex]);

	return (
		<Navigation title="Paritta" active="paritta" hideFooter={false}>
			<Container>
				<section className="relative mt-4 overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-4 pb-28 shadow-xl shadow-slate-200/35 backdrop-blur-sm sm:mt-6 sm:p-6 md:pb-8 lg:p-8">
					<div className="pointer-events-none absolute -right-16 top-0 h-44 w-44 rounded-full bg-[#f3deb1]/45 blur-3xl" />
					<div className="pointer-events-none absolute -left-16 bottom-2 h-40 w-40 rounded-full bg-[#c8dded]/50 blur-3xl" />

					<div className="relative z-10 mb-5 sm:mb-7">
						<p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
							Sounds
						</p>
						<h1 className="text-3xl font-semibold leading-tight text-slate-800 sm:text-4xl lg:text-5xl">
							Paritta
						</h1>
						<p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
							Pemutar audio Paritta dengan kontrol lengkap dan playlist.
						</p>
					</div>

					<div className="relative z-10 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
						<div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:col-span-5">
							<p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
								Now Playing
							</p>
							<h2 className="mt-2 text-xl font-semibold text-slate-800">
								{currentTrack.title}
							</h2>

							<div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
								<div
									className="h-full rounded-full bg-[#7ea7cb] transition-all"
									style={{
										width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
									}}
								/>
							</div>

							<div className="mt-2 flex items-center justify-between text-xs font-medium text-slate-500">
								<span>{formatTime(currentTime)}</span>
								<span>{formatTime(duration)}</span>
							</div>

							<div className="mt-4 hidden grid-cols-2 gap-2 sm:grid-cols-5 md:grid">
								<button
									type="button"
									onClick={onPrev}
									aria-label="Previous"
									className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#edf4fa]"
								>
									<StepBackwardOutlined aria-hidden="true" />
								</button>
								<button
									type="button"
									onClick={onPlayPause}
									aria-label={isPlaying ? 'Pause' : 'Play'}
									className="rounded-xl border border-slate-200 bg-[#edf4fa] px-3 py-2 text-sm font-semibold text-[#486d92] transition hover:bg-[#dcebf7]"
								>
									{isPlaying ? (
										<PauseOutlined aria-hidden="true" />
									) : (
										<CaretRightFilled aria-hidden="true" />
									)}
								</button>
								<button
									type="button"
									onClick={onStop}
									aria-label="Stop"
									className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#edf4fa]"
								>
									<StopOutlined aria-hidden="true" />
								</button>
								<button
									type="button"
									onClick={onNext}
									aria-label="Next"
									className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#edf4fa] sm:col-span-2"
								>
									<StepForwardOutlined aria-hidden="true" />
								</button>
							</div>

							<div className="mt-2 hidden items-center justify-end md:flex">
								<button
									type="button"
									onClick={onToggleLoop}
									className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-[#edf4fa]"
								>
									<span className="inline-flex items-center gap-2">
										<RedoOutlined aria-hidden="true" />
										{loopButtonLabel}
									</span>
								</button>
							</div>

							<audio
								ref={audioRef}
								src={currentTrack.src}
								preload="metadata"
								onLoadedMetadata={(event) =>
									setDuration(event.currentTarget.duration || 0)
								}
								onTimeUpdate={(event) =>
									setCurrentTime(event.currentTarget.currentTime)
								}
								onEnded={onEnded}
							/>
						</div>

						<div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:col-span-7">
							<p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
								Playlist
							</p>
							<div className="max-h-[540px] space-y-2 overflow-auto pr-1">
								{TRACKS.map((track, index) => (
									<button
										key={track.src}
										type="button"
										onClick={() => selectTrack(index, true)}
										className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition mb-2 ${
											index === currentIndex
												? 'border-[#c8dded] bg-[#edf4fa] text-[#486d92]'
												: 'border-slate-100 bg-white text-slate-700 hover:bg-slate-50'
										}`}
									>
										<div className="flex items-center justify-between gap-3">
											<span className="truncate font-medium">
												{track.title}
											</span>
											{index === currentIndex && (
												<span className="text-xs font-semibold uppercase tracking-wide">
													{isPlaying ? 'Playing' : 'Selected'}
												</span>
											)}
										</div>
									</button>
								))}
							</div>
						</div>
					</div>
				</section>

				<div className="fixed bottom-24 left-3 right-3 z-40 rounded-2xl border border-white/70 bg-white/90 p-2 shadow-xl shadow-slate-400/20 backdrop-blur-sm md:hidden">
					<div className="grid grid-cols-5 gap-2">
						<button
							type="button"
							onClick={onPrev}
							aria-label="Previous"
							className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#edf4fa]"
						>
							<StepBackwardOutlined aria-hidden="true" />
						</button>
						<button
							type="button"
							onClick={onPlayPause}
							aria-label={isPlaying ? 'Pause' : 'Play'}
							className="rounded-xl border border-slate-200 bg-[#edf4fa] px-3 py-2 text-sm font-semibold text-[#486d92] transition hover:bg-[#dcebf7]"
						>
							{isPlaying ? (
								<PauseOutlined aria-hidden="true" />
							) : (
								<CaretRightFilled aria-hidden="true" />
							)}
						</button>
						<button
							type="button"
							onClick={onStop}
							aria-label="Stop"
							className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#edf4fa]"
						>
							<StopOutlined aria-hidden="true" />
						</button>
						<button
							type="button"
							onClick={onNext}
							aria-label="Next"
							className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#edf4fa]"
						>
							<StepForwardOutlined aria-hidden="true" />
						</button>
						<button
							type="button"
							onClick={onToggleLoop}
							aria-label="Toggle loop mode"
							className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-[#edf4fa]"
						>
							<span className="inline-flex items-center gap-1">
								<RedoOutlined aria-hidden="true" />
								{loopMode}
							</span>
						</button>
					</div>
				</div>
			</Container>
		</Navigation>
	);
};

export default ParittaPage;
