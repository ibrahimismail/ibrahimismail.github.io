/**
 * File-type colour for the diff's hunk headers.
 *
 * This file used to carry a dictionary that coloured the words inside each achievement line the
 * way an editor colours code. It was taken back out: the chrome around a line is structure and
 * reads well in colour, but highlighting the prose inside it decorated the sentence rather than
 * explaining it. The paths keep their colour, because a path really is a path.
 */
export function extensionClass(path: string): string {
	const extension = path.split('.').pop() ?? '';
	if (extension === 'go') return 'text-sx-esc';
	if (extension === 'ts' || extension === 'tsx') return 'text-sx-fn';
	if (extension === 'swift') return 'text-sx-num';
	if (extension === 'proto') return 'text-sx-key';
	if (extension === 'js') return 'text-sx-type';
	return 'text-text-lo';
}
