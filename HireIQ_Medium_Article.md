# I Built a Complete AI Job Search Toolkit in a Single HTML File — Here's Why and How

*A free, open alternative to $100+/month of separate tools — and why it beats the Apify scraper approach everyone keeps recommending*

---

When I started thinking seriously about job searching, I noticed the same problem everyone else notices: you need six different tools and none of them talk to each other.

You use one tool to find jobs. A different one to check if your resume will pass the ATS filter. Another to write cover letters. A spreadsheet to track applications. YouTube to practice interview answers. LinkedIn to research companies. And somewhere in between, you lose context, lose momentum, and spend half your energy managing tools instead of actually applying.

So I built HireIQ — a complete job search workflow in a single HTML file, powered by free AI, that covers everything from finding the job to negotiating the offer.

---

## What it does

HireIQ covers what would normally cost you around $100/month across separate paid tools:

**Job search** pulls live listings from LinkedIn, Indeed, and Glassdoor via the JSearch API (a licensed aggregator — more on why that matters in a moment). Results are scored against your saved resume so you see a match percentage on every card.

**ATS keyword checker** takes any job description, extracts the keywords an ATS system would look for, and shows you exactly which ones your resume hits, partially matches, or misses entirely — with a percentage score and a colour-coded breakdown. There's also an AI "fix gaps" button that rewrites your resume to close those gaps.

**Resume tailoring** rewrites your resume specifically for each role, embedding keywords naturally while keeping your actual experience intact. You can download the tailored version as a .docx or .pdf.

**Cover letter generator** writes a fully personalised cover letter using your resume, the full job description, and five tone options — Professional, Enthusiastic, Concise, Story-driven, or Bold & Direct. Not a template with your name dropped in. An actual letter that references specifics from the job.

**Kanban application tracker** is a drag-and-drop board across five stages: Applied → Screening → Interview → Offer → Rejected. Each card holds the job URL, salary, notes, priority level, and a follow-up reminder date. When a reminder is due, the card pulses red and you get a browser notification.

**AI mock interviewer** runs a real interview session — it asks questions, listens to your answers, and gives you a score out of 10 with specific feedback on content, structure, and what to improve. Four interview types: Behavioral, Technical, System Design, and Full Loop. Full session transcript at the end.

**Interview bank** has 145 curated questions from 46 companies — FAANG, Stripe, Shopify, Jane Street, Citadel, and more. Filter by category, difficulty, and company. Mark questions as reviewed, track your progress per category, and run Study Mode which flash-cards you through unreviewed questions.

**Salary estimator** takes a job description and your context (experience level, company size, location, currency) and returns a low/mid/high salary band with a rationale for each and a specific negotiation tip.

**Offer negotiation coach** is the newest feature. You enter the offer details — base salary, equity, signing bonus, any competing offers or leverage you have — and it generates a counter-offer script with the exact words to use, a BATNA analysis, and a ready-to-send negotiation email.

**Analytics dashboard** shows your response rate, interview rate, pipeline funnel, and weekly application cadence — all built from your own tracker data, no new APIs needed.

---

## The architecture

The entire application is one HTML file. No framework, no build step, no backend. About 300KB including all the CSS and JavaScript.

**Groq** handles all the AI — it runs `llama-3.3-70b-versatile` and has a generous free tier that covers everything a job search needs. You create a free account at console.groq.com, generate an API key, and paste it in on first launch.

**JSearch via RapidAPI** provides the live job data. Free plan gives 200 requests per month — enough for an active search with daily alerts. The key point: JSearch is a licensed data aggregator, which matters.

**Everything else** runs client-side. Your data — resume, tracker, alerts — lives in your browser's localStorage. Nothing is sent to any server except Groq and RapidAPI when you use those features.

Deployment is a drag-and-drop to Vercel. Three files: `index.html`, `sw.js` (service worker for push notifications and offline support), and `vercel.json` (headers config). Live at a public URL in under 5 minutes.

---

## Why not just use Apify and Claude?

I keep seeing people recommend this approach for job search automation: use an Apify actor to scrape LinkedIn, pipe the results to Claude, and have it process and organise the listings. It's a popular idea in AI circles right now.

I tried it. Here's my honest take.

**It works for one specific thing:** bulk data extraction. If you want 500 job listings scraped and dumped into a CSV, this is the right tool. Fast to set up if you're technical.

**It has two real problems:**

First, LinkedIn actively blocks scrapers. It's in their Terms of Service, they send cease-and-desist letters, and the Apify scrapers break frequently when LinkedIn changes its HTML structure. JSearch (what HireIQ uses) is a licensed data provider — they get LinkedIn's data through an official channel, so it's both legal and reliable.

Second, the scraping approach stops at the data. Finding the job is maybe 10% of the job search problem. The other 90% is everything that happens after: tailoring your resume, writing a cover letter, tracking your applications, practising for interviews, estimating the salary, negotiating the offer. A scraping workflow gives you a spreadsheet of jobs. HireIQ gives you the entire workflow.

They solve different halves of the same problem. Use Apify if you want to monitor a niche job market at scale. Use HireIQ if you want to actually get the job.

---

## vs. paying for separate tools

| What you need | Paid option | In HireIQ |
|---|---|---|
| ATS checking | JobScan — $50/mo | ✅ Free |
| Application tracking | Teal — $30/mo | ✅ Free |
| AI resume writing | Rezi — $30/mo | ✅ Free |
| Mock interview practice | Pramp, Interviewing.io | ✅ Free |
| Salary data | Levels.fyi (limited free) | ✅ Free |
| Negotiation coaching | Coaches — $200+/hr | ✅ Free |

The only cost is your time to get two free API keys — maybe 5 minutes total.

---

## What I learned building it

**Single-file architecture is underrated for tools like this.** When there's no backend to maintain, no database to manage, no auth to implement, and no servers to pay for, you can focus entirely on the features. The constraint forces clarity. Every feature has to earn its place because there's no "maybe we'll add a page for that later."

**The bring-your-own-keys model is better than it sounds.** I initially thought "make users get their own API keys" was a friction point that would kill adoption. It's actually a feature. Users who go through 5 minutes of setup to get a Groq key and a RapidAPI key are the users who are serious about their job search. The tool self-selects for motivated users. And their data never touches a server I control, which means I have zero data liability.

**AI is genuinely useful here, not gimmicky.** The ATS checker, resume tailoring, and cover letter generation all produce output that's actually better than what most people would write themselves — not because the AI is smarter, but because it never gets lazy, always includes the right keywords, and can produce a tailored cover letter in 30 seconds instead of 30 minutes. The mock interviewer is probably the feature I'm most proud of — getting real scored feedback on your answers at 11pm when no human interviewer is available is something that didn't exist in a free tool before.

**Perceived performance matters as much as actual performance.** I spent more time than I expected on loading states. Replacing the spinning loader with skeleton cards — placeholder cards in the same shape as real job cards, with a shimmer animation — made the app feel dramatically faster even though the API calls take the same time. The brain reacts to structure appearing faster than it reacts to content appearing.

---

## Try it / get the code

Live app: **hire-iq-lime.vercel.app**

To run it yourself:
1. Get a free Groq key at console.groq.com (2 min, no credit card)
2. Get a free RapidAPI key at rapidapi.com → search JSearch → subscribe Basic (Free) (3 min)
3. Open the app, enter your keys, and you're in

The entire application is a single HTML file. Everything runs in your browser. Your data stays with you.

---

*Built entirely with Claude as the AI pair-programmer. What usually takes weeks of scaffolding, framework decisions, and infrastructure setup took a fraction of the time when the entire application lives in one file and the AI handles the implementation details while you focus on what the tool should actually do.*

---

**Tags:** `artificial-intelligence` `job-search` `side-project` `web-development` `career`
