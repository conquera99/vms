import { FC } from 'react';

const Title: FC = ({ children }) => (
	<h2 className="text-3xl font-bold fixed top-0 z-10 w-full bg-white/70 py-3 backdrop-filter backdrop-blur-lg">
		{children}
	</h2>
);

export default Title;
