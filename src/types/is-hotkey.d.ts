declare module 'is-hotkey' {
	const isHotkey: (hotkey: string | readonly string[], event: Event) => boolean;

	export default isHotkey;
}
