import type { Half, Tag } from './types';

/**
 * Two halves, server first, with depth tiers inside each. The layout is the argument: a reader
 * sees two full columns before they read a word.
 *
 * Tiers are honest rather than flattering — a wall of equal badges reads as junior, and
 * claiming the same depth in Flask as in TypeScript would be a lie a reviewer can catch in one
 * question. `tag` links a term back to the timeline lines that prove it.
 */
export type Tier = 'daily' | 'shipped' | 'reach for';

export type Entry = { name: string; tag?: Tag };

export type Column = {
	half: Exclude<Half, 'both'>;
	label: string;
	tiers: { tier: Tier; entries: Entry[] }[];
};

export const TIER_NOTE: Record<Tier, string> = {
	daily: 'reach for without thinking',
	shipped: 'shipped to production and supported',
	'reach for': 'read fluently, reach for when it fits',
};

export const STACK: Column[] = [
	{
		half: 'server',
		label: 'Server & platform',
		tiers: [
			{
				tier: 'daily',
				entries: [
					{ name: 'Node.js', tag: 'node' },
					{ name: 'TypeScript', tag: 'typescript' },
					{ name: 'PostgreSQL', tag: 'postgres' },
					{ name: 'REST' },
				],
			},
			{
				tier: 'shipped',
				entries: [
					{ name: 'Go', tag: 'go' },
					{ name: 'gRPC + protobuf', tag: 'grpc' },
					{ name: 'GraphQL', tag: 'graphql' },
					{ name: 'Webhooks', tag: 'graphql' },
					{ name: 'Schema migrations', tag: 'migrations' },
					{ name: 'Authorization engines', tag: 'authz' },
					{ name: 'Applied cryptography', tag: 'crypto' },
					{ name: 'Microservices', tag: 'grpc' },
				],
			},
			{
				tier: 'reach for',
				entries: [
					{ name: 'Python' },
					{ name: 'Flask' },
					{ name: 'Java' },
					{ name: 'PHP' },
					{ name: 'MySQL' },
					{ name: 'MongoDB' },
					{ name: 'Docker' },
				],
			},
		],
	},
	{
		half: 'client',
		label: 'Client & interface',
		tiers: [
			{
				tier: 'daily',
				entries: [
					{ name: 'TypeScript', tag: 'typescript' },
					{ name: 'Vue', tag: 'vue' },
					{ name: 'React', tag: 'react' },
					{ name: 'Tailwind' },
					{ name: 'Astro' },
					{ name: 'Vite' },
				],
			},
			{
				tier: 'shipped',
				entries: [
					{ name: 'Manifest V3', tag: 'mv3' },
					{ name: 'Service workers', tag: 'mv3' },
					{ name: 'Micro-frontends', tag: 'microfrontends' },
					{ name: 'Swift native bridge', tag: 'swift' },
					{ name: 'Electron' },
					{ name: 'List virtualization', tag: 'perf' },
					{ name: 'Four browser stores', tag: 'ci' },
					{ name: 'Design systems', tag: 'vue' },
				],
			},
			{
				tier: 'reach for',
				entries: [{ name: 'SASS' }, { name: 'Webpack' }, { name: 'Framer Motion' }],
			},
		],
	},
];
