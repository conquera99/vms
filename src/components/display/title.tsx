import { FC } from 'react';

const Title: FC = ({ children }) => (
	<h2 className="text-2xl text-indigo-500 font-bold fixed top-0 z-10 left-0 right-0 px-4 bg-white/60 py-3 backdrop-filter backdrop-blur-md">
		{children}
	</h2>
);

export default Title;
