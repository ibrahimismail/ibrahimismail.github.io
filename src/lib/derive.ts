import type { Dir, Half, Role, Tag } from '../content/types';
import { EXPERIENCE } from '../content/experience';

/**
 * Everything the page needs that is a consequence of the content rather than a decision about
 * it: counts, dates, durations, orderings, the tag index. Authoring any of these by hand is how
 * a "16 files changed" ends up saying 14 three commits later.
 */

const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

/** '2022-02' → { year: 2022, month: 2 }. Throws rather than guessing on a malformed value. */
function parse(stamp: string): { year: number; month: number } {
	const [year, month] = stamp.split('-').map(Number);
	if (!year || !month || month < 1 || month > 12) {
		throw new Error(`derive: '${stamp}' is not a YYYY-MM stamp`);
	}
	return { year, month };
}

/** '2022-02' → 'Feb 2022'. */
export function monthYear(stamp: string): string {
	const { year, month } = parse(stamp);
	return `${MONTHS[month - 1]} ${year}`;
}

/** 'Feb 2022 — May 2026', or 'Feb 2022 — now' for a role still running. */
export function period(role: Pick<Role, 'start' | 'end'>): string {
	return `${monthYear(role.start)} — ${role.end ? monthYear(role.end) : 'now'}`;
}

/** Whole months between the two stamps, counting the first month. */
export function months(role: Pick<Role, 'start' | 'end'>): number {
	const from = parse(role.start);
	const to = role.end
		? parse(role.end)
		: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
	return (to.year - from.year) * 12 + (to.month - from.month) + 1;
}

/** '4 yrs 4 mos' — and '11 mos' rather than '0 yrs 11 mos'. */
export function duration(role: Pick<Role, 'start' | 'end'>): string {
	const total = months(role);
	const years = Math.floor(total / 12);
	const rest = total % 12;
	const parts: string[] = [];
	if (years) parts.push(`${years} yr${years === 1 ? '' : 's'}`);
	if (rest) parts.push(`${rest} mo${rest === 1 ? '' : 's'}`);
	return parts.join(' ') || '1 mo';
}

export function fileCount(role: Role): number {
	return role.dirs.reduce((sum, dir) => sum + dir.files.length, 0);
}

export function lineCount(role: Role): number {
	return role.dirs.reduce(
		(sum, dir) => sum + dir.files.reduce((n, file) => n + file.lines.length, 0),
		0,
	);
}

/**
 * The server half first, then the mixed work, then the client half — the ordering rule of the
 * whole site, in one place. Within a half the authored order is kept, because that order is a
 * judgement about what matters and nothing here should second-guess it.
 */
const HALF_RANK: Record<Half, number> = { server: 0, both: 1, client: 2 };

export function serverFirst(dirs: Dir[]): Dir[] {
	return [...dirs].sort((a, b) => HALF_RANK[a.half] - HALF_RANK[b.half]);
}

/** Which directory opens by default: the first one, after the sort. So `backend/`. */
export function openByDefault(role: Role): string | undefined {
	return serverFirst(role.dirs)[0]?.name;
}

/** Every place a technology actually appears, for the stack section and the palette's `stack`. */
export function where(tag: Tag): { company: string; path: string }[] {
	const hits: { company: string; path: string }[] = [];
	for (const role of EXPERIENCE) {
		for (const dir of role.dirs) {
			for (const file of dir.files) {
				if (file.lines.some((line) => line.tags?.includes(tag))) {
					hits.push({ company: role.company, path: `${dir.name}/${file.path}` });
				}
			}
		}
	}
	return hits;
}

/** Totals the build transcript prints, counted rather than claimed. */
export const TOTALS = {
	roles: EXPERIENCE.length,
	files: EXPERIENCE.reduce((sum, role) => sum + fileCount(role), 0),
	lines: EXPERIENCE.reduce((sum, role) => sum + lineCount(role), 0),
};
