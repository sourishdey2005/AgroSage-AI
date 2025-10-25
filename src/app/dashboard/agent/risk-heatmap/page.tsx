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
import { RefreshCw, ShieldAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getRiskHeatmap, type RiskHeatmapOutput } from '@/ai/flows/risk-heatmap';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RiskHeatmapPage() {
  const [result, setResult] = React.useState<RiskHeatmapOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchRiskData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const riskResult = await getRiskHeatmap();
      setResult(riskResult);
    } catch (err) {
      setError('Failed to get risk analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRiskData();
  }, [fetchRiskData]);

  const getRiskColor = (score: number) => {
    if (score > 8) return 'bg-red-500/30 text-red-900 dark:text-red-200';
    if (score > 6) return 'bg-orange-500/30 text-orange-900 dark:text-orange-200';
    if (score > 4) return 'bg-yellow-500/30 text-yellow-900 dark:text-yellow-200';
    return 'bg-green-500/30 text-green-900 dark:text-green-200';
  };
  
  return (
     <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">
                Agricultural Risk Heatmap
            </h1>
            <Button variant="ghost" size="icon" onClick={fetchRiskData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
        </div>
        <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <ShieldAlert /> Crop Risk Analysis
            </CardTitle>
            <CardDescription>
                AI-generated assessment of disease, supply chain, and market volatility risks for major crops. Scores are from 1 (low risk) to 10 (high risk).
            </CardDescription>
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
            <TooltipProvider>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Crop</TableHead>
                        <TableHead className="text-center">Disease Risk</TableHead>
                        <TableHead className="text-center">Supply Chain Risk</TableHead>
                        <TableHead className="text-center">Market Volatility</TableHead>
                        <TableHead className="text-center font-bold">Overall Risk</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {result.riskData
                        .sort((a, b) => b.overallRisk - a.overallRisk)
                        .map((item) => (
                        <TableRow key={item.crop}>
                        <TableCell className="font-medium">{item.crop}</TableCell>
                        <TableCell className={`text-center font-mono text-lg font-semibold ${getRiskColor(item.diseaseRisk)}`}>
                            {item.diseaseRisk}
                        </TableCell>
                        <TableCell className={`text-center font-mono text-lg font-semibold ${getRiskColor(item.supplyChainRisk)}`}>
                            {item.supplyChainRisk}
                        </TableCell>
                        <TableCell className={`text-center font-mono text-lg font-semibold ${getRiskColor(item.marketVolatility)}`}>
                            {item.marketVolatility}
                        </TableCell>
                        <TableCell className={`text-center font-mono text-xl font-extrabold ${getRiskColor(item.overallRisk)}`}>
                            <Tooltip>
                                <TooltipTrigger>{item.overallRisk}</TooltipTrigger>
                                <TooltipContent>
                                    <p>Weighted average of all risk factors.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TooltipProvider>
            )}
        </CardContent>
        </Card>
    </div>
  );
}
