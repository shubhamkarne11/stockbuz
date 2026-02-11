"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

interface AlertFormProps {
    symbol: string;
    currentPrice: number;
}

export function AlertForm({ symbol, currentPrice }: AlertFormProps) {
    const [targetPrice, setTargetPrice] = useState<string>(currentPrice.toString());
    const [condition, setCondition] = useState("above");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Save to local storage for demo
        const newAlert = {
            id: Date.now(),
            symbol,
            targetPrice: parseFloat(targetPrice),
            condition,
            active: true,
            createdAt: new Date().toISOString(),
        };

        const existingAlerts = JSON.parse(localStorage.getItem("stockAlerts") || "[]");
        localStorage.setItem("stockAlerts", JSON.stringify([...existingAlerts, newAlert]));

        alert(`Alert set for ${symbol} when price goes ${condition} ₹${targetPrice}`);
    };

    const handleSetAlert = (e: React.MouseEvent) => {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent); // Re-use handleSubmit logic
    };

    return (
        <Card className="bg-black/40 backdrop-blur-md border-white/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-[40px] pointer-events-none"></div>
            <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary animate-pulse" />
                    <span>Set Price Alert</span>
                </CardTitle>
                <CardDescription>
                    Get notified when {symbol} hits a target.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Target Price</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">₹</span>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                placeholder={currentPrice.toString()}
                                value={targetPrice}
                                onChange={(e) => setTargetPrice(e.target.value)}
                                className="pl-8 bg-black/20 border-white/10 focus-visible:ring-primary font-mono text-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Condition</Label>
                        <RadioGroup defaultValue="above" onValueChange={setCondition} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="above" id="above" />
                                <Label htmlFor="above">Above</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="below" id="below" />
                                <Label htmlFor="below">Below</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <Button onClick={handleSetAlert} className="w-full font-bold bg-primary hover:bg-primary/90 shadow-[0_0_15px_-5px_var(--primary)] transition-all hover:scale-[1.02]">
                        <Bell className="mr-2 h-4 w-4" /> Create Alert
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
