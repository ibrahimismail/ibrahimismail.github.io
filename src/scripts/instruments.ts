/**
 * The live column of the instruments panel.
 *
 * Everything here is measured on the reader's own page view, with the Performance API, as it
 * happens. That is the whole point of the section: an animated counter ticking up to 10× is
 * decoration, and a number measured in front of you is evidence. Anything that cannot be
 * measured in a given browser says so rather than showing a plausible figure.
 */
type Stats = {
	builtAt: string;
	pages: number;
	indexGzip: number;
	cssGzip: number;
	jsGzip: number;
};

function set(root: HTMLElement, name: string, value: string) {
	const cell = root.querySelector<HTMLElement>(`[data-live='${name}']`);
	if (cell) cell.textContent = value;
}

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} kB`;
const ms = (value: number) => `${Math.round(value)} ms`;

export function mountInstruments() {
	const root = document.querySelector<HTMLElement>('[data-instruments]');
	if (!root || root.dataset.wired) return;
	root.dataset.wired = 'true';

	/* What this page cost to load, from the entries the browser recorded for it. */
	function transferred() {
		try {
			const resources = performance.getEntriesByType(
				'resource',
			) as PerformanceResourceTiming[];
			const nav = performance.getEntriesByType('navigation')[0] as
				| PerformanceNavigationTiming
				| undefined;
			const bytes =
				resources.reduce(
					(sum, entry) => sum + (entry.transferSize || entry.encodedBodySize || 0),
					0,
				) + (nav?.transferSize ?? 0);
			set(root, 'transferred', kb(bytes));
			set(root, 'requests', String(resources.length + 1));
		} catch {
			set(root, 'transferred', 'not measurable');
		}
	}

	function observe(type: string, handle: (entry: PerformanceEntry) => void) {
		try {
			new PerformanceObserver((list) => list.getEntries().forEach(handle)).observe({
				type,
				buffered: true,
			} as PerformanceObserverInit);
		} catch {
			/* An engine without this entry type leaves the cell at its placeholder. */
		}
	}

	observe('largest-contentful-paint', (entry) => set(root, 'lcp', ms(entry.startTime)));
	observe('first-input', (entry) =>
		set(root, 'inp', ms((entry as PerformanceEventTiming).processingStart - entry.startTime)),
	);

	let shift = 0;
	observe('layout-shift', (entry) => {
		const cls = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
		if (cls.hadRecentInput) return;
		shift += cls.value;
		set(root, 'cls', shift.toFixed(3));
	});

	/* A short frame-time sample, taken once, rather than a permanent rAF loop. */
	let frames = 0;
	const started = performance.now();
	function sample(now: number) {
		frames++;
		if (now - started < 1000) {
			requestAnimationFrame(sample);
		} else {
			set(root, 'frame', `${((now - started) / frames).toFixed(1)} ms`);
		}
	}
	requestAnimationFrame(sample);

	set(root, 'nodes', String(document.querySelectorAll('*').length));

	if (document.readyState === 'complete') {
		transferred();
	} else {
		addEventListener('load', transferred, { once: true });
	}

	/* The build's own figures, written by the build. One request, 120 bytes, first-party. */
	fetch('/stats.json')
		.then((response) => (response.ok ? (response.json() as Promise<Stats>) : null))
		.then((stats) => {
			if (!stats) return;
			set(root, 'page-html', kb(stats.indexGzip));
			set(root, 'css', kb(stats.cssGzip));
			set(root, 'js', kb(stats.jsGzip));
			set(root, 'pages', String(stats.pages));
			set(
				root,
				'built',
				new Date(stats.builtAt).toLocaleDateString('en-GB', {
					day: 'numeric',
					month: 'short',
					year: 'numeric',
				}),
			);
		})
		.catch(() => {
			/* Served without the stats file: the measured column still stands on its own. */
		});
}
