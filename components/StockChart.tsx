"use client";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface StockChartProps {
    symbol: string;
}

export function StockChart({ symbol }: StockChartProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState("1y");
    const [isPositive, setIsPositive] = useState(true);

    const ranges = [
        { label: "1D", value: "1d", interval: "5m" }, // 1 day, 5 minute interval
        { label: "5D", value: "5d", interval: "15m" }, // 5 days, 15 minute interval
        { label: "1M", value: "1mo", interval: "1d" },
        { label: "6M", value: "6mo", interval: "1d" },
        { label: "YTD", value: "ytd", interval: "1d" },
        { label: "1Y", value: "1y", interval: "1d" },
        { label: "5Y", value: "5y", interval: "1wk" },
        { label: "Max", value: "max", interval: "1mo" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const selectedRange = ranges.find(r => r.value === range) || ranges[5];
                const res = await fetch(`/api/stocks/${symbol}/chart?range=${range}&interval=${selectedRange.interval}`);

                if (!res.ok) throw new Error("Failed to fetch");

                const result = await res.json();
                console.log("Chart Data:", result); // Debug log

                if (result.quotes) {
                    const formattedData = result.quotes
                        .filter((item: any) => item.close !== null && item.close !== undefined) // Filter out nulls
                        .map((item: any) => ({
                            date: new Date(item.date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: range === '1d' || range === '5d' ? undefined : '2-digit',
                                hour: range === '1d' ? '2-digit' : undefined,
                                minute: range === '1d' ? '2-digit' : undefined
                            }),
                            originalDate: item.date,
                            close: item.close,
                        }));

                    // Determine trend
                    if (formattedData.length > 1) {
                        const firstPrice = formattedData[0].close;
                        const lastPrice = formattedData[formattedData.length - 1].close;
                        setIsPositive(lastPrice >= firstPrice);
                    }

                    setData(formattedData);
                }
            } catch (error) {
                console.error("Failed to fetch chart data", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [symbol, range]);

    // Colors
    const color = isPositive ? "#22c55e" : "#ef4444"; // green-500 : red-500

    return (
        <Card className="w-full bg-black/40 backdrop-blur-md border-white/10 shadow-2xl overflow-hidden relative group">
            <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 peer`} style={{ backgroundImage: `linear-gradient(to bottom right, ${color}10, transparent)` }}></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-white/5 relative z-10">
                <CardTitle className="text-lg font-bold flex items-center">
                    <span className="bg-white/5 p-2 rounded-lg mr-3" style={{ color: color }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></svg>
                    </span>
                    Price Performance
                </CardTitle>
                <div className="flex space-x-1 bg-black/20 p-1 rounded-lg border border-white/5">
                    {ranges.map((r) => (
                        <button
                            key={r.value}
                            onClick={() => setRange(r.value)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-300 ${range === r.value
                                ? 'shadow-lg text-white'
                                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                                }`}
                            style={range === r.value ? { backgroundColor: color, boxShadow: `0 0 10px -2px ${color}` } : {}}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="pt-6 h-[400px] relative z-10">
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <Skeleton className="h-[300px] w-full bg-primary/5 rounded-xl animate-pulse" />
                    </div>
                ) : data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                hide
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                orientation="right"
                                tick={{ fontSize: 12, fill: '#666' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `₹${value.toFixed(0)}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    backdropFilter: 'blur(4px)'
                                }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{ color: '#888', marginBottom: '4px' }}
                                formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                                labelFormatter={(label) => label}
                            />
                            <Area
                                type="monotone"
                                dataKey="close"
                                stroke={color}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorClose)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        No chart data available
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
