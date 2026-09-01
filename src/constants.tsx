import { Skill, Experience, Education, FounderVenture } from "./types";

export const PROFILE = {
  name: "Ibrahim Ismail",
  title: "Senior Full-Stack Engineer",
  bioLead: "Senior Full-Stack Engineer",
  bioBody:
    " with 5+ years building full-stack systems across frontend architecture, backend APIs, and browser extension platforms—including micro-frontends, REST and GraphQL APIs, and secure authentication and authorization flows.",
  location: "Beirut, Lebanon",
  phone: "+961 3 689 039",
  email: "ibrahimismailh@gmail.com",
  website: "https://ibrahimismail.dev",
  linkedin: "https://linkedin.com/in/ibrahimismailh",
};

export const FOUNDER_VENTURE: FounderVenture = {
  name: "KlikNote",
  role: "Founder & Lead Engineer",
  tagline:
    "A high-velocity, local-first, keyboard-native note-taking app built for uninterrupted focus.",
  url: "https://kliknote.com",
  logo: "/kliknote-logo.svg",
  description: [
    "When your mind moves fast, context-switching kills momentum. I founded KlikNote to replace the cloud latency, account walls, and heavy interfaces of traditional note tools with something that keeps up.",
    "Designed and engineered a zero-latency, client-side engine with global context-menu capture—web research and ideas are saved the instant they happen, living securely in the browser's isolated storage.",
    "Local-first by default, keyboard-native, and built entirely around the browser extension experience I wanted as a power user.",
  ],
  ctaLabel: "Try KlikNote today",
};

export const EXPERIENCE: Experience[] = [
  {
    company: "JumpCloud",
    role: "Software Engineer",
    dates: { startMonth: 2, startYear: 2022, endMonth: 5, endYear: 2026 },
    location: "Colorado, US (Remote)",
    summary:
      "JumpCloud is a unified identity and device management platform (SSO, MFA, Zero Trust, RADIUS) securing Windows, macOS, Linux, and Mobile devices.",
    subsections: [
      {
        title: "Ownership & Technical Leadership",
        items: [
          "Lead the Password Manager browser extension team, owning the full SDLC—architecture, delivery process, testing strategy, staged rollout, and production support—for a security product shipped to every major browser.",
          "Onboard and mentor engineers, run knowledge-transfer sessions, and interview candidates across the hiring pipeline with hire recommendations.",
        ],
      },
      {
        title: "Architecture & Platform Engineering",
        items: [
          "Re-architected the password manager browser extension for Manifest V3, replacing a persistent background script with an ephemeral service worker and designing a new message-passing layer connecting the service worker, popup, injected page dialogs, and the desktop client.",
          "Rebuilt the entire extension UI against a new design system while migrating the codebase from React to Vue, delivered incrementally without disrupting the release cadence.",
          "Extended the platform to Safari, authoring a native Swift bridge for low-level IPC with the macOS desktop application, and contributed across the cross-platform Electron desktop app.",
          "Build and ship admin portal features as independently deployable microfrontends, working within a distributed frontend architecture where multiple teams release into a shared application shell on separate cadences.",
        ],
      },
      {
        title: "Backend & Distributed Systems",
        items: [
          "Designed and shipped the custom roles authorization system end to end: backend CRUD endpoints, database migrations for new permission scopes, a new scope-evaluation engine governing access across the admin portal, and support for admins holding multiple roles.",
          "Built a metadata-driven roles UI that dynamically renders scope categories, type-split tables, and inter-scope dependencies—so new permissions ship server-side with zero frontend changes.",
          "Built an icon-streaming service with client-side caching, integrating third-party GraphQL APIs and consuming webhooks to keep application metadata current as upstream sources change.",
          "Build and consume services across a microservices architecture, defining typed contracts with gRPC and Protocol Buffers and owning deployment through multiple environments.",
        ],
      },
      {
        title: "Security Engineering",
        items: [
          "Implemented secure peer-to-peer communication between extension and desktop client, including the underlying cryptography: key generation, key exchange, key rotation, and combined symmetric/asymmetric encryption.",
          "Built JumpCloud Go, a browser extension enabling cross-platform biometric, passwordless authentication to the User Portal; hardened the credential autofill engine with user-defined autofill rules, per-site exceptions, and allow/deny listing.",
        ],
      },
      {
        title: "Performance, Scale & Delivery",
        items: [
          "Scaled the vault 10×—from 5,000 to 50,000 items—through caching, lazy loading, and list virtualization; rebuilt the peer-sync mechanism to raise throughput and eliminate memory leaks.",
          "Replaced a legacy Gulp workflow with a Webpack build pipeline, cutting build times 8× (4 minutes → 30 seconds).",
          "Own CI/CD for the extension: automated debug and production builds and distribution to all major browser stores, migrated from CircleCI to GitHub Actions.",
          "Drive release safety and reliability in an Agile Scrum team—feature-flagged rollouts (LaunchDarkly, Split), DataDog observability, and hands-on incident response including rollbacks and root-cause analysis.",
          "Introduced AI-assisted development workflows across the team (Cursor, GitHub Copilot, Gemini, agent skills, MCP servers) to increase engineering velocity.",
        ],
      },
    ],
  },
  {
    company: "MYKI",
    role: "Software Engineer",
    dates: { startMonth: 9, startYear: 2021, endMonth: 2, endYear: 2022 },
    location: "Beirut, Lebanon",
    summary:
      "A decentralized password management company serving global businesses and MSPs (Acquired by JumpCloud).",
    description: [
      "Led the development efforts for the flagship password manager browser extension, shipping key updates, strengthening cross-browser stability, and refining automated credential autofill logic.",
    ],
  },
  {
    company: "Neo Mena Technologies",
    role: "Software Engineer",
    dates: { startMonth: 12, startYear: 2020, endMonth: 9, endYear: 2021 },
    location: "Beirut, Lebanon",
    summary:
      "A premier FinTech corporation specializing in wealth management and modern digital investment applications.",
    description: [
      "Translated structural UX drafts into highly performant, pixel-perfect, and fully responsive frontend views using React and SASS.",
      "Independently managed a standalone mini-project from scratch to production deployment, introducing full localization, dark mode, mobile-first design rules, and complete automated unit testing patterns.",
    ],
  },
];

export const EDUCATION: Education[] = [
  {
    school: "LIU",
    degree: "Master of Science in Computer Engineering",
    location: "Beirut, Lebanon",
    period: "SEP 2019 - JUNE 2021",
    gpa: "3.85",
  },
  {
    school: "LIU",
    degree: "Bachelor of Science in Computer Engineering",
    location: "Beirut, Lebanon",
    period: "SEP 2016 - JUNE 2019",
    gpa: "4.0",
  },
];

export const SKILLS: Skill[] = [
  {
    name: "JavaScript",
    icon: "https://img.icons8.com/color/48/javascript.png",
  },
  {
    name: "TypeScript",
    icon: "https://img.icons8.com/color/48/typescript.png",
  },
  { name: "React", icon: "https://img.icons8.com/color/48/react-native.png" },
  { name: "Next.js", icon: "https://img.icons8.com/color/48/nextjs.png" },
  { name: "Vue", icon: "https://img.icons8.com/color/48/vue-js.png" },
  { name: "Tailwind", icon: "https://img.icons8.com/color/48/tailwindcss.png" },
  { name: "Node.js", icon: "https://img.icons8.com/color/48/nodejs.png" },
  {
    name: "Express.js",
    icon: "https://img.icons8.com/color/48/express-js.png",
  },
  { name: "GraphQL", icon: "https://img.icons8.com/color/48/graphql.png" },
  { name: "Java", icon: "https://img.icons8.com/color/48/java-coffee-cup-logo.png" },
  { name: "Python", icon: "https://img.icons8.com/color/48/python--v1.png" },
  { name: "Flask", icon: "https://img.icons8.com/color/48/flask.png" },
  { name: "PHP", icon: "https://img.icons8.com/officel/48/php-logo.png" },
  {
    name: "PostgreSQL",
    icon: "https://img.icons8.com/color/48/postgreesql.png",
  },
  {
    name: "MySQL",
    icon: "https://img.icons8.com/color/48/mysql-logo.png",
  },
  {
    name: "MongoDB",
    icon: "https://img.icons8.com/color/48/mongodb.png",
  },
  { name: "Docker", icon: "https://img.icons8.com/color/48/docker.png" },
  {
    name: "GitHub Actions",
    icon: "https://img.icons8.com/color/48/github--v1.png",
  },
  {
    name: "CircleCI",
    icon: "https://img.icons8.com/color/48/circleci.png",
  },
  {
    name: "Browser Extensions",
    icon: "https://img.icons8.com/?size=100&id=63785&format=png&color=000000",
  },
];
