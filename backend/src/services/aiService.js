// src/services/aiService.js
/**
 * AI Service — GROQ Claude
 * - Score job match against resume (0-100)
 * - Tailor resume for specific job description
 * - Generate targeted cover letter
 * - Extract structured job details
 */

const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile'; // or 'mixtral-8x7b-32768'
// headers: 'Authorization': `Bearer ${key}`
// body format: OpenAI-compatible (messages array, no separate system field)

async function callClaude({ apiKey, system, user, maxTokens = 2000 }) {
  const key = apiKey || process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ API key not configured');

  const res = await fetch(GROQ_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'GROQ-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || '';
}

function safeJSON(text, fallback) {
  try {
    return JSON.parse(text.replace(/```json?|```/g, '').trim());
  } catch {
    return fallback;
  }
}

/**
 * Score how well a job matches the candidate's profile
 * Returns { score, verdict, reasons, gaps, apply_recommendation }
 */
export async function scoreJobMatch({ resume, jobTitle, jobDescription, targetRoles, apiKey }) {
  const system = `You are an expert technical recruiter. Analyze job fit objectively and return ONLY valid JSON.`;

  const user = `
Resume (first 3000 chars):
"""
${(resume || 'No resume provided').slice(0, 3000)}
"""

Job Title: ${jobTitle}
Job Description (first 2500 chars):
"""
${(jobDescription || 'No description').slice(0, 2500)}
"""

Candidate's target roles: ${JSON.stringify(targetRoles || [])}

Return ONLY this JSON object, no other text:
{
  "score": <integer 0-100>,
  "verdict": "<Excellent|Good|Fair|Poor> match",
  "reasons": ["<strength 1>", "<strength 2>"],
  "gaps": ["<gap 1>", "<gap 2>"],
  "experience_required": "<e.g. 8+ years>",
  "key_skills_matched": ["skill1", "skill2"],
  "apply_recommendation": <true|false>,
  "headline": "<one sentence why this is/isn't a match>"
}`;

  try {
    const text = await callClaude({ apiKey, system, user, maxTokens: 600 });
    return safeJSON(text, {
      score: 55, verdict: 'Fair match', reasons: [], gaps: [],
      apply_recommendation: true, headline: 'Score estimation failed — review manually',
    });
  } catch (err) {
    console.error('[AI] scoreJobMatch error:', err.message);
    return { score: 50, verdict: 'Fair match', reasons: [], gaps: [], apply_recommendation: true };
  }
}

/**
 * Tailor the candidate's resume for a specific job
 * Returns updated resume text with job-relevant highlights
 */
export async function tailorResume({ resume, jobTitle, jobDescription, company, apiKey }) {
  if (!resume || resume.length < 50) {
    return resume || 'No resume provided';
  }

  const system = `You are an expert resume writer specializing in tech leadership roles.
Tailor resumes to maximize ATS scoring while keeping content 100% truthful.
Return ONLY the updated resume text — no preamble, no commentary.`;

  const user = `
Target Job: ${jobTitle} at ${company}

Job Description (key requirements):
"""
${(jobDescription || '').slice(0, 2000)}
"""

Current Resume:
"""
${resume.slice(0, 4000)}
"""

Rewrite the resume to:
1. Mirror exact keywords from the job description (for ATS matching)
2. Reorder bullet points to lead with most relevant experience
3. Quantify any unquantified achievements with reasonable estimates
4. Adjust the professional summary to target this specific role
5. Keep all facts 100% accurate — only reframe, never fabricate

Return only the tailored resume text.`;

  try {
    return await callClaude({ apiKey, system, user, maxTokens: 2500 });
  } catch (err) {
    console.error('[AI] tailorResume error:', err.message);
    return resume;
  }
}

/**
 * Generate a targeted cover letter
 */
export async function generateCoverLetter({ resume, jobTitle, jobDescription, company, apiKey }) {
  const system = `You are an expert cover letter writer for senior tech roles.
Write compelling, authentic cover letters that get interviews. Be specific, not generic.
Return ONLY the cover letter text — no subject line, no meta-commentary.`;

  const user = `
Job: ${jobTitle} at ${company}

Job Description:
"""
${(jobDescription || '').slice(0, 2000)}
"""

Candidate Background:
"""
${(resume || '').slice(0, 2500)}
"""

Write a 3-paragraph cover letter:
- Para 1: Hook — why THIS role at THIS company excites them specifically
- Para 2: Proof — 2-3 specific accomplishments that directly address the job requirements
- Para 3: Ask — clear call to action and availability

Tone: Confident, specific, conversational. Not robotic.`;

  try {
    return await callClaude({ apiKey, system, user, maxTokens: 800 });
  } catch (err) {
    console.error('[AI] generateCoverLetter error:', err.message);
    return `Dear Hiring Manager,\n\nI am very interested in the ${jobTitle} role at ${company}.\n\nBest regards`;
  }
}
