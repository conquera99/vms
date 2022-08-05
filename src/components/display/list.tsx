import { FC, ReactNode } from 'react';

const List: FC<{ children: ReactNode }> = ({ children }) => {
	return <div className="w-full border-b py-2 transition-all duration-200">{children}</div>;
};

export default List;
