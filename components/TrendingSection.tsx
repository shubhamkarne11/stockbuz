"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

// Mock trending data for now, could be fetched from API
const trendingStocks: Stock[] = [
    { symbol: "TATASTEEL.NS", name: "Tata Steel", price: 145.20, change: 2.5, changePercent: 1.75 },
    { symbol: "RELIANCE.NS", name: "Reliance Industries", price: 2980.50, change: -15.0, changePercent: -0.50 },
    { symbol: "INFY.NS", name: "Infosys", price: 1650.00, change: 12.00, changePercent: 0.73 },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank", price: 1420.30, change: 5.40, changePercent: 0.38 },
];

export function TrendingSection() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {trendingStocks.map((stock) => (
                <Link key={stock.symbol} href={`/stocks/${stock.symbol}`}>
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-t-4 border-t-transparent hover:border-t-primary">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stock.symbol.split('.')[0]}
                            </CardTitle>
                            {stock.change >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{stock.price.toFixed(2)}</div>
                            <p className={`text-xs ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {stock.change > 0 ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{stock.name}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
