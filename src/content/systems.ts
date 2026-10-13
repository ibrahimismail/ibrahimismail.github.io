import type { System } from './types';

/**
 * The work that cannot be screenshotted. Server-side first, and the first two get interactive
 * islands in phase 2 — the scope engine shares the extension bus's depth budget, because the
 * backend piece is not the junior one.
 *
 * The other two are a diagram and a code block: static on purpose, and there to balance the
 * section's card count without inventing interactions that would not earn their bytes.
 */
const ALL: System[] = [
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

/**
 * The switch. `ALL` to show the section, `[]` to take it off the site — then redeploy.
 *
 * Same shape as the venture's, and for the same reason: the content stays either way, so
 * turning it back on is the one-line edit in reverse. Everything that could render a system
 * reads this — the page, the section list, the build sequence's steps, and the palette's `run`
 * commands — so hiding it cannot leave a gap, a stray heading, or a command that scrolls to
 * nothing.
 */
export const SYSTEMS: System[] = [];
