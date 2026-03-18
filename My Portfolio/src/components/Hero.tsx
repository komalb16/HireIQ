import { motion } from 'motion/react';
import { ArrowDown, Download, Loader2, Mail, Linkedin } from 'lucide-react';
import resumeData from '../data/resume.json';

interface HeroProps {
  onDownloadClick: () => void;
  isGeneratingPdf?: boolean;
}

export default function Hero({ onDownloadClick, isGeneratingPdf }: HeroProps) {
  const { name, title, summary, email, links } = resumeData.basics;
  const linkedInUrl = links.find(link => link.name === 'LinkedIn')?.url;

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium italic tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/60">
          {name}
        </h1>
        <h2 className="text-xl md:text-3xl font-mono text-emerald-400/90 mb-6 tracking-tight">
          {title}
        </h2>

        <div className="flex flex-wrap justify-center gap-6 mb-10 text-white/60 font-mono text-sm">
          {email && (
            <motion.a 
              href={`mailto:${email}`} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 hover:text-emerald-400 transition-all duration-300"
            >
              <Mail size={16} />
              {email}
            </motion.a>
          )}
          {linkedInUrl && (
            <motion.a 
              href={linkedInUrl.startsWith('http') ? linkedInUrl : `https://${linkedInUrl}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 hover:text-emerald-400 transition-all duration-300"
            >
              <Linkedin size={16} />
              LinkedIn
            </motion.a>
          )}
        </div>

        <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-12 max-w-3xl mx-auto font-sans font-light">
          {summary}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <motion.a
            href="#experience"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium tracking-wide hover:bg-white/90 transition-colors"
          >
            View Experience
            <ArrowDown size={18} />
          </motion.a>
          
          <motion.button
            whileHover={!isGeneratingPdf ? { scale: 1.05 } : {}}
            whileTap={!isGeneratingPdf ? { scale: 0.95 } : {}}
            onClick={onDownloadClick}
            disabled={isGeneratingPdf}
            className={`flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full font-medium tracking-wide transition-colors backdrop-blur-sm border border-white/10 ${
              isGeneratingPdf ? 'opacity-70 cursor-not-allowed' : 'hover:bg-white/20'
            }`}
          >
            {isGeneratingPdf ? 'Generating PDF...' : 'Download Resume'}
            {isGeneratingPdf ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-white/50"
      >
        <ArrowDown size={24} />
      </motion.div>
    </section>
  );
}
