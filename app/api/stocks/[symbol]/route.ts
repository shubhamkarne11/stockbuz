import { NextResponse } from 'next/server';
import yahooFinance from '@/lib/yahoo';

export async function GET(
    request: Request,
    props: { params: Promise<{ symbol: string }> }
) {
    const params = await props.params;
    const symbol = params.symbol;

    try {
        const quote = await yahooFinance.quote(symbol);
        const summary = await yahooFinance.quoteSummary(symbol, { modules: ['summaryProfile', 'price', 'defaultKeyStatistics'] });

        return NextResponse.json({ quote, summary });
    } catch (error) {
        console.error('Error fetching stock quote:', error);
        return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
    }
}
