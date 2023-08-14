import PageHeadInterface from 'interfaces/general';
import { ReactNode } from 'react';

export default interface BaseNavInterface extends PageHeadInterface {
	active?: string;
	isAdmin?: boolean;
	isSuperAdminOnly?: boolean;
	access?: string;
	children?: ReactNode;
	hideFooter?: boolean;
}
