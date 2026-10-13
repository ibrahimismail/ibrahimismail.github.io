/**
 * The shape of the career. One source for the page, the agent build script, the command
 * palette's index and the print route — nothing on the site is authored twice.
 */

/** Anything a line can be filtered by. The palette's `find` and `stack` are a filter over these. */
export type Tag =
	| 'typescript'
	| 'react'
	| 'vue'
	| 'swift'
	| 'go'
	| 'node'
	| 'graphql'
	| 'grpc'
	| 'crypto'
	| 'mv3'
	| 'perf'
	| 'ci'
	| 'ai'
	| 'leadership'
	| 'microfrontends';

/** One `+` line in a diff: a single thing he did. */
export type Line = {
	text: string;
	tags?: Tag[];
};

/** A "file changed" — a slice of the work, named like the code it was. */
export type File = {
	path: string;
	lines: Line[];
};

/** A grouping of files. Rendered as a collapsed directory until the reader opens it. */
export type Dir = {
	name: string;
	files: File[];
};

export type Role = {
	company: string;
	role: string;
	location: string;
	/** `YYYY-MM`. Absent `end` means current. */
	start: string;
	end?: string;
	/** What the company is, for a reader who has not heard of it. One sentence. */
	summary: string;
	/** Anything that needs saying beside the dates, e.g. an acquisition. */
	note?: string;
	dirs: Dir[];
};

export type System = {
	id: 'extension-bus' | 'scope-engine' | 'kliknote';
	title: string;
	/** ≤ 90 characters. The card has room for one line and no more. */
	blurb: string;
	island: 'ExtensionBus' | 'ScopeEngine' | 'KlikNote';
	cover: string;
	/** Which company the work belongs to, so a card can point back into the timeline. */
	company?: string;
};

export type Education = {
	school: string;
	degree: string;
	location: string;
	start: string;
	end: string;
	gpa?: string;
};

/** A `?role=` preset: the same content, ordered for one audience. */
export type Target = {
	id: string;
	label: string;
	sentence: string;
	/** Directories opened by default in the timeline, most relevant first. */
	openDirs: string[];
};
