import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { ToastContainer } from 'react-toastify';

import 'styles/globals.css';
import 'styles/rc-select.css';
import 'styles/rc-picker.css';
import 'styles/rc-input-number.css';
import 'styles/toastify.css';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session} refetchInterval={5 * 60}>
			<SWRConfig
				value={{
					fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
				}}
			>
				<ToastContainer position="top-center" />
				<Component {...pageProps} />
			</SWRConfig>
		</SessionProvider>
	);
}
export default MyApp;
