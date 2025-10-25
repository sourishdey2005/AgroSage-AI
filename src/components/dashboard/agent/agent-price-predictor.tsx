'use client';

import * as React from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BrainCircuit, Search, Zap } from 'lucide-react';
import { agentPricePrediction } from '@/ai/flows/agent-price-prediction';
import type { AgentPricePredictionOutput } from '@/ai/flows/agent-price-prediction';
import { Skeleton } from '@/components/ui/skeleton';

const crops = ['Tomato', 'Onion', 'Wheat', 'Potato', 'Rice', 'Sugarcane', 'Cotton', 'Soybean', 'Maize'];

const schema = z.object({
  crop: z.string().min(1, 'Please select a crop'),
});
type FormSchema = z.infer<typeof schema>;

export function AgentPricePredictor() {
  const [result, setResult] = React.useState<AgentPricePredictionOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const predictionResult = await agentPricePrediction(data);
      setResult(predictionResult);
    } catch (err) {
      setError('Failed to get price prediction. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BrainCircuit /> AI Price Predictor
        </CardTitle>
        <CardDescription>
          Predict future price spikes across major mandis to identify profitable opportunities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            <div className="w-full sm:w-auto flex-grow space-y-2">
                <Controller
                name="crop"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a crop to predict..." />
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
          <Button type="submit" className="w-full sm:w-auto font-bold" disabled={isLoading}>
            {isLoading ? 'Predicting...' : 'Predict Prices'} <Search className="ml-2 h-4 w-4" />
          </Button>
        </form>

        {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
        
        {isLoading && (
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        )}

        {result && (
          <div>
            <h4 className="font-semibold mb-2">7-Day Forecast (₹/Quintal)</h4>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mandi</TableHead>
                        {result.predictions[0]?.forecast.map(f => <TableHead key={f.day} className="text-center">{f.day}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {result.predictions.map(({ mandi, forecast }) => (
                        <TableRow key={mandi}>
                            <TableCell className="font-medium">{mandi}</TableCell>
                            {forecast.map(({ price, isSpike }, index) => (
                                <TableCell key={index} className="text-center font-mono">
                                    <div className="flex items-center justify-center gap-1">
                                        {price}
                                        {isSpike && <Zap className="h-4 w-4 text-yellow-500" title="Predicted Spike" />}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </div>
        )}

        {!isLoading && !result && !error && (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-48">
                <p className="text-muted-foreground">Select a crop to see the AI price forecast.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}