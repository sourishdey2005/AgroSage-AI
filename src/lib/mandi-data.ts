export type PricePoint = {
    date: string;
    price: number;
};

export type MandiData = {
    crop: string;
    mandi: string;
    priceHistory: PricePoint[];
    volume: number; // in metric tons
};

export type CropData = {
    [cropName: string]: MandiData[];
};

export type SupplyChainNode = {
    name: string;
};

export type SupplyChainLink = {
    source: number; // index in nodes array
    target: number; // index in nodes array
    value: number; // volume
};

export type SupplyChainData = {
    nodes: SupplyChainNode[];
    links: SupplyChainLink[];
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

const generateVolume = (baseVolume: number): number => {
    return Math.round(baseVolume + (Math.random() - 0.5) * baseVolume * 0.2); // +/- 10%
}

export const marketData: MandiData[] = [
    // Tomato
    { crop: "Tomato", mandi: "Pune", priceHistory: generatePriceHistory(2500, 7), volume: generateVolume(500) },
    { crop: "Tomato", mandi: "Nagpur", priceHistory: generatePriceHistory(2300, 7), volume: generateVolume(300) },
    { crop: "Tomato", mandi: "Bangalore", priceHistory: generatePriceHistory(2700, 7), volume: generateVolume(450) },
    { crop: "Tomato", mandi: "Delhi", priceHistory: generatePriceHistory(2600, 7), volume: generateVolume(600) },

    // Onion
    { crop: "Onion", mandi: "Pune", priceHistory: generatePriceHistory(3000, 7), volume: generateVolume(800) },
    { crop: "Onion", mandi: "Nagpur", priceHistory: generatePriceHistory(3200, 7), volume: generateVolume(750) },
    { crop: "Onion", mandi: "Lucknow", priceHistory: generatePriceHistory(2900, 7), volume: generateVolume(650) },
    { crop: "Onion", mandi: "Delhi", priceHistory: generatePriceHistory(3100, 7), volume: generateVolume(900) },

    // Wheat
    { crop: "Wheat", mandi: "Lucknow", priceHistory: generatePriceHistory(2200, 7), volume: generateVolume(1200) },
    { crop: "Wheat", mandi: "Pune", priceHistory: generatePriceHistory(2350, 7), volume: generateVolume(1000) },
    { crop: "Wheat", mandi: "Delhi", priceHistory: generatePriceHistory(2250, 7), volume: generateVolume(1500) },
    
    // Potato
    { crop: "Potato", mandi: "Bangalore", priceHistory: generatePriceHistory(2000, 7), volume: generateVolume(700) },
    { crop: "Potato", mandi: "Lucknow", priceHistory: generatePriceHistory(1900, 7), volume: generateVolume(850) },
    { crop: "Potato", mandi: "Pune", priceHistory: generatePriceHistory(2100, 7), volume: generateVolume(600) },

    // Rice
    { crop: "Rice", mandi: "Delhi", priceHistory: generatePriceHistory(4000, 7), volume: generateVolume(1100) },
    { crop: "Rice", mandi: "Nagpur", priceHistory: generatePriceHistory(4200, 7), volume: generateVolume(950) },
    { crop: "Rice", mandi: "Bangalore", priceHistory: generatePriceHistory(4100, 7), volume: generateVolume(1000) },
];


export const supplyChainData: SupplyChainData = {
    nodes: [
        { name: "Pune Mandi" },
        { name: "Nagpur Mandi" },
        { name: "Bangalore Mandi" },
        { name: "Delhi Mandi" },
        { name: "Lucknow Mandi" },
        { name: "Mumbai Retail" },
        { name: "Kolkata Retail" },
        { name: "Chennai Retail" },
        { name: "Export" },
    ],
    links: [
        // Pune
        { source: 0, target: 5, value: 400 },
        { source: 0, target: 7, value: 200 },
        { source: 0, target: 8, value: 150 },
        // Nagpur
        { source: 1, target: 5, value: 300 },
        { source: 1, target: 6, value: 250 },
        // Bangalore
        { source: 2, target: 7, value: 500 },
        { source: 2, target: 8, value: 200 },
        // Delhi
        { source: 3, target: 6, value: 600 },
        { source: 3, target: 5, value: 300 },
        // Lucknow
        { source: 4, target: 6, value: 400 },
        { source: 4, target: 5, value: 200 },
    ]
};
