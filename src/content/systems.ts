import type { System } from './types';

/**
 * The work that cannot be screenshotted. Server-side first, and the first two get interactive
 * islands in phase 2 — the scope engine shares the extension bus's depth budget, because the
 * backend piece is not the junior one.
 *
 * The other two are a diagram and a code block: static on purpose, and there to balance the
 * section's card count without inventing interactions that would not earn their bytes.
 */
export const SYSTEMS: System[] = [
	{
		id: 'scope-engine',
		half: 'server',
		title: 'The scope engine',
		blurb: 'Permissions that resolve through a dependency graph, with the trace printed.',
		island: 'ScopeEngine',
		cover: '/covers/graph.webp',
		company: 'JumpCloud',
	},
	{
		id: 'extension-bus',
		half: 'both',
		title: 'The extension bus',
		blurb: 'An ephemeral process, a queue that outlives it, and IPC to a native host.',
		island: 'ExtensionBus',
		cover: '/covers/bus.webp',
		company: 'JumpCloud',
	},
	{
		id: 'icon-service',
		half: 'server',
		title: 'Icon streaming',
		blurb: 'Third-party GraphQL in, webhooks for freshness, cached and streamed out.',
		cover: '/covers/pipeline.webp',
		company: 'JumpCloud',
	},
	{
		id: 'contracts',
		half: 'server',
		title: 'Service contracts',
		blurb: 'Typed boundaries between services, in protobuf, deployed across environments.',
		cover: '/covers/bridge.webp',
		company: 'JumpCloud',
	},
];
