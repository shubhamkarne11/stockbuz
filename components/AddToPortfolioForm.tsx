"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Plus } from "lucide-react";
import { toast } from "sonner";
import { PortfolioStock } from "@/lib/types";

interface AddToPortfolioFormProps {
    symbol: string;
    stockName: string;
    currentPrice: number;
}

export function AddToPortfolioForm({ symbol, stockName, currentPrice }: AddToPortfolioFormProps) {
    const [purchasePrice, setPurchasePrice] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("1");
    const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Update purchase price dynamically when current price changes
    useEffect(() => {
        if (currentPrice > 0) {
            setPurchasePrice(currentPrice.toFixed(2));
        }
    }, [currentPrice]);

    const handleAddToPortfolio = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!purchasePrice || parseFloat(purchasePrice) <= 0) {
            toast.error("Please enter a valid purchase price");
            return;
        }

        if (!quantity || parseInt(quantity) <= 0) {
            toast.error("Please enter a valid quantity");
            return;
        }

        // Create new portfolio item
        const newPortfolioStock: PortfolioStock = {
            id: Date.now(),
            symbol,
            stockName,
            purchasePrice: parseFloat(purchasePrice),
            quantity: parseInt(quantity),
            purchaseDate,
            addedAt: new Date().toISOString(),
        };

        // Get existing portfolio from localStorage
        const existingPortfolio = JSON.parse(localStorage.getItem("stockPortfolio") || "[]");

        // Add new stock to portfolio
        localStorage.setItem("stockPortfolio", JSON.stringify([...existingPortfolio, newPortfolioStock]));

        // Show success message
        toast.success(`Added ${quantity} shares of ${symbol} to your portfolio!`);

        // Reset form
        setPurchasePrice(currentPrice.toString());
        setQuantity("1");
        setPurchaseDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <Card className="bg-black/40 backdrop-blur-md border-white/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-[40px] pointer-events-none"></div>
            <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-green-500" />
                    <span>Add to Portfolio</span>
                </CardTitle>
                <CardDescription>
                    Track your investment in {symbol}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
                <form onSubmit={handleAddToPortfolio} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="purchase-price">Purchase Price</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">₹</span>
                            <Input
                                id="purchase-price"
                                type="number"
                                step="0.01"
                                placeholder={currentPrice.toString()}
                                value={purchasePrice}
                                onChange={(e) => setPurchasePrice(e.target.value)}
                                className="pl-8 bg-black/20 border-white/10 focus-visible:ring-green-500 font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="bg-black/20 border-white/10 focus-visible:ring-green-500 font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="purchase-date">Purchase Date</Label>
                        <Input
                            id="purchase-date"
                            type="date"
                            value={purchaseDate}
                            onChange={(e) => setPurchaseDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="bg-black/20 border-white/10 focus-visible:ring-green-500"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full font-bold bg-green-600 hover:bg-green-700 shadow-[0_0_15px_-5px_rgb(34,197,94)] transition-all hover:scale-[1.02]"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add to Portfolio
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
