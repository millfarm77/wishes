import { NextRequest, NextResponse } from 'next/server';
import { scrapeProductUrl } from '@/lib/scraper';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'A valid URL is required' },
        { status: 400 }
      );
    }

    const metadata = await scrapeProductUrl(url);
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Scrape API error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape product data' },
      { status: 500 }
    );
  }
}
