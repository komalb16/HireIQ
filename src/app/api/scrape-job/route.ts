import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes('linkedin.com/jobs')) {
      return NextResponse.json({ error: 'Invalid LinkedIn Job URL' }, { status: 400 });
    }

    // Launch playwright in headless mode for the API
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for the description to load. Public pages usually have a 'show more' button.
    try {
      const showMoreBtn = await page.$('button[data-tracking-control-name="public_jobs_show-more-html-btn"]');
      if (showMoreBtn) {
        await showMoreBtn.click();
        await page.waitForTimeout(1000); // Give it time to expand
      }
    } catch (e) {
      // Button might not exist or already expanded
    }

    // Extract text. Public job descriptions are often in this class:
    const description = await page.evaluate(() => {
      const el = document.querySelector('.show-more-less-html__markup') || 
                 document.querySelector('.jobs-description-content__text') || 
                 document.querySelector('#job-details');
      return el ? (el as HTMLElement).innerText : '';
    });

    await browser.close();

    if (!description || description.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract job description. LinkedIn might be blocking the request.' }, { status: 400 });
    }

    return NextResponse.json({ description: description.trim() });
  } catch (error: any) {
    console.error('Scraping error:', error);
    return NextResponse.json({ error: error.message || 'Failed to scrape job' }, { status: 500 });
  }
}
