// src/services/jobScraper.js
/**
 * Job Discovery Service — 100% Safe, API-only
 *
 * Sources (all legal, no ToS violations):
 *   1. JSearch (RapidAPI) — licensed aggregator covering LinkedIn, Indeed, Glassdoor, ZipRecruiter
 *   2. Remotive API — free remote tech jobs
 *   3. HN Who's Hiring — monthly Hacker News thread
 *
 * ⛔ No direct LinkedIn scraping
 * ⛔ No browser automation for job discovery
 * ✅ JSearch is a licensed data partner — fully legal
 */

const JSEARCH_BASE = 'https://jsearch.p.rapidapi.com/search';
const REMOTIVE_BASE = 'https://remotive.com/api/remote-jobs';

const DEFAULT_ROLES = [
  'Engineering Manager',
  'Director of Engineering',
  'Staff Engineer',
  'Principal Engineer',
  'Site Reliability Engineer',
  'Principal SRE',
  'VP of Engineering',
  'Platform Engineer',
  'DevOps Manager',
  'Technical Program Manager',
  'Staff SRE',
  'Engineering Director',
];

const DEFAULT_LOCATIONS = ['United States', 'Switzerland'];

/**
 * Deduplicate jobs by title + company combination
 */
function dedup(jobs) {
  const seen = new Set();
  return jobs.filter((j) => {
    const key = `${j.title?.toLowerCase()}_${j.company?.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Fetch jobs from JSearch (RapidAPI)
 * Covers: LinkedIn Jobs, Indeed, Glassdoor, ZipRecruiter, Monster
 */
export async function fetchFromJSearch({ roles, locations, apiKey, limit = 5 }) {
  const jobs = [];
  const key = apiKey || process.env.RAPIDAPI_KEY;

  if (!key) {
    console.warn('[JSearch] No API key — skipping');
    return jobs;
  }

  for (const role of roles.slice(0, 6)) {
    for (const location of locations.slice(0, 3)) {
      try {
        const query = encodeURIComponent(`${role} ${location}`);
        const url = `${JSEARCH_BASE}?query=${query}&page=1&num_pages=1&date_posted=week&remote_jobs_only=false`;

        const res = await fetch(url, {
          headers: {
            'X-RapidAPI-Key': key,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
          },
        });

        if (!res.ok) {
          console.error(`[JSearch] ${res.status} for "${role} ${location}"`);
          continue;
        }

        const data = await res.json();
        const results = (data.data || []).slice(0, limit);

        for (const j of results) {
          jobs.push({
            external_id: j.job_id,
            title: j.job_title || role,
            company: j.employer_name || 'Unknown',
            location: j.job_city ? `${j.job_city}, ${j.job_state || j.job_country}` : j.job_country,
            country: j.job_country || location,
            job_url: j.job_apply_link || j.job_google_link,
            description: j.job_description || '',
            salary: j.job_min_salary
              ? `$${j.job_min_salary?.toLocaleString()}–$${j.job_max_salary?.toLocaleString()} ${j.job_salary_period || ''}`
              : null,
            employment_type: j.job_employment_type,
            posted_date: j.job_posted_at_datetime_utc,
            source: 'jsearch',
          });
        }

        // Rate limiting: be polite to the API
        await new Promise((r) => setTimeout(r, 300));
      } catch (err) {
        console.error(`[JSearch] Error for "${role}":`, err.message);
      }
    }
  }

  return dedup(jobs);
}

/**
 * Fetch remote jobs from Remotive (free, no auth required)
 */
export async function fetchFromRemotive({ roles, limit = 5 }) {
  const jobs = [];

  try {
    const searchTerms = roles.slice(0, 4).map((r) =>
      r.toLowerCase().replace(/\s+/g, '-')
    );

    for (const term of searchTerms) {
      const url = `${REMOTIVE_BASE}?search=${encodeURIComponent(term)}&limit=${limit}`;
      const res = await fetch(url);

      if (!res.ok) continue;

      const data = await res.json();
      for (const j of (data.jobs || []).slice(0, limit)) {
        jobs.push({
          external_id: `remotive_${j.id}`,
          title: j.title,
          company: j.company_name,
          location: j.candidate_required_location || 'Remote',
          country: 'Remote',
          job_url: j.url,
          description: j.description?.replace(/<[^>]*>/g, '') || '',
          salary: j.salary || null,
          employment_type: j.job_type,
          posted_date: j.publication_date,
          source: 'remotive',
        });
      }

      await new Promise((r) => setTimeout(r, 200));
    }
  } catch (err) {
    console.error('[Remotive] Error:', err.message);
  }

  return dedup(jobs);
}

/**
 * Main scraper — combines all sources
 */
export async function scrapeJobs({ roles, locations, apiKey, maxPerSource = 5 }) {
  const activeRoles = roles?.length ? roles : DEFAULT_ROLES;
  const activeLocations = locations?.length ? locations : DEFAULT_LOCATIONS;

  console.log(`[Scraper] Searching ${activeRoles.length} roles × ${activeLocations.length} locations`);

  const [jsearchJobs, remotiveJobs] = await Promise.allSettled([
    fetchFromJSearch({ roles: activeRoles, locations: activeLocations, apiKey, limit: maxPerSource }),
    fetchFromRemotive({ roles: activeRoles, limit: 3 }),
  ]);

  const all = [
    ...(jsearchJobs.status === 'fulfilled' ? jsearchJobs.value : []),
    ...(remotiveJobs.status === 'fulfilled' ? remotiveJobs.value : []),
  ];

  const unique = dedup(all);
  console.log(`[Scraper] Found ${unique.length} unique jobs`);
  return unique;
}
