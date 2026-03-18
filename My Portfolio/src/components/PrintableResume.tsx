import { forwardRef } from 'react';
import resumeData from '../data/resume.json';

const PrintableResume = forwardRef<HTMLDivElement>((props, ref) => {
  const { basics, experience, skills, education, certifications } = resumeData;

  return (
    <div className="absolute top-0 left-0 w-0 h-0 overflow-hidden">
      <div ref={ref} className="w-[800px] p-10 font-sans text-black bg-white">
        <header className="border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-4xl font-bold mb-1 text-gray-900">{basics.name}</h1>
          <h2 className="text-xl text-gray-700 mb-3">{basics.title}</h2>
          <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
            <span>{basics.email}</span>
            <span>•</span>
            <span>{basics.phone}</span>
            <span>•</span>
            <span>{basics.location}</span>
            {basics.links.map(link => (
              <span key={link.name}>
                <span className="mr-4">•</span>
                {link.url}
              </span>
            ))}
          </div>
        </header>

        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1 text-gray-800">Summary</h3>
          <p className="text-sm leading-relaxed text-gray-700">{basics.summary}</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1 text-gray-800">Experience</h3>
          <div className="space-y-5">
            {experience.map((job, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-md text-gray-900">
                    {job.role} <span className="font-normal text-gray-600">at {job.company}</span>
                  </h4>
                  <span className="text-sm text-gray-600 font-medium">{job.dates}</span>
                </div>
                {job.bullets.length > 0 && (
                  <ul className="list-disc list-outside text-sm space-y-1 ml-4 mt-2">
                    {job.bullets.map((bullet, j) => (
                      <li key={j} className="text-gray-700 pl-1">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1 text-gray-800">Skills & Expertise</h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {skills.map((group, i) => (
              <div key={i} className="text-gray-700">
                <span className="font-bold text-gray-900">{group.group}:</span> {group.items.join(', ')}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1 text-gray-800">Education</h3>
          {education.map((edu, i) => (
            <div key={i} className="mb-2 flex justify-between items-baseline text-sm">
              <div>
                <span className="font-bold text-gray-900">{edu.institution}</span>
                <span className="text-gray-700"> - {edu.degree}</span>
              </div>
              <span className="text-gray-600 font-medium">{edu.dates}</span>
            </div>
          ))}
        </section>
        
        {certifications.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1 text-gray-800">Certifications</h3>
            <ul className="list-disc list-outside text-sm space-y-1 ml-4">
              {certifications.map((cert, i) => (
                <li key={i} className="text-gray-700 pl-1">{cert}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
});

PrintableResume.displayName = 'PrintableResume';

export default PrintableResume;
