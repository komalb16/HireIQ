// src/api/routes.js
import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { runJobAgent, getRunStatus } from '../agents/jobAgent.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ── Helper ────────────────────────────────────────────────────
function sanitize(user) {
  if (!user) return null;
  const { linkedin_password, ...safe } = user;
  safe.target_roles = tryParse(user.target_roles, []);
  safe.target_locations = tryParse(user.target_locations, []);
  return safe;
}

function tryParse(val, fallback) {
  try { return typeof val === 'string' ? JSON.parse(val) : val; }
  catch { return fallback; }
}

// ── Users ─────────────────────────────────────────────────────
router.post('/users', (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (user) {
    db.prepare('UPDATE users SET name=?, phone=?, updated_at=datetime("now") WHERE id=?').run(name, phone || user.phone, user.id);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  } else {
    const id = uuidv4();
    db.prepare('INSERT INTO users (id, name, email, phone) VALUES (?, ?, ?, ?)').run(id, name, email, phone || '');
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }
  res.json(sanitize(user));
});

router.get('/users/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(sanitize(user));
});

router.patch('/users/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });

  const allowed = ['name', 'phone', 'whatsapp_number', 'rapidapi_key', 'twilio_sid',
    'twilio_token', 'twilio_from', 'GROQ_key', 'target_roles', 'target_locations',
    'min_score', 'auto_apply', 'apply_limit_daily', 'notify_whatsapp'];

  const updates = {};
  for (const k of allowed) {
    if (req.body[k] !== undefined)
      updates[k] = typeof req.body[k] === 'object' ? JSON.stringify(req.body[k]) : req.body[k];
  }
  if (!Object.keys(updates).length) return res.json(sanitize(user));

  const set = Object.keys(updates).map((k) => `${k} = ?`).join(', ');
  db.prepare(`UPDATE users SET ${set}, updated_at = datetime('now') WHERE id = ?`).run(...Object.values(updates), req.params.id);
  res.json(sanitize(db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)));
});

// ── Resume Upload ─────────────────────────────────────────────
router.post('/users/:id/resume', upload.single('resume'), async (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    let text = '';
    const mime = req.file.mimetype;

    if (mime.includes('pdf')) {
      // Basic PDF text extraction — strip non-printable chars
      text = req.file.buffer.toString('latin1').replace(/[^\x20-\x7E\n\r]/g, ' ').replace(/\s{3,}/g, '\n').trim();
    } else {
      text = req.file.buffer.toString('utf8');
    }

    db.prepare('UPDATE users SET resume_text=?, resume_filename=?, updated_at=datetime("now") WHERE id=?')
      .run(text, req.file.originalname, req.params.id);

    res.json({ success: true, filename: req.file.originalname, chars: text.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Agent ─────────────────────────────────────────────────────
router.post('/agent/run', async (req, res) => {
  const { userId, dryRun } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const existing = getRunStatus(userId);
  if (existing?.status === 'running') return res.status(409).json({ error: 'Agent already running', runId: existing.runId });

  // Fire and forget — return immediately
  runJobAgent({ userId, dryRun: !!dryRun }).catch(console.error);
  res.json({ success: true, message: 'Agent started' });
});

router.get('/agent/status/:userId', (req, res) => {
  const status = getRunStatus(req.params.userId);
  if (!status) return res.json({ status: 'idle' });
  res.json(status);
});

router.get('/agent/history/:userId', (req, res) => {
  const runs = db.prepare('SELECT * FROM agent_runs WHERE user_id = ? ORDER BY started_at DESC LIMIT 20').all(req.params.userId);
  res.json(runs.map((r) => ({ ...r, log: tryParse(r.log, []) })));
});

// ── Jobs ──────────────────────────────────────────────────────
router.get('/jobs/:userId', (req, res) => {
  const { status, limit = 50, offset = 0 } = req.query;
  const where = status ? 'WHERE user_id = ? AND status = ?' : 'WHERE user_id = ?';
  const params = status ? [req.params.userId, status, +limit, +offset] : [req.params.userId, +limit, +offset];

  const jobs = db.prepare(`SELECT * FROM jobs ${where} ORDER BY match_score DESC, created_at DESC LIMIT ? OFFSET ?`).all(...params);
  const total = db.prepare(`SELECT COUNT(*) as n FROM jobs ${where === 'WHERE user_id = ?' ? where : 'WHERE user_id = ? AND status = ?'}`).get(...params.slice(0, status ? 2 : 1)).n;

  res.json({ jobs, total, limit: +limit, offset: +offset });
});

router.patch('/jobs/:jobId', (req, res) => {
  const { status, notes } = req.body;
  const updates = {};
  if (status) updates.status = status;
  if (notes !== undefined) updates.notes = notes;
  if (status === 'applied') updates.applied_at = new Date().toISOString();
  if (!Object.keys(updates).length) return res.json({ success: true });

  const set = Object.keys(updates).map((k) => `${k} = ?`).join(', ');
  db.prepare(`UPDATE jobs SET ${set} WHERE id = ?`).run(...Object.values(updates), req.params.jobId);
  res.json({ success: true });
});

router.get('/jobs/:userId/:jobId/resume', (req, res) => {
  const job = db.prepare('SELECT tailored_resume, title, company FROM jobs WHERE id = ? AND user_id = ?').get(req.params.jobId, req.params.userId);
  if (!job) return res.status(404).json({ error: 'Not found' });
  res.json(job);
});

router.get('/jobs/:userId/:jobId/cover', (req, res) => {
  const job = db.prepare('SELECT cover_letter, title, company FROM jobs WHERE id = ? AND user_id = ?').get(req.params.jobId, req.params.userId);
  if (!job) return res.status(404).json({ error: 'Not found' });
  res.json(job);
});

// ── Stats ─────────────────────────────────────────────────────
router.get('/stats/:userId', (req, res) => {
  const uid = req.params.userId;
  const total = db.prepare('SELECT COUNT(*) as n FROM jobs WHERE user_id = ?').get(uid).n;
  const byStatus = db.prepare('SELECT status, COUNT(*) as n FROM jobs WHERE user_id = ? GROUP BY status').all(uid);
  const avgScore = db.prepare('SELECT AVG(match_score) as avg FROM jobs WHERE user_id = ? AND match_score IS NOT NULL').get(uid).avg;
  const topJobs = db.prepare('SELECT title, company, match_score, status, job_url FROM jobs WHERE user_id = ? AND match_score >= 70 ORDER BY match_score DESC LIMIT 5').all(uid);
  const recentRuns = db.prepare('SELECT * FROM agent_runs WHERE user_id = ? ORDER BY started_at DESC LIMIT 5').all(uid);

  res.json({ total, byStatus, avgScore: Math.round(avgScore || 0), topJobs, recentRuns });
});

export default router;
