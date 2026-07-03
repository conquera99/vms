'use client';

import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';

export default function AntdStyleRegistry({ children }: { children: React.ReactNode }) {
	const [cache] = useState(() => createCache());

	useServerInsertedHTML(() => {
		return (
			<style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
		);
	});

	return <StyleProvider cache={cache} hashPriority="low">{children}</StyleProvider>;
}
