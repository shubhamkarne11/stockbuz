import { NextResponse } from 'next/server';
import yahooFinance from '@/lib/yahoo';

export async function GET() {
    try {
        // Yahoo Finance has a 'trending' module, but 'dailyGainers' etc might need specific query options or different module.
        // yahoo-finance2 'trending' usually returns trending search terms, not necessarily market movers.
        // 'screener' or specific modules are often used.
        // For simplicity and reliability without a premium subscription, we might simulate "Market Movers" 
        // by fetching a predefined list of popular volatile stocks, OR use `yahooFinance.dailyGainers` if available/supported in this lib version.
        // Checking doc/types, `dailyGainers` isn't a direct top-level method in all versions.

        // Alternative: Use `quote` on a list of known movers or indices. 
        // However, users want "Futuristic" real data.
        // Let's try to query trending/screener if possible. 
        // Since `yahoo-finance2` APIs can be tricky with free tier, we will fetch a mix of popular tech/finance stocks 
        // and sort them by % change to dynamically generate "Gainers" and "Losers".

        const symbols = [
            'NVDA', 'TSLA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NFLX', 'AMD', 'INTC', // US Tech
            'RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS', 'ICICIBANK.NS', 'TATASTEEL.NS', 'SBIN.NS', 'ADANIENT.NS', // Indian
            'BTC-USD', 'ETH-USD' // Crypto
        ];

        const quotes = await yahooFinance.quote(symbols);

        const validQuotes = quotes.filter(q => q.regularMarketChangePercent !== undefined);

        // Sort for Gainers (>0, desc)
        const gainers = [...validQuotes]
            .filter(q => q.regularMarketChangePercent! > 0)
            .sort((a, b) => b.regularMarketChangePercent! - a.regularMarketChangePercent!)
            .slice(0, 5);

        // Sort for Losers (<0, asc)
        const losers = [...validQuotes]
            .filter(q => q.regularMarketChangePercent! < 0)
            .sort((a, b) => a.regularMarketChangePercent! - b.regularMarketChangePercent!)
            .slice(0, 5);

        // Most Active (by volume)
        const active = [...validQuotes]
            .sort((a, b) => (b.regularMarketVolume || 0) - (a.regularMarketVolume || 0))
            .slice(0, 5);

        return NextResponse.json({ gainers, losers, active });
    } catch (error) {
        console.error('Market Movers API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch market movers' }, { status: 500 });
    }
}
