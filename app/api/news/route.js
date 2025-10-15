import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/news - Fetch news from database
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || 50;
    const days = searchParams.get('days') || 7;

    // Fetch news from last X days
    const result = await query(
      `SELECT * FROM news 
       WHERE article_date >= NOW() - INTERVAL '${days} days'
       ORDER BY article_date DESC 
       LIMIT $1`,
      [limit]
    );

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      news: result.rows
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}