import { motion } from 'motion/react';
import resumeData from '../data/resume.json';

export default function Experience() {
  const { experience } = resumeData;

  return (
    <section id="experience" className="py-24 px-6 max-w-5xl mx-auto text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-sans font-medium tracking-tighter mb-16 text-center">
          Experience
        </h2>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
          {experience.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#14141e] text-emerald-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(52,211,153,0.2)] z-10">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              </div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors duration-300">
                <div className="flex flex-col mb-4">
                  <h3 className="text-xl font-semibold text-white">{job.role}</h3>
                  <span className="text-emerald-400/90 font-mono text-sm mt-1">{job.company}</span>
                  <span className="text-white/50 text-xs mt-2 uppercase tracking-wider">{job.dates}</span>
                  <span className="text-white/40 text-xs mt-1">{job.location}</span>
                </div>
                
                {job.bullets.length > 0 && (
                  <ul className="space-y-3 mt-6">
                    {job.bullets.map((bullet, i) => (
                      <li key={i} className="text-sm text-white/70 leading-relaxed flex items-start gap-3">
                        <span className="text-emerald-400/50 mt-1.5 text-[10px]">â¶</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
