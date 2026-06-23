import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes('linkedin.com/jobs')) {
      return NextResponse.json({ error: 'Invalid LinkedIn Job URL' }, { status: 400 });
    }

    // Use fetch-based scraping compatible with Vercel serverless
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'LinkedIn blocked the request. Please paste the job description manually.' 
      }, { status: 400 });
    }

    const html = await response.text();

    // Extract job description from LinkedIn HTML
    // Try multiple selectors via regex
    let description = '';

    // Method 1: JSON-LD structured data (most reliable)
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (jsonLdMatch) {
      try {
        const jsonLd = JSON.parse(jsonLdMatch[1]);
        if (jsonLd.description) {
          // Strip HTML tags from description
          description = jsonLd.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        }
      } catch (e) {
        // JSON parse failed, try next method
      }
    }

    // Method 2: Extract from show-more-less HTML markup
    if (!description) {
      const descMatch = html.match(/class="show-more-less-html__markup[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      if (descMatch) {
        description = descMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    // Method 3: Extract from jobs description content
    if (!description) {
      const altMatch = html.match(/id="job-details"[^>]*>([\s\S]*?)<\/section>/i);
      if (altMatch) {
        description = altMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    if (!description || description.trim().length < 50) {
      return NextResponse.json({ 
        error: 'Could not extract job description. LinkedIn may require login. Please paste the job description text manually.' 
      }, { status: 400 });
    }

    return NextResponse.json({ description: description.trim() });
  } catch (error: any) {
    console.error('Scraping error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch job description. Please paste the text manually.' 
    }, { status: 500 });
  }
}
