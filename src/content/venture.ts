import type { Venture } from './types';

/**
 * KlikNote. Not a job and not a client project — a product he designed and built himself, so it
 * gets its own act rather than a card among the work he did for employers.
 *
 * It is also the one thing on the site that comes and goes: sometimes it should be public,
 * sometimes it should not. Hiding it is the single edit below, and the type is what makes that
 * safe — `VENTURE` is nullable, so every consumer has to handle its absence or the build fails.
 * Nothing else needs touching, and nothing 404s: the venture is a section of the one document,
 * never a route of its own.
 *
 * What reads it: the venture section, the build choreography (which derives its steps from
 * content, so a hidden venture leaves no gap in the timeline), the command palette's index,
 * and the print route.
 */
const KLIKNOTE: Venture = {
	name: 'KlikNote',
	role: 'Founder & Lead Engineer',
	tagline:
		'A high-velocity, local-first, keyboard-native note-taking app built for uninterrupted focus.',
	url: 'https://kliknote.com',
	logo: '/kliknote-square.svg',
	island: 'KlikNote',
	body: [
		'When your mind moves fast, context-switching kills momentum. I founded KlikNote to replace the cloud latency, account walls, and heavy interfaces of traditional note tools with something that keeps up.',
		'Designed and engineered a zero-latency, client-side engine with global context-menu capture — web research and ideas are saved the instant they happen, living securely in the browser’s isolated storage.',
		'Local-first by default, keyboard-native, and built entirely around the browser extension experience I wanted as a power user.',
	],
	cta: 'Try KlikNote today',
};

/**
 * The switch. `KLIKNOTE` to show it, `null` to take it off the site — then redeploy. The data
 * above stays either way, so turning it back on is the same one-line edit in reverse.
 */
export const VENTURE: Venture | null = null;
