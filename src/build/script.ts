import type { SectionId } from '../content/sections';

/**
 * The choreography.
 *
 * Authored as a function of the content rather than as a fixed timetable, for two reasons. The
 * numbers it prints have to be true — a fake build log on an engineer's portfolio is the one
 * unforgivable detail — and a step can disappear (KlikNote, switched off) without leaving a
 * hole in the timing, because the driver sums durations rather than reading absolute times.
 */
export type Step =
	| { kind: 'prompt'; text: string; ms: number }
	| { kind: 'plan'; lines: string[]; ms: number }
	| { kind: 'tool'; tool: 'Read' | 'Write' | 'Bash'; arg: string; out: string; ms: number; reveals?: SectionId }
	| { kind: 'done'; text: string; ms: number };

export type Facts = {
	target: string;
	roles: number;
	files: number;
	lines: number;
	systems: number;
	venture: boolean;
	pages: number;
	/** Measured in the browser, not asserted: what this page actually cost to load. */
	transferredKb: number;
	jsRequests: number;
};

/** Short on a phone: six steps instead of ten, and the two smaller writes go. */
export function steps(facts: Facts, compact: boolean): Step[] {
	const all: (Step | null)[] = [
		{ kind: 'prompt', text: `build portfolio --target=${facts.target.split(' ')[0]}`, ms: 760 },
		{
			kind: 'plan',
			lines: [
				`target: ${facts.target}`,
				'read the career, lay out the document, wire the interactives',
				'server-side first — ordering, not volume',
			],
			ms: 680,
		},
		{
			kind: 'tool',
			tool: 'Read',
			arg: 'content/profile.ts',
			out: 'senior full-stack engineer · Beirut',
			ms: 520,
			reveals: 'masthead',
		},
		{
			kind: 'tool',
			tool: 'Read',
			arg: 'content/experience.ts',
			out: `${facts.roles} roles · ${facts.files} files · ${facts.lines} lines`,
			ms: 620,
			reveals: 'timeline',
		},
		compact
			? null
			: {
					kind: 'tool',
					tool: 'Write',
					arg: 'islands/ScopeEngine.ts',
					out: 'resolver + dependency graph',
					ms: 520,
					reveals: 'systems',
				},
		{
			kind: 'tool',
			tool: 'Write',
			arg: 'islands/ExtensionBus.ts',
			out: `${facts.systems} systems · 5 scenarios`,
			ms: 560,
			reveals: 'systems',
		},
		facts.venture && !compact
			? {
					kind: 'tool',
					tool: 'Write',
					arg: 'islands/KlikNote.ts',
					out: 'local-first · no network',
					ms: 460,
					reveals: 'venture',
				}
			: null,
		compact
			? null
			: {
					kind: 'tool',
					tool: 'Read',
					arg: 'content/stack.ts',
					out: 'two halves, server first',
					ms: 420,
					reveals: 'stack',
				},
		{
			kind: 'tool',
			tool: 'Bash',
			arg: 'npm run build',
			out: `✓ ${facts.pages} pages · ${facts.jsRequests} js requests · ${facts.transferredKb} kB`,
			ms: 700,
			reveals: 'instruments',
		},
		{ kind: 'done', text: 'ready · ⌘K to drive it', ms: 520 },
	];

	return all.filter((step): step is Step => step !== null);
}

/** Measured, never guessed. Anything it cannot measure it reports as zero. */
export function measure(): Pick<Facts, 'transferredKb' | 'jsRequests'> {
	let bytes = 0;
	let js = 0;
	try {
		for (const entry of performance.getEntriesByType(
			'resource',
		) as PerformanceResourceTiming[]) {
			bytes += entry.transferSize || entry.encodedBodySize || 0;
			if (entry.initiatorType === 'script') js++;
		}
		const nav = performance.getEntriesByType('navigation')[0] as
			| PerformanceNavigationTiming
			| undefined;
		bytes += nav?.transferSize ?? 0;
	} catch {
		/* An older engine without the Performance API reports nothing rather than a guess. */
	}
	return { transferredKb: Math.round(bytes / 1024), jsRequests: js };
}
