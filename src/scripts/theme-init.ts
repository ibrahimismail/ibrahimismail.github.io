import { applyTheme, getStoredThemePreference, setThemePreference } from '../lib/theme';

applyTheme(getStoredThemePreference());

// Only visitors who explicitly picked 'system' follow the OS; anyone who has not chosen a
// theme stays on the default, and an explicit light/dark choice re-applies harmlessly.
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
	applyTheme(getStoredThemePreference());
});

document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
	button.addEventListener('click', () => {
		const isLight = document.documentElement.classList.contains('light');
		setThemePreference(isLight ? 'dark' : 'light');
	});
});

/*
 * Directories render open and are collapsed by CSS, so the first click on a collapsed one would
 * otherwise toggle `open` to false — the reader would click a closed-looking row and watch
 * nothing happen. Taking the attribute off hands it back to the native control, already open.
 */
document.addEventListener('click', (event) => {
	const summary = (event.target as HTMLElement | null)?.closest('summary');
	const details = summary?.parentElement;
	if (!(details instanceof HTMLDetailsElement) || !details.hasAttribute('data-collapsed')) {
		return;
	}
	event.preventDefault();
	details.removeAttribute('data-collapsed');
	details.open = true;
});

/*
 * ⌘P from anywhere should produce exactly what /cv produces: every directory expanded. The
 * print stylesheet forces the content visible on its own — that is the no-JS path and it works
 * — but engines disagree about how a closed <details> hides its content, and the disagreement
 * was costing a whole page. Opening them for the duration of the print run settles it, and the
 * reader gets their page back exactly as they left it.
 */
const opened = 'printOpened';

addEventListener('beforeprint', () => {
	document.querySelectorAll<HTMLDetailsElement>('details:not([open])').forEach((details) => {
		details.open = true;
		details.dataset[opened] = '';
	});
	document.querySelectorAll('details[data-collapsed]').forEach((details) => {
		details.removeAttribute('data-collapsed');
		details.setAttribute('data-was-collapsed', '');
	});
});

addEventListener('afterprint', () => {
	document.querySelectorAll<HTMLDetailsElement>(`details[data-print-opened]`).forEach((details) => {
		details.open = false;
		delete details.dataset[opened];
	});
	document.querySelectorAll('details[data-was-collapsed]').forEach((details) => {
		details.removeAttribute('data-was-collapsed');
		details.setAttribute('data-collapsed', '');
	});
});
