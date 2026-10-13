import type { SectionId } from './sections';

/**
 * `?role=` presets. The same content, ordered for one reader.
 *
 * No model, no personalisation service, no stored profile — a map of five arrangements, picked
 * by a query parameter. The point is that a tailored link can go out with each application:
 * ibrahimismail.dev/?role=backend reads as a backend portfolio without a word changing.
 *
 * `clause` decides which half of the pitch is the top line. `openDirs` decides which directory
 * of the timeline is already expanded. `order` is applied as CSS `order`, generated at build
 * time, so the arrangement is right at first paint rather than rearranged afterwards.
 */
export type TargetId = 'backend' | 'platform' | 'security' | 'fullstack' | 'frontend';

export type Target = {
	id: TargetId;
	/** What the build transcript says it is building for. */
	label: string;
	clause: 'server' | 'client';
	openDirs: string[];
	order: SectionId[];
};

export const DEFAULT_ORDER: SectionId[] = [
	'timeline',
	'systems',
	'venture',
	'stack',
	'instruments',
	'contact',
];

export const TARGETS: Target[] = [
	{
		id: 'backend',
		label: 'backend + distributed systems',
		clause: 'server',
		openDirs: ['backend'],
		order: DEFAULT_ORDER,
	},
	{
		id: 'platform',
		label: 'platform + developer experience',
		clause: 'server',
		openDirs: ['platform'],
		order: ['systems', 'timeline', 'stack', 'venture', 'instruments', 'contact'],
	},
	{
		id: 'security',
		label: 'security engineering',
		clause: 'server',
		openDirs: ['security'],
		order: ['timeline', 'systems', 'stack', 'venture', 'instruments', 'contact'],
	},
	{
		id: 'fullstack',
		label: 'full-stack engineering',
		clause: 'server',
		openDirs: ['backend'],
		order: DEFAULT_ORDER,
	},
	{
		id: 'frontend',
		label: 'frontend architecture',
		clause: 'client',
		openDirs: ['platform'],
		order: ['systems', 'timeline', 'venture', 'stack', 'instruments', 'contact'],
	},
];

export const DEFAULT_TARGET: Target = {
	id: 'fullstack',
	label: 'senior full-stack engineering',
	clause: 'server',
	openDirs: ['backend'],
	order: DEFAULT_ORDER,
};

export function targetFor(id: string | null | undefined): Target {
	return TARGETS.find((target) => target.id === id) ?? DEFAULT_TARGET;
}
