import { NextResponse } from 'next/server';
import yahooFinance from '@/lib/yahoo';

export async function GET(
    request: Request,
    props: { params: Promise<{ symbol: string }> }
) {
    const params = await props.params;
    const symbol = params.symbol;

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '1y';
    const interval = searchParams.get('interval') || '1d';

    // Validate/Map interval based on range if needed, or trust client/defaults
    // Yahoo Finance API standard ranges: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
    // Standard intervals: 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo

    const queryOptions: any = {
        interval: interval || '1d',
        includePrePost: false
    };

    const now = new Date();
    let period1 = new Date();

    switch (range) {
        case '1d':
            // For 1d, 1y etc, standard calc. 1d often implies "today" or "last 24h"
            period1.setDate(now.getDate() - 1); // 24h ago
            break;
        case '5d':
            period1.setDate(now.getDate() - 5);
            break;
        case '1mo':
            period1.setMonth(now.getMonth() - 1);
            break;
        case '6mo':
            period1.setMonth(now.getMonth() - 6);
            break;
        case 'ytd':
            period1 = new Date(now.getFullYear(), 0, 1);
            break;
        case '1y':
            period1.setFullYear(now.getFullYear() - 1);
            break;
        case '5y':
            period1.setFullYear(now.getFullYear() - 5);
            break;
        case 'max':
            period1 = new Date(0); // 1970
            break;
        default:
            period1.setFullYear(now.getFullYear() - 1); // Default 1y
            break;
    }

    queryOptions.period1 = period1.toISOString();
    // Do not include 'range' in queryOptions as it causes validation error

    try {
        const chartData = await yahooFinance.chart(symbol, queryOptions);
        return NextResponse.json(chartData);
    } catch (error) {
        console.error('Error fetching chart data:', error);
        return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
    }
}
