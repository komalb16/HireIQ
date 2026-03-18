import { motion } from 'motion/react';
import resumeData from '../data/resume.json';

export default function Extra() {
  const { extra } = resumeData;

  if (!extra || extra.length === 0) return null;

  return (
    <section id="extra" className="py-24 px-6 max-w-5xl mx-auto text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-sans font-medium tracking-tighter mb-16 text-center">
          Additional Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {extra.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors duration-300"
            >
              <p className="text-white/80 text-lg leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
