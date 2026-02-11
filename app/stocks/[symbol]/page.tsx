import { StockHeader } from "@/components/StockHeader";
import { StockChart } from "@/components/StockChart";
import { StockInfo } from "@/components/StockInfo";
import { AlertForm } from "@/components/AlertForm";
import yahooFinance from '@/lib/yahoo';
import { Card, CardContent } from "@/components/ui/card";

interface PageProps {
    params: Promise<{
        symbol: string;
    }>;
}

// Fetch data directly on server
async function getStockData(symbol: string) {
    try {
        const quote = await yahooFinance.quote(symbol);
        // Use try-catch for summary as it might fail for some symbols
        let summary: any = {};
        try {
            summary = await yahooFinance.quoteSummary(symbol, { modules: ['summaryProfile', 'price', 'defaultKeyStatistics', 'summaryDetail'] });
        } catch (e) {
            console.warn("Summary fetch failed", e);
        }
        return { quote, summary };
    } catch (error) {
        console.error("Failed to fetch stock data", error);
        return null;
    }
}

export default async function StockPage(props: PageProps) {
    const params = await props.params;
    const { symbol } = params;
    const data = await getStockData(symbol);

    if (!data || !data.quote) {
        // ... existing error state
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500">Stock Not Found</h1>
                    <p className="text-muted-foreground">Could not fetch data for {symbol}</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <div className="container py-12 space-y-8 relative z-10">
                {/* Header */}
                <StockHeader symbol={symbol} quote={data.quote} />

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Chart and Info (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        <StockChart symbol={symbol} />

                        {/* Key Statistics */}
                        <StockInfo symbol={symbol} quote={data.quote} summary={data.summary || {}} />

                        {/* Company Summary */}
                        <Card className="bg-black/40 backdrop-blur-md border-white/10">
                            <CardContent className="pt-6">
                                <h3 className="text-lg font-bold mb-4 flex items-center text-primary">
                                    About {data.quote.shortName || symbol}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {data.summary.summaryProfile?.longBusinessSummary || "No description available for this company."}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Alerts & Actions (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <AlertForm symbol={symbol} currentPrice={data.quote.regularMarketPrice || 0} />

                        {/* Watchlist Placeholder */}
                        <Card className="bg-black/40 backdrop-blur-md border-white/10">
                            <CardContent className="pt-6">
                                <h3 className="text-lg font-semibold mb-2">Watchlist</h3>
                                <p className="text-sm text-muted-foreground">Log in to add this stock to your watchlist.</p>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </main>
    );
}
