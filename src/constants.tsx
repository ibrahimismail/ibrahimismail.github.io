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
  period: "2026 – Present",
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
    period: "FEB 2022 - MAY 2026 (4 years 3 months)",
    location: "Colorado, US (Remote)",
    summary:
      "JumpCloud provides an enterprise cloud directory platform securing access, identity, and device management across global workforces.",
    subsections: [
      {
        title: "Core Architecture & Team Leadership",
        items: [
          "Led the JumpCloud Password Manager Browser Extension (PWMBE) team, taking full accountability for end-to-end delivery, architectural decisions, and cross-team execution.",
          "Architected complex UI structures within a micro-frontends framework for the core JumpCloud Admin Portal.",
          "Engineered a dynamic rendering UI for custom admin roles, grouping permission scopes flexibly into categorized tables with logical selection dependencies. This eliminated the need for frontend code changes when adding new scopes.",
          "Actively participated in the technical hiring pipeline, interviewing engineering candidates, and built a structured onboarding process with continuous knowledge-transfer sessions.",
        ],
      },
      {
        title: "System Optimization & Performance Engineering",
        items: [
          "Replaced a legacy Gulp build workflow with a modern Webpack configuration for the browser extension, slashing build compilation times by 8x (from 4 minutes to 30 seconds).",
          "Implemented client-side caching, lazy loading, and list virtualization to scale the extension's data capability, expanding smoothly from a 5,000-item ceiling to handling 50,000+ items with minimal footprints.",
          "Overhauled the low-level peer synchronization mechanism connecting the web extension to the desktop application, mitigating critical memory leaks and boosting performance.",
        ],
      },
      {
        title: "Security, Authentication & Native Integrations",
        items: [
          "Led the critical migration of the primary web extension from Manifest v2 to v3, redesigning core workflows around background Service Workers to maintain high-efficiency operations.",
          "Developed the JumpCloud Go browser extension from scratch, enabling secure, cross-platform biometric authentication for seamless user logins.",
          "Extended extension ecosystem capabilities by delivering Safari browser support, using a native Swift communication layer to interface securely with supporting desktop software.",
          "Implemented secure peer-to-peer data synchronization pipelines utilizing complex underlying encryption models, including asymmetric/symmetric encryption, key generation, and robust key rotation.",
        ],
      },
      {
        title: "Modern Engineering Workflows & DevOps",
        items: [
          "Embedded advanced AI tools (Cursor, Claude Code, Gemini, Copilot, and custom MCP server integrations) directly into regular development cycles, establishing massive gains in coding velocity and test writing.",
          "Built and managed full CI/CD deployment automation (migrating from CircleCI to GitHub Actions) to compile, test, and automatically distribute production builds directly to major web stores.",
          "Managed production incident responses, rollbacks, and root-cause analyses using LaunchDarkly for real-time feature flagging and DataDog for centralized system logging.",
        ],
      },
    ],
  },
  {
    company: "MYKI",
    role: "Software Engineer",
    period: "SEP 2021 - FEB 2022 (6 months)",
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
    period: "DEC 2020 - SEP 2021 (9 months)",
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
