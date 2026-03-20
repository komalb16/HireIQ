// src/config/database.js
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/jobagent.db');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    whatsapp_number TEXT,
    rapidapi_key TEXT,
    twilio_sid TEXT,
    twilio_token TEXT,
    twilio_from TEXT,
    GROQ_key TEXT,
    resume_text TEXT,
    resume_filename TEXT,
    target_roles TEXT DEFAULT '["Engineering Manager","Director of Engineering","Staff Engineer","Principal Engineer","SRE","Principal SRE","VP of Engineering","Platform Engineer"]',
    target_locations TEXT DEFAULT '["USA","Switzerland"]',
    min_score INTEGER DEFAULT 65,
    auto_apply INTEGER DEFAULT 0,
    apply_limit_daily INTEGER DEFAULT 10,
    notify_whatsapp INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    external_id TEXT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    country TEXT,
    job_url TEXT,
    description TEXT,
    salary TEXT,
    employment_type TEXT,
    posted_date TEXT,
    source TEXT DEFAULT 'jsearch',
    status TEXT DEFAULT 'discovered',
    match_score INTEGER,
    match_reasons TEXT,
    match_gaps TEXT,
    tailored_resume TEXT,
    cover_letter TEXT,
    applied_at TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS agent_runs (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    status TEXT DEFAULT 'running',
    jobs_found INTEGER DEFAULT 0,
    jobs_scored INTEGER DEFAULT 0,
    jobs_applied INTEGER DEFAULT 0,
    started_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    log TEXT DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    type TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    sent_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export default db;
