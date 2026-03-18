/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import AnimatedBackground from './components/AnimatedBackground';
import Splash from './components/Splash';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Extra from './components/Extra';
import PrintableResume from './components/PrintableResume';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element || isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Komal_Batra_Resume.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent font-sans selection:bg-emerald-400/30 selection:text-emerald-200">
      <div className="no-print">
        <AnimatedBackground />
        
        {showSplash ? (
          <Splash onComplete={() => setShowSplash(false)} />
        ) : (
          <main className="relative z-10">
            <Hero onDownloadClick={handleDownloadPdf} isGeneratingPdf={isGeneratingPdf} />
            <Experience />
            <Skills />
            <Education />
            <Certifications />
            <Extra />
            
            <footer className="py-12 text-center text-white/40 text-sm font-mono">
              <p>© {new Date().getFullYear()} Komal Batra. All rights reserved.</p>
            </footer>
          </main>
        )}
      </div>
      <PrintableResume ref={printRef} />
    </div>
  );
}
