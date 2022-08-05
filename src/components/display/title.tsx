import { FC, ReactNode } from 'react';

const Title: FC<{ children?: ReactNode }> = ({ children }) => (
	<h2 className="page-title text-2xl text-indigo-500 font-bold fixed top-0 md:static md:top-auto md:px-0 z-10 left-0 right-0 px-4 bg-white/60 py-3 backdrop-filter backdrop-blur-md">
		{children}
	</h2>
);

export default Title;
