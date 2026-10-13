import type { Half } from './types';

/**
 * Skills, grouped the way they are scanned for.
 *
 * The first version sorted everything into three depth tiers — "daily", "shipped", "reach for".
 * Honest, but not readable: a recruiter scanning for a keyword does not parse "reach for without
 * thinking" as a proficiency level, and a tier called "reach for" sitting below one called
 * "shipped" reads as though it were the deeper of the two.
 *
 * So the grouping is now by category, which is what someone is actually looking for — languages,
 * data, security — and depth survives in one plain-English form: whatever is in `also` is
 * working knowledge rather than something he would claim as current.
 *
 * Two columns, backend first, per the framing rule in REDESIGN-PLAN.md §2.
 */
export type Group = {
	label: string;
	/** What he would put his name to. Ordered most-used first. */
	main: string[];
	/** Read fluently, reached for when it fits. Rendered quietly, and labelled as such. */
	also?: string[];
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
				main: ['TypeScript', 'Go', 'Node.js'],
				also: ['Python', 'Java', 'PHP'],
			},
			{
				label: 'APIs & contracts',
				main: ['gRPC', 'Protocol Buffers', 'GraphQL', 'REST', 'Webhooks'],
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
				main: ['Microservices', 'Docker', 'GitHub Actions', 'CI/CD'],
				also: ['CircleCI', 'Flask'],
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
				main: ['Tailwind', 'Vite', 'Webpack'],
				also: ['SASS', 'Framer Motion'],
			},
		],
	},
];
