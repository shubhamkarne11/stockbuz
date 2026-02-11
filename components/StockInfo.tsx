"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface StockInfoProps {
    symbol: string;
    quote: any;
    summary: any;
}

export function StockInfo({ symbol, quote: initialQuote, summary: initialSummary }: StockInfoProps) {
    const [quote, setQuote] = useState(initialQuote);
    const [summary, setSummary] = useState(initialSummary);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/stocks/${symbol}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.quote) setQuote(data.quote);
                    // Summary might not change as often, but we can update it too if needed
                    if (data.summary) setSummary(data.summary);
                }
            } catch (error) {
                console.error("Failed to update stock info", error);
            }
        }, 1000); // Poll every 1 second

        return () => clearInterval(interval);
    }, [symbol]);

    const price = quote.regularMarketPrice;
    const change = quote.regularMarketChange;
    const changePercent = quote.regularMarketChangePercent;
    const isPositive = change >= 0;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard label="Previous Close" value={quote.regularMarketPreviousClose} prefix="₹" />
            <StatsCard label="Open" value={quote.regularMarketOpen} prefix="₹" />
            <StatsCard label="Day High" value={quote.regularMarketDayHigh} prefix="₹" className="text-green-500" />
            <StatsCard label="Day Low" value={quote.regularMarketDayLow} prefix="₹" className="text-red-500" />

            <StatsCard label="Volume" value={quote.regularMarketVolume} formatter={(val) => (val / 1000000).toFixed(2) + "M"} />
            <StatsCard label="Market Cap" value={quote.marketCap} formatter={(val) => "₹" + (val / 10000000).toFixed(2) + "Cr"} />
            <StatsCard label="P/E Ratio" value={quote.trailingPE} formatter={(val) => val?.toFixed(2)} />
            <StatsCard label="52W High" value={quote.fiftyTwoWeekHigh} prefix="₹" />
        </div>
    );
}

function StatsCard({ label, value, prefix = "", formatter, className }: any) {
    const displayValue = value ? (formatter ? formatter(value) : `${prefix}${value.toLocaleString()}`) : "N/A";

    return (
        <Card className="bg-black/30 backdrop-blur border-white/5 hover:border-primary/30 transition-all hover:bg-black/50 group">
            <CardContent className="p-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-xl font-mono font-semibold tracking-tight group-hover:text-primary transition-colors ${className}`}>
                    {displayValue}
                </p>
            </CardContent>
        </Card>
    );
}
