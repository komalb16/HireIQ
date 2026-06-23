"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Sparkles, Download, Copy, Eye, EyeOff, ChevronRight,
  Plus, Trash2, GripVertical, FileText, Code2, Palette,
  User, Briefcase, GraduationCap, Star, Wrench, Award,
  ChevronDown, ChevronUp, RotateCcw, Wand2, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAppContext } from "@/context/AppContext";
import { groqChat } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResumeSection {
  id: string;
  type: "experience" | "education" | "skills" | "projects" | "certifications" | "summary";
  title: string;
  items: ResumeItem[];
}

interface ResumeItem {
  id: string;
  [key: string]: string;
}

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  sections: ResumeSection[];
}

// ─── Templates ───────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean two-column layout, popular for tech roles",
    accentColor: "#6366f1",
    preview: "bg-gradient-to-br from-indigo-50 to-white",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Single column, maximum readability",
    accentColor: "#0f172a",
    preview: "bg-gradient-to-br from-slate-50 to-white",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Traditional format for finance & consulting",
    accentColor: "#1e3a5f",
    preview: "bg-gradient-to-br from-blue-50 to-white",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold headers for design & product roles",
    accentColor: "#059669",
    preview: "bg-gradient-to-br from-emerald-50 to-white",
  },
];

// ─── LaTeX template generator ─────────────────────────────────────────────────

function generateLatex(data: ResumeData): string {
  const experienceSection = data.sections.find(s => s.type === "experience");
  const educationSection = data.sections.find(s => s.type === "education");
  const skillsSection = data.sections.find(s => s.type === "skills");
  const projectsSection = data.sections.find(s => s.type === "projects");
  const summarySection = data.sections.find(s => s.type === "summary");

  const expItems = (experienceSection?.items || []).map(item => `
  \\resumeSubheading
    {${item.company || ""}}{${item.location || ""}}
    {${item.title || ""}}{${item.startDate || ""} -- ${item.endDate || "Present"}}
    \\resumeItemListStart
      ${(item.bullets || "").split("\n").filter(Boolean).map(b => `\\resumeItem{${b.replace(/^[-•]\s*/, "")}}`).join("\n      ")}
    \\resumeItemListEnd`).join("\n");

  const eduItems = (educationSection?.items || []).map(item => `
  \\resumeSubheading
    {${item.school || ""}}{${item.location || ""}}
    {${item.degree || ""}}{${item.startDate || ""} -- ${item.endDate || ""}}`).join("\n");

  const skillItems = (skillsSection?.items || []).map(item =>
    `\\textbf{${item.category || "Skills"}}{: ${item.skills || ""}}`
  ).join(" \\\\\n    ");

  const projItems = (projectsSection?.items || []).map(item => `
  \\resumeProjectHeading
    {\\textbf{${item.name || ""}} $|$ \\emph{${item.tech || ""}}}{${item.date || ""}}
    \\resumeItemListStart
      ${(item.bullets || "").split("\n").filter(Boolean).map(b => `\\resumeItem{${b.replace(/^[-•]\s*/, "")}}`).join("\n      ")}
    \\resumeItemListEnd`).join("\n");

  return `%-------------------------
% Resume in LaTeX
% Based on Jake's Resume Template
%-------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{\\item\\small{#1 \\vspace{-2pt}}}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${data.name || "Your Name"}} \\\\ \\vspace{1pt}
    \\small ${data.phone || ""}  $|$ \\href{mailto:${data.email || ""}}{${data.email || ""}} $|$
    \\href{${data.linkedin || ""}}{LinkedIn} $|$
    \\href{${data.github || ""}}{GitHub}${data.website ? ` $|$ \\href{${data.website}}{Portfolio}` : ""}
\\end{center}

${summarySection && summarySection.items[0]?.text ? `
%-----------SUMMARY-----------
\\section{Summary}
  \\small{${summarySection.items[0].text}}
` : ""}

${experienceSection && expItems.trim() ? `
%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${expItems}
  \\resumeSubHeadingListEnd
` : ""}

${projectsSection && projItems.trim() ? `
%-----------PROJECTS-----------
\\section{Projects}
  \\resumeSubHeadingListStart
${projItems}
  \\resumeSubHeadingListEnd
` : ""}

${educationSection && eduItems.trim() ? `
%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${eduItems}
  \\resumeSubHeadingListEnd
` : ""}

${skillsSection && skillItems.trim() ? `
%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${skillItems}
    }}
  \\end{itemize}
` : ""}

%-------------------------------------------
\\end{document}`;
}

// ─── HTML Preview generator ───────────────────────────────────────────────────

function generateHTMLPreview(data: ResumeData, template: string): string {
  const colors: Record<string, { accent: string; heading: string }> = {
    modern: { accent: "#6366f1", heading: "#1e1b4b" },
    minimal: { accent: "#0f172a", heading: "#0f172a" },
    executive: { accent: "#1e3a5f", heading: "#1e3a5f" },
    creative: { accent: "#059669", heading: "#064e3b" },
  };
  const c = colors[template] || colors.modern;

  const experienceSection = data.sections.find(s => s.type === "experience");
  const educationSection = data.sections.find(s => s.type === "education");
  const skillsSection = data.sections.find(s => s.type === "skills");
  const projectsSection = data.sections.find(s => s.type === "projects");
  const summarySection = data.sections.find(s => s.type === "summary");
  const certsSection = data.sections.find(s => s.type === "certifications");

  const sectionHeader = (title: string) =>
    `<div style="border-bottom:2px solid ${c.accent};margin:18px 0 10px;padding-bottom:4px;">
      <h2 style="color:${c.heading};font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;margin:0;">${title}</h2>
    </div>`;

  const expHTML = experienceSection?.items.map(item => `
    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <strong style="font-size:13px;color:${c.heading};">${item.company || ""}</strong>
        <span style="font-size:11px;color:#64748b;">${item.startDate || ""} – ${item.endDate || "Present"}</span>
      </div>
      <div style="display:flex;justify-content:space-between;">
        <em style="font-size:12px;color:${c.accent};">${item.title || ""}</em>
        <span style="font-size:11px;color:#94a3b8;">${item.location || ""}</span>
      </div>
      <ul style="margin:6px 0 0 16px;padding:0;">
        ${(item.bullets || "").split("\n").filter(Boolean).map(b =>
          `<li style="font-size:11.5px;color:#374151;margin-bottom:3px;">${b.replace(/^[-•]\s*/, "")}</li>`
        ).join("")}
      </ul>
    </div>`).join("") || "";

  const eduHTML = educationSection?.items.map(item => `
    <div style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;">
        <strong style="font-size:13px;color:${c.heading};">${item.school || ""}</strong>
        <span style="font-size:11px;color:#64748b;">${item.startDate || ""} – ${item.endDate || ""}</span>
      </div>
      <div style="display:flex;justify-content:space-between;">
        <span style="font-size:12px;color:#475569;">${item.degree || ""}</span>
        <span style="font-size:11px;color:#94a3b8;">${item.location || ""}</span>
      </div>
      ${item.gpa ? `<p style="font-size:11px;color:#64748b;margin:2px 0 0;">GPA: ${item.gpa}</p>` : ""}
    </div>`).join("") || "";

  const skillHTML = skillsSection?.items.map(item => `
    <div style="margin-bottom:5px;font-size:12px;">
      <strong style="color:${c.heading};">${item.category || ""}:</strong>
      <span style="color:#374151;"> ${item.skills || ""}</span>
    </div>`).join("") || "";

  const projHTML = projectsSection?.items.map(item => `
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <strong style="font-size:13px;color:${c.heading};">${item.name || ""}</strong>
        <span style="font-size:11px;color:#64748b;">${item.date || ""}</span>
      </div>
      ${item.tech ? `<em style="font-size:11px;color:${c.accent};">${item.tech}</em>` : ""}
      <ul style="margin:5px 0 0 16px;padding:0;">
        ${(item.bullets || "").split("\n").filter(Boolean).map(b =>
          `<li style="font-size:11.5px;color:#374151;margin-bottom:3px;">${b.replace(/^[-•]\s*/, "")}</li>`
        ).join("")}
      </ul>
    </div>`).join("") || "";

  const certHTML = certsSection?.items.map(item => `
    <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
      <span style="font-size:12px;color:#374151;"><strong>${item.name || ""}</strong> — ${item.issuer || ""}</span>
      <span style="font-size:11px;color:#64748b;">${item.date || ""}</span>
    </div>`).join("") || "";

  return `
    <div style="font-family:'Georgia',serif;max-width:780px;margin:0 auto;background:white;padding:32px 40px;color:#1e293b;">
      <div style="text-align:center;border-bottom:3px solid ${c.accent};padding-bottom:16px;margin-bottom:20px;">
        <h1 style="margin:0 0 6px;font-size:26px;font-weight:900;color:${c.heading};letter-spacing:-0.5px;">${data.name || "Your Name"}</h1>
        <div style="font-size:12px;color:#64748b;display:flex;justify-content:center;flex-wrap:wrap;gap:8px;">
          ${data.email ? `<span>${data.email}</span>` : ""}
          ${data.phone ? `<span>•</span><span>${data.phone}</span>` : ""}
          ${data.location ? `<span>•</span><span>${data.location}</span>` : ""}
          ${data.linkedin ? `<span>•</span><a href="${data.linkedin}" style="color:${c.accent};">LinkedIn</a>` : ""}
          ${data.github ? `<span>•</span><a href="${data.github}" style="color:${c.accent};">GitHub</a>` : ""}
          ${data.website ? `<span>•</span><a href="${data.website}" style="color:${c.accent};">Portfolio</a>` : ""}
        </div>
      </div>
      ${summarySection?.items[0]?.text ? `
        ${sectionHeader("Summary")}
        <p style="font-size:12.5px;color:#374151;line-height:1.6;margin:0 0 4px;">${summarySection.items[0].text}</p>
      ` : ""}
      ${expHTML ? `${sectionHeader("Experience")}${expHTML}` : ""}
      ${projHTML ? `${sectionHeader("Projects")}${projHTML}` : ""}
      ${eduHTML ? `${sectionHeader("Education")}${eduHTML}` : ""}
      ${skillHTML ? `${sectionHeader("Technical Skills")}${skillHTML}` : ""}
      ${certHTML ? `${sectionHeader("Certifications")}${certHTML}` : ""}
    </div>`;
}

// ─── Default resume data ──────────────────────────────────────────────────────

const defaultData: ResumeData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  sections: [
    {
      id: "summary",
      type: "summary",
      title: "Professional Summary",
      items: [{ id: "s1", text: "" }],
    },
    {
      id: "experience",
      type: "experience",
      title: "Work Experience",
      items: [
        {
          id: "e1",
          company: "",
          title: "",
          location: "",
          startDate: "",
          endDate: "",
          bullets: "",
        },
      ],
    },
    {
      id: "education",
      type: "education",
      title: "Education",
      items: [
        {
          id: "edu1",
          school: "",
          degree: "",
          location: "",
          startDate: "",
          endDate: "",
          gpa: "",
        },
      ],
    },
    {
      id: "skills",
      type: "skills",
      title: "Technical Skills",
      items: [
        { id: "sk1", category: "Languages", skills: "" },
        { id: "sk2", category: "Frameworks", skills: "" },
        { id: "sk3", category: "Tools & Platforms", skills: "" },
      ],
    },
    {
      id: "projects",
      type: "projects",
      title: "Projects",
      items: [
        {
          id: "p1",
          name: "",
          tech: "",
          date: "",
          bullets: "",
          url: "",
        },
      ],
    },
  ],
};

// ─── Section field configs ────────────────────────────────────────────────────

const SECTION_FIELDS: Record<string, { key: string; label: string; type?: string; fullWidth?: boolean }[]> = {
  experience: [
    { key: "company", label: "Company" },
    { key: "title", label: "Job Title" },
    { key: "location", label: "Location" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date (or Present)" },
    { key: "bullets", label: "Bullet Points (one per line)", type: "textarea", fullWidth: true },
  ],
  education: [
    { key: "school", label: "School / University" },
    { key: "degree", label: "Degree & Major" },
    { key: "location", label: "Location" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "gpa", label: "GPA (optional)" },
  ],
  skills: [
    { key: "category", label: "Category (e.g. Languages)" },
    { key: "skills", label: "Skills (comma separated)", fullWidth: true },
  ],
  projects: [
    { key: "name", label: "Project Name" },
    { key: "tech", label: "Technologies" },
    { key: "date", label: "Date" },
    { key: "url", label: "URL (optional)" },
    { key: "bullets", label: "Description (one bullet per line)", type: "textarea", fullWidth: true },
  ],
  certifications: [
    { key: "name", label: "Certification Name" },
    { key: "issuer", label: "Issuing Organization" },
    { key: "date", label: "Date Issued" },
    { key: "credentialId", label: "Credential ID (optional)" },
  ],
  summary: [
    { key: "text", label: "Professional Summary", type: "textarea", fullWidth: true },
  ],
};

// ─── AI bullet enhancer ───────────────────────────────────────────────────────

async function enhanceBullets(bullets: string, role: string, groqKey: string): Promise<string> {
  const prompt = `You are an expert resume writer. Rewrite these resume bullet points for a ${role || "software engineer"} role.
Make each bullet: action verb start, quantified where possible, concise (max 15 words), ATS-friendly.
Return ONLY the improved bullets, one per line, no numbering, no extra commentary.

Original bullets:
${bullets}`;
  return groqChat(prompt, groqKey);
}

async function generateSummary(data: ResumeData, groqKey: string): Promise<string> {
  const exp = data.sections.find(s => s.type === "experience")?.items[0];
  const edu = data.sections.find(s => s.type === "education")?.items[0];
  const skills = data.sections.find(s => s.type === "skills")?.items.map(i => i.skills).filter(Boolean).join(", ");

  const prompt = `Write a 2-3 sentence professional summary for a resume.
Name: ${data.name}
Most recent role: ${exp?.title || ""} at ${exp?.company || ""}
Education: ${edu?.degree || ""} from ${edu?.school || ""}
Skills: ${skills || ""}
Return ONLY the summary text, no labels, no quotes.`;
  return groqChat(prompt, groqKey);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ResumeBuilderPage() {
  const { state, addNotification } = useAppContext();
  const [resumeData, setResumeData] = useState<ResumeData>(defaultData);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [activeTab, setActiveTab] = useState<"build" | "preview" | "latex">("build");
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [enhancingId, setEnhancingId] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingFromAI, setGeneratingFromAI] = useState(false);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateField = (field: keyof Omit<ResumeData, "sections">, value: string) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const updateSectionItem = (sectionId: string, itemId: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, [field]: value } : i) }
          : s
      ),
    }));
  };

  const addItem = (sectionId: string) => {
    const section = resumeData.sections.find(s => s.id === sectionId);
    if (!section) return;
    const template = SECTION_FIELDS[section.type]?.reduce((acc, f) => ({ ...acc, [f.key]: "" }), { id: `${sectionId}_${Date.now()}` }) || { id: `${sectionId}_${Date.now()}` };
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, items: [...s.items, template] } : s
      ),
    }));
  };

  const removeItem = (sectionId: string, itemId: string) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
      ),
    }));
  };

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleEnhanceBullets = async (sectionId: string, itemId: string, bullets: string, role: string) => {
    if (!state.settings.groqKey) {
      addNotification("Auth Required", "Add your Groq AI key in Settings to use AI features.");
      return;
    }
    setEnhancingId(itemId);
    try {
      const enhanced = await enhanceBullets(bullets, role, state.settings.groqKey);
      updateSectionItem(sectionId, itemId, "bullets", enhanced);
      addNotification("Enhanced!", "Bullet points upgraded with AI.");
    } catch {
      addNotification("Error", "AI enhancement failed. Check your Groq key.");
    } finally {
      setEnhancingId(null);
    }
  };

  const handleGenerateSummary = async () => {
    if (!state.settings.groqKey) {
      addNotification("Auth Required", "Add your Groq AI key in Settings.");
      return;
    }
    setGeneratingSummary(true);
    try {
      const summary = await generateSummary(resumeData, state.settings.groqKey);
      setResumeData(prev => ({
        ...prev,
        sections: prev.sections.map(s =>
          s.type === "summary"
            ? { ...s, items: [{ id: "s1", text: summary.trim() }] }
            : s
        ),
      }));
      addNotification("Generated!", "Professional summary created.");
    } catch {
      addNotification("Error", "Summary generation failed.");
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleGenerateFromPrompt = async () => {
    if (!state.settings.groqKey) {
      addNotification("Auth Required", "Add your Groq AI key in Settings.");
      return;
    }
    if (!aiPrompt.trim()) {
      addNotification("Input Required", "Describe your background to generate a resume.");
      return;
    }
    setGeneratingFromAI(true);
    try {
      const prompt = `Based on this description, generate a complete resume in JSON format.
Description: ${aiPrompt}

Return ONLY valid JSON matching this structure exactly:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+1 555-000-0000",
  "location": "City, State",
  "linkedin": "https://linkedin.com/in/handle",
  "github": "https://github.com/handle",
  "website": "",
  "sections": [
    {
      "id": "summary", "type": "summary", "title": "Professional Summary",
      "items": [{ "id": "s1", "text": "2-3 sentence professional summary" }]
    },
    {
      "id": "experience", "type": "experience", "title": "Work Experience",
      "items": [
        { "id": "e1", "company": "Company Name", "title": "Job Title", "location": "City, ST", "startDate": "Jan 2022", "endDate": "Present", "bullets": "- Achieved X resulting in Y%\n- Built Z using technology A\n- Led team of N engineers" }
      ]
    },
    {
      "id": "education", "type": "education", "title": "Education",
      "items": [{ "id": "edu1", "school": "University Name", "degree": "B.S. Computer Science", "location": "City, ST", "startDate": "Aug 2018", "endDate": "May 2022", "gpa": "" }]
    },
    {
      "id": "skills", "type": "skills", "title": "Technical Skills",
      "items": [
        { "id": "sk1", "category": "Languages", "skills": "Python, JavaScript, TypeScript" },
        { "id": "sk2", "category": "Frameworks", "skills": "React, Node.js, Django" },
        { "id": "sk3", "category": "Tools", "skills": "AWS, Docker, Git" }
      ]
    },
    {
      "id": "projects", "type": "projects", "title": "Projects",
      "items": [{ "id": "p1", "name": "Project Name", "tech": "React, Node.js", "date": "2023", "bullets": "- Built X that does Y\n- Increased Z by N%", "url": "" }]
    }
  ]
}`;

      const raw = await groqChat(prompt, state.settings.groqKey);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean) as ResumeData;
      setResumeData(parsed);
      addNotification("Resume Generated!", "AI has populated your resume. Review and refine each section.");
      setActiveTab("build");
    } catch {
      addNotification("Error", "AI generation failed. Try a more detailed description.");
    } finally {
      setGeneratingFromAI(false);
    }
  };

  const copyLatex = () => {
    navigator.clipboard.writeText(generateLatex(resumeData));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addNotification("Copied!", "LaTeX code copied to clipboard. Paste into Overleaf.");
  };

  const downloadHTML = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${resumeData.name} - Resume</title></head><body>${generateHTMLPreview(resumeData, selectedTemplate)}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(resumeData.name || "resume").replace(/\s+/g, "_")}_resume.html`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification("Downloaded!", "Resume saved as HTML. Open in browser to print as PDF.");
  };

  const sectionIcon: Record<string, React.ReactNode> = {
    summary: <User size={14} />,
    experience: <Briefcase size={14} />,
    education: <GraduationCap size={14} />,
    skills: <Wrench size={14} />,
    projects: <Star size={14} />,
    certifications: <Award size={14} />,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em] border border-[var(--accent)]/20">
            <FileText size={12} /> Resume Builder
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[var(--accent)] to-cyan-400 bg-clip-text text-transparent tracking-tighter uppercase italic">
            Resume <span className="text-[var(--text)] not-italic">Studio</span>
          </h1>
          <p className="text-slate-400 text-sm uppercase tracking-widest">
            AI-powered builder + LaTeX export + ATS-optimized templates
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={downloadHTML}
            className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 font-black rounded-2xl text-sm shadow-lg shadow-emerald-500/20 uppercase flex items-center gap-2"
          >
            <Download size={16} /> Export HTML
          </Button>
          <Button
            onClick={copyLatex}
            variant="outline"
            className="h-12 px-6 border-slate-700 rounded-2xl font-black text-sm uppercase flex items-center gap-2"
          >
            <Code2 size={16} /> {copied ? "Copied!" : "Copy LaTeX"}
          </Button>
        </div>
      </div>

      {/* AI Quick Generate */}
      <Card className="p-6 bg-gradient-to-r from-[var(--accent)]/5 to-cyan-500/5 border-[var(--accent)]/20 rounded-3xl">
        <div className="flex items-center gap-3 mb-4">
          <Wand2 size={20} className="text-[var(--accent)]" />
          <h2 className="font-black text-lg uppercase tracking-widest">AI Quick Generate</h2>
          <Badge variant="outline" className="text-[10px] border-[var(--accent)]/30 text-[var(--accent)]">Powered by Groq</Badge>
        </div>
        <div className="flex gap-3">
          <textarea
            className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 text-sm text-[var(--text)] resize-none h-20 placeholder-slate-500 focus:outline-none focus:border-[var(--accent)] transition-colors"
            placeholder="Describe yourself: '5 years fullstack engineer, worked at Amazon as SDE2 on AWS Lambda, B.S. CS from IIT Hyderabad, skills in React/Python/AWS...'"
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
          />
          <Button
            onClick={handleGenerateFromPrompt}
            disabled={generatingFromAI}
            className="h-20 px-6 bg-[var(--accent)] hover:opacity-90 rounded-2xl font-black text-sm uppercase flex flex-col items-center gap-1 min-w-[100px]"
          >
            {generatingFromAI ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            <span>{generatingFromAI ? "Building..." : "Generate"}</span>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Panel — Builder */}
        <div className="xl:col-span-3 space-y-4">
          {/* Tab Bar */}
          <div className="flex bg-slate-900/80 rounded-2xl p-1 border border-slate-800 shadow-inner w-fit">
            {[
              { id: "build", icon: <FileText size={14} />, label: "Build" },
              { id: "preview", icon: <Eye size={14} />, label: "Preview" },
              { id: "latex", icon: <Code2 size={14} />, label: "LaTeX" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "build" | "preview" | "latex")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? "bg-[var(--accent)] text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "build" && (
              <motion.div key="build" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                {/* Personal Info */}
                <Card className="p-6 bg-[var(--surface)] border-[var(--border)] rounded-3xl">
                  <div className="flex items-center gap-3 mb-5">
                    <User size={16} className="text-[var(--accent)]" />
                    <h3 className="font-black text-sm uppercase tracking-widest">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "name", label: "Full Name", span: true },
                      { key: "email", label: "Email" },
                      { key: "phone", label: "Phone" },
                      { key: "location", label: "Location (City, State)" },
                      { key: "linkedin", label: "LinkedIn URL" },
                      { key: "github", label: "GitHub URL" },
                      { key: "website", label: "Portfolio URL" },
                    ].map(f => (
                      <div key={f.key} className={f.span ? "col-span-2" : ""}>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">{f.label}</label>
                        <input
                          type="text"
                          value={resumeData[f.key as keyof Omit<ResumeData, "sections">]}
                          onChange={e => updateField(f.key as keyof Omit<ResumeData, "sections">, e.target.value)}
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors placeholder-slate-600"
                          placeholder={f.label}
                        />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Resume Sections */}
                {resumeData.sections.map(section => (
                  <Card key={section.id} className="bg-[var(--surface)] border-[var(--border)] rounded-3xl overflow-hidden">
                    {/* Section Header */}
                    <button
                      className="w-full flex items-center justify-between p-5 hover:bg-slate-900/30 transition-colors"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[var(--accent)]">{sectionIcon[section.type]}</span>
                        <span className="font-black text-sm uppercase tracking-widest">{section.title}</span>
                        <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500">
                          {section.items.length} {section.items.length === 1 ? "entry" : "entries"}
                        </Badge>
                      </div>
                      {collapsedSections.has(section.id) ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>

                    {!collapsedSections.has(section.id) && (
                      <div className="px-5 pb-5 space-y-4 border-t border-slate-800/50">
                        {/* Summary special case */}
                        {section.type === "summary" && (
                          <div className="pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Professional Summary</label>
                              <Button
                                onClick={handleGenerateSummary}
                                disabled={generatingSummary}
                                className="h-7 px-3 text-[10px] font-black uppercase rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20"
                              >
                                {generatingSummary ? <Loader2 size={10} className="animate-spin mr-1" /> : <Sparkles size={10} className="mr-1" />}
                                AI Generate
                              </Button>
                            </div>
                            <textarea
                              value={section.items[0]?.text || ""}
                              onChange={e => updateSectionItem(section.id, section.items[0]?.id, "text", e.target.value)}
                              rows={4}
                              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none placeholder-slate-600"
                              placeholder="Experienced software engineer with 5+ years building scalable systems..."
                            />
                          </div>
                        )}

                        {section.type !== "summary" && section.items.map((item, idx) => (
                          <div key={item.id} className="pt-4 space-y-3">
                            {section.items.length > 1 && (
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Entry {idx + 1}</span>
                                <button
                                  onClick={() => removeItem(section.id, item.id)}
                                  className="text-red-500/60 hover:text-red-500 transition-colors p-1"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                              {(SECTION_FIELDS[section.type] || []).map(field => (
                                <div key={field.key} className={field.fullWidth ? "col-span-2" : ""}>
                                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">{field.label}</label>
                                  {field.type === "textarea" ? (
                                    <div className="space-y-2">
                                      <textarea
                                        value={item[field.key] || ""}
                                        onChange={e => updateSectionItem(section.id, item.id, field.key, e.target.value)}
                                        rows={4}
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none placeholder-slate-600"
                                        placeholder={field.key === "bullets" ? "- Increased API performance by 40% by optimizing SQL queries\n- Led team of 5 engineers to deliver project 2 weeks early" : ""}
                                      />
                                      {field.key === "bullets" && (
                                        <Button
                                          onClick={() => handleEnhanceBullets(section.id, item.id, item[field.key] || "", item.title || item.name || "")}
                                          disabled={enhancingId === item.id}
                                          className="h-7 px-3 text-[10px] font-black uppercase rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20 flex items-center gap-1"
                                        >
                                          {enhancingId === item.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                                          AI Enhance Bullets
                                        </Button>
                                      )}
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      value={item[field.key] || ""}
                                      onChange={e => updateSectionItem(section.id, item.id, field.key, e.target.value)}
                                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors placeholder-slate-600"
                                      placeholder={field.label}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        {section.type !== "summary" && (
                          <button
                            onClick={() => addItem(section.id)}
                            className="w-full mt-2 py-2.5 border-2 border-dashed border-slate-700 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-all flex items-center justify-center gap-2"
                          >
                            <Plus size={14} /> Add {section.title} Entry
                          </button>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </motion.div>
            )}

            {activeTab === "preview" && (
              <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Card className="rounded-3xl overflow-hidden border-[var(--border)]">
                  <div
                    ref={previewRef}
                    className="bg-white min-h-[1000px] overflow-auto"
                    dangerouslySetInnerHTML={{ __html: generateHTMLPreview(resumeData, selectedTemplate) }}
                  />
                </Card>
              </motion.div>
            )}

            {activeTab === "latex" && (
              <motion.div key="latex" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Card className="rounded-3xl overflow-hidden border-[var(--border)] bg-slate-950">
                  <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <Code2 size={16} className="text-emerald-400" />
                      <span className="text-sm font-black uppercase tracking-widest text-slate-300">LaTeX Source</span>
                      <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">Jake's Resume Format</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyLatex}
                        className="h-8 px-4 text-[10px] font-black uppercase rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 flex items-center gap-1"
                      >
                        <Copy size={10} /> {copied ? "Copied!" : "Copy All"}
                      </Button>
                      <a
                        href="https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 px-4 text-[10px] font-black uppercase rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 flex items-center gap-1 transition-colors"
                      >
                        Open Overleaf
                      </a>
                    </div>
                  </div>
                  <pre className="p-6 text-xs text-emerald-300 overflow-auto max-h-[800px] leading-relaxed font-mono whitespace-pre-wrap">
                    {generateLatex(resumeData)}
                  </pre>
                </Card>
                <div className="mt-4 p-4 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 text-sm text-slate-400">
                  <strong className="text-[var(--accent)]">How to use LaTeX:</strong> Copy the code above &rarr; Open{" "}
                  <a href="https://overleaf.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline">Overleaf.com</a>{" "}
                  &rarr; New Project &rarr; Blank Project &rarr; paste the code &rarr; Compile. Download as PDF directly from Overleaf.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel — Template Picker + Tips */}
        <div className="xl:col-span-2 space-y-6">
          {/* Template Selector */}
          <Card className="p-5 bg-[var(--surface)] border-[var(--border)] rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Palette size={16} className="text-[var(--accent)]" />
              <h3 className="font-black text-sm uppercase tracking-widest">Templates</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`relative p-3 rounded-2xl border-2 text-left transition-all ${
                    selectedTemplate === t.id
                      ? "border-[var(--accent)] bg-[var(--accent)]/5"
                      : "border-slate-800 hover:border-slate-600"
                  }`}
                >
                  <div
                    className="w-full h-12 rounded-xl mb-2"
                    style={{ background: `linear-gradient(135deg, ${t.accentColor}22, ${t.accentColor}11)`, borderLeft: `3px solid ${t.accentColor}` }}
                  />
                  <p className="text-xs font-black uppercase tracking-wider" style={{ color: t.accentColor }}>{t.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{t.description}</p>
                  {selectedTemplate === t.id && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[var(--accent)] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* ATS Tips */}
          <Card className="p-5 bg-[var(--surface)] border-[var(--border)] rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Star size={16} className="text-amber-500" />
              <h3 className="font-black text-sm uppercase tracking-widest text-amber-500">ATS Tips</h3>
            </div>
            <div className="space-y-3">
              {[
                { tip: "Use standard section headers", detail: "'Work Experience', 'Education', 'Skills' — ATS scanners look for these." },
                { tip: "Quantify everything", detail: "Replace 'improved performance' with 'improved performance by 40%'." },
                { tip: "Match job keywords", detail: "Copy key terms from the job description verbatim into your skills/bullets." },
                { tip: "One page for <5 years", detail: "Two pages is fine for 5+ years. Never three pages." },
                { tip: "No tables or columns in ATS submissions", detail: "Use a simple single-column format when submitting through portals." },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <span className="text-[9px] font-black text-amber-500">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text)]">{item.tip}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* LaTeX Resources */}
          <Card className="p-5 bg-[var(--surface)] border-[var(--border)] rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Code2 size={16} className="text-emerald-400" />
              <h3 className="font-black text-sm uppercase tracking-widest text-emerald-400">LaTeX Resources</h3>
            </div>
            <div className="space-y-2">
              {[
                { name: "Overleaf (Online Editor)", url: "https://overleaf.com", desc: "Free, browser-based LaTeX editor" },
                { name: "Jake's Resume Template", url: "https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs", desc: "Most popular CS resume template" },
                { name: "LaTeX Resume Guide", url: "https://www.overleaf.com/learn/latex/How_to_write_a_LaTeX_class_file_and_design_your_own_CV", desc: "Full customization guide" },
              ].map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-all group"
                >
                  <ChevronRight size={12} className="text-emerald-400 mt-1 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-400">{r.name}</p>
                    <p className="text-[11px] text-slate-500">{r.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
