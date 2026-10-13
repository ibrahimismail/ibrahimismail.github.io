/**
 * The scope graph behind the roles demo. A deliberately small slice of the real idea: scopes
 * grouped by the portal area they govern, some of them implying others, and roles that grant
 * sets of them. An admin can hold several roles at once and the grants union.
 *
 * The point it makes is the one that is hard to make in a sentence: because the UI renders from
 * this metadata, adding a permission is a server-side change and the frontend ships nothing.
 */
export type Scope = {
	id: string;
	area: Area;
	verb: 'read' | 'write';
	/** Scopes this one necessarily grants. Write usually implies read, and more besides. */
	implies?: string[];
	/** Added by the "ship a new permission" control, to show what arriving metadata does. */
	shipped?: boolean;
};

export type Area = 'Devices' | 'Users' | 'Billing' | 'Policies' | 'Directory';

export const AREAS: Area[] = ['Devices', 'Users', 'Billing', 'Policies', 'Directory'];

export const SCOPES: Scope[] = [
	{ id: 'devices.read', area: 'Devices', verb: 'read' },
	{ id: 'devices.write', area: 'Devices', verb: 'write', implies: ['devices.read', 'users.read'] },
	{ id: 'users.read', area: 'Users', verb: 'read' },
	{ id: 'users.write', area: 'Users', verb: 'write', implies: ['users.read', 'directory.read'] },
	{ id: 'billing.read', area: 'Billing', verb: 'read' },
	{ id: 'billing.write', area: 'Billing', verb: 'write', implies: ['billing.read'] },
	{ id: 'policies.read', area: 'Policies', verb: 'read' },
	{
		id: 'policies.write',
		area: 'Policies',
		verb: 'write',
		implies: ['policies.read', 'devices.read'],
	},
	{ id: 'directory.read', area: 'Directory', verb: 'read' },
];

export type Role = {
	id: string;
	label: string;
	grants: string[];
};

export const ROLES: Role[] = [
	{ id: 'device-manager', label: 'Device manager', grants: ['devices.write'] },
	{ id: 'billing-viewer', label: 'Billing viewer', grants: ['billing.read'] },
	{ id: 'help-desk', label: 'Help desk', grants: ['users.write', 'devices.read'] },
	{ id: 'policy-admin', label: 'Policy admin', grants: ['policies.write'] },
];

/** The permission the "ship it" control introduces, server-side, with no frontend release. */
export const SHIPPED_SCOPE: Scope = {
	id: 'policies.approve',
	area: 'Policies',
	verb: 'write',
	implies: ['policies.read'],
	shipped: true,
};
