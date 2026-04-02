# I Built a Complete AI Job Search Toolkit in a Single HTML File

## A free alternative to $100+/month of separate tools — and why it beats the Apify scraper approach everyone keeps recommending

---

*8 min read · [Your Name]*

---

> 💡 **TL;DR:** HireIQ is a free, browser-based job search app covering live job search, ATS checking, resume tailoring, cover letters, mock interviews, salary estimation, and offer negotiation — all in one HTML file. No backend, no account, no subscription. [Try it here →](https://hire-iq-lime.vercel.app)

---

📸 **[HEADER IMAGE: Full-page screenshot of HireIQ with job results loaded, dark theme, sidebar visible. 1600×840px. This is your thumbnail everywhere.]**

---

## The Problem With Job Searching Today

When I started thinking seriously about job searching, I noticed the same problem everyone else notices: **you need six different tools and none of them talk to each other.**

You use one tool to *find* jobs. A different one to check if your resume will pass the **ATS** (Applicant Tracking System) filter. Another to write cover letters. A spreadsheet to track applications. YouTube to practice interview answers. LinkedIn to research companies.

At every handoff, you lose context. You copy-paste the same job description four times. You forget which version of your resume you sent where. The process is exhausting — and that's before you've written a single cover letter.

So I built **HireIQ**: a complete job search workflow in a single `index.html` file, powered by free AI, that takes you from *finding the job* to *negotiating the offer.*

---a

📊 **[DIAGRAM: Upload 04_workflow.svg here — the 5-step journey map. Caption: "HireIQ covers every step of the job search workflow."]**

---

## What HireIQ Does

Rather than add another tool to the chaos, HireIQ replaces all of them.

### 🔍 Live Job Search

Results pulled from **LinkedIn, Indeed, and Glassdoor** in real time via the **JSearch API** — a licensed data aggregator. Every result shows an AI match score against your saved resume, plus **LinkedIn** and **Easy Apply** badges. Full job descriptions with structured requirements, not just titles.

📸 **[SCREENSHOT: Job search results — 4–6 cards with match scores like "87% match". Caption: "Live results scored against your resume."]**

### 🎯 ATS Keyword Checker

**75% of resumes are rejected by ATS software before a human ever reads them.** HireIQ extracts every keyword from a job description, checks which ones your resume hits, partially matches, or misses entirely, and gives you a percentage score. An AI "Fix gaps" button rewrites your resume to close the gaps in seconds.

### ✂️ Resume Tailoring

Groq AI rewrites your resume specifically for each role — embedding keywords naturally while keeping your actual experience intact. Download as `.docx` or `.pdf` in one click.

### ✉️ Cover Letter Generator

A fully personalised letter using your resume, the full job description, and five tone options: *Professional, Enthusiastic, Concise, Story-driven, or Bold & Direct*. Not a template — a letter that references specifics from the role.

📸 **[SCREENSHOT: Cover letter tab — tone buttons + generated letter. Caption: "Five tones, fully personalised per role."]**

### 📋 Kanban Application Tracker

Drag-and-drop across five stages: **Applied → Screening → Interview → Offer → Rejected**. Each card holds the job URL, salary, notes, priority level, and a **follow-up reminder date**. When a reminder fires, the card pulses red and a push notification appears.

📸 **[SCREENSHOT: Kanban board with cards spread across multiple columns. Caption: "Drag cards between stages as you hear back."]**

### 🎤 AI Mock Interviewer

A real scored session — the AI asks questions, listens to your answers, and gives a score out of 10 with specific feedback on content, structure, and delivery. Four types: *Behavioral, Technical, System Design, Full Loop*. Full session transcript at the end.

### 💡 Interview Bank

145 curated questions from 46 companies — **FAANG, Stripe, Shopify, Jane Street, Citadel**, and more. Study Mode flash-cards you through unreviewed questions. Progress tracked per category.

📸 **[SCREENSHOT: Interview Bank — category progress bars at top, 2–3 open question cards. Caption: "145 questions, study mode, per-category progress."]**

### 💰 Salary Estimator + 🤝 Negotiation Coach

Paste a job description → **low/mid/high salary band** with rationale. Then enter the actual offer into the Negotiation Coach and get: a counter-offer script with the *exact words to say*, a **BATNA** analysis, and a ready-to-send negotiation email.

### 📊 Analytics Dashboard

Your **response rate, interview rate, pipeline funnel, and weekly cadence** — built from your own tracker data.

📸 **[SCREENSHOT: Analytics dashboard — stat cards + funnel chart. Caption: "Charts built from your own tracker data."]**

---

> 💡 **The full feature set covers what you'd normally pay ~$110/month for across JobScan ($50), Teal ($30), and Rezi ($30) — plus mock interviews, salary data, and negotiation coaching that none of them offer.**

---

## The Architecture

This is the part I'm most proud of. The *entire application* is one HTML file.

**No framework. No build step. No backend. No database. No server.** About **300KB** including all CSS and JavaScript.

```
index.html    ← the entire app
sw.js         ← service worker (offline + push notifications)
vercel.json   ← headers config
```

Three files. Deployed by drag-and-drop to Vercel in under 5 minutes.

📊 **[DIAGRAM: Upload 02_architecture.svg here — the layered architecture diagram. Caption: "Three layers: user's browser, the single HTML file, and two free APIs."]**

### Why single-file?

The constraint forces clarity. No backend to maintain, no database to manage, no auth to implement. Every feature has to earn its place.

**Your API keys and data never touch a server I control.** Everything lives in your browser's `localStorage`.

### The bring-your-own-keys model

Users get a free **Groq key** at `console.groq.com` and a free **RapidAPI key** at `rapidapi.com → JSearch`. Under 5 minutes total. No credit card required for either.

This felt like friction when I first designed it. It's actually a feature — users who complete setup are serious about their job search, and I have zero API costs and zero data liability.

---

## Why Not Just Use Apify + Claude?

This question keeps coming up, so let me answer it directly.

A popular approach right now is using an **Apify** web scraper connected to Claude to extract job listings in bulk. It's legitimate. Here's my honest assessment.

**It works for exactly one thing:** bulk data extraction. 500 job listings scraped and organised in a CSV.

**Two real problems:**

*First*, **LinkedIn actively blocks scrapers.** It's in their Terms of Service, they send cease-and-desist letters, and the scrapers break when LinkedIn changes its HTML. JSearch is a *licensed* data provider — it accesses LinkedIn's data officially. Legal and reliable.

*Second*, **the scraping approach stops at the data.** Finding the job is maybe 10% of the problem.

📊 **[DIAGRAM: Upload 03_comparison.svg here — the comparison table. Caption: "Apify finds jobs. HireIQ helps you get them."]**

> **The scraping approach finds jobs. HireIQ helps you get them. They solve different halves of the same problem.**

---

## What I Learned Building It

### 1. Perceived performance matters as much as actual performance

Replacing a spinning loader with **skeleton cards** — placeholder cards in the same shape as real results, with a shimmer animation — made the app feel dramatically faster even though the API calls take the same time. The brain reacts to *structure appearing* faster than *content appearing*.

This is what LinkedIn, Notion, and Vercel all do. 20 minutes to implement, bigger first impression than any feature.

### 2. The single-file constraint is a superpower

Most side projects die under their own complexity. HireIQ has none of that. The entire codebase is one file. Deploying a change is dragging a file into Vercel. Debugging is opening DevTools.

*For a productivity tool one person maintains, this is the right architecture.*

### 3. AI is genuinely useful here — not gimmicky

The ATS checker, resume tailoring, cover letter generation, and mock interview scoring all produce output that's *actually better* than what most people would write themselves. Not because AI is smarter, but because it never gets lazy, always includes the right keywords, and produces a tailored cover letter in 30 seconds instead of 30 minutes.

### 4. Headlines that name the pain beat headlines that describe the product

The original hero text was *"Your AI-powered job search toolkit."* I changed it to:

> *"Stop applying blindly. Start landing interviews."*

The first line names the emotion — sending applications into the void. The second is the payoff. Users don't need inspiration; they need to know immediately whether this solves their problem.

---

📊 **[DIAGRAM: Upload 01_feature_map.svg here — the full feature wheel. Caption: "All 8 features in one tool — from search to negotiation."]**

---

## Try It

**Live app:** [hire-iq-lime.vercel.app](https://hire-iq-lime.vercel.app)

1. Get a free Groq key at [console.groq.com](https://console.groq.com) *(2 min, no credit card)*
2. Get a free RapidAPI key at [rapidapi.com](https://rapidapi.com) → search **JSearch** → subscribe Basic (Free) *(3 min)*
3. Open the app, enter your keys, and you're in

Everything runs in your browser. Your data stays with you.

---

## What's Next

- **Career path advisor** — resume → AI maps your next 2–3 roles and what skills you need
- **Browser extension** — one-click ATS check on any LinkedIn job page
- **Cloud sync** — Supabase to persist data across devices

If you try HireIQ and have feedback, I'd genuinely like to hear it.

---

*Built entirely with Claude as the AI pair-programmer.*

---

**Tags:** `artificial-intelligence` `job-search` `side-project` `web-development` `career`

---
---

## 📸 UPLOAD GUIDE FOR MEDIUM

**How to upload diagrams in Medium:**
1. Click the **+** button on any empty line
2. Choose **Image**
3. Upload the `.svg` file directly — Medium accepts SVG
4. Add the caption from the `[...]` marker

**Diagram files to upload:**
- `01_feature_map.svg` → place after "What's Next" section
- `02_architecture.svg` → place after "The Architecture" section
- `03_comparison.svg` → place after "Why Not Just Use Apify" section
- `04_workflow.svg` → place after the opening problem section

**Screenshots to take:**
1. Search results with match scores (header image — 1600×840px)
2. Cover letter tab with generated output
3. Kanban board with cards in multiple columns
4. Interview Bank with category progress bars
5. Analytics dashboard stat cards

---
---

## 💬 SUGGESTED BIO LINES

Pick one or combine two. Medium bios show under your name on every article.

**Option 1 — Builder focus:**
*"Software engineer and side project builder. I build tools that solve real problems — currently HireIQ, a free AI job search toolkit used by job seekers worldwide."*

**Option 2 — Concise + credible:**
*"Builder · AI tools enthusiast · Creator of HireIQ. I write about building software, AI in the real world, and lessons from shipping side projects."*

**Option 3 — Problem-first:**
*"I build tools that replace expensive software with free alternatives. Latest: HireIQ — an AI job search toolkit that replaces $100+/month of paid tools."*

**Option 4 — Personal + professional:**
*"[Your role] by day, builder by night. Created HireIQ — a free AI-powered job search app. Writing about software, side projects, and what I learn building them."*

**Option 5 — Short and punchy:**
*"Building with AI. Creator of HireIQ. Writing about what actually works."*

**My recommendation: Option 2** — it signals what you do, why to follow you, and what you've built, in two sentences. The word "enthusiast" is warm without being vague.

For the profile photo: use a real photo, not an avatar. Articles with a real face get 30–40% more follows from readers who liked the article.
