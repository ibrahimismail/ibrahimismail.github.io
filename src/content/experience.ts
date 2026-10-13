import type { Role } from './types';

/**
 * The career, as a commit log. Each role is a commit; each "file changed" is a slice of the
 * work; each line is one thing he did.
 *
 * Why this shape: the JumpCloud entry is eighteen achievements. As a bullet list it is a wall
 * nobody reads. As a diff it is scannable, dense, and in a form this audience reads fluently.
 *
 * Directory order is server-first (see REDESIGN-PLAN.md §2), and `half` is what makes that a
 * sort rather than a hand-ordered literal. Nothing here is inflated to balance the halves —
 * only ordered.
 */
export const EXPERIENCE: Role[] = [
	{
		company: 'JumpCloud',
		role: 'Software Engineer',
		location: 'Colorado, US (Remote)',
		start: '2022-02',
		end: '2026-05',
		summary:
			'A unified identity and device management platform — SSO, MFA, Zero Trust, RADIUS — securing Windows, macOS, Linux and mobile devices.',
		note: 'Password Manager & Auth Team',
		dirs: [
			{
				name: 'backend',
				half: 'server',
				files: [
					{
						path: 'roles-authz.go',
						lines: [
							{
								text: 'shipped the custom roles authorization system end to end: CRUD endpoints, database migrations for new permission scopes, and support for admins holding multiple roles',
								tags: ['authz', 'go', 'migrations'],
							},
						],
					},
					{
						path: 'scope-engine.go',
						lines: [
							{
								text: 'designed the scope-evaluation engine governing access across the admin portal, including dependencies between scopes',
								tags: ['authz', 'go'],
							},
						],
					},
					{
						path: 'icon-service.ts',
						lines: [
							{
								text: 'built an icon-streaming service with client-side caching, integrating third-party GraphQL APIs and consuming webhooks to keep application metadata current as upstream sources change',
								tags: ['node', 'graphql'],
							},
						],
					},
					{
						path: 'contracts.proto',
						lines: [
							{
								text: 'built and consumed services across a microservices architecture, defining typed contracts with gRPC and Protocol Buffers and owning deployment through multiple environments',
								tags: ['grpc', 'go'],
							},
						],
					},
					{
						path: 'roles-ui.ts',
						lines: [
							{
								text: 'built a metadata-driven roles UI that renders scope categories, type-split tables and inter-scope dependencies from server metadata — so new permissions ship backend-only, with zero frontend changes',
								tags: ['authz', 'typescript'],
							},
						],
					},
				],
			},
			{
				name: 'security',
				half: 'server',
				files: [
					{
						path: 'p2p-crypto.ts',
						lines: [
							{
								text: 'implemented secure peer-to-peer communication between the extension and the desktop client, including the cryptography underneath: key generation, key exchange, key rotation, and combined symmetric and asymmetric encryption',
								tags: ['crypto', 'typescript'],
							},
						],
					},
					{
						path: 'passwordless.ts',
						lines: [
							{
								text: 'built JumpCloud Go, a browser extension for cross-platform biometric, passwordless authentication to the User Portal',
								tags: ['crypto', 'mv3'],
							},
							{
								text: 'hardened the credential autofill engine with user-defined autofill rules, per-site exceptions, and allow and deny listing',
								tags: ['crypto'],
							},
						],
					},
				],
			},
			{
				name: 'platform',
				half: 'both',
				files: [
					{
						path: 'manifest-v3.ts',
						lines: [
							{
								text: 're-architected the password manager browser extension for Manifest V3, replacing a persistent background script with an ephemeral service worker',
								tags: ['mv3', 'typescript'],
							},
							{
								text: 'designed a new message-passing layer connecting the service worker, the popup, injected page dialogs, and the desktop client',
								tags: ['mv3', 'typescript'],
							},
						],
					},
					{
						path: 'safari-bridge.swift',
						lines: [
							{
								text: 'extended the platform to Safari, authoring a native Swift bridge for low-level IPC with the macOS desktop application, and contributed across the cross-platform Electron desktop app',
								tags: ['swift'],
							},
						],
					},
					{
						path: 'microfrontends.ts',
						lines: [
							{
								text: 'built and shipped admin portal features as independently deployable micro-frontends, in a distributed frontend architecture where several teams release into a shared application shell on separate cadences',
								tags: ['microfrontends', 'typescript'],
							},
						],
					},
				],
			},
			{
				name: 'client',
				half: 'client',
				files: [
					{
						path: 'ui-migration.ts',
						lines: [
							{
								text: 'rebuilt the entire extension UI against a new design system while migrating the codebase from React to Vue, delivered incrementally without disrupting the release cadence',
								tags: ['vue', 'react'],
							},
						],
					},
				],
			},
			{
				name: 'perf',
				half: 'both',
				files: [
					{
						path: 'vault-scale.ts',
						lines: [
							{
								text: 'scaled the vault 10× — from 5,000 to 50,000 items — through caching, lazy loading and list virtualization',
								tags: ['perf', 'typescript'],
							},
							{
								text: 'rebuilt the peer-sync mechanism to raise throughput and eliminate memory leaks',
								tags: ['perf'],
							},
						],
					},
				],
			},
			{
				name: 'delivery',
				half: 'both',
				files: [
					{
						path: 'webpack.config.js',
						lines: [
							{
								text: 'replaced a legacy Gulp workflow with a Webpack build pipeline, cutting build times 8× — four minutes to thirty seconds',
								tags: ['ci', 'perf'],
							},
						],
					},
					{
						path: 'release.yml',
						lines: [
							{
								text: 'own CI/CD for the extension: automated debug and production builds, distribution to all major browser stores, and the migration from CircleCI to GitHub Actions',
								tags: ['ci'],
							},
						],
					},
					{
						path: 'reliability.md',
						lines: [
							{
								text: 'drive release safety in an Agile Scrum team — feature-flagged rollouts (LaunchDarkly, Split), DataDog observability, and hands-on incident response including rollbacks and root-cause analysis',
								tags: ['ci'],
							},
						],
					},
				],
			},
			{
				name: 'leadership',
				half: 'both',
				files: [
					{
						path: 'team.ts',
						lines: [
							{
								text: 'lead the Password Manager browser extension team, owning the full SDLC — architecture, delivery process, testing strategy, staged rollout and production support — for a security product shipped to every major browser',
								tags: ['leadership'],
							},
							{
								text: 'onboard and mentor engineers, run knowledge-transfer sessions, and interview candidates across the hiring pipeline with hire recommendations',
								tags: ['leadership'],
							},
						],
					},
				],
			},
			{
				name: 'ai',
				half: 'both',
				files: [
					{
						path: 'workflows.md',
						lines: [
							{
								text: 'introduced AI-assisted development workflows across the team — Cursor, GitHub Copilot, Gemini, agent skills and MCP servers — to increase engineering velocity',
								tags: ['ai'],
							},
						],
					},
				],
			},
		],
	},
	{
		company: 'MYKI',
		role: 'Software Engineer',
		location: 'Beirut, Lebanon',
		start: '2021-09',
		end: '2022-02',
		summary:
			'A decentralized password management company serving global businesses and MSPs.',
		note: 'Acquired by JumpCloud',
		dirs: [
			{
				name: 'client',
				half: 'client',
				files: [
					{
						path: 'extension.ts',
						lines: [
							{
								text: 'led development on the flagship password manager browser extension, shipping key updates and strengthening cross-browser stability',
								tags: ['typescript', 'leadership'],
							},
							{
								text: 'refined the automated credential autofill logic',
								tags: ['typescript'],
							},
						],
					},
				],
			},
		],
	},
	{
		company: 'Neo Mena Technologies',
		role: 'Software Engineer',
		location: 'Beirut, Lebanon',
		start: '2020-12',
		end: '2021-09',
		summary:
			'A FinTech corporation specializing in wealth management and digital investment applications.',
		dirs: [
			{
				name: 'client',
				half: 'client',
				files: [
					{
						path: 'views.tsx',
						lines: [
							{
								text: 'translated structural UX drafts into performant, pixel-accurate, fully responsive frontend views in React and SASS',
								tags: ['react'],
							},
						],
					},
					{
						path: 'standalone.tsx',
						lines: [
							{
								text: 'took a standalone project from scratch to production alone, introducing full localization, dark mode, mobile-first rules and complete automated unit testing patterns',
								tags: ['react', 'typescript'],
							},
						],
					},
				],
			},
		],
	},
];
