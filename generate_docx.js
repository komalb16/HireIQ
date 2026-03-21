const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, LevelFormat, UnderlineType,
  PageNumber, Footer, Header, TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

const args = process.argv.slice(2);
const mode      = args[0];          // 'resume' or 'coverletter'
const inputFile = args[1];          // path to JSON input
const outputFile= args[2];          // path to write .docx

const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// ─────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────
function hr() {
  return new Paragraph({
    paragraph: {
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '2E75B6', space: 1 } }
    },
    spacing: { before: 80, after: 80 }
  });
}

function sectionHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, font: 'Arial', color: '2E75B6' })],
    spacing: { before: 200, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '2E75B6', space: 2 } }
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun({ text, font: 'Arial', size: 20 })],
    spacing: { before: 20, after: 20 }
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Arial', size: opts.size || 20, bold: opts.bold || false, italic: opts.italic || false, color: opts.color || '000000' })],
    spacing: { before: opts.before || 0, after: opts.after || 60 },
    alignment: opts.align || AlignmentType.LEFT
  });
}

// ─────────────────────────────────────────────
// PARSE PLAIN-TEXT RESUME INTO STRUCTURED SECTIONS
// ─────────────────────────────────────────────
function parseResumeText(text) {
  // Normalize line endings, strip markdown artifacts
  const clean = text
    .replace(/\r\n/g, '\n')
    .replace(/\*\*(.*?)\*\*/g, '$1')     // remove **bold**
    .replace(/\*(.*?)\*/g, '$1')          // remove *italic*
    .replace(/#{1,6}\s*/g, '')            // remove ## headings
    .replace(/^[-–—]\s+/gm, '• ')        // normalize bullet dashes
    .replace(/^\u2022\s*/gm, '• ')        // normalize unicode bullets
    .trim();

  const lines = clean.split('\n').map(l => l.trimEnd());
  const sections = [];
  let currentSection = null;
  let currentContent = [];

  const SECTION_HEADERS = [
    /^(SUMMARY|PROFESSIONAL SUMMARY|OBJECTIVE|PROFILE)/i,
    /^(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE)/i,
    /^(EDUCATION|ACADEMIC)/i,
    /^(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|COMPETENCIES)/i,
    /^(CERTIFICATIONS?|LICENSES?|CREDENTIALS?)/i,
    /^(PROJECTS?|PERSONAL PROJECTS?|NOTABLE PROJECTS?)/i,
    /^(AWARDS?|ACHIEVEMENTS?|HONORS?)/i,
    /^(PUBLICATIONS?|RESEARCH)/i,
    /^(LANGUAGES?)/i,
    /^(VOLUNTEER|VOLUNTEERING)/i,
  ];

  function isHeader(line) {
    return SECTION_HEADERS.some(r => r.test(line.trim()));
  }

  for (const line of lines) {
    if (!line) {
      if (currentContent.length > 0) currentContent.push('');
      continue;
    }
    if (isHeader(line)) {
      if (currentSection) sections.push({ title: currentSection, lines: currentContent });
      currentSection = line.trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentSection) sections.push({ title: currentSection, lines: currentContent });

  // First non-section lines = contact block
  const firstSectionIdx = lines.findIndex(l => isHeader(l));
  const contactLines = (firstSectionIdx > 0 ? lines.slice(0, firstSectionIdx) : []).filter(l => l.trim());

  return { contactLines, sections };
}

function buildResumeParagraphs(parsed, name) {
  const children = [];

  // ── NAME ──
  const displayName = name || parsed.contactLines[0] || 'Your Name';
  children.push(new Paragraph({
    children: [new TextRun({ text: displayName, bold: true, size: 40, font: 'Arial', color: '1F3864' })],
    spacing: { before: 0, after: 60 },
    alignment: AlignmentType.CENTER
  }));

  // ── CONTACT LINE ──
  const contactInfo = parsed.contactLines.slice(1).filter(l => l.trim()).join('  |  ');
  if (contactInfo) {
    children.push(new Paragraph({
      children: [new TextRun({ text: contactInfo, size: 18, font: 'Arial', color: '444444' })],
      spacing: { before: 0, after: 160 },
      alignment: AlignmentType.CENTER
    }));
  }

  // ── SECTIONS ──
  for (const section of parsed.sections) {
    children.push(sectionHeading(section.title));

    for (const line of section.lines) {
      const trimmed = line.trim();
      if (!trimmed) { children.push(new Paragraph({ spacing: { before: 0, after: 40 } })); continue; }

      if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
        children.push(bullet(trimmed.replace(/^[•\-]\s+/, '')));
      } else if (/^\d{4}|^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(trimmed) && trimmed.length < 80) {
        // date / subtitle line
        children.push(new Paragraph({
          children: [new TextRun({ text: trimmed, size: 19, font: 'Arial', italic: true, color: '666666' })],
          spacing: { before: 20, after: 20 }
        }));
      } else if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 60) {
        // sub-section ALL CAPS → job title / company
        children.push(new Paragraph({
          children: [new TextRun({ text: trimmed, bold: true, size: 21, font: 'Arial', color: '1F3864' })],
          spacing: { before: 120, after: 20 }
        }));
      } else {
        children.push(para(trimmed, { before: 20, after: 20 }));
      }
    }
  }

  return children;
}

// ─────────────────────────────────────────────
// PARSE COVER LETTER TEXT
// ─────────────────────────────────────────────
function buildCoverLetterParagraphs(text, name, company) {
  const clean = text
    .replace(/\r\n/g, '\n')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s*/g, '')
    .trim();

  const lines = clean.split('\n');
  const children = [];

  // Header block
  children.push(new Paragraph({
    children: [new TextRun({ text: name || 'Your Name', bold: true, size: 28, font: 'Arial', color: '1F3864' })],
    spacing: { before: 0, after: 40 },
  }));

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  children.push(para(today, { size: 20, color: '666666', after: 200 }));

  // Body paragraphs
  let emptyCount = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      emptyCount++;
      if (emptyCount === 1) children.push(new Paragraph({ spacing: { before: 0, after: 120 } }));
      continue;
    }
    emptyCount = 0;

    // Salutation
    if (/^dear /i.test(trimmed)) {
      children.push(new Paragraph({
        children: [new TextRun({ text: trimmed, bold: true, size: 22, font: 'Arial' })],
        spacing: { before: 0, after: 160 }
      }));
    }
    // Closing
    else if (/^(sincerely|best regards|regards|yours truly|respectfully)/i.test(trimmed)) {
      children.push(new Paragraph({ spacing: { before: 160, after: 40 } }));
      children.push(new Paragraph({
        children: [new TextRun({ text: trimmed, size: 22, font: 'Arial' })],
        spacing: { before: 0, after: 80 }
      }));
    }
    // Signature name
    else if (trimmed === name || (name && trimmed.includes(name))) {
      children.push(new Paragraph({
        children: [new TextRun({ text: trimmed, bold: true, size: 22, font: 'Arial' })],
        spacing: { before: 0, after: 40 }
      }));
    }
    // Normal paragraph
    else {
      children.push(new Paragraph({
        children: [new TextRun({ text: trimmed, size: 22, font: 'Arial' })],
        spacing: { before: 0, after: 120 },
        alignment: AlignmentType.JUSTIFIED
      }));
    }
  }

  return children;
}

// ─────────────────────────────────────────────
// BUILD DOCUMENT
// ─────────────────────────────────────────────
async function buildDoc() {
  let contentChildren = [];

  if (mode === 'resume') {
    const parsed = parseResumeText(data.text);
    contentChildren = buildResumeParagraphs(parsed, data.name);
  } else {
    contentChildren = buildCoverLetterParagraphs(data.text, data.name, data.company);
  }

  const doc = new Document({
    numbering: {
      config: [{
        reference: 'bullets',
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: '\u2022',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }]
    },
    styles: {
      default: {
        document: { run: { font: 'Arial', size: 20 } }
      }
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1260, bottom: 1080, left: 1260 }
        }
      },
      children: contentChildren
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputFile, buffer);
  console.log('OK:' + outputFile);
}

buildDoc().catch(e => { console.error('ERR:' + e.message); process.exit(1); });
