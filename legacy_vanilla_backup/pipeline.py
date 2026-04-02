#!/usr/bin/env python3
"""
HireIQ Document Pipeline
  audit  <text_file>              → JSON audit result
  pdf    <docx_file> <out_dir>    → converts docx to pdf via LibreOffice
"""
import sys, json, re, subprocess, os, shutil, tempfile
from pathlib import Path

# ─────────────────────────────────────────────
# ATS COMPLIANCE AUDIT
# ─────────────────────────────────────────────
def audit_resume(text: str) -> dict:
    issues   = []
    warnings = []
    passed   = []

    lines = text.strip().splitlines()
    first_500 = text[:500]

    # 1. Markdown artifacts
    md_bold   = re.findall(r'\*\*[^*]+\*\*', text)
    md_head   = re.findall(r'^#{1,6}\s+', text, re.MULTILINE)
    md_italic = re.findall(r'(?<!\*)\*[^*\n]+\*(?!\*)', text)
    if md_bold:   issues.append({'rule': 'Markdown bold', 'detail': f'{len(md_bold)} instance(s) of **text** found — renders literally in ATS', 'fix': 'Remove ** markers'})
    if md_head:   issues.append({'rule': 'Markdown headings', 'detail': f'{len(md_head)} ## heading(s) found', 'fix': 'Remove # characters, use CAPS section headers'})
    if md_italic: warnings.append({'rule': 'Markdown italic', 'detail': f'{len(md_italic)} *italic* instance(s) found', 'fix': 'Remove * markers'})
    if not md_bold and not md_head: passed.append('No markdown artifacts')

    # 2. Problematic bullet characters
    bad_bullets = re.findall(r'[→►▸▶✓✔★☆❖◆◇]', text)
    if bad_bullets:
        issues.append({'rule': 'Unsupported bullet characters', 'detail': f'Found: {set(bad_bullets)} — many ATS systems skip these', 'fix': 'Use plain dash (-) or standard bullet (•)'})
    else:
        passed.append('Bullet characters are ATS-safe')

    # 3. Contact info in first 10 lines
    contact_block = '\n'.join(lines[:10])
    has_email  = bool(re.search(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}', contact_block))
    has_phone  = bool(re.search(r'[\+\(]?[\d\s\-\(\)]{7,}', contact_block))
    if not has_email: issues.append({'rule': 'Missing email', 'detail': 'No email address found in first 10 lines', 'fix': 'Add email at the top of resume'})
    else: passed.append('Email address present')
    if not has_phone: warnings.append({'rule': 'Missing phone', 'detail': 'No phone number found in first 10 lines', 'fix': 'Add phone number near the top'})
    else: passed.append('Phone number present')

    # 4. Standard section headings
    standard_sections = {
        'experience': r'\b(work experience|professional experience|experience|employment)\b',
        'education':  r'\beducation\b',
        'skills':     r'\b(skills|technical skills|core competencies|competencies)\b',
    }
    text_lower = text.lower()
    missing_sections = []
    for name, pattern in standard_sections.items():
        if re.search(pattern, text_lower):
            passed.append(f'"{name.title()}" section found')
        else:
            missing_sections.append(name)
    if missing_sections:
        warnings.append({'rule': 'Missing standard sections', 'detail': f'Could not find: {", ".join(missing_sections)}', 'fix': 'Add standard section headings ATS can parse'})

    # 5. Date formats
    bad_dates = re.findall(r'\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+of\s+\d{4}\b', text, re.IGNORECASE)
    if bad_dates:
        warnings.append({'rule': 'Verbose date format', 'detail': f'{len(bad_dates)} verbose date(s) found', 'fix': 'Use "Jan 2023" or "01/2023" format'})
    else:
        passed.append('Date formats look ATS-friendly')

    # 6. Word count
    words = len(text.split())
    if words < 200:
        warnings.append({'rule': 'Too short', 'detail': f'Only {words} words — may appear thin to ATS ranking algorithms', 'fix': 'Aim for 400–800 words for most roles'})
    elif words > 1200:
        warnings.append({'rule': 'Too long', 'detail': f'{words} words — most ATS systems prefer 1 page (≤800 words)', 'fix': 'Trim to most recent/relevant 10 years'})
    else:
        passed.append(f'Word count ({words}) is in the ideal range')

    # 7. Special characters that confuse parsers
    bad_chars = re.findall(r'[""''–—…©®™]', text)
    if bad_chars:
        warnings.append({'rule': 'Smart quotes / special chars', 'detail': f'{len(bad_chars)} curly quotes or special characters found', 'fix': 'Use straight quotes and ASCII dashes'})
    else:
        passed.append('No problematic special characters')

    # 8. Tables / column indicators (heuristic)
    has_tabs = text.count('\t') > 5
    if has_tabs:
        warnings.append({'rule': 'Tab characters detected', 'detail': 'Tabs may indicate a two-column layout which confuses ATS parsers', 'fix': 'Use single-column layout'})
    else:
        passed.append('No multi-column layout detected')

    score = max(0, 100 - len(issues) * 20 - len(warnings) * 8)
    grade = 'A' if score >= 90 else 'B' if score >= 75 else 'C' if score >= 55 else 'D'

    return {
        'score':    score,
        'grade':    grade,
        'issues':   issues,
        'warnings': warnings,
        'passed':   passed,
        'words':    words,
        'summary':  f'{len(issues)} critical issue(s), {len(warnings)} warning(s), {len(passed)} check(s) passed'
    }

# ─────────────────────────────────────────────
# DOCX → PDF via LibreOffice
# ─────────────────────────────────────────────
def convert_to_pdf(docx_path: str, out_dir: str) -> str:
    docx_path = os.path.abspath(docx_path)
    out_dir   = os.path.abspath(out_dir)
    os.makedirs(out_dir, exist_ok=True)

    result = subprocess.run(
        ['python3', '/mnt/skills/public/docx/../../../scripts/office/soffice.py' if os.path.exists('/mnt/skills/public/docx/../../../scripts/office/soffice.py') else 'libreoffice',
         '--headless', '--convert-to', 'pdf', '--outdir', out_dir, docx_path],
        capture_output=True, text=True, timeout=60
    )

    # Try direct libreoffice if wrapper not found
    if result.returncode != 0 or 'Error' in result.stderr:
        result = subprocess.run(
            ['libreoffice', '--headless', '--convert-to', 'pdf', '--outdir', out_dir, docx_path],
            capture_output=True, text=True, timeout=60
        )

    stem = Path(docx_path).stem
    pdf_path = os.path.join(out_dir, stem + '.pdf')
    if os.path.exists(pdf_path):
        return pdf_path
    raise RuntimeError(f'PDF not created. stderr: {result.stderr[:400]}')

# ─────────────────────────────────────────────
# ENTRYPOINT
# ─────────────────────────────────────────────
if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''

    if cmd == 'audit':
        text_file = sys.argv[2]
        with open(text_file) as f:
            text = f.read()
        result = audit_resume(text)
        print(json.dumps(result))

    elif cmd == 'pdf':
        docx_file = sys.argv[2]
        out_dir   = sys.argv[3]
        pdf = convert_to_pdf(docx_file, out_dir)
        print('OK:' + pdf)

    else:
        print('Usage: pipeline.py audit <text_file> | pdf <docx_file> <out_dir>', file=sys.stderr)
        sys.exit(1)
