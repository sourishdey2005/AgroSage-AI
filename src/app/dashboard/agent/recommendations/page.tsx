'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BrainCircuit, RefreshCw, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getCropRecommendations, type CropRecommendationsOutput } from '@/ai/flows/crop-recommendations';
import { Progress } from '@/components/ui/progress';

export default function AIRecommendationsPage() {
  const [result, setResult] = React.useState<CropRecommendationsOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchRecommendations = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const recommendations = await getCropRecommendations();
      setResult(recommendations);
    } catch (err) {
      setError('Failed to get AI recommendations. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          AI Recommendation Engine
        </h1>
        <Button variant="ghost" size="icon" onClick={fetchRecommendations} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <BrainCircuit /> Top Crop Opportunities
          </CardTitle>
          <CardDescription>
            AI-driven suggestions for high-demand crops based on simulated market trends, seasonal demand, and export potential.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="grid md:grid-cols-3 gap-4">
              <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5 mt-2" /></CardContent><CardFooter><Skeleton className="h-8 w-full" /></CardFooter></Card>
              <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5 mt-2" /></CardContent><CardFooter><Skeleton className="h-8 w-full" /></CardFooter></Card>
              <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5 mt-2" /></CardContent><CardFooter><Skeleton className="h-8 w-full" /></CardFooter></Card>
            </div>
          )}

          {result && (
            <div className="grid md:grid-cols-3 gap-6">
              {result.recommendations.map((rec) => (
                <Card key={rec.crop} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{rec.crop}</CardTitle>
                    <CardDescription>{rec.reason}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2">
                     <div>
                        <p className="text-sm font-medium">Demand Score</p>
                        <div className="flex items-center gap-2">
                            <Progress value={rec.demandScore * 10} />
                            <span className="font-bold">{rec.demandScore}/10</span>
                        </div>
                     </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <TrendingUp className="mr-2 h-4 w-4" /> Analyze Trend
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
