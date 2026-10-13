import { targetFor } from '../content/targets';

/**
 * The parts of `?role=` that CSS cannot do: which directory of the timeline is already open,
 * and the line that names who the link was written for.
 *
 * The ordering itself is handled by generated CSS before first paint — see OrderStyles — so
 * nothing here moves anything the reader has already seen.
 */
export function applyTargeting() {
	const root = document.documentElement;

	const addressee = root.dataset.for;
	const line = document.querySelector<HTMLElement>('[data-addressee]');
	if (addressee && line) {
		line.textContent = `Built this view for ${addressee}.`;
		line.hidden = false;
	}

	if (!root.dataset.role) return;
	const target = targetFor(root.dataset.role);

	/*
	 * CSS `order` moved the sections before first paint, which is what keeps the arrangement
	 * from visibly rearranging itself. But `order` does not move the tab sequence, so without
	 * this the keyboard would walk the page in an order nobody can see. Matching the DOM to the
	 * visual order afterwards is invisible — everything is already where it ends up.
	 */
	const container = document.querySelector<HTMLElement>('[data-sections]');
	if (container) {
		for (const id of target.order) {
			const section = container.querySelector<HTMLElement>(`[data-build='${id}']`);
			if (section) container.append(section);
		}
	}

	for (const details of document.querySelectorAll<HTMLDetailsElement>('[data-dir]')) {
		const wanted = target.openDirs.includes(details.dataset.dir ?? '');
		details.toggleAttribute('data-collapsed', !wanted);
		details.open = true;
	}
}
