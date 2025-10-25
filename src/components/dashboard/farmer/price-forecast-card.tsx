'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  BarChart,
  CalendarDays,
  LineChart as LineChartIcon,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Tooltip } from 'recharts';
import { predictCropPrice } from '@/ai/flows/price-forecasting';
import type { PriceForecastingOutput } from '@/ai/flows/price-forecasting';

const schema = z.object({
  crop: z.string().min(1, 'Please select a crop'),
  location: z.string().min(1, 'Please select a location'),
});
type FormSchema = z.infer<typeof schema>;

const crops = ['Tomato', 'Wheat', 'Rice', 'Onion', 'Potato'];
const locations = ['Pune', 'Lucknow', 'Nagpur', 'Bangalore', 'Delhi'];

export function PriceForecastCard() {
  const [result, setResult] = React.useState<PriceForecastingOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const forecastResult = await predictCropPrice(data);
      setResult(forecastResult);
    } catch (err) {
      setError('Failed to get price forecast. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const chartData = result?.prices.map((price, index) => ({
    day: `Day ${index + 1}`,
    price: price,
  }));

  const chartConfig = {
    price: {
      label: 'Price',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  const TrendIcon = () => {
    if (!result) return null;
    switch (result.trend.toLowerCase()) {
      case 'increasing': return <TrendingUp className="h-6 w-6 text-green-500" />;
      case 'decreasing': return <TrendingDown className="h-6 w-6 text-red-500" />;
      default: return <Minus className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><BarChart /> Price Prediction</CardTitle>
        <CardDescription>Forecast crop prices for the next 7 days to sell at the right time.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="crop">Crop</Label>
            <Select onValueChange={(value) => control.setValue('crop', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a crop" />
              </SelectTrigger>
              <SelectContent>
                {crops.map(crop => <SelectItem key={crop} value={crop}>{crop}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.crop && <p className="text-sm text-destructive">{errors.crop.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location (Mandi)</Label>
             <Select onValueChange={(value) => control.setValue('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>
          <Button type="submit" className="w-full font-bold" disabled={isLoading}>
            {isLoading ? 'Forecasting...' : 'Forecast Price'} <Search className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <div className="md:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg font-headline">7-Day Price Forecast</h3>
           {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
           {!isLoading && !result && !error && (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                    <LineChartIcon className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                    <p className="text-muted-foreground">Select a crop and location to see the price forecast.</p>
                </div>
            )}
            {isLoading && (
                 <div className="aspect-video w-full bg-muted rounded-lg animate-pulse" />
            )}
           {result && (
              <Card>
                <CardContent className="pt-6">
                  <ChartContainer config={chartConfig} className="aspect-video w-full">
                    <LineChart data={chartData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `${result.unit.split('/')[0]}${value}`}
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Line dataKey="price" type="monotone" stroke="var(--color-price)" strokeWidth={2} dot={true} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Next 7 Days</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendIcon />
                        <span className="font-semibold capitalize">{result.trend} Trend</span>
                    </div>
                    <div>
                        <span className="text-sm text-muted-foreground">Unit: {result.unit}</span>
                    </div>
                </CardFooter>
              </Card>
           )}
        </div>
      </CardContent>
    </Card>
  );
}