/**
 * Runs the build sequence.
 *
 * Three properties it has to have. It is a pure function of elapsed time, so skipping is
 * `elapsed = total` and one final pass — there is no state a half-finished run can be left in.
 * It never animates a layout property. And it can be stopped by anything the reader does,
 * because a visitor with forty seconds must never be made to wait.
 */
type Step = {
	tool: 'Read' | 'Write' | 'Bash';
	arg: string;
	out: string;
	reveals?: string;
	code: string[];
	optional?: boolean;
};

/*
 * Pacing. A line of code every LINE_MS, then REST on the finished file before the next one
 * opens.
 *
 * REST is the whole difference between "it is writing files" and "it keeps abandoning them": at
 * 260ms the pane cleared almost the instant the last line landed, so no file ever looked
 * finished. The card settles and the pane is marked saved at the start of that rest, not the
 * end of it, so the completion is what the reader is looking at while it holds.
 */
const PROMPT_MS = 620;
const PLAN_MS = 480;
const LINE_MS = 40;
const REST = 720;
const BASH_MS = 680;
/* A long declaration streams faster per line rather than making the whole sequence long. */
const WRITE_CAP = 1200;

/** What the page actually cost to load. Measured, never asserted. */
function measured() {
	try {
		const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
		const nav = performance.getEntriesByType('navigation')[0] as
			| PerformanceNavigationTiming
			| undefined;
		const bytes =
			resources.reduce((sum, e) => sum + (e.transferSize || e.encodedBodySize || 0), 0) +
			(nav?.transferSize ?? 0);
		const js = resources.filter((entry) => entry.initiatorType === 'script').length;
		return { kb: Math.round(bytes / 1024), js };
	} catch {
		return { kb: 0, js: 0 };
	}
}

export function runBuild(overlay: HTMLElement) {
	const root = document.documentElement;
	const transcript = overlay.querySelector<HTMLElement>('[data-transcript]')!;
	const codeList = overlay.querySelector<HTMLOListElement>('[data-code]')!;
	const codeName = overlay.querySelector<HTMLElement>('[data-code-name]')!;
	const codeState = overlay.querySelector<HTMLElement>('[data-code-state]')!;
	const codeDot = overlay.querySelector<HTMLElement>('[data-code-dot]')!;
	const promptLine = overlay.querySelector<HTMLElement>('[data-prompt]')!;
	const headState = overlay.querySelector<HTMLElement>('[data-head-state]')!;
	const skipButton = overlay.querySelector<HTMLButtonElement>('[data-skip]')!;

	const compact = window.innerWidth < 640;
	const all: Step[] = JSON.parse(overlay.dataset.steps ?? '[]');
	const steps = compact ? all.filter((step) => !step.optional) : all;
	const plan: string[] = JSON.parse(overlay.dataset.plan ?? '[]');
	const pages = Number(overlay.dataset.pages ?? 0);

	/* The flag carries the preset's own id, not the first word of its prose label. */
	const prompt = `build portfolio --target=${root.dataset.role || 'full-stack'}`;

	/* Durations, derived from the work each step actually does: write, then rest on it. */
	const writes = steps.map((step) =>
		step.tool === 'Bash' ? BASH_MS : Math.min(step.code.length * LINE_MS, WRITE_CAP),
	);
	const spans = writes.map((write) => write + REST);
	const heads = PROMPT_MS + PLAN_MS;
	const total = heads + spans.reduce((sum, span) => sum + span, 0) + 420;

	let frame = 0;
	let done = false;
	let planted = false;
	let rendered = -1;
	let shownFile = -1;
	let shownLines = 0;
	const started = performance.now();

	function reveal(id?: string) {
		if (!id) return;
		document.querySelector(`[data-build='${id}']`)?.classList.add('built');
	}

	function card(step: Step, index: number) {
		const row = document.createElement('div');
		row.dataset.card = String(index);
		row.className =
			'shrink-0 rounded border border-border/70 bg-surface/40 px-2.5 py-1.5 transition-colors duration-200 sm:py-2';

		const head = document.createElement('p');
		head.className = 'flex items-baseline gap-2';
		const mark = document.createElement('span');
		mark.dataset.mark = '';
		mark.className = 'text-sx-num';
		mark.textContent = '◐';
		const tool = document.createElement('span');
		tool.className = 'text-sx-key';
		tool.textContent = step.tool;
		const arg = document.createElement('span');
		arg.className = 'truncate text-text-hi';
		arg.textContent = step.arg;
		head.append(mark, tool, arg);

		const note = document.createElement('p');
		note.dataset.note = '';
		note.className = 'mt-1 pl-5 text-[0.75rem] text-text-lo';
		note.textContent = '…';

		row.append(head, note);
		return row;
	}

	function settle(index: number, step: Step, span: number) {
		const row = transcript.querySelector<HTMLElement>(`[data-card='${index}']`);
		if (!row || row.dataset.settled) return;
		row.dataset.settled = 'true';
		row.classList.add('border-sx-add/30');
		row.querySelector<HTMLElement>('[data-mark]')!.textContent = '✓';
		row.querySelector<HTMLElement>('[data-mark]')!.className = 'text-sx-add';

		const { kb, js } = measured();
		const note = row.querySelector<HTMLElement>('[data-note]')!;
		note.textContent =
			step.tool === 'Bash'
				? `✓ ${pages} pages · ${js} js requests · ${kb} kB · ${Math.round(span)} ms`
				: `${step.out}${step.code.length ? ` · ${step.code.length} lines` : ''} · ${Math.round(span)} ms`;
		note.className = 'mt-1 pl-5 text-[0.75rem] text-sx-add/90';
	}

	/** The code pane. Lines are appended, never re-rendered — one write per frame at most. */
	function paintCode(index: number, lines: number, step: Step) {
		if (index !== shownFile) {
			shownFile = index;
			shownLines = 0;
			codeList.replaceChildren();
			codeName.textContent = step.arg;
			codeState.textContent = '';
			codeDot.className = 'size-1.5 rounded-full bg-sx-num';
		}
		while (shownLines < lines && shownLines < step.code.length) {
			const row = document.createElement('li');
			row.className = 'flex gap-3';
			const number = document.createElement('span');
			number.className = 'w-6 shrink-0 text-right text-[0.6875rem] text-text-lo/35';
			number.textContent = String(shownLines + 1);
			const body = document.createElement('span');
			/*
			 * Wrapped on a phone, where a clipped line reads as broken, and left as written on a
			 * laptop, where there is room for it. A wrapped line and one gutter number is what an
			 * editor with soft wrap does, so the mismatch is the familiar one.
			 */
			body.className =
				'min-w-0 break-words whitespace-pre-wrap text-text-hi sm:break-normal sm:whitespace-pre';
			body.innerHTML = step.code[shownLines];
			row.append(number, body);
			codeList.append(row);
			shownLines++;
		}
	}

	function paint(elapsed: number) {
		promptLine.textContent = prompt.slice(
			0,
			Math.ceil(prompt.length * Math.min(elapsed / PROMPT_MS, 1)),
		);

		if (!planted && elapsed >= PROMPT_MS) {
			planted = true;
			const block = document.createElement('div');
			block.className = 'space-y-0.5 border-l border-border pl-3 text-text-lo';
			for (const line of plan) {
				const item = document.createElement('p');
				item.textContent = line;
				block.append(item);
			}
			transcript.append(block);
		}

		let at = heads;
		for (let index = 0; index < steps.length; index++) {
			const step = steps[index];
			const write = writes[index];
			const span = spans[index];

			if (elapsed >= at && index > rendered) {
				rendered = index;
				transcript.append(card(step, index));
				transcript.scrollTop = transcript.scrollHeight;
			}

			/* Writing. */
			if (elapsed >= at && elapsed < at + write) {
				const progress = (elapsed - at) / Math.max(write, 1);
				if (step.code.length) {
					paintCode(index, Math.ceil(progress * step.code.length), step);
				} else {
					codeName.textContent = step.arg;
				}
			}

			/* Written — and it stays on screen, finished, for the whole of REST. */
			if (elapsed >= at + write) {
				if (step.code.length) {
					paintCode(index, step.code.length, step);
					if (shownFile === index && codeState.textContent !== 'saved') {
						codeState.textContent = 'saved';
						codeDot.className = 'size-1.5 rounded-full bg-sx-add';
					}
				}
				settle(index, step, write);
				reveal(step.reveals);
			}

			at += span;
		}
	}

	/*
	 * Two backstops, because the sequence hides the document behind it and must never be the
	 * reason someone cannot read the page. requestAnimationFrame does not fire in a backgrounded
	 * tab — open the site in a new tab, switch away, come back, and without the timer the overlay
	 * would still be sitting there. And leaving the tab at all ends the show: nobody is watching.
	 */
	let watchdog = 0;
	const onHidden = () => {
		if (document.visibilityState === 'hidden') finish();
	};

	function finish() {
		if (done) return;
		done = true;
		cancelAnimationFrame(frame);
		clearTimeout(watchdog);
		document.removeEventListener('visibilitychange', onHidden);
		detach();

		paint(total);
		headState.textContent = 'ready';
		headState.className = 'text-sx-add';
		for (const section of document.querySelectorAll('[data-build]')) {
			section.classList.add('built');
		}
		overlay.dataset.state = 'leaving';

		setTimeout(() => {
			overlay.remove();
			root.classList.remove('js-build');
		}, 300);
	}

	function tick(now: number) {
		const elapsed = now - started;
		paint(elapsed);
		if (elapsed >= total) {
			finish();
			return;
		}
		frame = requestAnimationFrame(tick);
	}

	/* Anything at all means "I would rather read the page". */
	const events = ['wheel', 'touchstart', 'keydown', 'pointerdown', 'scroll'] as const;
	function onInput(event: Event) {
		if (event.type === 'keydown' && (event as KeyboardEvent).repeat) return;
		finish();
	}
	function detach() {
		for (const type of events) removeEventListener(type, onInput, true);
	}
	for (const type of events) addEventListener(type, onInput, { capture: true, passive: true });
	skipButton.addEventListener('click', finish);

	watchdog = window.setTimeout(finish, total + 1500);
	document.addEventListener('visibilitychange', onHidden);

	frame = requestAnimationFrame(tick);
	return finish;
}
