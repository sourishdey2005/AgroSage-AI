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
import { Briefcase, BarChart, Users, FileText, Search, LineChart as LineChartIcon, TrendingUp, TrendingDown, Minus, ArrowRight, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
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
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Tooltip } from 'recharts';
import { marketData, type MandiData, type CropData } from '@/lib/mandi-data';

const crops = Array.from(new Set(marketData.map(d => d.crop)));

type ProfitOpportunity = {
    buyMandi: MandiData | null;
    sellMandi: MandiData | null;
    spread: number;
};


export default function AgentDashboardPage() {
  const [selectedCrop, setSelectedCrop] = React.useState<string>(crops[0]);
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [liveTableData, setLiveTableData] = React.useState<MandiData[]>([]);
  const [profitOpportunity, setProfitOpportunity] = React.useState<ProfitOpportunity | null>(null);

  React.useEffect(() => {
    const cropData = marketData.filter(d => d.crop === selectedCrop);
    
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
        
        if (buyMandi && sellMandi) {
             setProfitOpportunity({
                buyMandi,
                sellMandi,
                spread: maxPrice - minPrice,
            });
        }
    } else {
        setProfitOpportunity(null);
    }

  }, [selectedCrop]);
  
  const chartConfig = {
    price: { label: 'Price', color: 'hsl(var(--primary))' },
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
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Across 3 states</p>
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
              <BarChart className="h-4 w-4 text-muted-foreground" />
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

      <Card>
        <CardHeader>
          <CardTitle>📊 Live Mandi Analytics Board</CardTitle>
          <CardDescription>Real-time mandi price graph from multiple regions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-2">
                <p className="font-medium text-sm">Select Crop:</p>
                {crops.map(crop => (
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
                              {liveTableData.map((mandi, index) => (
                                <Line key={mandi.mandi} dataKey={mandi.mandi} type="monotone" stroke={mandiColors[index % mandiColors.length]} strokeWidth={2} dot={true} name={mandi.mandi} />
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
    </>
  );
}
