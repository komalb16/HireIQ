// src/agents/jobAgent.js
/**
 * Job Agent Orchestrator
 *
 * Pipeline:
 * 1. Discover jobs via safe APIs (JSearch + Remotive)
 * 2. Score each job vs resume with Claude AI
 * 3. For high-scoring jobs: tailor resume + generate cover letter
 * 4. Save everything to DB — user reviews and applies manually (safest)
 * 5. Send WhatsApp summary
 *
 * ✅ Safe approach: no LinkedIn automation, no account risk
 * ✅ User applies manually from dashboard with one-click job links
 */

import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { scrapeJobs } from '../services/jobScraper.js';
import { scoreJobMatch, tailorResume, generateCoverLetter } from '../services/aiService.js';
import { notifyDailySummary, notifyError } from '../services/whatsappService.js';

const activeRuns = new Map();

export function getRunStatus(userId) {
  return activeRuns.get(userId) || null;
}

export async function runJobAgent({ userId, dryRun = false }) {
  const runId = uuidv4();

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) throw new Error(`User ${userId} not found`);

  const targetRoles = JSON.parse(user.target_roles || '[]');
  const targetLocations = JSON.parse(user.target_locations || '[]');
  const minScore = user.min_score || 65;
  const dailyLimit = user.apply_limit_daily || 10;

  const logs = [];
  const log = (msg) => {
    const line = `[${new Date().toISOString()}] ${msg}`;
    logs.push(line);
    console.log(line);
    const s = activeRuns.get(userId);
    if (s) { s.logs = logs; s.lastLog = msg; }
  };

  db.prepare(`INSERT INTO agent_runs (id, user_id, status, started_at) VALUES (?, ?, 'running', datetime('now'))`).run(runId, userId);

  activeRuns.set(userId, {
    runId, status: 'running', phase: 'Starting',
    jobsFound: 0, jobsScored: 0, jobsQueued: 0,
    logs, lastLog: 'Starting agent...', startTime: Date.now(),
  });

  const status = () => activeRuns.get(userId);
  const updateStatus = (updates) => activeRuns.set(userId, { ...activeRuns.get(userId), ...updates });

  try {
    // ── Phase 1: Discover ────────────────────────────────────
    log(`Phase 1: Discovering jobs for ${targetRoles.length} roles in ${targetLocations.join(', ')}`);
    updateStatus({ phase: 'Discovering jobs...' });

    const rawJobs = await scrapeJobs({
      roles: targetRoles,
      locations: targetLocations,
      apiKey: user.rapidapi_key || process.env.RAPIDAPI_KEY,
      maxPerSource: 5,
    });

    log(`Discovered ${rawJobs.length} unique jobs`);
    updateStatus({ jobsFound: rawJobs.length });

    // Filter out already-seen jobs
    const newJobs = rawJobs.filter((j) => {
      if (!j.external_id) return true;
      const existing = db.prepare('SELECT id FROM jobs WHERE external_id = ? AND user_id = ?').get(j.external_id, userId);
      return !existing;
    });

    log(`${newJobs.length} new jobs (${rawJobs.length - newJobs.length} already seen)`);

    // Save all new jobs to DB as 'discovered'
    for (const j of newJobs) {
      db.prepare(`INSERT OR IGNORE INTO jobs
        (id, user_id, external_id, title, company, location, country, job_url, description, salary, employment_type, posted_date, source, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'discovered')
      `).run(uuidv4(), userId, j.external_id, j.title, j.company, j.location, j.country, j.job_url, j.description, j.salary, j.employment_type, j.posted_date, j.source);
    }

    // ── Phase 2: Score ───────────────────────────────────────
    log(`Phase 2: Scoring ${newJobs.length} jobs against resume`);
    updateStatus({ phase: 'AI scoring jobs...' });

    const scoredJobs = [];
    for (const j of newJobs.slice(0, 30)) {
      try {
        const match = await scoreJobMatch({
          resume: user.resume_text,
          jobTitle: j.title,
          jobDescription: j.description,
          targetRoles,
          apiKey: user.GROQ_key || process.env.GROQ_API_KEY,
        });

        db.prepare(`UPDATE jobs SET status='scored', match_score=?, match_reasons=?, match_gaps=?
          WHERE external_id=? AND user_id=?
        `).run(match.score, JSON.stringify(match.reasons), JSON.stringify(match.gaps), j.external_id, userId);

        scoredJobs.push({ ...j, score: match.score, match });
        log(`  Scored: "${j.title}" @ ${j.company} → ${match.score}% (${match.verdict})`);
      } catch (err) {
        log(`  Score failed for "${j.title}": ${err.message}`);
      }
    }

    updateStatus({ jobsScored: scoredJobs.length });

    // ── Phase 3: Tailor high-scoring jobs ───────────────────
    const highMatches = scoredJobs
      .filter((j) => j.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, dailyLimit);

    log(`Phase 3: Tailoring resumes for ${highMatches.length} high-match jobs (score ≥ ${minScore}%)`);
    updateStatus({ phase: 'Tailoring resumes...', jobsQueued: highMatches.length });

    for (const j of highMatches) {
      if (!dryRun && user.resume_text) {
        try {
          const [tailored, coverLetter] = await Promise.all([
            tailorResume({
              resume: user.resume_text,
              jobTitle: j.title,
              jobDescription: j.description,
              company: j.company,
              apiKey: user.GROQ_key || process.env.GROQ_API_KEY,
            }),
            generateCoverLetter({
              resume: user.resume_text,
              jobTitle: j.title,
              jobDescription: j.description,
              company: j.company,
              apiKey: user.GROQ_key || process.env.GROQ_API_KEY,
            }),
          ]);

          db.prepare(`UPDATE jobs SET status='ready', tailored_resume=?, cover_letter=?
            WHERE external_id=? AND user_id=?
          `).run(tailored, coverLetter, j.external_id, userId);

          log(`  Tailored: "${j.title}" @ ${j.company}`);
        } catch (err) {
          log(`  Tailoring failed: ${err.message}`);
          db.prepare(`UPDATE jobs SET status='scored' WHERE external_id=? AND user_id=?`).run(j.external_id, userId);
        }
      }
    }

    // ── Phase 4: WhatsApp Summary ────────────────────────────
    log('Phase 4: Sending WhatsApp summary');
    updateStatus({ phase: 'Sending notifications...' });

    if (user.notify_whatsapp && !dryRun) {
      await notifyDailySummary({
        user: {
          twilio_sid: user.twilio_sid || process.env.TWILIO_ACCOUNT_SID,
          twilio_token: user.twilio_token || process.env.TWILIO_AUTH_TOKEN,
          twilio_from: user.twilio_from || process.env.TWILIO_WHATSAPP_FROM,
          whatsapp_number: user.whatsapp_number || process.env.WHATSAPP_TO,
        },
        stats: {
          found: newJobs.length,
          highMatch: highMatches.length,
          queued: highMatches.length,
          minScore,
          topJobs: highMatches.slice(0, 3).map((j) => ({
            title: j.title, company: j.company, score: j.score,
          })),
        },
      });
    }

    // ── Complete ─────────────────────────────────────────────
    const completedAt = new Date().toISOString();
    db.prepare(`UPDATE agent_runs SET status='completed', jobs_found=?, jobs_scored=?, jobs_applied=?, completed_at=?, log=?
      WHERE id=?`).run(newJobs.length, scoredJobs.length, highMatches.length, completedAt, JSON.stringify(logs), runId);

    updateStatus({ status: 'completed', phase: 'Done', completedAt });
    log(`✅ Agent run complete. Found ${newJobs.length} → Scored ${scoredJobs.length} → Ready ${highMatches.length}`);

    return { runId, jobsFound: newJobs.length, jobsScored: scoredJobs.length, jobsReady: highMatches.length };
  } catch (err) {
    log(`❌ Agent error: ${err.message}`);
    db.prepare(`UPDATE agent_runs SET status='failed', completed_at=datetime('now'), log=? WHERE id=?`).run(JSON.stringify(logs), runId);
    updateStatus({ status: 'failed', phase: 'Error' });

    try {
      await notifyError({ user: { whatsapp_number: user.whatsapp_number }, message: err.message });
    } catch (_) {}

    throw err;
  } finally {
    setTimeout(() => activeRuns.delete(userId), 60000);
  }
}
