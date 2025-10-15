import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// POST /api/subscribe - Add email subscriber
export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Insert subscriber (or update if exists)
    await query(
      `INSERT INTO subscribers (email, subscribed_at, active)
       VALUES ($1, NOW(), true)
       ON CONFLICT (email) 
       DO UPDATE SET active = true, subscribed_at = NOW()`,
      [email.toLowerCase().trim()]
    );

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to daily digest'
    });

  } catch (error) {
    console.error('Error subscribing email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}