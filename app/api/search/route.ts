import { NextResponse } from 'next/server';
import yahooFinance from '@/lib/yahoo';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        const results = await yahooFinance.search(query) as any;
        const quotes = results.quotes;
        return NextResponse.json({ results: quotes });
    } catch (error) {
        console.error('Yahoo Finance Search Error:', error);
        return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
    }
}
