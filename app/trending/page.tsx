"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TrendingPage() {
    const [data, setData] = useState<{ gainers: any[], losers: any[], active: any[] }>({ gainers: [], losers: [], active: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/market-movers');
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (error) {
                console.error("Failed to fetch market movers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const StockCard = ({ stock }: { stock: any }) => {
        const isPositive = stock.regularMarketChangePercent >= 0;
        const color = isPositive ? "#22c55e" : "#ef4444";

        return (
            <Link href={`/stocks/${stock.symbol}`}>
                <Card className="bg-black/30 backdrop-blur border-white/5 hover:border-white/20 transition-all hover:bg-black/50 group cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{stock.symbol}</h3>
                                <p className="text-sm text-muted-foreground truncate max-w-[200px]">{stock.shortName || stock.longName}</p>
                            </div>
                            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-bold`} style={{ backgroundColor: `${color}20`, color: color }}>
                                {isPositive ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
                                {Math.abs(stock.regularMarketChangePercent)?.toFixed(2)}%
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-3xl font-mono font-bold">₹{stock.regularMarketPrice?.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground" style={{ color: color }}>
                                {isPositive ? "+" : ""}{stock.regularMarketChange?.toFixed(2)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        );
    };

    const StockGrid = ({ stocks }: { stocks: any[] }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((stock) => (
                <StockCard key={stock.symbol} stock={stock} />
            ))}
        </div>
    );

    return (
        <main className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <div className="container py-12 space-y-8 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight flex items-center">
                            <Flame className="mr-3 h-10 w-10 text-orange-500" />
                            Trending Stocks
                        </h1>
                        <p className="text-muted-foreground mt-2">Real-time market movers and most active stocks</p>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="gainers" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/20 p-1 rounded-lg border border-white/5">
                        <TabsTrigger
                            value="gainers"
                            className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500 data-[state=active]:shadow-[0_0_10px_-2px_#22c55e]"
                        >
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Top Gainers
                        </TabsTrigger>
                        <TabsTrigger
                            value="losers"
                            className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500 data-[state=active]:shadow-[0_0_10px_-2px_#ef4444]"
                        >
                            <ArrowDownIcon className="mr-2 h-4 w-4" />
                            Top Losers
                        </TabsTrigger>
                        <TabsTrigger value="active">
                            <Flame className="mr-2 h-4 w-4" />
                            Most Active
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="gainers">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} className="h-40 bg-primary/5 rounded-xl" />
                                ))}
                            </div>
                        ) : (
                            <StockGrid stocks={data.gainers} />
                        )}
                    </TabsContent>

                    <TabsContent value="losers">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} className="h-40 bg-primary/5 rounded-xl" />
                                ))}
                            </div>
                        ) : (
                            <StockGrid stocks={data.losers} />
                        )}
                    </TabsContent>

                    <TabsContent value="active">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} className="h-40 bg-primary/5 rounded-xl" />
                                ))}
                            </div>
                        ) : (
                            <StockGrid stocks={data.active} />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
