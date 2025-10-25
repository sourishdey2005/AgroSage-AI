'use client';

import * as React from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  BarChart,
  Search,
  Calendar,
  MapPin,
  Package,
  IndianRupee,
  AreaChart,
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
import { predictYieldAndProfit } from '@/ai/flows/yield-forecasting';
import type { YieldForecastingOutput } from '@/ai/flows/yield-forecasting';

const schema = z.object({
  crop: z.string().min(1, 'Please select a crop'),
  area: z.coerce.number().min(0.1, 'Area must be greater than 0'),
  location: z.string().min(1, 'Please select a location'),
});

type FormSchema = z.infer<typeof schema>;

const crops = ['Tomato', 'Wheat', 'Rice', 'Onion', 'Potato'];
const locations = ['Pune', 'Lucknow', 'Nagpur', 'Bangalore', 'Delhi'];

export function YieldForecastCard() {
  const [result, setResult] = React.useState<YieldForecastingOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const forecastResult = await predictYieldAndProfit(data);
      setResult(forecastResult);
    } catch (err) {
      setError('Failed to get yield forecast. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BarChart /> Yield &amp; Profit Forecast
        </CardTitle>
        <CardDescription>
          Predict your crop yield and potential income to make better selling decisions.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="crop">Crop</Label>
            <Controller
              name="crop"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.crop && <p className="text-sm text-destructive">{errors.crop.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Area (in acres)</Label>
            <Input id="area" type="number" step="0.1" placeholder="e.g., 2.5" {...register('area')} />
            {errors.area && <p className="text-sm text-destructive">{errors.area.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>
          <Button type="submit" className="w-full font-bold" disabled={isLoading}>
            {isLoading ? 'Calculating...' : 'Forecast Yield'} <Search className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <div className="md:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg font-headline">Forecast Details</h3>
          {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          {!isLoading && !result && !error && (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
              <AreaChart className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">Fill out the form to see your yield and profit forecast.</p>
            </div>
          )}
          {isLoading && (
            <div className="space-y-4">
              <div className="h-24 w-full bg-muted rounded animate-pulse" />
              <div className="h-24 w-full bg-muted rounded animate-pulse" />
              <div className="h-24 w-full bg-muted rounded animate-pulse" />
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Expected Income</CardTitle>
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(result.totalIncome)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on a predicted price of ₹{result.predictedPrice}/kg
                  </p>
                </CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Yield</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{result.totalYield.toLocaleString('en-IN')} kg</div>
                    <p className="text-xs text-muted-foreground">{result.expectedYield} kg/acre</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Best Sell Date</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{result.bestSellDate}</div>
                    <p className="text-xs text-muted-foreground">AI Recommendation</p>
                  </CardContent>
                </Card>
              </div>
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Recommended Mandi</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{result.recommendedMandi}</div>
                    <p className="text-xs text-muted-foreground">For highest potential profit</p>
                  </CardContent>
                </Card>
            </div>
          )}
        </div>
      </CardContent>
      {result && 
        <CardFooter>
            <Button className="w-full md:w-auto ml-auto">Generate Digital Receipt</Button>
        </CardFooter>
      }
    </Card>
  );
}