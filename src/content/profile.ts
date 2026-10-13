/**
 * Who he is, in the few lines every page needs: the <head>, the masthead, the print route and
 * the structured data all read this one object.
 *
 * `status` is the most load-bearing sentence on the site — it is the first thing a recruiter
 * looks for — so it carries a date and is reviewed, not left to rot.
 */
export const PROFILE = {
	name: 'Ibrahim Ismail',
	title: 'Senior Full-Stack Engineer',
	/** One sentence, concrete, no adjectives that cannot be checked against the timeline. */
	sentence:
		'Builds the software other software runs inside — browser extensions, micro-frontends, native bridges, permission engines.',
	description:
		'Senior full-stack engineer. Six years on security software: Manifest V3 extension architecture, native IPC bridges, cryptographic key exchange, permission engines, and micro-frontends at scale.',
	/* TODO confirm with Ibrahim — see REDESIGN-PLAN.md §16. */
	status: { text: 'Open to senior and staff engineering roles', asOf: '2026-10' },
	location: 'Beirut, Lebanon',
	phone: '+961 3 689 039',
	email: 'ibrahimismailh@gmail.com',
	website: 'https://ibrahimismail.dev',
	linkedin: 'https://linkedin.com/in/ibrahimismailh',
	github: 'https://github.com/ibrahimismail',
	sameAs: ['https://linkedin.com/in/ibrahimismailh', 'https://github.com/ibrahimismail'],
	knowsAbout: [
		'Browser extension architecture',
		'Manifest V3',
		'Micro-frontends',
		'TypeScript',
		'Vue',
		'React',
		'Applied cryptography',
		'Authorization systems',
		'Frontend performance',
	],
} as const;
