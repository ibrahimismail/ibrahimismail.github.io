/**
 * The KlikNote demo. Deliberately tiny — the product's argument is that there is no latency and
 * no account, and the fastest way to make that argument is to let someone type into it.
 *
 * The request counter is measured, not asserted: it reads the Performance API for anything this
 * page fetched after the island mounted. If a future change ever adds a network call here, the
 * badge turns itself into a correction.
 */
const KEY = 'kliknote:demo';

type Note = { text: string; note: string };

export function mountKlikNote() {
	document.querySelectorAll<HTMLElement>('[data-kliknote]').forEach((root) => {
		if (root.dataset.wired) return;
		root.dataset.wired = 'true';

		const input = root.querySelector<HTMLInputElement>('[data-input]')!;
		const list = root.querySelector<HTMLElement>('[data-notes]')!;
		const network = root.querySelector<HTMLElement>('[data-network]')!;

		const seeded: Note[] = [...list.querySelectorAll('[data-note]')].map((item) => ({
			text: item.firstElementChild!.textContent ?? '',
			note: item.lastElementChild!.textContent ?? '',
		}));

		let notes: Note[] = seeded;
		let selected = -1;

		try {
			const stored = localStorage.getItem(KEY);
			if (stored) notes = JSON.parse(stored);
		} catch {
			/* Private windows and blocked storage are fine; the seed stands in. */
		}

		/*
		 * The badge counts requests made after the page finished loading — not after this script
		 * mounted. Mounting happens before the fonts and the stylesheet have landed, so the
		 * earlier version proudly reported five requests the demo had nothing to do with.
		 */
		let baseline = performance.getEntriesByType('resource').length;

		function rebase() {
			baseline = performance.getEntriesByType('resource').length;
			render();
		}

		function save() {
			try {
				localStorage.setItem(KEY, JSON.stringify(notes.slice(0, 12)));
			} catch {
				/* Nothing to do, and nothing worth telling the reader about. */
			}
		}

		function render() {
			list.replaceChildren(
				...notes.map((entry, index) => {
					const item = document.createElement('li');
					item.dataset.note = '';
					item.className =
						'flex items-baseline justify-between gap-3 rounded border border-transparent px-2.5 py-1.5 font-mono text-[0.8125rem] text-text-hi aria-selected:border-border aria-selected:bg-surface';
					if (index === selected) item.setAttribute('aria-selected', 'true');

					const text = document.createElement('span');
					text.textContent = entry.text;
					const when = document.createElement('span');
					when.className = 'shrink-0 text-[0.6875rem] text-text-lo';
					when.textContent = entry.note;
					item.append(text, when);
					return item;
				}),
			);

			/* Whatever happened above, it did not involve the network. Prove it. */
			const added = performance.getEntriesByType('resource').length - baseline;
			network.textContent = `network · ${added} request${added === 1 ? '' : 's'}`;
			network.classList.toggle('text-sx-add', added === 0);
			network.classList.toggle('text-warn', added !== 0);
		}

		input.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' && input.value.trim()) {
				notes = [{ text: input.value.trim(), note: 'just now' }, ...notes];
				input.value = '';
				selected = 0;
				save();
				render();
			} else if (event.key === 'Escape') {
				input.value = '';
			} else if (event.key === 'ArrowDown') {
				event.preventDefault();
				selected = Math.min(selected + 1, notes.length - 1);
				render();
			} else if (event.key === 'ArrowUp') {
				event.preventDefault();
				selected = Math.max(selected - 1, -1);
				render();
			} else if ((event.key === 'Backspace' || event.key === 'Delete') && !input.value && selected >= 0) {
				event.preventDefault();
				notes = notes.filter((_, index) => index !== selected);
				selected = Math.min(selected, notes.length - 1);
				save();
				render();
			}
		});

		list.addEventListener('click', (event) => {
			const item = (event.target as HTMLElement).closest('[data-note]');
			if (!item) return;
			selected = [...list.children].indexOf(item);
			render();
			input.focus();
		});

		render();

		if (document.readyState === 'complete') {
			rebase();
		} else {
			addEventListener('load', rebase, { once: true });
		}
	});
}
