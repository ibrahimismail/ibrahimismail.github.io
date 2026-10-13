/**
 * Who he is, in the few lines every page needs: the <head>, the masthead, the print route and
 * the structured data all read this one object.
 *
 * Framing rule, enforced everywhere downstream: a senior full-stack engineer, half server and
 * half client, with the server half shown first. Order is the only lever used for that — never
 * volume, never adjectives. See REDESIGN-PLAN.md §2 "Framing".
 *
 * `status` is the most load-bearing sentence on the site — it is the first thing a recruiter
 * looks for — so it carries a date and is reviewed, not left to rot.
 */
export const PROFILE = {
	name: 'Ibrahim Ismail',
	title: 'Senior Full-Stack Engineer',
	/**
	 * Two clauses, server then client, deliberately the same length. The masthead sets them as
	 * two lines of equal weight, so the balance is something the reader sees rather than a
	 * claim they have to take on trust.
	 */
	sentence: [
		'Authorization engines, service contracts and encrypted channels on the server.',
		'Extension platforms, native bridges and micro-frontends on the client.',
	],
	description:
		'Senior full-stack engineer, six years on security software. Authorization and scope-evaluation engines, gRPC service contracts, cryptographic key exchange and schema migrations on the backend; Manifest V3 extension architecture, native IPC bridges and micro-frontends on the frontend.',
	status: { text: 'Open to senior engineering roles', asOf: '2026-10' },
	location: 'Beirut, Lebanon',
	phone: '+961 3 689 039',
	email: 'ibrahimismailh@gmail.com',
	website: 'https://ibrahimismail.dev',
	linkedin: 'https://linkedin.com/in/ibrahimismailh',
	sameAs: ['https://linkedin.com/in/ibrahimismailh'],
	/* Server-side first: this array's order is a ranking signal, and crawlers read it as one. */
	knowsAbout: [
		'Authorization systems',
		'Applied cryptography',
		'gRPC and Protocol Buffers',
		'GraphQL APIs',
		'Microservices',
		'PostgreSQL',
		'Go',
		'Node.js',
		'Browser extension architecture',
		'Manifest V3',
		'Micro-frontends',
		'TypeScript',
		'Vue',
		'React',
	],
} as const;
