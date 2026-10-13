/**
 * A small TypeScript highlighter, for the source the build sequence streams.
 *
 * Not a parser — a scanner that knows comments, strings, keywords, numbers, calls and types,
 * which is every category One Dark gives a colour. A real tokenizer would be an order of
 * magnitude more code for no visible difference at fourteen lines a file.
 */
const KEYWORDS = new Set([
	'const', 'let', 'var', 'function', 'return', 'import', 'export', 'from', 'type', 'interface',
	'if', 'else', 'for', 'of', 'in', 'while', 'new', 'class', 'extends', 'async', 'await',
	'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'as', 'default', 'void',
]);

const LITERALS = new Set(['true', 'false', 'null', 'undefined', 'this']);

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const escapeHtml = (value: string) => value.replace(/[&<>]/g, (char) => ESCAPES[char]);

const wrap = (cls: string, text: string) => `<span class="${cls}">${escapeHtml(text)}</span>`;

/**
 * One line to HTML. `block` carries whether a /* … *&#47; comment is still open, because that is
 * the only piece of state a line-at-a-time scanner cannot work out for itself.
 */
export function highlightLine(line: string, block: boolean): { html: string; block: boolean } {
	let out = '';
	let i = 0;
	let inBlock = block;

	while (i < line.length) {
		if (inBlock) {
			const end = line.indexOf('*/', i);
			const stop = end === -1 ? line.length : end + 2;
			out += wrap('text-text-lo/60 italic', line.slice(i, stop));
			i = stop;
			inBlock = end === -1;
			continue;
		}

		const rest = line.slice(i);

		if (rest.startsWith('//')) {
			out += wrap('text-text-lo/60 italic', rest);
			break;
		}

		if (rest.startsWith('/*')) {
			inBlock = true;
			continue;
		}

		const string = /^(['"`])(?:\\.|(?!\1)[^\\])*\1?/.exec(rest);
		if (string) {
			out += wrap('text-sx-add', string[0]);
			i += string[0].length;
			continue;
		}

		const number = /^\d[\w.]*/.exec(rest);
		if (number) {
			out += wrap('text-sx-num', number[0]);
			i += number[0].length;
			continue;
		}

		const word = /^[A-Za-z_$][\w$]*/.exec(rest);
		if (word) {
			const text = word[0];
			const after = rest.slice(text.length).trimStart();
			if (KEYWORDS.has(text)) out += wrap('text-sx-key', text);
			else if (LITERALS.has(text)) out += wrap('text-sx-num', text);
			else if (after.startsWith('(')) out += wrap('text-sx-fn', text);
			else if (/^[A-Z]/.test(text)) out += wrap('text-sx-type', text);
			else out += escapeHtml(text);
			i += text.length;
			continue;
		}

		const punctuation = /^[^\w\s'"`]+/.exec(rest);
		if (punctuation) {
			out += wrap('text-text-lo/70', punctuation[0]);
			i += punctuation[0].length;
			continue;
		}

		out += escapeHtml(line[i]);
		i += 1;
	}

	return { html: out, block: inBlock };
}

/** A whole excerpt, carrying block-comment state from one line to the next. */
export function highlightCode(lines: string[]): string[] {
	let block = false;
	return lines.map((line) => {
		const result = highlightLine(line, block);
		block = result.block;
		return result.html;
	});
}

/**
 * One complete declaration, from its first line to the line that closes it.
 *
 * Earlier versions took a window of N lines and tried to end it tidily — on a balanced bracket,
 * then on a line that closed something. Both still ended inside a structure: `],` four levels
 * down an array of roles is syntactically closed and visibly chopped. There is no way to end a
 * window well, so this does not take one. It starts at a top-level declaration and runs until
 * the brackets it opened have all closed, which is the only thing that reads as a whole file
 * being written.
 *
 * `max` is a guard against a marker that matches something unclosable; overrunning it means the
 * wrong marker was chosen, and the fallback keeps the sequence running rather than throwing
 * during a visitor's page load.
 */
export function unit(source: string, marker: string, max = 46): string[] {
	const lines = source.split('\n');
	const start = Math.max(
		0,
		lines.findIndex((line) => line.includes(marker)),
	);

	let depth = 0;
	let opened = false;
	let end = -1;

	for (let i = start; i < Math.min(lines.length, start + max); i++) {
		/* Strings and comments go first, so a brace inside one cannot skew the count. */
		const code = lines[i]
			.replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, '')
			.replace(/\/\/.*$/, '')
			.replace(/\/\*.*?\*\//g, '');

		for (const char of code) {
			if ('{(['.includes(char)) {
				depth++;
				opened = true;
			} else if ('})]'.includes(char)) {
				depth--;
			}
		}

		if (opened && depth <= 0) {
			end = i;
			break;
		}
	}

	const stop = end >= 0 ? end : Math.min(lines.length, start + max) - 1;
	return lines.slice(start, stop + 1).map((line) => line.replace(/\t/g, '  '));
}
