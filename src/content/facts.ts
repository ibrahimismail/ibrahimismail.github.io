/**
 * The career numbers, kept where they can be checked against experience.ts rather than
 * invented in the markup. Phase 4 puts the page's own live measurements beside them.
 *
 * Every one of these traces to a line in the timeline. Nothing rounded up.
 */
export const FACTS = [
	{ value: '10×', label: 'vault scale', note: '5,000 → 50,000 items' },
	{ value: '8×', label: 'faster builds', note: '4 min → 30 s' },
	{ value: '4', label: 'browser stores', note: 'Chrome, Firefox, Safari, Edge' },
	{ value: '6', label: 'years shipping', note: 'since 2020' },
	{ value: '1', label: 'acquisition', note: 'MYKI → JumpCloud' },
] as const;
