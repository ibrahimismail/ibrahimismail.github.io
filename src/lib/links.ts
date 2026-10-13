/**
 * Which links should open in a tab of their own.
 *
 * Anything that would replace the page: another site, or a file the browser hands to a viewer.
 * `mailto:` and `tel:` are left alone deliberately — they hand off to an app without navigating,
 * and giving them a target leaves an empty tab behind in several browsers.
 */
export function opensElsewhere(href: string): boolean {
	return /^https?:/.test(href) || /\.(pdf|docx?)$/i.test(href);
}

/** Spread onto an anchor: `{...away(href)}`. Empty for links that stay put. */
export function away(href: string) {
	return opensElsewhere(href)
		? ({ target: '_blank', rel: 'noopener noreferrer' } as const)
		: ({} as const);
}
