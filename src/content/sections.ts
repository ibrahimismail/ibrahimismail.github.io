import { SYSTEMS } from './systems';
import { VENTURE } from './venture';

/**
 * The sections of the one page, in their default order.
 *
 * One list, read by the page that lays them out, the `?role=` ordering CSS, the command
 * palette's `goto`, and the build sequence that reveals them. A section that exists in one of
 * those and not the others is the bug this module is here to prevent.
 */
export type SectionId =
	| 'masthead'
	| 'timeline'
	| 'systems'
	| 'venture'
	| 'stack'
	| 'instruments'
	| 'contact';

export type Section = {
	id: SectionId;
	/** What `goto` matches on, and what the palette lists. */
	label: string;
};

const ALL: Section[] = [
	{ id: 'masthead', label: 'top' },
	{ id: 'timeline', label: 'career' },
	{ id: 'systems', label: 'systems' },
	{ id: 'venture', label: 'kliknote' },
	{ id: 'stack', label: 'stack' },
	{ id: 'instruments', label: 'instruments' },
	{ id: 'contact', label: 'contact' },
];

/** Both removable sections drop out here, so every list derived from this one loses them too. */
export const SECTIONS: Section[] = ALL.filter((section) => {
	if (section.id === 'venture') return VENTURE !== null;
	if (section.id === 'systems') return SYSTEMS.length > 0;
	return true;
});

export const SECTION_IDS = SECTIONS.map((section) => section.id);
