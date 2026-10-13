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

	for (const details of document.querySelectorAll<HTMLDetailsElement>('[data-dir]')) {
		const wanted = target.openDirs.includes(details.dataset.dir ?? '');
		details.toggleAttribute('data-collapsed', !wanted);
		details.open = true;
	}
}
