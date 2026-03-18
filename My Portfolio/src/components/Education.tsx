import { motion } from 'motion/react';
import resumeData from '../data/resume.json';

export default function Education() {
  const { education } = resumeData;

  return (
    <section id="education" className="py-24 px-6 max-w-5xl mx-auto text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-sans font-medium tracking-tighter mb-16 text-center">
          Education
        </h2>

        <div className="space-y-8">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors duration-300 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{edu.institution}</h3>
                <p className="text-emerald-400/90 font-mono text-sm">{edu.degree}</p>
              </div>
              <div className="mt-4 md:mt-0 text-white/50 text-sm font-mono tracking-wider uppercase">
                {edu.dates}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
