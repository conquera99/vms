import { FC } from 'react';

const Container: FC = ({ children }) => {
	return <div className="max-w-5xl xl:max-w-7xl mx-auto">{children}</div>;
};

export default Container;
