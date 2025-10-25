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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Map, RefreshCw } from 'lucide-react';
import { getCropSuitability } from '@/ai/flows/crop-suitability';
import type { CropSuitabilityOutput } from '@/ai/flows/crop-suitability';
import { Skeleton } from '@/components/ui/skeleton';

export function RegionalCropSuitability() {
  const [result, setResult] = React.useState<CropSuitabilityOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchSuitability = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const suitabilityResult = await getCropSuitability();
      setResult(suitabilityResult);
    } catch (err) {
      setError('Failed to get crop suitability analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSuitability();
  }, [fetchSuitability]);

  const getBackgroundColor = (score: number) => {
    if (score > 80) return 'bg-green-500/20';
    if (score > 60) return 'bg-yellow-500/20';
    if (score > 40) return 'bg-orange-500/20';
    return 'bg-red-500/20';
  };
  
  const pivotData = (data: CropSuitabilityOutput['suitabilityMap'] | undefined) => {
    if (!data) return { districts: [], crops: [], grid: {} };

    const districts = [...new Set(data.map(item => item.district))];
    const crops = [...new Set(data.map(item => item.crop))];
    const grid: Record<string, Record<string, { score: number; remark: string }>> = {};

    districts.forEach(district => {
      grid[district] = {};
      crops.forEach(crop => {
        const entry = data.find(d => d.district === district && d.crop === crop);
        grid[district][crop] = entry ? { score: entry.suitabilityScore, remark: entry.remark } : { score: 0, remark: 'N/A' };
      });
    });

    return { districts, crops, grid };
  };

  const { districts, crops, grid } = pivotData(result?.suitabilityMap);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="space-y-1.5">
                <CardTitle className="font-headline flex items-center gap-2">
                <Map /> Regional Crop Suitability Map
                </CardTitle>
                <CardDescription>
                AI-powered heatmap of crop feasibility based on simulated soil, climate, and water data.
                </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={fetchSuitability} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
        
        {isLoading && (
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                 <Skeleton className="h-12 w-full" />
            </div>
        )}

        {result && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>District</TableHead>
                {crops.map(crop => <TableHead key={crop} className="text-center">{crop}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {districts.map(district => (
                <TableRow key={district}>
                  <TableCell className="font-medium">{district}</TableCell>
                  {crops.map(crop => (
                    <TableCell key={crop} className={`text-center ${getBackgroundColor(grid[district][crop]?.score)}`}>
                        <div className="font-bold text-lg">{grid[district][crop]?.score}</div>
                        <div className="text-xs text-muted-foreground">{grid[district][crop]?.remark}</div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}