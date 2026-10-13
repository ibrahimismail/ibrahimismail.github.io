/**
 * Colours the achievement lines the way an editor colours code.
 *
 * The palette was chosen so colour would carry meaning for free, and then the diff was shipped
 * as grey prose in a monospace font — the one surface where that promise had to land. This is
 * the fix: the terms a reader is scanning for (the languages, the products, the numbers, the
 * files) get the hue an editor would give them, and the connective tissue stays plain.
 *
 * A dictionary rather than a parser, because these are English sentences with technology in
 * them, not source. Longest match wins, so "Protocol Buffers" is not two words.
 */
export type Kind = 'verb' | 'tech' | 'name' | 'concept' | 'num' | 'path' | 'plain';

export type Token = { text: string; kind: Kind };

/**
 * What was done — the blue an editor gives a function name. One per line, at the front, so the
 * eye lands on the action before the detail.
 */
const VERBS = [
	'implemented',
	're-architected',
	'rebuilt',
	'replaced',
	'designed',
	'extended',
	'hardened',
	'migrated',
	'scaled',
	'shipped',
	'built',
	'drove',
	'drive',
	'introduced',
	'translated',
	'refined',
	'led',
	'lead',
	'own',
	'owning',
	'onboard',
	'mentor',
	'took',
	'authoring',
	'authored',
];

/**
 * The nouns of the domain — the cyan an editor gives a type. These are the words a reviewer
 * scans for, which is exactly why they should not be the same grey as "and".
 */
const CONCEPTS = [
	'scope-evaluation engine',
	'message-passing layer',
	'list virtualization',
	'background script',
	'key generation',
	'key exchange',
	'key rotation',
	'service contracts',
	'design system',
	'authorization',
	'cryptography',
	'virtualization',
	'encryption',
	'migrations',
	'autofill',
	'endpoints',
	'webhooks',
	'caching',
	'lazy loading',
	'localization',
	'dark mode',
	'memory leaks',
	'peer sync',
	'peer-sync',
	'throughput',
	'rollouts',
	'rollbacks',
	'root-cause analysis',
	'observability',
	'incident response',
	'feature-flagged',
	'biometric',
	'passwordless',
	'permission scopes',
	'scope categories',
	'metadata',
	'build pipeline',
	'build times',
	'unit testing',
	'staged rollout',
	'production support',
	'testing strategy',
	'delivery process',
	'architecture',
	'SDLC',
	'vault',
	'queue',
	'popup',
	'desktop client',
	'browser stores',
	'symmetric',
	'asymmetric',
];

/** Languages, protocols, runtimes — the purple an editor gives a keyword. */
const TECH = [
	'Protocol Buffers',
	'protocol buffers',
	'Manifest V3',
	'service worker',
	'micro-frontends',
	'microservices',
	'TypeScript',
	'JavaScript',
	'PostgreSQL',
	'GraphQL',
	'protobuf',
	'Electron',
	'Webpack',
	'MongoDB',
	'Tailwind',
	'gRPC',
	'REST',
	'SASS',
	'Swift',
	'React',
	'Flask',
	'MySQL',
	'Docker',
	'Python',
	'Astro',
	'Node.js',
	'Vite',
	'Java',
	'Vue',
	'Gulp',
	'Go',
	'PHP',
	'CRUD',
	'IPC',
	'SSO',
	'MFA',
	'UI',
];

/** Products, platforms and the companies behind them — the yellow of a type name. */
const NAMES = [
	'GitHub Copilot',
	'GitHub Actions',
	'Password Manager',
	'JumpCloud Go',
	'LaunchDarkly',
	'User Portal',
	'Zero Trust',
	'MCP servers',
	'agent skills',
	'JumpCloud',
	'CircleCI',
	'DataDog',
	'RADIUS',
	'Gemini',
	'Cursor',
	'Safari',
	'macOS',
	'Linux',
	'Split',
	'MYKI',
	'Scrum',
	'Agile',
];

const PATH = /\b[\w-]+\.(?:go|ts|tsx|js|jsx|proto|swift|yml|yaml|md|json|config)\b/;
function escape(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const longestFirst = (list: string[]) => [...list].sort((a, b) => b.length - a.length);

/*
 * No match may begin or end inside a hyphenated word: without this, "type-split tables" lights
 * up the product Split, and "re-architected" matches twice. Case-sensitive, which costs nothing
 * because every achievement line is written starting lowercase.
 */
const EDGE_OPEN = '(?<![\\w-])';
const EDGE_CLOSE = '(?![\\w-])';

const group = (name: string, list: string[]) =>
	`(?<${name}>${EDGE_OPEN}(?:${longestFirst(list).map(escape).join('|')})${EDGE_CLOSE})`;

const PATTERN = new RegExp(
	[
		`(?<path>${PATH.source})`,
		group('name', NAMES),
		group('tech', TECH),
		group('concept', CONCEPTS),
		group('verb', VERBS),
		`(?<num>${EDGE_OPEN}\\d[\\d,]*(?:×|x)?${EDGE_CLOSE})`,
	].join('|'),
	'g',
);

export function highlight(text: string): Token[] {
	const tokens: Token[] = [];
	let at = 0;

	for (const match of text.matchAll(PATTERN)) {
		const index = match.index ?? 0;
		if (index > at) tokens.push({ text: text.slice(at, index), kind: 'plain' });

		const groups = match.groups ?? {};
		const kind: Kind = groups.path
			? 'path'
			: groups.name
				? 'name'
				: groups.tech
					? 'tech'
					: groups.concept
						? 'concept'
						: groups.verb
							? 'verb'
							: 'num';
		tokens.push({ text: match[0], kind });
		at = index + match[0].length;
	}

	if (at < text.length) tokens.push({ text: text.slice(at), kind: 'plain' });
	return tokens;
}

/** The Tailwind class each kind wears. One place, so the diff and the palette cannot drift. */
export const KIND_CLASS: Record<Kind, string> = {
	verb: 'text-sx-fn',
	tech: 'text-sx-key',
	name: 'text-sx-type',
	concept: 'text-sx-esc',
	num: 'text-sx-num',
	path: 'text-sx-esc',
	plain: '',
};

/** File-type colour for the tree and the hunk headers, by extension. */
export function extensionClass(path: string): string {
	const extension = path.split('.').pop() ?? '';
	if (extension === 'go') return 'text-sx-esc';
	if (extension === 'ts' || extension === 'tsx') return 'text-sx-fn';
	if (extension === 'swift') return 'text-sx-num';
	if (extension === 'proto') return 'text-sx-key';
	if (extension === 'js') return 'text-sx-type';
	return 'text-text-lo';
}

const ESCAPES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
};

const escapeHtml = (value: string) => value.replace(/[&<>"]/g, (char) => ESCAPES[char]);

/**
 * The line as one HTML string.
 *
 * Mapping tokens to elements in the template puts a whitespace text node between every pair,
 * which reads as " , database" — a space before the comma on nearly every line. Building the
 * string here is the only way to guarantee the tokens sit flush against each other.
 */
export function highlightHtml(text: string): string {
	return highlight(text)
		.map((token) =>
			token.kind === 'plain'
				? escapeHtml(token.text)
				: `<span class="${KIND_CLASS[token.kind]}">${escapeHtml(token.text)}</span>`,
		)
		.join('');
}
