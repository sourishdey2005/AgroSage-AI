'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, BarChart as BarChartIcon, Users, FileText, Search, LineChart as LineChartIcon, TrendingUp, TrendingDown, Minus, ArrowRight, ArrowDownCircle, ArrowUpCircle, Package, Truck } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Tooltip, Sankey, BarChart, Bar, ResponsiveContainer, Legend } from 'recharts';
import { type MandiData, type SupplyChainData, supplyChainData as staticSupplyChainData } from '@/lib/mandi-data';
import { FarmerQueryChatPanel } from '@/components/dashboard/agent/farmer-query-chat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const initialCrops = ['Tomato', 'Onion', 'Wheat', 'Potato', 'Rice'];
const mandis = ['Pune', 'Nagpur', 'Bangalore', 'Delhi', 'Lucknow'];
const basePrices: Record<string, number> = {
    Tomato: 2500,
    Onion: 3000,
    Wheat: 2200,
    Potato: 2000,
    Rice: 4000,
};
const baseVolumes: Record<string, number> = {
    Tomato: 500,
    Onion: 800,
    Wheat: 1200,
    Potato: 700,
    Rice: 1100,
};

const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const generatePriceHistory = (basePrice: number, days: number): {date: string, price: number}[] => {
    const history: {date: string, price: number}[] = [];
    let currentPrice = basePrice * (1 + (Math.random() - 0.5) * 0.2); // Start with a +/- 10% random variation
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        history.push({
            date: formatDate(date),
            price: Math.round(currentPrice),
        });
        const changePercent = (Math.random() - 0.45) * 0.1; // -4.5% to +5.5% change
        currentPrice *= (1 + changePercent);
    }
    return history;
};

const generateVolume = (baseVolume: number): number => {
    return Math.round(baseVolume + (Math.random() - 0.5) * baseVolume * 0.3); // +/- 15%
};

const generateMarketData = (): MandiData[] => {
    const data: MandiData[] = [];
    initialCrops.forEach(crop => {
        mandis.forEach(mandi => {
            // Not all crops are in all mandis
            if (Math.random() > 0.3) {
                 data.push({
                    crop: crop,
                    mandi: mandi,
                    priceHistory: generatePriceHistory(basePrices[crop], 7),
                    volume: generateVolume(baseVolumes[crop]),
                });
            }
        });
    });
    return data;
};


type ProfitOpportunity = {
    buyMandi: MandiData | null;
    sellMandi: MandiData | null;
    spread: number;
};


export default function AgentDashboardPage() {
  const [marketData, setMarketData] = React.useState<MandiData[]>(generateMarketData);
  const [selectedCrop, setSelectedCrop] = React.useState<string>(initialCrops[0]);
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [liveTableData, setLiveTableData] = React.useState<MandiData[]>([]);
  const [profitOpportunity, setProfitOpportunity] = React.useState<ProfitOpportunity | null>(null);
  const [tradeVolumeData, setTradeVolumeData] = React.useState<any[]>([]);
  const [supplyChainData] = React.useState<SupplyChainData>(staticSupplyChainData);

  // Live data simulation
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(generateMarketData());
    }, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const cropData = marketData.filter(d => d.crop === selectedCrop);
    if (cropData.length === 0 && initialCrops.length > 0) {
      // If selected crop has no data after refresh, switch to first available crop
      const firstAvailableCrop = initialCrops.find(c => marketData.some(d => d.crop === c));
      if (firstAvailableCrop) {
        setSelectedCrop(firstAvailableCrop);
      }
      return;
    }
    
    // Chart Data Formatting
    const formattedChartData = cropData.reduce((acc, mandi) => {
      mandi.priceHistory.forEach((pricePoint, index) => {
        if (!acc[index]) {
          acc[index] = { date: pricePoint.date };
        }
        acc[index][mandi.mandi] = pricePoint.price;
      });
      return acc;
    }, [] as any[]);

    setChartData(formattedChartData);
    setLiveTableData(cropData);

    // Profit Opportunity Calculation
    if (cropData.length > 1) {
        let buyMandi: MandiData | null = null;
        let sellMandi: MandiData | null = null;
        let minPrice = Infinity;
        let maxPrice = -Infinity;

        cropData.forEach(mandi => {
            const latestPrice = mandi.priceHistory[mandi.priceHistory.length - 1].price;
            if (latestPrice < minPrice) {
                minPrice = latestPrice;
                buyMandi = mandi;
            }
            if (latestPrice > maxPrice) {
                maxPrice = latestPrice;
                sellMandi = mandi;
            }
        });
        
        if (buyMandi && sellMandi && buyMandi.mandi !== sellMandi.mandi) {
             setProfitOpportunity({
                buyMandi,
                sellMandi,
                spread: maxPrice - minPrice,
            });
        } else {
            setProfitOpportunity(null);
        }
    } else {
        setProfitOpportunity(null);
    }

    // Trade Volume Calculation
    const volumeData = initialCrops.map(crop => {
      const totalVolume = marketData
        .filter(d => d.crop === crop)
        .reduce((sum, current) => sum + current.volume, 0);
      return { crop, volume: totalVolume };
    });
    setTradeVolumeData(volumeData);

  }, [selectedCrop, marketData]);

  const chartConfig = {
    price: { label: 'Price', color: 'hsl(var(--primary))' },
    volume: { label: 'Volume', color: 'hsl(var(--chart-2))' },
  };

  const getTrend = (history: {date: string, price: number}[]) => {
    if (history.length < 2) return { icon: <Minus className="h-4 w-4 text-yellow-500" />, direction: 'stable'};
    const latestPrice = history[history.length - 1].price;
    const previousPrice = history[history.length - 2].price;
    if (latestPrice > previousPrice) return { icon: <TrendingUp className="h-4 w-4 text-green-500" />, direction: 'up'};
    if (latestPrice < previousPrice) return { icon: <TrendingDown className="h-4 w-4 text-red-500" />, direction: 'down'};
    return { icon: <Minus className="h-4 w-4 text-yellow-500" />, direction: 'stable'};
  };

  const mandiColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const availableCrops = Array.from(new Set(marketData.map(d => d.crop)));


  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Agent Dashboard</h1>
        <Button><FileText className="mr-2 h-4 w-4" /> Generate Report</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,254</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Mandis</CardTitle>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{liveTableData.length}</div>
              <p className="text-xs text-muted-foreground">For {selectedCrop}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Farmer Network</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+12 since last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performing Crop</CardTitle>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Onion</div>
              <p className="text-xs text-muted-foreground">Highest volume this month</p>
            </CardContent>
          </Card>
        </div>

        {profitOpportunity && profitOpportunity.spread > 0 && (
            <Card className="bg-accent/30 border-primary/50">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2 text-xl">
                        📈 Profit Opportunity: {selectedCrop}
                    </CardTitle>
                    <CardDescription>
                        Identify where to buy low and sell high based on latest market prices.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 items-center gap-4 text-center">
                    <div className="flex flex-col items-center gap-2 p-4 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-2">
                             <ArrowDownCircle className="h-6 w-6 text-green-500" />
                             <h3 className="font-semibold text-lg">Buy At</h3>
                        </div>
                        <p className="text-2xl font-bold font-headline">{profitOpportunity.buyMandi?.mandi}</p>
                        <p className="font-mono text-lg">₹{profitOpportunity.buyMandi?.priceHistory[profitOpportunity.buyMandi.priceHistory.length - 1].price}/qtl</p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                        <ArrowRight className="h-8 w-8 text-muted-foreground hidden md:block" />
                        <div className="text-green-600 dark:text-green-400">
                             <p className="text-sm font-medium">Potential Profit</p>
                             <p className="text-3xl font-bold font-headline">₹{profitOpportunity.spread.toFixed(2)}/qtl</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 p-4 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-2">
                             <ArrowUpCircle className="h-6 w-6 text-red-500" />
                             <h3 className="font-semibold text-lg">Sell At</h3>
                        </div>
                        <p className="text-2xl font-bold font-headline">{profitOpportunity.sellMandi?.mandi}</p>
                        <p className="font-mono text-lg">₹{profitOpportunity.sellMandi?.priceHistory[profitOpportunity.sellMandi.priceHistory.length - 1].price}/qtl</p>
                    </div>
                </CardContent>
            </Card>
        )}
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Tabs defaultValue="price-analytics">
                 <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="price-analytics"><LineChartIcon />Price Analytics</TabsTrigger>
                    <TabsTrigger value="volume-overview"><BarChartIcon />Trade Volume</TabsTrigger>
                    <TabsTrigger value="supply-chain"><Truck />Supply Chain</TabsTrigger>
                </TabsList>
                 <TabsContent value="price-analytics">
                     <Card>
                        <CardHeader>
                        <CardTitle>📊 Live Mandi Price Board</CardTitle>
                        <CardDescription>Real-time mandi price graph from multiple regions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">Select Crop:</p>
                                {availableCrops.map(crop => (
                                    <Button
                                        key={crop}
                                        variant={selectedCrop === crop ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedCrop(crop)}
                                    >
                                        {crop}
                                    </Button>
                                ))}
                            </div>

                            <div className="grid lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-headline">{selectedCrop} Price Trends (₹/Quintal)</CardTitle>
                                        <CardDescription>Last 7 Days</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartContainer config={chartConfig} className="aspect-video w-full">
                                            <LineChart data={chartData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} />
                                            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                            <Tooltip content={<ChartTooltipContent />} />
                                            <Legend />
                                            {liveTableData.map((mandi, index) => (
                                                <Line key={mandi.mandi} dataKey={mandi.mandi} type="monotone" stroke={mandiColors[index % mandiColors.length]} strokeWidth={2} dot={false} name={mandi.mandi} />
                                            ))}
                                            </LineChart>
                                        </ChartContainer>
                                    </CardContent>
                                    </Card>
                                </div>
                                <div className="lg:col-span-1">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg font-headline">Live Prices</CardTitle>
                                            <CardDescription>Latest prices from connected mandis.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                <TableRow>
                                                    <TableHead>Mandi</TableHead>
                                                    <TableHead className="text-right">Price</TableHead>
                                                    <TableHead className="text-right">Trend</TableHead>
                                                </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                {liveTableData.map((data) => (
                                                    <TableRow key={data.mandi}>
                                                    <TableCell className="font-medium">{data.mandi}</TableCell>
                                                    <TableCell className="text-right font-mono">₹{data.priceHistory[data.priceHistory.length - 1].price}/qtl</TableCell>
                                                    <TableCell className="flex justify-end">{getTrend(data.priceHistory).icon}</TableCell>
                                                    </TableRow>
                                                ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                 </TabsContent>
                 <TabsContent value="volume-overview">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><Package /> Trade Volume Overview</CardTitle>
                            <CardDescription>Total trade volume by crop across all monitored mandis (in metric tons).</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={chartConfig} className="aspect-video w-full">
                                <BarChart data={tradeVolumeData} accessibilityLayer>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="crop" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis />
                                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent hideLabel />} />
                                    <Legend />
                                    <Bar dataKey="volume" fill="var(--color-volume)" radius={8} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                 </TabsContent>
                 <TabsContent value="supply-chain">
                    <Card>
                         <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><Truck /> Supply Chain Flow</CardTitle>
                            <CardDescription>Visual representation of goods movement from mandis to destinations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="aspect-video w-full">
                                <ResponsiveContainer width="100%" height={400}>
                                    <Sankey
                                        data={supplyChainData}
                                        node={{ fill: 'hsl(var(--primary))' }}
                                        nodePadding={50}
                                        margin={{
                                            left: 20,
                                            right: 20,
                                            top: 5,
                                            bottom: 5,
                                        }}
                                        >
                                        <Tooltip />
                                    </Sankey>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                 </TabsContent>
            </Tabs>
        </div>
        <div className="lg:col-span-1">
            <FarmerQueryChatPanel />
        </div>
      </div>
    </>
  );
}
