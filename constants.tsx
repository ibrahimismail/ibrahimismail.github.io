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
    description: [
      "Migrated the password manager's cross-browser extension from manifest v2 to v3 and designed a modern webpack build/dev workflow that optimized build times and increased development velocity.",
      "Added Safari browser support and created a communication layer using Swift to communicate with the supporting desktop application.",
      "Migrated UI elements from React to Vue to use the common UI libraries.",
      "Set up CI/CD pipelines using CircleCI and GitHub Actions to release the browser extension to all major browser stores.",
      "Added new features to authentication and authorization systems such as custom roles, MFA factors, multiple roles, implementing both UI elements and supporting backend endpoints.",
      "Integrated AI tools and AI workflows into daily development cycles to increase development velocity.",
      "Worked closely with designers to improve UX.",
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
