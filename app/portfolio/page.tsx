"use client";

import { useState, useEffect } from "react";
import { PortfolioCard } from "@/components/PortfolioCard";
import { PortfolioStock, PortfolioSummary } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, TrendingUp, TrendingDown, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PortfolioPage() {
    const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
    const [currentPrices, setCurrentPrices] = useState<{ [symbol: string]: number }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load portfolio from localStorage
        const loadPortfolio = () => {
            const storedPortfolio = JSON.parse(localStorage.getItem("stockPortfolio") || "[]");
            setPortfolio(storedPortfolio);
            setLoading(false);
        };

        loadPortfolio();

        // Listen for storage changes (if user adds stock in another tab)
        window.addEventListener('storage', loadPortfolio);
        return () => window.removeEventListener('storage', loadPortfolio);
    }, []);

    useEffect(() => {
        // Fetch current prices for all stocks
        const fetchPrices = async () => {
            const prices: { [symbol: string]: number } = {};

            for (const stock of portfolio) {
                try {
                    const res = await fetch(`/api/stocks/${stock.symbol}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.quote?.regularMarketPrice) {
                            prices[stock.symbol] = data.quote.regularMarketPrice;
                        }
                    }
                } catch (error) {
                    console.error(`Failed to fetch price for ${stock.symbol}`, error);
                }
            }

            setCurrentPrices(prices);
        };

        if (portfolio.length > 0) {
            fetchPrices();
            // Poll for updates every 5 seconds
            const interval = setInterval(fetchPrices, 5000);
            return () => clearInterval(interval);
        }
    }, [portfolio]);

    const handleRemoveStock = (id: number) => {
        const updatedPortfolio = portfolio.filter(stock => stock.id !== id);
        setPortfolio(updatedPortfolio);
        localStorage.setItem("stockPortfolio", JSON.stringify(updatedPortfolio));
    };

    // Calculate portfolio summary
    const calculateSummary = (): PortfolioSummary => {
        let totalInvestment = 0;
        let currentValue = 0;

        portfolio.forEach(stock => {
            totalInvestment += stock.purchasePrice * stock.quantity;
            const price = currentPrices[stock.symbol] || 0;
            currentValue += price * stock.quantity;
        });

        const totalProfitLoss = currentValue - totalInvestment;
        const totalProfitLossPercent = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

        return {
            totalInvestment,
            currentValue,
            totalProfitLoss,
            totalProfitLossPercent,
        };
    };

    const summary = calculateSummary();
    const isOverallProfit = summary.totalProfitLoss >= 0;

    if (loading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Briefcase className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
                    <p className="text-muted-foreground">Loading portfolio...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <div className="container py-12 space-y-8 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                            <Briefcase className="h-10 w-10 text-primary" />
                            My Portfolio
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Track your investments and performance
                        </p>
                    </div>
                </div>

                {portfolio.length === 0 ? (
                    /* Empty State */
                    <Card className="bg-black/40 backdrop-blur-md border-white/10">
                        <CardContent className="py-16 text-center">
                            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">Your portfolio is empty</h3>
                            <p className="text-muted-foreground mb-6">
                                Start building your portfolio by adding stocks from their detail pages
                            </p>
                            <Button asChild>
                                <Link href="/">Browse Stocks</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="bg-black/40 backdrop-blur-md border-white/10 hover:border-primary/30 transition-all">
                                <CardContent className="p-6">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Total Investment</p>
                                    <p className="text-2xl font-mono font-bold">₹{summary.totalInvestment.toLocaleString()}</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-black/40 backdrop-blur-md border-white/10 hover:border-primary/30 transition-all">
                                <CardContent className="p-6">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Current Value</p>
                                    <p className="text-2xl font-mono font-bold">₹{summary.currentValue.toLocaleString()}</p>
                                </CardContent>
                            </Card>

                            <Card className={`backdrop-blur-md border-white/10 hover:border-primary/30 transition-all ${isOverallProfit ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                <CardContent className="p-6">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                        {isOverallProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                        Total P&L
                                    </p>
                                    <p className={`text-2xl font-mono font-bold ${isOverallProfit ? 'text-green-500' : 'text-red-500'}`}>
                                        {isOverallProfit ? '+' : ''}₹{summary.totalProfitLoss.toFixed(2)}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className={`backdrop-blur-md border-white/10 hover:border-primary/30 transition-all ${isOverallProfit ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                <CardContent className="p-6">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">P&L Percentage</p>
                                    <p className={`text-2xl font-mono font-bold ${isOverallProfit ? 'text-green-500' : 'text-red-500'}`}>
                                        {isOverallProfit ? '+' : ''}{summary.totalProfitLossPercent.toFixed(2)}%
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Portfolio Grid */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Holdings ({portfolio.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {portfolio.map(stock => (
                                    <PortfolioCard
                                        key={stock.id}
                                        stock={stock}
                                        onRemove={handleRemoveStock}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
