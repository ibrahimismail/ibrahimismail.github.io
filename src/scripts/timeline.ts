/**
 * The commit log's interactions: a live filter and keyboard movement.
 *
 * Both are enhancements over markup that already works — every line is in the DOM, and every
 * directory opens by clicking its summary. Neither is the only way to reach anything, which is
 * why the toolbar stays hidden until this runs.
 */
function normalise(value: string) {
	return value.toLowerCase().trim();
}

export function mountTimeline() {
	document.querySelectorAll<HTMLElement>('#timeline').forEach((root) => {
		if (root.dataset.wired) return;
		root.dataset.wired = 'true';

		const tools = root.querySelector<HTMLElement>('[data-timeline-tools]')!;
		const filter = root.querySelector<HTMLInputElement>('[data-filter]')!;
		const status = root.querySelector<HTMLElement>('[data-filter-status]')!;
		const lines = [...root.querySelectorAll<HTMLElement>('[data-line]')];
		const files = [...root.querySelectorAll<HTMLElement>('[data-file]')];
		const dirs = [...root.querySelectorAll<HTMLDetailsElement>('details')];
		const roles = [...root.querySelectorAll<HTMLElement>('[data-role-entry]')];

		tools.hidden = false;

		/* The text each line is matched against, read once rather than on every keystroke. */
		const haystack = new Map<HTMLElement, string>();
		for (const line of lines) {
			haystack.set(line, normalise(line.textContent ?? ''));
		}
		for (const file of files) {
			const path = file.querySelector('[data-path]')?.textContent ?? '';
			haystack.set(file, normalise(path));
		}

		function applyFilter(raw: string) {
			const query = normalise(raw);

			if (!query) {
				for (const node of [...lines, ...files, ...roles]) node.hidden = false;
				for (const dir of dirs) {
					dir.open = true;
					if (dir.dataset.wasCollapsed !== undefined) {
						dir.setAttribute('data-collapsed', '');
						delete dir.dataset.wasCollapsed;
					}
				}
				status.hidden = true;
				return;
			}

			let hits = 0;
			for (const line of lines) {
				const match = haystack.get(line)!.includes(query);
				line.hidden = !match;
				if (match) hits++;
			}

			for (const file of files) {
				const own = haystack.get(file)!.includes(query);
				const kept = [...file.querySelectorAll<HTMLElement>('[data-line]')].some(
					(line) => !line.hidden,
				);
				if (own) {
					file.hidden = false;
					for (const line of file.querySelectorAll<HTMLElement>('[data-line]')) {
						line.hidden = false;
					}
				} else {
					file.hidden = !kept;
				}
			}

			for (const dir of dirs) {
				const kept = [...dir.querySelectorAll<HTMLElement>('[data-file]')].some(
					(file) => !file.hidden,
				);
				/* A filter that leaves a match inside a closed directory has hidden its own result. */
				if (dir.hasAttribute('data-collapsed')) {
					dir.dataset.wasCollapsed = '';
					dir.removeAttribute('data-collapsed');
				}
				dir.open = kept;
				dir.hidden = !kept;
			}

			for (const role of roles) {
				role.hidden = ![...role.querySelectorAll<HTMLElement>('[data-file]')].some(
					(file) => !file.hidden,
				);
			}

			status.hidden = false;
			status.textContent =
				hits === 0
					? `no lines match “${raw.trim()}”`
					: `${hits} line${hits === 1 ? '' : 's'} match “${raw.trim()}”`;
		}

		filter.addEventListener('input', () => applyFilter(filter.value));
		filter.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				filter.value = '';
				applyFilter('');
				filter.blur();
			}
		});

		/*
		 * Keyboard: `/` to filter, j/k between directories. Deliberately not a focus trap — tab
		 * still walks the page the way it did before any of this was wired up.
		 */
		document.addEventListener('keydown', (event) => {
			const typing =
				event.target instanceof HTMLElement &&
				(event.target.tagName === 'INPUT' || event.target.isContentEditable);

			if (event.key === '/' && !typing) {
				event.preventDefault();
				filter.focus();
				return;
			}

			if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
			if (event.key !== 'j' && event.key !== 'k') return;

			const summaries = dirs
				.filter((dir) => !dir.hidden)
				.map((dir) => dir.querySelector('summary')!);
			if (!summaries.length) return;

			const here = summaries.indexOf(document.activeElement as HTMLElement);
			const next =
				event.key === 'j'
					? Math.min(here + 1, summaries.length - 1)
					: Math.max(here - 1, 0);
			summaries[here === -1 ? 0 : next].focus();
			event.preventDefault();
		});
	});
}
