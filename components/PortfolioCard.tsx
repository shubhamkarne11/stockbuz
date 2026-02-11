"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { PortfolioStock } from "@/lib/types";
import { toast } from "sonner";
import Link from "next/link";

interface PortfolioCardProps {
    stock: PortfolioStock;
    onRemove: (id: number) => void;
}

export function PortfolioCard({ stock, onRemove }: PortfolioCardProps) {
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch current price
        const fetchCurrentPrice = async () => {
            try {
                const res = await fetch(`/api/stocks/${stock.symbol}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.quote?.regularMarketPrice) {
                        setCurrentPrice(data.quote.regularMarketPrice);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch current price", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentPrice();

        // Poll for updates every 5 seconds
        const interval = setInterval(fetchCurrentPrice, 5000);
        return () => clearInterval(interval);
    }, [stock.symbol]);

    const handleRemove = () => {
        if (confirm(`Remove ${stock.symbol} from your portfolio?`)) {
            onRemove(stock.id);
            toast.success(`Removed ${stock.symbol} from portfolio`);
        }
    };

    // Calculate metrics
    const totalInvestment = stock.purchasePrice * stock.quantity;
    const currentValue = currentPrice ? currentPrice * stock.quantity : 0;
    const profitLoss = currentValue - totalInvestment;
    const profitLossPercent = totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;
    const isProfit = profitLoss >= 0;

    return (
        <Card className="bg-black/40 backdrop-blur-md border-white/10 hover:border-primary/30 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${isProfit ? 'bg-green-500/10' : 'bg-red-500/10'} rounded-full blur-[60px] pointer-events-none`}></div>

            <CardContent className="p-6 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <Link href={`/stocks/${stock.symbol}`} className="hover:text-primary transition-colors">
                        <h3 className="text-xl font-bold">{stock.symbol}</h3>
                        <p className="text-sm text-muted-foreground">{stock.stockName}</p>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemove}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* Price Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Purchase Price</p>
                        <p className="text-lg font-mono font-semibold">₹{stock.purchasePrice.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Price</p>
                        <p className="text-lg font-mono font-semibold">
                            {loading ? (
                                <span className="text-muted-foreground">Loading...</span>
                            ) : currentPrice ? (
                                `₹${currentPrice.toFixed(2)}`
                            ) : (
                                <span className="text-muted-foreground">N/A</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Investment Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/5">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Quantity</p>
                        <p className="text-base font-mono font-semibold">{stock.quantity} shares</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Investment</p>
                        <p className="text-base font-mono font-semibold">₹{totalInvestment.toLocaleString()}</p>
                    </div>
                </div>

                {/* Valuation */}
                <div className="space-y-3">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Value</p>
                        <p className="text-xl font-mono font-bold">
                            {currentPrice ? `₹${currentValue.toLocaleString()}` : 'N/A'}
                        </p>
                    </div>

                    {/* Profit/Loss */}
                    {currentPrice && (
                        <div className={`p-3 rounded-lg ${isProfit ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {isProfit ? (
                                        <TrendingUp className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <TrendingDown className="h-5 w-5 text-red-500" />
                                    )}
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">P&L</span>
                                </div>
                                <div className="text-right">
                                    <p className={`text-lg font-mono font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                                        {isProfit ? '+' : ''}₹{profitLoss.toFixed(2)}
                                    </p>
                                    <p className={`text-sm font-mono ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                                        {isProfit ? '+' : ''}{profitLossPercent.toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Purchase Date */}
                <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-muted-foreground">
                        Purchased on {new Date(stock.purchaseDate).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
