import { query } from '@/lib/db';
import { searchNews } from '@/lib/perplexity';
import { NextResponse } from 'next/server';

// POST /api/scrape-news - Fetch new news from Perplexity and save to database
export async function POST(request) {
  try {
    console.log('🔍 Starting news scrape...');

    // Search for news using Perplexity
    const { news } = await searchNews();

    console.log(`📰 Found ${news.length} news items from Perplexity`);

    if (news.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new news found',
        inserted: 0
      });
    }

    // Insert news into database (skip duplicates)
    let inserted = 0;
    for (const item of news) {
      try {
        await query(
          `INSERT INTO news (company, type, title, summary, source, url, article_date, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
           ON CONFLICT (url) DO NOTHING`,
          [
            item.company,
            item.type,
            item.title,
            item.summary,
            item.source,
            item.url
          ]
        );
        inserted++;
      } catch (err) {
        console.error('Error inserting news item:', err);
      }
    }

    console.log(`✅ Inserted ${inserted} new news items`);

    return NextResponse.json({
      success: true,
      message: `Successfully scraped news`,
      found: news.length,
      inserted: inserted
    });

  } catch (error) {
    console.error('Error scraping news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to scrape news' },
      { status: 500 }
    );
  }
}