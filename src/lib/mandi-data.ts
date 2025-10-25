export type PricePoint = {
    date: string;
    price: number;
};

export type MandiData = {
    crop: string;
    mandi: string;
    priceHistory: PricePoint[];
};

export type CropData = {
    [cropName: string]: MandiData[];
};

const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const generatePriceHistory = (basePrice: number, days: number): PricePoint[] => {
    const history: PricePoint[] = [];
    let currentPrice = basePrice;
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        history.push({
            date: formatDate(date),
            price: Math.round(currentPrice),
        });
        // Fluctuate price for the next day
        const changePercent = (Math.random() - 0.45) * 0.1; // -4.5% to +5.5% change
        currentPrice *= (1 + changePercent);
    }
    return history;
};

export const marketData: MandiData[] = [
    // Tomato
    { crop: "Tomato", mandi: "Pune", priceHistory: generatePriceHistory(2500, 7) },
    { crop: "Tomato", mandi: "Nagpur", priceHistory: generatePriceHistory(2300, 7) },
    { crop: "Tomato", mandi: "Bangalore", priceHistory: generatePriceHistory(2700, 7) },
    { crop: "Tomato", mandi: "Delhi", priceHistory: generatePriceHistory(2600, 7) },

    // Onion
    { crop: "Onion", mandi: "Pune", priceHistory: generatePriceHistory(3000, 7) },
    { crop: "Onion", mandi: "Nagpur", priceHistory: generatePriceHistory(3200, 7) },
    { crop: "Onion", mandi: "Lucknow", priceHistory: generatePriceHistory(2900, 7) },
    { crop: "Onion", mandi: "Delhi", priceHistory: generatePriceHistory(3100, 7) },

    // Wheat
    { crop: "Wheat", mandi: "Lucknow", priceHistory: generatePriceHistory(2200, 7) },
    { crop: "Wheat", mandi: "Pune", priceHistory: generatePriceHistory(2350, 7) },
    { crop: "Wheat", mandi: "Delhi", priceHistory: generatePriceHistory(2250, 7) },
    
    // Potato
    { crop: "Potato", mandi: "Bangalore", priceHistory: generatePriceHistory(2000, 7) },
    { crop: "Potato", mandi: "Lucknow", priceHistory: generatePriceHistory(1900, 7) },
    { crop: "Potato", mandi: "Pune", priceHistory: generatePriceHistory(2100, 7) },

    // Rice
    { crop: "Rice", mandi: "Delhi", priceHistory: generatePriceHistory(4000, 7) },
    { crop: "Rice", mandi: "Nagpur", priceHistory: generatePriceHistory(4200, 7) },
    { crop: "Rice", mandi: "Bangalore", priceHistory: generatePriceHistory(4100, 7) },
];
