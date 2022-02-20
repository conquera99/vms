import { useState, useEffect, RefObject, LegacyRef } from 'react';

export default function useOnScreen(ref: RefObject<any> | LegacyRef<HTMLDivElement> | undefined) {
	const [isIntersecting, setIntersecting] = useState(false);

	useEffect(() => {
		if (!(ref as RefObject<any>)?.current) return;

		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe((ref as RefObject<any>)?.current);
		// Remove the observer as soon as the component is unmounted
		return () => {
			observer.disconnect();
		};
	}, [ref]);

	return isIntersecting;
}
