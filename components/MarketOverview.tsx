"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowUpIcon, ArrowDownIcon, Activity } from "lucide-react";

export function MarketOverview() {
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

    const StockList = ({ stocks }: { stocks: any[] }) => (
        <div className="space-y-4">
            {stocks.map((stock) => (
                <Link href={`/stocks/${stock.symbol}`} key={stock.symbol} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div>
                        <div className="font-bold group-hover:text-primary transition-colors">{stock.symbol}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[120px]">{stock.shortName || stock.longName}</div>
                    </div>
                    <div className="text-right">
                        <div className="font-mono font-medium">₹{stock.regularMarketPrice?.toFixed(2)}</div>
                        <div className={`text-xs flex items-center justify-end ${stock.regularMarketChangePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {stock.regularMarketChangePercent >= 0 ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
                            {Math.abs(stock.regularMarketChangePercent)?.toFixed(2)}%
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );

    return (
        <Card className="w-full bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center text-xl">
                    <Activity className="mr-2 h-5 w-5 text-primary" />
                    Market Movers
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="gainers" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="gainers" className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500">Gainers</TabsTrigger>
                        <TabsTrigger value="losers" className="data-[state=active]:bg-red-500/10 data-[state=active]:text-red-500">Losers</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                    </TabsList>
                    <TabsContent value="gainers">
                        {loading ? <div className="h-40 flex items-center justify-center text-muted-foreground">Loading...</div> : <StockList stocks={data.gainers} />}
                    </TabsContent>
                    <TabsContent value="losers">
                        {loading ? <div className="h-40 flex items-center justify-center text-muted-foreground">Loading...</div> : <StockList stocks={data.losers} />}
                    </TabsContent>
                    <TabsContent value="active">
                        {loading ? <div className="h-40 flex items-center justify-center text-muted-foreground">Loading...</div> : <StockList stocks={data.active} />}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
