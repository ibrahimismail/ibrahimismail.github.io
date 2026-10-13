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
