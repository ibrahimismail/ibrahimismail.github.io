import { Skill, Experience, Education } from "./types";

export const PROFILE = {
  name: "Ibrahim Ismail",
  title: "Senior Full-Stack Engineer",
  bio: "Senior Full-Stack Engineer with 5+ years of experience specializing in high-performance frontend architectures, including micro-frontends and browser extensions, backed by robust full-stack capabilities.",
  location: "Beirut, Lebanon",
  phone: "+961 3 689 039",
  email: "ibrahimismailh@gmail.com",
  website: "https://ibrahimismail.dev",
  linkedin: "https://linkedin.com/in/ibrahimismailh",
};

export const EXPERIENCE: Experience[] = [
  {
    company: "JumpCloud",
    role: "Software Engineer",
    period: "FEB 2022 - MAY 2026 (4 years 3 months)",
    location: "Colorado, US (Remote)",
    subsections: [
      {
        title: "Password Manager",
        items: [
          "Leading the JumpCloud Password Manager browser extension (PWMBE) team, and owning all the processes, deliverables and the full SDLC.",
          "Engineering a new build process for the PWMBE using webpack to replace the legacy gulp workflow, reducing build times by 8x (from 4 minutes to 30 seconds).",
          "Migrating the PWMBE from manifest v2 to manifest v3, redesigning the extension to use a service worker instead of a persistent background script.",
          "Rewriting the whole PWMBE UI to implement a new design while migrating from React to Vue.",
          "Optimized the PWMBE credentials autofilling mechanism, and added multiple features such as autofill exceptions, blacklisting, whitelisting, and user-defined autofill rules.",
          "Implementing a new communication mechanism between the extension's service worker, popup, and UI dialogs.",
          "Adding Safari browser support to the PWMBE and creating a native low-level communication layer using Swift to communicate with the supporting desktop application.",
          "Improved the peer sync mechanism that the PWMBE uses to communicate with the supporting desktop application, enhancing performance and greatly reducing memory leaks.",
          "Experience implementing secure peer-to-peer communication and the underlying encryption mechanisms, from key generation, key exchange, key rotation, asymmetric and symmetric encryption.",
          "Scaling the PWMBE to support a much larger number of items by implementing caching and lazy loading, in addition to list virtualization. Increased the supported number of items by 10x (from 5,000 to 50,000).",
          "Implementing an image server with frontend caching to stream website icon images for different PWM applications, including calling GraphQL third-party endpoints and subscribing to updates using a webhook.",
          "Contributed to the cross-platform (Electron.js) PWM Desktop Application.",
          "Implementing CI/CD pipelines to build debugging and production builds for the PWMBE, then distribute them to all major browser stores. First implemented in CircleCI then migrated to GitHub Actions.",
          "Onboarded multiple new team members to the PWMBE and hosted knowledge transfer sessions.",
        ],
      },
      {
        title: "Admin & User Portal",
        items: [
          "Created a new browser extension (JumpCloud Go) to support cross-platform biometric authentication for User Portal login, allowing users to login without needing to use their passwords.",
          "Implemented custom roles UI using dynamic rendering to allow building a new custom role, grouping scopes into different categories, then splitting them into different tables based on type, and implementing logical dependencies between selections. This also allows adding new scopes without needing any frontend changes.",
          "Implemented multiple backend endpoints to support CRUD operations of custom roles.",
          "Implemented database migration scripts to allow adding new scopes to the system.",
          "Implemented a new scope checking mechanism to determine access on the admin portal.",
          "Implemented a new feature to allow admins to be assigned to multiple roles.",
          "Experience working with microfrontends on the JumpCloud Admin Portal.",
          "Owning the full SDLC from design to implementation and testing to deploying to multiple environments.",
        ],
      },
      {
        title: "General",
        items: [
          "Integrating AI tools and AI workflows into daily development cycles to increase development velocity. Utilizing tools such as Gemini, GitHub Copilot, Cursor, agent skills, MCP servers, etc.",
          "Experience writing unit tests both for frontend and backend applications.",
          "Experience working with feature flags (LaunchDarkly, Split).",
          "Experience working with logging services such as DataDog.",
          "Experience working with microservices and gRPC with Protocol Buffers (Protobuf).",
          "Experience with handling production incidents, rollbacks, and root cause analysis.",
          "Experience working in an Agile Scrum team.",
          "Participated in the hiring process, interviewing multiple candidates and providing feedback and recommendations.",
        ],
      },
    ],
  },
  {
    company: "MYKI",
    role: "Software Engineer",
    period: "SEP 2021 - FEB 2022 (6 months)",
    location: "Beirut, Lebanon",
    description: [
      "Led the MYKI password manager's browser extension development efforts, adding new features, ensuring cross-browser support, and improving the credentials autofill mechanism.",
    ],
  },
  {
    company: "Neo Mena Technologies",
    role: "Software Engineer",
    period: "DEC 2020 - SEP 2021 (9 months)",
    location: "Beirut, Lebanon",
    description: [
      "Translated designs into performant, pixel-perfect, and responsive web components using React and SASS CSS.",
      "Set up a new mini project with localization, dark mode, unit testing, and mobile-first design and led it to completion.",
    ],
  },
];

export const EDUCATION: Education[] = [
  {
    school: "Lebanese International University (LIU)",
    degree: "Master of Science in Computer Engineering",
    location: "Beirut, Lebanon",
    period: "SEP 2019 - JUNE 2021",
    gpa: "3.85",
  },
  {
    school: "Lebanese International University (LIU)",
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
  { name: "Vue", icon: "https://img.icons8.com/color/48/vue-js.png" },
  { name: "React", icon: "https://img.icons8.com/color/48/react-native.png" },
  { name: "Node.js", icon: "https://img.icons8.com/color/48/nodejs.png" },
  {
    name: "Electron.js",
    icon: "https://img.icons8.com/?size=100&id=z1hRF8ZnphmY&format=png&color=000000",
  },
  {
    name: "Express.js",
    icon: "https://img.icons8.com/color/48/express-js.png",
  },
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
  {
    name: "React Native",
    icon: "https://img.icons8.com/color/48/react-native.png",
  },
];
