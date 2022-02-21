import PageHeadInterface from 'interfaces/general';

export default interface BaseNavInterface extends PageHeadInterface {
	active?: string;
	isAdmin?: boolean;
	isSuperAdminOnly?: boolean;
	access?: string;
}
