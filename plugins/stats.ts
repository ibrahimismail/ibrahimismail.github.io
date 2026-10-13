import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import type { AstroIntegration } from 'astro';

/**
 * Writes what the build actually produced to dist/client/stats.json, so the instruments panel
 * prints real sizes rather than numbers someone typed once and never updated.
 *
 * It runs on `astro:build:done` — after the HTML exists, which a Vite plugin would be too early
 * to see — and measures gzipped bytes, because that is what crosses the wire.
 */
async function walk(dir: string): Promise<string[]> {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((entry) => {
			const path = join(dir, entry.name);
			return entry.isDirectory() ? walk(path) : Promise.resolve([path]);
		}),
	);
	return files.flat();
}

export function stats(): AstroIntegration {
	return {
		name: 'ii:stats',
		hooks: {
			'astro:build:done': async ({ dir, pages, logger }) => {
				const root = dir.pathname;
				const files = await walk(root);

				const totals = { htmlGzip: 0, cssGzip: 0, jsGzip: 0, fontBytes: 0 };
				/* The one page most people will ever load, reported on its own. */
				let indexGzip = 0;

				for (const file of files) {
					if (file.endsWith('stats.json')) continue;
					const body = await readFile(file);
					if (file.endsWith('.html')) {
						const size = gzipSync(body).length;
						totals.htmlGzip += size;
						if (file.endsWith('/index.html')) indexGzip = size;
					}
					else if (file.endsWith('.css')) totals.cssGzip += gzipSync(body).length;
					else if (file.endsWith('.js')) totals.jsGzip += gzipSync(body).length;
					else if (file.endsWith('.woff2')) totals.fontBytes += body.length;
				}

				const payload = {
					builtAt: new Date().toISOString(),
					pages: pages.length,
					indexGzip,
					...totals,
				};

				await writeFile(join(root, 'stats.json'), JSON.stringify(payload));
				logger.info(
					`stats.json · ${payload.pages} pages · html ${payload.htmlGzip}B · css ${payload.cssGzip}B · js ${payload.jsGzip}B gzip`,
				);
			},
		},
	};
}
