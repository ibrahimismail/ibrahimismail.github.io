/**
 * The password manager's message bus, as something that can be watched running.
 *
 * Framed for what it was: a distributed-systems problem — an ephemeral process, a queue that
 * has to outlive it, IPC to a native host, and a key rotation happening mid-flight — that
 * happened to live in a browser.
 *
 * Coordinates are in the SVG's own 760×400 space. They are authored rather than computed
 * because a layout this small reads better arranged by hand than by a force simulation.
 */
export type NodeId = 'popup' | 'page' | 'dialog' | 'sw' | 'desktop' | 'bridge' | 'api';

export type BusNode = {
	id: NodeId;
	label: string;
	sub: string;
	x: number;
	y: number;
};

export const NODES: BusNode[] = [
	{ id: 'popup', label: 'Popup', sub: 'extension UI', x: 330, y: 32 },
	{ id: 'page', label: 'Content script', sub: 'injected per page', x: 92, y: 116 },
	{ id: 'dialog', label: 'Injected dialog', sub: 'in-page UI', x: 92, y: 288 },
	{ id: 'sw', label: 'Service worker', sub: 'ephemeral', x: 330, y: 196 },
	{ id: 'desktop', label: 'Desktop client', sub: 'Electron', x: 640, y: 116 },
	{ id: 'bridge', label: 'Swift bridge', sub: 'native IPC', x: 640, y: 288 },
	{ id: 'api', label: 'API', sub: 'https', x: 330, y: 352 },
];

/** Drawn once; every scenario travels over this same wiring. */
export const EDGES: [NodeId, NodeId][] = [
	['page', 'sw'],
	['dialog', 'sw'],
	['popup', 'sw'],
	['sw', 'desktop'],
	['desktop', 'bridge'],
	['sw', 'api'],
];

export type Hop = {
	from: NodeId;
	to: NodeId;
	/** One short line. It is narration, not documentation. */
	label: string;
	/** Something that happens to the bus itself rather than a message crossing it. */
	event?: 'kill' | 'respawn' | 'queue' | 'rotate';
};

export type Scenario = {
	id: string;
	label: string;
	blurb: string;
	hops: Hop[];
};

export const SCENARIOS: Scenario[] = [
	{
		id: 'autofill',
		label: 'autofill',
		blurb: 'A login form appears and the right credential has to reach it.',
		hops: [
			{ from: 'page', to: 'sw', label: 'form detected — which credential fits this origin?' },
			{ from: 'sw', to: 'desktop', label: 'vault query over the encrypted channel' },
			{ from: 'desktop', to: 'sw', label: 'one matching item, decrypted in the client' },
			{ from: 'sw', to: 'dialog', label: 'render the picker in the page, not the popup' },
		],
	},
	{
		id: 'unlock',
		label: 'unlock',
		blurb: 'Biometric unlock, where the key material never enters the extension.',
		hops: [
			{ from: 'dialog', to: 'sw', label: 'vault is locked — ask for unlock' },
			{ from: 'sw', to: 'desktop', label: 'unlock request' },
			{ from: 'desktop', to: 'bridge', label: 'native prompt: Touch ID' },
			{ from: 'bridge', to: 'desktop', label: 'attestation, key released inside the client' },
			{ from: 'desktop', to: 'sw', label: 'session unlocked — no key crosses this line' },
			{ from: 'sw', to: 'popup', label: 'UI reflects the unlocked vault' },
		],
	},
	{
		id: 'key-exchange',
		label: 'key exchange',
		blurb: 'How the extension and the desktop client come to share a secret at all.',
		hops: [
			{ from: 'sw', to: 'desktop', label: 'hello — here is my public key' },
			{ from: 'desktop', to: 'sw', label: 'and mine, with a signed challenge' },
			{ from: 'sw', to: 'desktop', label: 'symmetric session key, sealed to that public key' },
			{ from: 'desktop', to: 'sw', label: 'channel established — symmetric from here' },
		],
	},
	{
		id: 'rotation',
		label: 'rotation',
		blurb: 'Rotating the session key while a message is already in flight.',
		hops: [
			{ from: 'sw', to: 'desktop', label: 'rotation due — proposing a new session key' },
			{ from: 'page', to: 'sw', label: 'an autofill request arrives mid-rotation', event: 'queue' },
			{ from: 'desktop', to: 'sw', label: 'new key accepted, old one retired', event: 'rotate' },
			{ from: 'sw', to: 'desktop', label: 'the queued request goes out under the new key' },
			{ from: 'sw', to: 'page', label: 'the caller never knew a rotation happened' },
		],
	},
	{
		id: 'cold-start',
		label: 'cold start',
		blurb:
			'The hard part of Manifest V3: the service worker dies mid-conversation, and the conversation has to survive it.',
		hops: [
			{ from: 'page', to: 'sw', label: 'autofill request' },
			{ from: 'sw', to: 'sw', label: 'the worker is evicted — 30 seconds idle', event: 'kill' },
			{ from: 'page', to: 'sw', label: 'a second request lands on nothing', event: 'queue' },
			{ from: 'sw', to: 'sw', label: 'respawn: state rehydrated, queue drained in order', event: 'respawn' },
			{ from: 'sw', to: 'desktop', label: 'both requests go out, still in order' },
			{ from: 'desktop', to: 'sw', label: 'answers come back' },
			{ from: 'sw', to: 'page', label: 'the page never saw the gap' },
		],
	},
];
