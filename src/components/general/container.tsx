import { FC, ReactNode } from 'react';

const Container: FC<{ children?: ReactNode }> = ({ children }) => {
	return <div className="max-w-5xl xl:max-w-7xl mx-auto">{children}</div>;
};

export default Container;

export const ContainerAdmin: FC<{ children?: ReactNode }> = ({ children }) => {
	return <div className="max-w-2xl xl:max-w-4xl mx-auto">{children}</div>;
};
