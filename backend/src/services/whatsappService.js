// src/services/whatsappService.js
/**
 * WhatsApp Notification Service via Twilio
 */

async function send({ sid, token, from, to, body }) {
  const s = sid || process.env.TWILIO_ACCOUNT_SID;
  const t = token || process.env.TWILIO_AUTH_TOKEN;
  const f = from || process.env.TWILIO_WHATSAPP_FROM;
  const dest = to || process.env.WHATSAPP_TO;

  if (!s || !t || !f || !dest) {
    console.warn('[WhatsApp] Not configured — skipping');
    return { success: false };
  }

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${s}/Messages.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${s}:${t}`).toString('base64'),
    },
    body: new URLSearchParams({
      From: f.startsWith('whatsapp:') ? f : `whatsapp:${f}`,
      To: dest.startsWith('whatsapp:') ? dest : `whatsapp:${dest}`,
      Body: body,
    }).toString(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Twilio ${res.status}`);
  return { success: true, sid: data.sid };
}

export async function notifyJobFound({ user, job, matchScore }) {
  const stars = matchScore >= 85 ? '🔥🔥🔥' : matchScore >= 70 ? '⭐⭐' : '📋';
  const msg = `${stars} *New Job Match: ${matchScore}%*

*${job.title}*
🏢 ${job.company}
📍 ${job.location}
${job.salary ? `💰 ${job.salary}` : ''}

📝 This job has been added to your queue for review.
🔗 ${job.job_url || 'No direct link'}

_JobAgent Pro_`;

  return send({
    sid: user.twilio_sid, token: user.twilio_token,
    from: user.twilio_from, to: user.whatsapp_number,
    body: msg,
  }).catch(console.error);
}

export async function notifyDailySummary({ user, stats }) {
  const msg = `📊 *Daily Job Report*
━━━━━━━━━━━━━━━━━━
🔍 Jobs discovered: ${stats.found}
🎯 High matches (${stats.minScore}%+): ${stats.highMatch}
✉️ Ready to apply: ${stats.queued}

${stats.topJobs?.slice(0, 3).map((j, i) =>
    `${i + 1}. *${j.title}* @ ${j.company} (${j.score}%)`
  ).join('\n') || 'No matches today'}

Open your dashboard to review and apply.
_JobAgent Pro_`;

  return send({
    sid: user.twilio_sid, token: user.twilio_token,
    from: user.twilio_from, to: user.whatsapp_number,
    body: msg,
  }).catch(console.error);
}

export async function notifyError({ user, message }) {
  return send({
    sid: user.twilio_sid, token: user.twilio_token,
    from: user.twilio_from, to: user.whatsapp_number,
    body: `⚠️ *JobAgent Error*\n${message}\n\nCheck dashboard for details.`,
  }).catch(console.error);
}
