import type { BusNode, Hop, NodeId, Scenario } from '../content/bus';

/**
 * Drives the bus diagram: one packet, a step log, a scrubber.
 *
 * Only `transform` and `opacity` are animated, through the Web Animations API — no offset-path,
 * which Safari has been uneven about, and no layout properties at all. A step is a promise that
 * resolves when its animation finishes, so playing a scenario is a plain `for await` rather
 * than a chain of timeouts that cannot be cancelled.
 */

const TRAVEL = 620;
const PAUSE = 260;

const still = matchMedia('(prefers-reduced-motion: reduce)');

export function mountBus() {
	document.querySelectorAll<HTMLElement>('[data-bus]').forEach((root) => {
		if (root.dataset.wired) return;
		root.dataset.wired = 'true';

		const scenarios: Scenario[] = JSON.parse(root.dataset.scenarios ?? '[]');
		const nodes: BusNode[] = JSON.parse(root.dataset.nodes ?? '[]');
		const at = (id: NodeId) => nodes.find((node) => node.id === id)!;

		const packet = root.querySelector<SVGCircleElement>('[data-packet]')!;
		const queue = root.querySelector<SVGGElement>('[data-queue]')!;
		const queueCount = root.querySelector<SVGTextElement>('[data-queue-count]')!;
		const log = root.querySelector<HTMLElement>('[data-log]')!;
		const blurb = root.querySelector<HTMLElement>('[data-blurb]')!;
		const controls = root.querySelector<HTMLElement>('[data-controls]')!;
		const scrub = root.querySelector<HTMLInputElement>('[data-scrub]')!;
		const playButton = root.querySelector<HTMLButtonElement>('[data-play]')!;

		controls.hidden = false;

		let scenario = scenarios[0];
		let step = 0;
		let queued = 0;
		/** Bumped on every interruption; an in-flight play loop sees the change and stops. */
		let run = 0;

		function renderLog() {
			log.replaceChildren(
				...scenario.hops.map((hop, index) => {
					const item = document.createElement('li');
					item.dataset.step = String(index);
					item.className =
						'flex gap-2.5 rounded px-1.5 py-1 text-text-lo transition-colors duration-200 aria-current:bg-accent/10 aria-current:text-text-hi';
					const number = document.createElement('span');
					number.ariaHidden = 'true';
					number.className = 'text-text-lo/50';
					number.textContent = String(index + 1).padStart(2, '0');
					const text = document.createElement('span');
					text.textContent = hop.label;
					item.append(number, text);
					return item;
				}),
			);
		}

		function markStep(index: number) {
			for (const item of log.querySelectorAll<HTMLElement>('[data-step]')) {
				if (Number(item.dataset.step) === index) {
					item.setAttribute('aria-current', 'step');
				} else {
					item.removeAttribute('aria-current');
				}
			}
			scrub.value = String(index);
		}

		function setNodeState(id: NodeId, dead: boolean) {
			const group = root.querySelector<SVGGElement>(`[data-node='${id}']`);
			group?.style.setProperty('opacity', dead ? '0.25' : '1');
		}

		function setQueue(count: number) {
			queued = Math.max(0, count);
			queueCount.textContent = String(queued);
			queue.style.opacity = queued > 0 ? '1' : '0';
		}

		function applyEvent(hop: Hop) {
			if (hop.event === 'kill') {
				setNodeState('sw', true);
			} else if (hop.event === 'respawn') {
				setNodeState('sw', false);
				setQueue(0);
			} else if (hop.event === 'queue') {
				setQueue(queued + 1);
			}
		}

		/** Move the packet from one node to the other. Resolves when it lands. */
		function travel(hop: Hop): Promise<void> {
			const from = at(hop.from);
			const to = at(hop.to);

			if (hop.from === hop.to || still.matches) {
				/* Nothing to travel: a bus event, or a reader who asked for no motion. */
				packet.style.opacity = hop.from === hop.to ? '0' : '1';
				packet.setAttribute('transform', `translate(${to.x} ${to.y})`);
				return new Promise((resolve) => setTimeout(resolve, still.matches ? 420 : 520));
			}

			packet.style.opacity = '1';
			const animation = packet.animate(
				[
					{ transform: `translate(${from.x}px, ${from.y}px)` },
					{ transform: `translate(${to.x}px, ${to.y}px)` },
				],
				{ duration: TRAVEL, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' },
			);
			return animation.finished.then(() => undefined);
		}

		async function play(from = 0) {
			const mine = ++run;
			packet.style.opacity = '0';

			for (let index = from; index < scenario.hops.length; index++) {
				if (mine !== run) return;
				step = index;
				markStep(index);
				const hop = scenario.hops[index];
				applyEvent(hop);
				await travel(hop);
				if (mine !== run) return;
				await new Promise((resolve) => setTimeout(resolve, PAUSE));
			}

			if (mine !== run) return;
			packet.style.opacity = '0';
		}

		/** Jump to a step without playing: everything up to it is applied instantly. */
		function seek(index: number) {
			run++;
			step = Math.min(Math.max(index, 0), scenario.hops.length - 1);
			setQueue(0);
			setNodeState('sw', false);
			for (let i = 0; i <= step; i++) applyEvent(scenario.hops[i]);
			const hop = scenario.hops[step];
			const to = at(hop.to);
			packet.getAnimations().forEach((animation) => animation.cancel());
			packet.setAttribute('transform', `translate(${to.x} ${to.y})`);
			packet.style.opacity = hop.from === hop.to ? '0' : '1';
			markStep(step);
		}

		function load(id: string, autoplay: boolean) {
			scenario = scenarios.find((candidate) => candidate.id === id) ?? scenarios[0];
			for (const button of root.querySelectorAll<HTMLButtonElement>('[data-scenario]')) {
				button.ariaPressed = String(button.dataset.scenario === scenario.id);
			}
			blurb.textContent = scenario.blurb;
			scrub.max = String(scenario.hops.length - 1);
			renderLog();
			setQueue(0);
			setNodeState('sw', false);
			if (autoplay) {
				void play(0);
			} else {
				seek(0);
			}
		}

		for (const button of root.querySelectorAll<HTMLButtonElement>('[data-scenario]')) {
			button.addEventListener('click', () => load(button.dataset.scenario!, true));
		}

		playButton.addEventListener('click', () => void play(0));
		root.querySelector('[data-next]')!.addEventListener('click', () => seek(step + 1));
		root.querySelector('[data-prev]')!.addEventListener('click', () => seek(step - 1));
		scrub.addEventListener('input', () => seek(Number(scrub.value)));

		/* A diagram nobody has scrolled to does not need to be running. */
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && !root.dataset.seen) {
						root.dataset.seen = 'true';
						void play(0);
					} else if (!entry.isIntersecting) {
						run++;
					}
				}
			},
			{ threshold: 0.4 },
		);
		observer.observe(root);

		seek(0);
	});
}
