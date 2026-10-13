/**
 * The palette's behaviour. Deterministic, local, and honest about what it is not.
 *
 * Every command does something the page can already do another way, which is the rule that
 * keeps a keyboard affordance from becoming a keyboard requirement.
 */
type Entry = { id: string; label: string };

declare global {
	interface Window {
		__paletteData?: { sections: Entry[]; scenarios: Entry[] };
	}
}

type Command = {
	name: string;
	hint: string;
	run: () => void;
};

function scrollTo(id: string) {
	document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setTheme(value: string) {
	const root = document.documentElement;
	const resolved =
		value === 'system'
			? matchMedia('(prefers-color-scheme: light)').matches
				? 'light'
				: 'dark'
			: value;
	root.classList.toggle('light', resolved === 'light');
	root.classList.toggle('dark', resolved === 'dark');
	try {
		localStorage.setItem('ii:theme', value);
	} catch {
		/* Not remembering a theme is not worth handling. */
	}
}

export function mountPalette() {
	const dialog = document.querySelector<HTMLDialogElement>('[data-palette]');
	if (!dialog || dialog.dataset.wired) return;
	dialog.dataset.wired = 'true';

	const data = window.__paletteData ?? { sections: [], scenarios: [] };
	const input = dialog.querySelector<HTMLInputElement>('[data-palette-input]')!;
	const list = dialog.querySelector<HTMLElement>('[data-palette-list]')!;
	const opener = document.querySelector<HTMLButtonElement>('[data-palette-open]')!;

	const filterField = () => document.querySelector<HTMLInputElement>('[data-filter]');

	const commands: Command[] = [
		...data.sections.map((section) => ({
			name: `goto ${section.label}`,
			hint: `#${section.id}`,
			run: () => scrollTo(section.id),
		})),
		...data.scenarios.map((scenario) => ({
			name: `run ${scenario.label}`,
			hint: 'extension bus',
			run: () => {
				scrollTo('systems');
				document
					.querySelector<HTMLButtonElement>(`[data-scenario='${scenario.id}']`)
					?.click();
			},
		})),
		{ name: 'theme dark', hint: 'one dark', run: () => setTheme('dark') },
		{ name: 'theme light', hint: 'one light', run: () => setTheme('light') },
		{ name: 'theme system', hint: 'follow the os', run: () => setTheme('system') },
		{
			name: 'cv',
			hint: 'download the pdf',
			run: () => {
				/* A click on a `download` anchor is the only way to ask for a save rather than
				   a view; window.open hands it to the browser's PDF viewer instead. */
				const link = document.createElement('a');
				link.href = '/Ibrahim_Ismail_CV.pdf';
				link.download = '';
				document.body.append(link);
				link.click();
				link.remove();
			},
		},
		{
			name: 'replay',
			hint: 'watch the build again',
			run: () => location.reload(),
		},
		{ name: 'help', hint: 'what this takes', run: () => input.focus() },
	];

	let shown: Command[] = commands;
	let active = 0;

	function render(query: string) {
		const q = query.trim().toLowerCase();

		/* `find x` and `stack x` are the same thing: hand the term to the timeline's filter. */
		const search = /^(find|stack)\s+(.+)$/.exec(q);
		if (search) {
			shown = [
				{
					name: `find “${search[2]}”`,
					hint: 'filter the career',
					run: () => {
						const field = filterField();
						if (!field) return;
						field.value = search[2];
						field.dispatchEvent(new Event('input', { bubbles: true }));
						scrollTo('timeline');
					},
				},
			];
		} else {
			shown = commands.filter((command) => !q || command.name.toLowerCase().includes(q));
		}

		if (!shown.length) {
			shown = [
				{
					name: 'not a chatbot — try help',
					hint: 'no model here, and nothing to wait for',
					run: () => {
						input.value = '';
						render('');
					},
				},
			];
		}

		active = 0;
		list.replaceChildren(
			...shown.map((command, index) => {
				const item = document.createElement('li');
				item.role = 'option';
				item.ariaSelected = String(index === active);
				item.className =
					'flex cursor-pointer items-baseline justify-between gap-4 rounded px-2.5 py-1.5 text-text-lo aria-selected:bg-accent/10 aria-selected:text-text-hi';
				const name = document.createElement('span');
				name.textContent = command.name;
				const hint = document.createElement('span');
				hint.className = 'text-[0.6875rem] text-text-lo/70';
				hint.textContent = command.hint;
				item.append(name, hint);
				item.addEventListener('click', () => {
					dialog.close();
					command.run();
				});
				return item;
			}),
		);
	}

	function move(delta: number) {
		active = Math.min(Math.max(active + delta, 0), shown.length - 1);
		[...list.children].forEach((item, index) => {
			(item as HTMLElement).ariaSelected = String(index === active);
		});
		list.children[active]?.scrollIntoView({ block: 'nearest' });
	}

	function open() {
		if (dialog.open) return;
		input.value = '';
		render('');
		dialog.showModal();
		input.focus();
	}

	opener.addEventListener('click', open);
	input.addEventListener('input', () => render(input.value));

	input.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			move(1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			move(-1);
		} else if (event.key === 'Enter') {
			event.preventDefault();
			const command = shown[active];
			dialog.close();
			command?.run();
		}
	});

	document.addEventListener('keydown', (event) => {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			open();
		}
	});

	/* Clicking the backdrop is a click whose target is the dialog itself. */
	dialog.addEventListener('click', (event) => {
		if (event.target === dialog) dialog.close();
	});
}
