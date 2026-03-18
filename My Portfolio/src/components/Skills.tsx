import { motion } from 'motion/react';
import resumeData from '../data/resume.json';

export default function Skills() {
  const { skills } = resumeData;

  return (
    <section id="skills" className="py-24 px-6 max-w-5xl mx-auto text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-sans font-medium tracking-tighter mb-16 text-center">
          Skills & Expertise
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((group, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold text-emerald-400 mb-6 font-mono tracking-tight">
                {group.group}
              </h3>
              <ul className="space-y-4">
                {group.items.map((item, i) => (
                  <li key={i} className="text-white/80 text-sm leading-relaxed flex items-start gap-3">
                    <span className="text-emerald-400/50 mt-1.5 text-[10px]">â–¶</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
