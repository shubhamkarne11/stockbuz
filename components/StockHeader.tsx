"use client";

import { useEffect, useState } from "react";

interface StockHeaderProps {
    symbol: string;
    quote: any;
}

export function StockHeader({ symbol, quote: initialQuote }: StockHeaderProps) {
    const [quote, setQuote] = useState(initialQuote);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/stocks/${symbol}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.quote) setQuote(data.quote);
                }
            } catch (error) {
                console.error("Failed to update stock header", error);
            }
        }, 1000); // Poll every 1 second

        return () => clearInterval(interval);
    }, [symbol]);

    const price = quote.regularMarketPrice;
    const change = quote.regularMarketChange;
    const changePercent = quote.regularMarketChangePercent;
    const isPositive = change >= 0;

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Glow Effect */}
            <div className="absolute -left-20 -top-20 w-40 h-40 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-all duration-700"></div>

            <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">{symbol}</h1>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider shadow-[0_0_10px_-3px_var(--primary)]">
                        {quote.exchange || "NSE"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {quote.quoteType || "EQUITY"}
                    </span>
                </div>
                <p className="text-lg text-muted-foreground font-medium">{quote.longName || quote.shortName}</p>
            </div>

            <div className="relative z-10 mt-4 md:mt-0 text-right">
                <div className="flex items-baseline justify-end space-x-3">
                    <span className="text-5xl font-mono font-medium tracking-tighter text-foreground drop-shadow-lg">
                        {quote.regularMarketPrice?.toLocaleString('en-IN', { style: 'currency', currency: quote.currency || 'INR' })}
                    </span>
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                </div>
                <div className={`flex items-center justify-end mt-1 text-lg font-bold ${quote.regularMarketChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {quote.regularMarketChange > 0 ? "+" : ""}{quote.regularMarketChange?.toFixed(2)}
                    <span className="ml-2 px-2 py-0.5 rounded bg-current/10 text-sm">
                        ({quote.regularMarketChangePercent?.toFixed(2)}%)
                    </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                    Last Updated: {new Date().toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
}
