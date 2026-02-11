"use client";

import * as React from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function StockSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 1) {
                setLoading(true);
                setShowResults(true);
                try {
                    const res = await fetch(`/api/search?q=${query}`);
                    const data = await res.json();
                    if (data.results) {
                        setResults(data.results);
                    } else {
                        setResults([]);
                    }
                } catch (error) {
                    console.error("Search error:", error);
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (symbol: string) => {
        setShowResults(false);
        setQuery("");
        router.push(`/stocks/${symbol}`);
    };

    return (
        <div className="relative w-full max-w-md mx-auto" ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search stocks (e.g., TATA, AAPL)..."
                    className="pl-10 h-12 bg-background/50 backdrop-blur border-primary/20 focus-visible:ring-primary/50 transition-all"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (query.length > 1) setShowResults(true); }}
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {/* Results Dropdown */}
            {showResults && (query.length > 1) && (
                <Card className="absolute top-full mt-2 w-full z-[100] max-h-[350px] overflow-y-auto bg-black/80 backdrop-blur-xl border-primary/20 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ring-1 ring-white/10">
                    <div className="p-1">
                        {!loading && results.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No results found.
                            </div>
                        ) : (
                            results.map((stock) => (
                                <div
                                    key={stock.symbol}
                                    onClick={() => handleSelect(stock.symbol)}
                                    className="flex flex-col px-4 py-3 cursor-pointer hover:bg-primary/20 transition-all border-b border-white/5 last:border-0 group"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{stock.symbol}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">{stock.exchange}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground truncate font-medium mt-0.5">{stock.shortname || stock.longname}</span>
                                    <span className="text-[10px] text-muted-foreground/60">{stock.typeDisp || "Stock"}</span>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
