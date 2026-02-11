import { StockSearch } from "@/components/StockSearch";
import { TrendingSection } from "@/components/TrendingSection";
import { TickerTape } from "@/components/TickerTape";
import { MarketOverview } from "@/components/MarketOverview";
import { ArrowRight, BarChart2, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      {/* Ticker Tape */}
      <TickerTape />

      {/* Hero Section with Grid Background */}
      <section className="relative w-full py-24 px-4 overflow-hidden border-b border-primary/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

        <div className="relative container mx-auto text-center z-10">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Live Market Data
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 animate-in fade-in slide-in-from-bottom-8 duration-700">
            Trade at the <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600">Speed of Light</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
            Advanced real-time analytics, institutional-grade data, and lightning-fast alerts.
            The next generation of market intelligence is here.
          </p>

          <div className="flex justify-center mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <StockSearch />
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Trending (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center">
                <Zap className="mr-2 h-6 w-6 text-yellow-500" />
                Trending Now
              </h2>
              <Link href="/trending">
                <Button variant="ghost" className="text-primary group">
                  View All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <TrendingSection />

            {/* Features (Visual Filler) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 rounded-xl border border-primary/10 bg-card/30 backdrop-blur hover:bg-primary/5 transition-colors">
                <BarChart2 className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-bold mb-2">Advanced Charting</h3>
                <p className="text-sm text-muted-foreground">Technical indicators and historical data at your fingertips.</p>
              </div>
              <div className="p-6 rounded-xl border border-primary/10 bg-card/30 backdrop-blur hover:bg-primary/5 transition-colors">
                <Zap className="h-10 w-10 text-yellow-500 mb-4" />
                <h3 className="font-bold mb-2">Real-time Executions</h3>
                <p className="text-sm text-muted-foreground">Zero latency updates for the most accurate pricing.</p>
              </div>
              <div className="p-6 rounded-xl border border-primary/10 bg-card/30 backdrop-blur hover:bg-primary/5 transition-colors">
                <Shield className="h-10 w-10 text-green-500 mb-4" />
                <h3 className="font-bold mb-2">Institutional Grade</h3>
                <p className="text-sm text-muted-foreground">Data reliability trusted by professional traders.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Market Overview (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <MarketOverview />

            {/* Promo / CTA */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-purple-500/10 p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Go Pro</h3>
              <p className="text-sm text-muted-foreground mb-4">Unlock Level 2 data and advanced screener tools.</p>
              <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
                Upgrade Now
              </Button>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
