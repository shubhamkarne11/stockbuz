// Portfolio type definitions

export interface PortfolioStock {
    id: number;
    symbol: string;
    stockName: string;
    purchasePrice: number;
    quantity: number;
    purchaseDate: string;
    addedAt: string;
}

export interface PortfolioSummary {
    totalInvestment: number;
    currentValue: number;
    totalProfitLoss: number;
    totalProfitLossPercent: number;
}
