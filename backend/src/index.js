// src/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import routes from './api/routes.js';
import db from './config/database.js';
import { runJobAgent } from './agents/jobAgent.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE'], credentials: false }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files if present
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../frontend')));

app.use('/api', routes);

app.get('/health', (req, res) => res.json({
  status: 'ok', version: '2.0.0', timestamp: new Date().toISOString()
}));

// Daily cron at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('[Cron] Running scheduled job agent for all users with auto_apply=1');
  const users = db.prepare('SELECT id FROM users WHERE auto_apply = 1').all();
  for (const { id } of users) {
    try { await runJobAgent({ userId: id }); }
    catch (err) { console.error(`[Cron] Failed for user ${id}:`, err.message); }
  }
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║        JobAgent Pro v2.0 — Backend            ║
║        http://localhost:${PORT}                  ║
╠═══════════════════════════════════════════════╣
║  POST /api/users          Register user       ║
║  PATCH /api/users/:id     Update settings     ║
║  POST /api/users/:id/resume  Upload resume    ║
║  POST /api/agent/run      Start agent         ║
║  GET  /api/agent/status/:id  Live status      ║
║  GET  /api/jobs/:userId   Browse jobs         ║
║  GET  /api/stats/:userId  Dashboard stats     ║
╚═══════════════════════════════════════════════╝
  `);
});

export default app;
