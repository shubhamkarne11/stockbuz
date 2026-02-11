"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, User, Menu } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

export function Navbar() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/";
    };

    // Prevent hydration mismatch by not rendering user-dependent content until mounted
    if (!mounted) {
        return (
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter">
                            <span className="text-primary">Stock</span>Sight
                        </Link>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <nav className="grid gap-6 text-lg font-medium">
                                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                                    StockSight
                                </Link>
                                <Link href="/" className="hover:text-foreground">
                                    Dashboard
                                </Link>
                                {user && (
                                    <>
                                        <Link href="/portfolio" className="text-muted-foreground hover:text-foreground">
                                            Portfolio
                                        </Link>
                                        <Link href="/alerts" className="text-muted-foreground hover:text-foreground">
                                            Alerts
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter">
                        <span className="text-primary">Stock</span>Sight
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/" className={`transition-colors hover:text-foreground/80 ${pathname === "/" ? "text-foreground" : "text-foreground/60"}`}>
                            Dashboard
                        </Link>
                        {user && (
                            <>
                                <Link href="/portfolio" className={`transition-colors hover:text-foreground/80 ${pathname === "/portfolio" ? "text-foreground" : "text-foreground/60"}`}>
                                    Portfolio
                                </Link>
                                <Link href="/alerts" className={`transition-colors hover:text-foreground/80 ${pathname === "/alerts" ? "text-foreground" : "text-foreground/60"}`}>
                                    Alerts
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <form className="hidden sm:flex relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search stocks..."
                            className="w-[200px] md:w-[300px] pl-8 rounded-full bg-background border-muted hover:border-primary transition-colors"
                        />
                    </form>
                    {/* Auth Section */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                                        <AvatarFallback>{user.name ? user.name.charAt(0) : "U"}</AvatarFallback>
                                    </Avatar>
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href="/portfolio" className="w-full">My Portfolio</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/alerts" className="w-full">My Alerts</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild variant="default" size="sm">
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
