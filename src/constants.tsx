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
    dates: { startMonth: 2, startYear: 2022 },
    location: "Colorado, US (Remote)",
    summary:
      "JumpCloud provides an enterprise cloud directory platform securing access, identity, and device management across global workforces.",
    subsections: [
      {
        title: "Backend Systems, APIs & Data",
        items: [
          "Built and maintained backend services powering password vault synchronization across web extensions, desktop apps, and native clients—handling encrypted data flows end to end.",
          "Engineered secure peer-to-peer sync pipelines with asymmetric and symmetric encryption, key generation, and rotation—designing the data layer for a distributed credential management system.",
          "Overhauled the low-level synchronization mechanism between the web extension and desktop application, eliminating critical memory leaks and significantly improving throughput under load.",
          "Scaled vault data handling from a 5,000-item ceiling to 50,000+ entries through optimized persistence patterns, client-side caching, and efficient reads/writes across SQL and NoSQL storage backends.",
          "Led the JumpCloud Password Manager Browser Extension (PWMBE) team with full ownership of backend integration, architectural decisions, and cross-team delivery.",
        ],
      },
      {
        title: "Platform Architecture & Admin Portal",
        items: [
          "Architected TypeScript micro-frontend modules for the JumpCloud Admin Portal, integrating REST and GraphQL APIs for identity, device, and access management workflows.",
          "Built a dynamic permission-scope rendering system driven by backend role definitions—grouping scopes into categorized tables with logical dependencies so new permissions ship without frontend code changes.",
          "Participated in the technical hiring pipeline, interviewed engineering candidates, and established structured onboarding with continuous knowledge-transfer sessions.",
        ],
      },
      {
        title: "Frontend, Extensions & Client Applications",
        items: [
          "Led the Manifest v2 to v3 migration for the primary web extension, redesigning core workflows around background Service Workers in TypeScript.",
          "Developed the JumpCloud Go browser extension from scratch, enabling secure, cross-platform biometric authentication for seamless user logins.",
          "Delivered Safari browser support via a native Swift communication layer interfacing securely with desktop software.",
          "Replaced a legacy Gulp build with a modern Webpack configuration, cutting extension build times by 8x (from 4 minutes to 30 seconds).",
          "Implemented lazy loading and list virtualization to keep UI performance stable as vault sizes grew by an order of magnitude.",
        ],
      },
      {
        title: "Engineering Workflows & DevOps",
        items: [
          "Built and managed full CI/CD automation (migrating from CircleCI to GitHub Actions) to compile, test, and distribute production builds to major web stores.",
          "Embedded advanced AI tools (Cursor, Claude Code, Gemini, Copilot, and custom MCP server integrations) into daily development, accelerating implementation and test coverage.",
          "Managed production incident response, rollbacks, and root-cause analysis using LaunchDarkly for feature flagging and DataDog for centralized logging.",
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
