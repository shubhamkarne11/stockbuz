"use client";

import { useEffect, useState } from "react";

const INDICES = [
    { symbol: "^NSEI", name: "NIFTY 50" },
    { symbol: "^BSESN", name: "SENSEX" },
    { symbol: "^GSPC", name: "S&P 500" },
    { symbol: "^IXIC", name: "NASDAQ" },
    { symbol: "^DJI", name: "DOW JONES" },
    { symbol: "BTC-USD", name: "BITCOIN" },
    { symbol: "GC=F", name: "GOLD" },
];

export function TickerTape() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data for all indices
                // In a real app, you might want to batch this or use a specific API endpoint
                // For now, we'll fetch them individually or use a bulk endpoint if created
                // To save API calls on the client, we should probably create a route for this specific component
                // or just fetch quotes.

                // Let's create a quick client-side fetch loop for now, or better: 
                // We should really have an API route for this to avoid exposing API keys (though we are using server-side lib on client? No, api routes.)

                const promises = INDICES.map(index =>
                    fetch(`/api/stocks/${index.symbol}`).then(res => res.json())
                );

                const results = await Promise.all(promises);
                const tapeData = results.map((res, i) => ({
                    ...INDICES[i],
                    price: res.quote?.regularMarketPrice,
                    change: res.quote?.regularMarketChange,
                    changePercent: res.quote?.regularMarketChangePercent
                }));

                setData(tapeData);

            } catch (error) {
                console.error("Failed to fetch ticker data", error);
            }
        };

        fetchData();
        // Poll every 10 seconds for ticker
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    if (data.length === 0) return null;

    return (
        <div className="w-full bg-muted/30 border-b overflow-hidden py-2 backdrop-blur-sm z-40">
            <div className="animate-ticker flex whitespace-nowrap">
                {/* Double the list to create seamless loop effect */}
                {[...data, ...data].map((item, i) => (
                    <div key={`${item.symbol}-${i}`} className="inline-flex items-center mx-6 space-x-2">
                        <span className="font-bold text-sm tracking-wide">{item.name}</span>
                        <span className="text-sm">
                            {item.price?.toLocaleString()}
                        </span>
                        <span className={`text-xs ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.changePercent)?.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
            <style jsx>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    display: inline-flex;
                    animation: ticker 30s linear infinite;
                }
                .animate-ticker:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
