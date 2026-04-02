import { Job } from "@/types";

export async function groqChat(prompt: string, apiKey: string, maxTokens: number = 1200): Promise<string> {
  if (!apiKey) return '⚠️ No Groq API key — go to Settings to add your free key.';
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      const code = data.error.code || '';
      if (response.status === 401 || code === 'invalid_api_key')
        return 'Error: Invalid Groq API key — please update it in Settings.';
      if (response.status === 429 || code.includes('rate_limit')) {
        const wait = response.headers?.get('retry-after') || '60';
        return `Error: Groq rate limit reached — wait ${wait}s and try again.`;
      }
      return `Error: ${data.error.message}`;
    }

    return data.choices?.[0]?.message?.content || 'No response.';
  } catch (error: any) {
    return `Error: ${error.message || 'Connection failed'}`;
  }
}

export async function searchJobs(params: {
  title?: string;
  location?: string;
  company?: string;
  query?: string;
  apiKey: string;
}): Promise<Job[]> {
  const { title, location, company, query, apiKey } = params;
  if (!apiKey) throw new Error('RapidAPI key missing');

  const q = [title, location, company, query].filter(Boolean).join(' ');
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(q)}&page=1&num_pages=1`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to fetch jobs');
  }

  const data = await response.json();
  return (data.data || []).map((j: any) => ({
    id: j.job_id,
    title: j.job_title,
    company: j.employer_name,
    location: `${j.job_city || ''}, ${j.job_state || ''} ${j.job_country || ''}`.trim(),
    description: j.job_description,
    url: j.job_apply_link,
    source: j.job_publisher,
    via: j.job_publisher,
    postedAt: j.job_posted_at_datetime_utc,
    salary: j.job_min_salary ? `$${j.job_min_salary} - $${j.job_max_salary}` : undefined,
    isLinkedIn: j.job_apply_link?.includes('linkedin.com'),
    isIndeed: j.job_apply_link?.includes('indeed.com'),
    isGlassdoor: j.job_apply_link?.includes('glassdoor.com'),
    easyApply: j.job_apply_is_direct,
  }));
}
