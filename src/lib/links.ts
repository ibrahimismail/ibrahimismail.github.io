/**
 * How a link should behave, decided from its href so the rule lives in one place.
 *
 * A file gets `download`, which is what a button labelled "Download CV" promises — without it
 * the browser hands the PDF to its own viewer and the reader has to save it themselves. It only
 * works same-origin, which the CV is.
 *
 * Another site opens beside the page rather than replacing it. `mailto:` and `tel:` are left
 * alone deliberately: they hand off to an app without navigating, and giving them a target
 * leaves an empty tab behind in several browsers.
 */
export function isFile(href: string): boolean {
	return /\.(pdf|docx?)$/i.test(href);
}

export function isExternal(href: string): boolean {
	return /^https?:/.test(href);
}

/** Spread onto an anchor: `{...away(href)}`. Empty for links that should just navigate. */
export function away(href: string) {
	if (isFile(href)) {
		return { download: true } as const;
	}
	if (isExternal(href)) {
		return { target: '_blank', rel: 'noopener noreferrer' } as const;
	}
	return {} as const;
}
