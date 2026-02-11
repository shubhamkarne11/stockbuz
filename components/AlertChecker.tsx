"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function AlertChecker() {
    useEffect(() => {
        const checkAlerts = async () => {
            const storedAlerts = JSON.parse(localStorage.getItem("stockAlerts") || "[]");
            const activeAlerts = storedAlerts.filter((a: any) => a.active && !a.triggered);

            if (activeAlerts.length === 0) return;

            for (const alert of activeAlerts) {
                try {
                    // Fetch current price
                    const res = await fetch(`/api/stocks/${alert.symbol}`); // This returns { quote, summary }
                    const data = await res.json();

                    if (data && data.quote) {
                        const currentPrice = data.quote.regularMarketPrice;
                        let triggered = false;

                        if (alert.condition === "above" && currentPrice >= alert.targetPrice) {
                            triggered = true;
                        } else if (alert.condition === "below" && currentPrice <= alert.targetPrice) {
                            triggered = true;
                        }

                        if (triggered) {
                            // Show notification
                            toast.success(`Price Alert: ${alert.symbol}`, {
                                description: `Current Price: ₹${currentPrice}. Target: ₹${alert.targetPrice}`,
                                duration: 10000,
                            });

                            // Mark as triggered in local storage
                            const updatedAlerts = storedAlerts.map((a: any) =>
                                a.id === alert.id ? { ...a, triggered: true, triggeredAt: new Date().toISOString() } : a
                            );
                            localStorage.setItem("stockAlerts", JSON.stringify(updatedAlerts));
                        }
                    }
                } catch (error) {
                    console.error("Error checking alert for", alert.symbol, error);
                }
            }
        };

        // Initial check
        checkAlerts();

        // Check every 30 seconds
        const interval = setInterval(checkAlerts, 30000);

        return () => clearInterval(interval);
    }, []);

    return null; // Logic only component
}
