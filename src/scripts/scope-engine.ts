import type { Role, Scope } from '../content/scopes';

/**
 * The roles demo. The same resolver the component runs server-side, so what the page arrives
 * with and what the first click produces are the same computation — there is no second
 * implementation to drift.
 *
 * Everything it touches is already in the DOM: it rewrites marks, reasons and states rather
 * than building rows, which keeps the no-JavaScript rendering honest and the diff small.
 */

type Resolved = Map<string, string>;

function resolve(scopes: Scope[], roles: Role[], held: Set<string>): Resolved {
	const resolved: Resolved = new Map();

	for (const role of roles) {
		if (!held.has(role.id)) continue;
		for (const grant of role.grants) {
			if (!resolved.has(grant)) resolved.set(grant, role.label);
		}
	}

	/* Implications are transitive: devices.write grants users.read, which may grant more. */
	const queue = [...resolved.keys()];
	while (queue.length) {
		const id = queue.shift()!;
		const scope = scopes.find((candidate) => candidate.id === id);
		for (const implied of scope?.implies ?? []) {
			if (!resolved.has(implied)) {
				resolved.set(implied, `implied by ${id}`);
				queue.push(implied);
			}
		}
	}

	return resolved;
}

export function mountScopeEngine() {
	document.querySelectorAll<HTMLElement>('[data-scope-engine]').forEach((root) => {
		if (root.dataset.wired) return;
		root.dataset.wired = 'true';

		const scopes: Scope[] = JSON.parse(root.dataset.scopes ?? '[]');
		const roles: Role[] = JSON.parse(root.dataset.roles ?? '[]');
		const shipped: Scope = JSON.parse(root.dataset.shipped ?? 'null');

		const chips = [...root.querySelectorAll<HTMLButtonElement>('[data-role]')];
		const trace = root.querySelector<HTMLElement>('[data-trace]')!;
		const areas = [...root.querySelectorAll<HTMLElement>('[data-area]')];
		const shipButton = root.querySelector<HTMLButtonElement>('[data-ship]')!;
		const shipNote = root.querySelector<HTMLElement>('[data-ship-note]')!;

		const held = new Set(
			chips.filter((chip) => chip.ariaPressed === 'true').map((chip) => chip.dataset.role!),
		);

		/* A trace row per scope, reused rather than re-rendered. */
		const rows = new Map<string, HTMLElement>();
		for (const row of trace.querySelectorAll<HTMLElement>('[data-scope]')) {
			rows.set(row.dataset.scope!, row);
		}

		function rowFor(scope: Scope) {
			const existing = rows.get(scope.id);
			if (existing) return existing;

			/* A scope that arrived after the page did — the whole point of the demo. */
			const row = trace.firstElementChild!.cloneNode(true) as HTMLElement;
			row.dataset.scope = scope.id;
			row.querySelector('span:nth-child(2)')!.textContent = scope.id;
			row.classList.add('animate-[fade-in_320ms_var(--e-out)]');
			trace.append(row);
			rows.set(scope.id, row);
			return row;
		}

		function paint() {
			const resolved = resolve(scopes, roles, held);

			for (const scope of scopes) {
				const row = rowFor(scope);
				const reason = resolved.get(scope.id);
				const mark = row.querySelector<HTMLElement>('[data-mark]')!;
				const label = row.querySelector<HTMLElement>('span:nth-child(2)')!;
				const why = row.querySelector<HTMLElement>('[data-reason]')!;

				mark.textContent = reason ? '✓' : '✗';
				mark.className = reason ? 'text-sx-add' : 'text-sx-del';
				label.className = reason ? 'text-text-hi' : 'text-text-lo/50';
				why.textContent = reason ? `← ${reason}` : '← no grant';
			}

			for (const area of areas) {
				const inArea = scopes.filter((scope) => scope.area === area.dataset.area);
				const granted = inArea.filter((scope) => resolved.has(scope.id));
				area.dataset.state = granted.length ? 'open' : 'closed';
				area.querySelector<HTMLElement>('[data-area-detail]')!.textContent = granted.length
					? [...new Set(granted.map((scope) => scope.verb))].join(' + ')
					: 'no access';
			}
		}

		for (const chip of chips) {
			chip.addEventListener('click', () => {
				const id = chip.dataset.role!;
				if (held.has(id)) {
					held.delete(id);
				} else {
					held.add(id);
				}
				chip.ariaPressed = String(held.has(id));
				paint();
			});
		}

		shipButton.addEventListener('click', () => {
			if (!shipped || scopes.some((scope) => scope.id === shipped.id)) return;
			scopes.push(shipped);

			/* And a role to grant it, so the new permission is reachable rather than theoretical. */
			const policyAdmin = roles.find((role) => role.id === 'policy-admin');
			policyAdmin?.grants.push(shipped.id);

			shipButton.disabled = true;
			shipButton.classList.add('opacity-40');
			shipNote.textContent = `${shipped.id} arrived in metadata. No frontend release.`;
			shipNote.classList.add('text-sx-add');
			paint();
		});

		paint();
	});
}
