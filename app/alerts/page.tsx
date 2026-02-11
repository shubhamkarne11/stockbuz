"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

interface Alert {
    id: number;
    symbol: string;
    targetPrice: number;
    condition: string;
    active: boolean;
    createdAt: string;
    triggered?: boolean;
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        const storedAlerts = JSON.parse(localStorage.getItem("stockAlerts") || "[]");
        setAlerts(storedAlerts);
    }, []);

    const handleDelete = (id: number) => {
        const updatedAlerts = alerts.filter((alert) => alert.id !== id);
        setAlerts(updatedAlerts);
        localStorage.setItem("stockAlerts", JSON.stringify(updatedAlerts));
    };

    return (
        <div className="container py-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Active Price Alerts</h1>
                <p className="text-muted-foreground">Manage your notifications and price targets.</p>
            </div>

            {alerts.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">No active alerts</h2>
                    <p className="text-muted-foreground mb-4">Start tracking stocks to get notified.</p>
                    <Button asChild>
                        <Link href="/">Search Stocks</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {alerts.map((alert) => (
                        <Card key={alert.id} className={alert.triggered ? "border-green-500 bg-green-500/10" : ""}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-bold">{alert.symbol}</CardTitle>
                                {alert.condition === "above" ? (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{alert.targetPrice.toFixed(2)}</div>
                                <p className="text-sm text-muted-foreground">
                                    Condition: Price goes {alert.condition} target
                                </p>
                                {alert.triggered && (
                                    <p className="text-xs font-semibold text-green-600 mt-2">Triggered!</p>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button variant="destructive" size="sm" className="w-full" onClick={() => handleDelete(alert.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Alert
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
