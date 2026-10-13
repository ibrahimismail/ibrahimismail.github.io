import type { Half } from './types';

/**
 * Skills, grouped the way they are scanned for.
 *
 * The first version sorted everything into three depth tiers — "daily", "shipped", "reach for".
 * Honest, but not readable: a recruiter scanning for a keyword does not parse "reach for without
 * thinking" as a proficiency level, and a tier called "reach for" sitting below one called
 * "shipped" reads as though it were the deeper of the two.
 *
 * So the grouping is by category, which is what someone is actually looking for: languages,
 * databases, security. There was a second list per group for working knowledge, set quietly
 * under an "also" — it undersold things that belong on a CV at full size, and the column had
 * the room. Everything a group holds is now one list.
 *
 * Two columns, backend first, per the framing rule in REDESIGN-PLAN.md §2.
 */
export type Group = {
	label: string;
	/** Ordered most-used first. */
	main: string[];
};

export type Column = {
	half: Exclude<Half, 'both'>;
	label: string;
	groups: Group[];
};

export const STACK: Column[] = [
	{
		half: 'server',
		label: 'Backend & platform',
		groups: [
			{
				label: 'Languages',
				main: ['TypeScript', 'Go', 'Node.js', 'Python', 'Java', 'PHP'],
			},
			{
				label: 'APIs & contracts',
				main: ['gRPC', 'Protocol Buffers', 'GraphQL', 'REST', 'Webhooks', 'Flask'],
			},
			{
				label: 'Databases',
				main: ['PostgreSQL', 'MySQL', 'MongoDB', 'Schema migrations'],
			},
			{
				label: 'Security',
				main: [
					'Authorization engines',
					'Scope evaluation',
					'Applied cryptography',
					'Key exchange & rotation',
				],
			},
			{
				label: 'Services & delivery',
				main: ['Microservices', 'Docker', 'GitHub Actions', 'CI/CD', 'CircleCI'],
			},
		],
	},
	{
		half: 'client',
		label: 'Frontend & browser',
		groups: [
			{
				label: 'Languages',
				main: ['TypeScript', 'JavaScript'],
			},
			{
				label: 'Frameworks',
				main: ['Vue', 'React', 'Astro'],
			},
			{
				label: 'Browser & desktop',
				main: [
					'Manifest V3',
					'Service workers',
					'Four browser stores',
					'Electron',
					'Swift native bridge',
				],
			},
			{
				label: 'Architecture',
				main: ['Micro-frontends', 'Design systems', 'List virtualization'],
			},
			{
				label: 'Styling & build',
				main: ['Tailwind', 'SASS', 'Vite', 'Webpack', 'Framer Motion'],
			},
		],
	},
];
