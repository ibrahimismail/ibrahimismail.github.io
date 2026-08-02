import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Download,
  Mail,
  Linkedin,
  MapPin,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Code2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { PROFILE, SKILLS, EXPERIENCE, EDUCATION, FOUNDER_VENTURE } from "./constants";
import { Theme } from "./types";
import { formatExperiencePeriod } from "./utils/formatPeriod";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const btnSize =
  "w-full sm:min-w-[12.5rem] sm:w-[12.5rem] flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all";
const btnPrimary = `${btnSize} bg-blue-600 hover:bg-blue-700 text-white shadow-lg`;
const btnOutline = `${btnSize} border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800`;
const btnVioletCompact =
  "inline-flex w-fit items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20";

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [showNavName, setShowNavName] = useState(false);
  const heroNameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || Theme.LIGHT;
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
  }, []);

  useEffect(() => {
    const heroName = heroNameRef.current;
    if (!heroName) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowNavName(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(heroName);
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.className = newTheme;
  };

  const [firstName, lastName] = PROFILE.name.split(" ");

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-500 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <nav className="fixed top-0 w-full z-50 glass py-4 transition-all">
        <div className="max-w-5xl mx-auto px-6 w-full flex justify-between items-center min-h-9">
          <div className="min-w-0 flex-1">
            <AnimatePresence>
              {showNavName && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-lg sm:text-xl font-extrabold tracking-tight cursor-pointer truncate"
                >
                  {firstName}{" "}
                  <span className="gradient-text">{lastName}</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === Theme.DARK ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <section className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              ref={heroNameRef}
              className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
            >
              {firstName} <span className="gradient-text">{lastName}</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-4 font-medium">
              {PROFILE.title}
            </p>
            <p className="text-lg max-w-2xl mx-auto mb-10 text-slate-500 dark:text-slate-400 leading-relaxed">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {PROFILE.bioLead}
              </span>
              {PROFILE.bioBody}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4 w-full max-w-xs mx-auto sm:max-w-none sm:mx-0">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`mailto:${PROFILE.email}`}
                className={btnPrimary}
              >
                <Mail size={18} /> Contact Me
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/Ibrahim_Ismail_CV.pdf"
                download="Ibrahim_Ismail_CV.pdf"
                className={btnOutline}
              >
                <Download size={18} /> Download CV
              </motion.a>
            </div>
          </motion.div>
        </section>

        <section className="mb-24 hidden">
          <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
            <Sparkles className="text-violet-500" /> Founder Work
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.01, y: -4 }}
              className="glass p-6 md:p-8 rounded-2xl border border-violet-500/20 border-l-4 border-l-violet-500 shadow-[0_0_40px_rgba(139,79,217,0.08)] dark:shadow-[0_0_40px_rgba(139,79,217,0.14)] transition-all"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-3">
                    <a
                      href={FOUNDER_VENTURE.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block transition-opacity hover:opacity-80"
                    >
                      <img
                        src={FOUNDER_VENTURE.logo}
                        alt={FOUNDER_VENTURE.name}
                        className="h-7 w-auto dark:brightness-110"
                      />
                    </a>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {FOUNDER_VENTURE.role}
                      </h3>
                      <a
                        href={FOUNDER_VENTURE.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                      >
                        {FOUNDER_VENTURE.url.replace("https://", "")}
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>

                <p className="text-base font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {FOUNDER_VENTURE.tagline}
                </p>

                <ul className="space-y-3">
                  {FOUNDER_VENTURE.description.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex items-start gap-2"
                    >
                      <ChevronRight
                        size={14}
                        className="mt-1 text-violet-500 shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={FOUNDER_VENTURE.url}
                  target="_blank"
                  rel="noreferrer"
                  className={btnVioletCompact}
                >
                  {FOUNDER_VENTURE.ctaLabel}
                  <ArrowUpRight size={16} />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section className="mb-24">
          <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
            <Briefcase className="text-blue-500" /> Professional Experience
          </h2>
          <div className="relative -mx-2 border-l-2 border-slate-200 dark:border-slate-800 md:mx-0 md:ml-4">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="space-y-8"
            >
              {EXPERIENCE.map((exp, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="relative pl-4 md:pl-8"
                >
                  <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-6 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="glass p-6 rounded-2xl border-l-4 border-blue-500 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {exp.role}
                        </h3>
                        <p className="text-blue-500 font-semibold text-sm">
                          {exp.company} · {exp.location}
                        </p>
                      </div>
                      <div className="text-sm text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full w-fit shrink-0">
                        {formatExperiencePeriod(exp.dates)}
                      </div>
                    </div>
                    {exp.summary ? (
                      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {exp.summary}
                      </p>
                    ) : null}
                    {exp.subsections ? (
                      <div className="space-y-6">
                        {exp.subsections.map((section, sIdx) => (
                          <div key={sIdx}>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
                              {section.title}
                            </h4>
                            <ul className="space-y-2">
                              {section.items.map((item, iIdx) => (
                                <li
                                  key={iIdx}
                                  className="text-slate-600 dark:text-slate-400 text-sm flex items-start gap-2"
                                >
                                  <ChevronRight
                                    size={14}
                                    className="mt-1 text-blue-500 shrink-0"
                                  />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {exp.description?.map((desc, dIdx) => (
                          <li
                            key={dIdx}
                            className="text-slate-600 dark:text-slate-400 text-sm flex items-start gap-2"
                          >
                            <ChevronRight
                              size={14}
                              className="mt-1 text-blue-500 shrink-0"
                            />
                            {desc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
            <Code2 className="text-blue-500" /> Technical Skills
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {SKILLS.map((skill, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass p-4 rounded-xl flex flex-col items-center gap-3 group transition-all text-center"
              >
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className="w-10 h-10 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                />
                <span className="font-medium text-[10px] sm:text-xs whitespace-nowrap">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mb-24">
          <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
            <GraduationCap className="text-blue-500" /> Education
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {EDUCATION.map((edu, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass p-6 rounded-2xl border-l-4 border-blue-500 transition-all"
              >
                <h3 className="text-lg font-bold">{edu.degree}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
                  {edu.school}
                </p>
                <p className="text-xs text-slate-400">{edu.location}</p>
                {edu.period && (
                  <p className="text-xs text-slate-400 mt-2">{edu.period}</p>
                )}
                {edu.gpa && (
                  <p className="text-xs text-blue-500 font-semibold mt-1">
                    GPA: {edu.gpa}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-6">Let's Build Together</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
            Based in {PROFILE.location}. Open to high-impact software
            engineering roles and collaborations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`mailto:${PROFILE.email}`}
              className={btnPrimary}
            >
              <Mail size={18} /> Email Me
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className={btnOutline}
            >
              <Linkedin size={18} /> LinkedIn
            </motion.a>
          </div>
          <div className="flex items-center gap-4 text-slate-400 mt-8">
            <div className="bg-slate-500/10 p-3 rounded-lg">
              <MapPin size={24} />
            </div>
            <span className="font-medium">{PROFILE.location}</span>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
      </footer>
    </div>
  );
};

export default App;
