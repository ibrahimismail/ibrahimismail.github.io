export type ThemePreference = 'light' | 'dark' | 'system';

export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'ii:theme';

/* Dark is the house style: the build sequence and the system diagrams are authored for it. */
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'dark';

export function isThemePreference(value: string | null): value is ThemePreference {
	return value === 'light' || value === 'dark' || value === 'system';
}

export function getSystemTheme(): ResolvedTheme {
	if (typeof window === 'undefined') {
		return 'dark';
	}

	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function getStoredThemePreference(): ThemePreference {
	if (typeof localStorage === 'undefined') {
		return DEFAULT_THEME_PREFERENCE;
	}

	const stored = localStorage.getItem(THEME_STORAGE_KEY);
	return isThemePreference(stored) ? stored : DEFAULT_THEME_PREFERENCE;
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
	return preference === 'system' ? getSystemTheme() : preference;
}

export const THEME_COLORS: Record<ResolvedTheme, string> = {
	light: '#fafafa',
	dark: '#1b1e24',
};

/*
 * Light is the class that does the work, not dark: the root tokens are the dark set, so an
 * unstyled document is already the default theme and only light needs marking.
 */
export function applyTheme(preference: ThemePreference): ResolvedTheme {
	const resolved = resolveTheme(preference);
	document.documentElement.classList.toggle('light', resolved === 'light');
	document.documentElement.classList.toggle('dark', resolved === 'dark');
	document
		.querySelector('meta[name="theme-color"]')
		?.setAttribute('content', THEME_COLORS[resolved]);
	return resolved;
}

export function setThemePreference(preference: ThemePreference): ResolvedTheme {
	localStorage.setItem(THEME_STORAGE_KEY, preference);
	return applyTheme(preference);
}
