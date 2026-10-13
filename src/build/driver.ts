import { measure, steps, type Facts, type Step } from './script';

/**
 * Runs the build sequence.
 *
 * Three properties it has to have. It is a pure function of elapsed time, so skipping is
 * `elapsed = total` and one final pass — there is no state a half-finished run can be left in.
 * It never animates a layout property. And it can be stopped at any point by anything the
 * reader does, because a visitor with forty seconds must never be made to wait.
 */

const SEEN_SESSION = 'ii:built';
const SEEN_STAMP = 'ii:built-at';
const WEEK = 7 * 24 * 60 * 60 * 1000;

function remember() {
	try {
		sessionStorage.setItem(SEEN_SESSION, '1');
		localStorage.setItem(SEEN_STAMP, String(Date.now()));
	} catch {
		/* A reader whose storage is blocked watches it once more. No harm done. */
	}
}

export function seenRecently(): boolean {
	try {
		if (sessionStorage.getItem(SEEN_SESSION)) return true;
		const stamp = Number(localStorage.getItem(SEEN_STAMP) ?? 0);
		return stamp > 0 && Date.now() - stamp < WEEK;
	} catch {
		return false;
	}
}

export function runBuild(overlay: HTMLElement, facts: Omit<Facts, 'transferredKb' | 'jsRequests'>) {
	const root = document.documentElement;
	const transcript = overlay.querySelector<HTMLElement>('[data-transcript]')!;
	const promptLine = overlay.querySelector<HTMLElement>('[data-prompt]')!;
	const skipButton = overlay.querySelector<HTMLButtonElement>('[data-skip]')!;

	const compact = window.innerWidth < 640;
	const timeline = steps({ ...facts, ...measure() }, compact);
	const total = timeline.reduce((sum, step) => sum + step.ms, 0);

	let frame = 0;
	let done = false;
	let rendered = -1;
	const started = performance.now();

	function reveal(id?: string) {
		if (!id) return;
		document.querySelector(`[data-build='${id}']`)?.classList.add('built');
	}

	function card(step: Step): HTMLElement {
		const line = document.createElement('div');

		if (step.kind === 'plan') {
			line.className = 'mt-1 space-y-0.5 border-l border-border pl-3 text-text-lo';
			for (const text of step.lines) {
				const item = document.createElement('p');
				item.textContent = text;
				line.append(item);
			}
			return line;
		}

		if (step.kind === 'done') {
			line.className = 'mt-2 text-sx-add';
			line.textContent = step.text;
			return line;
		}

		if (step.kind === 'tool') {
			line.className = 'mt-1.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5';
			const mark = document.createElement('span');
			mark.className = 'text-accent';
			mark.textContent = '⏺';
			const tool = document.createElement('span');
			tool.className = 'text-sx-key';
			tool.textContent = step.tool;
			const arg = document.createElement('span');
			arg.className = 'text-text-hi';
			arg.textContent = step.arg;
			const out = document.createElement('span');
			out.className = 'text-text-lo';
			out.textContent = step.out;
			line.append(mark, tool, arg, out);
			return line;
		}

		line.className = 'text-text-hi';
		line.textContent = step.text;
		return line;
	}

	/** The prompt types itself by index — one text write per frame, never innerHTML +=. */
	function typePrompt(step: Step, progress: number) {
		if (step.kind !== 'prompt') return;
		const shown = Math.ceil(step.text.length * Math.min(progress, 1));
		promptLine.textContent = step.text.slice(0, shown);
	}

	function paint(elapsed: number) {
		let at = 0;
		for (let index = 0; index < timeline.length; index++) {
			const step = timeline[index];
			const end = at + step.ms;

			if (elapsed >= at && index > rendered) {
				rendered = index;
				if (step.kind !== 'prompt') {
					transcript.append(card(step));
					transcript.scrollTop = transcript.scrollHeight;
				}
				if (step.kind === 'tool') reveal(step.reveals);
			}

			if (step.kind === 'prompt' && elapsed < end) {
				typePrompt(step, (elapsed - at) / step.ms);
			} else if (step.kind === 'prompt' && rendered >= index) {
				typePrompt(step, 1);
			}

			at = end;
		}
	}

	/*
	 * Two backstops, because the sequence hides the document behind it and must never be the
	 * reason someone cannot read the page.
	 *
	 * requestAnimationFrame does not fire in a backgrounded tab — open the site in a new tab,
	 * switch away, come back, and without the timer the overlay would still be sitting there.
	 * And leaving the tab at all ends the show: there is nobody watching it.
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
		for (const section of document.querySelectorAll('[data-build]')) {
			section.classList.add('built');
		}
		overlay.dataset.state = 'leaving';
		remember();

		setTimeout(() => {
			overlay.remove();
			root.classList.remove('js-build');
		}, 260);
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
