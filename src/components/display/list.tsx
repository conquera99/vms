import { FC } from 'react';

const List: FC = ({ children }) => {
	return <div className="w-full border-b py-2 transition-all duration-200">{children}</div>;
};

export default List;
