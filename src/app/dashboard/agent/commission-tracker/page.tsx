'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, Percent } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

type Commission = {
  id: string;
  crop: string;
  volume: number; // in quintals
  pricePerQuintal: number;
  commissionRate: number; // percentage
  totalCommission: number;
  status: 'Paid' | 'Pending';
  date: string;
};

const generateCommissionData = (): Commission[] => {
  const crops = ['Tomato', 'Onion', 'Wheat', 'Potato', 'Rice', 'Cotton'];
  const data: Commission[] = [];
  for (let i = 0; i < 20; i++) {
    const crop = crops[Math.floor(Math.random() * crops.length)];
    const volume = Math.floor(Math.random() * 100) + 10;
    const pricePerQuintal = Math.floor(Math.random() * 1000) + 2000;
    const commissionRate = Math.random() * (5 - 1.5) + 1.5; // 1.5% to 5%
    const totalValue = volume * pricePerQuintal;
    const totalCommission = totalValue * (commissionRate / 100);
    const date = new Date();
    date.setDate(date.getDate() - i);

    data.push({
      id: `deal-${i}`,
      crop,
      volume,
      pricePerQuintal,
      commissionRate,
      totalCommission,
      status: Math.random() > 0.4 ? 'Paid' : 'Pending',
      date: date.toLocaleDateString('en-IN'),
    });
  }
  return data;
};

export default function AgentCommissionTrackerPage() {
  const [commissionData] = React.useState<Commission[]>(
    generateCommissionData()
  );

  const totalEarned = commissionData
    .filter((d) => d.status === 'Paid')
    .reduce((sum, d) => sum + d.totalCommission, 0);
  const totalPending = commissionData
    .filter((d) => d.status === 'Pending')
    .reduce((sum, d) => sum + d.totalCommission, 0);

  const commissionByCrop = commissionData.reduce((acc, curr) => {
    if (!acc[curr.crop]) {
      acc[curr.crop] = { paid: 0, pending: 0 };
    }
    if (curr.status === 'Paid') {
      acc[curr.crop].paid += curr.totalCommission;
    } else {
      acc[curr.crop].pending += curr.totalCommission;
    }
    return acc;
  }, {} as Record<string, { paid: number; pending: number }>);

  const chartData = Object.entries(commissionByCrop).map(
    ([crop, amounts]) => ({
      crop,
      ...amounts,
    })
  );

  const chartConfig = {
    paid: { label: 'Paid', color: 'hsl(var(--chart-2))' },
    pending: { label: 'Pending', color: 'hsl(var(--chart-5))' },
  };

  return (
    <div className="space-y-6">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Agent Commission Tracker
        </h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Percent /> Commission Summary
          </CardTitle>
          <CardDescription>
            Track your profit margins, commissions, and payment statuses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Commission Earned
                </CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  ₹{totalEarned.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all paid deals
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Pending Payments
                </CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  ₹{totalPending.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting settlement
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Commission by Crop</CardTitle>
            <CardDescription>Visual breakdown of earnings per crop.</CardDescription>
        </CardHeader>
        <CardContent>
             <ChartContainer config={chartConfig} className="aspect-video w-full">
                <BarChart data={chartData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="crop" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis />
                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="paid" stackId="a" fill="var(--color-paid)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead className="text-right">Volume (qtl)</TableHead>
                <TableHead className="text-right">Rate (%)</TableHead>
                <TableHead className="text-right">Commission (₹)</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissionData.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell>{deal.date}</TableCell>
                  <TableCell className="font-medium">{deal.crop}</TableCell>
                  <TableCell className="text-right">{deal.volume}</TableCell>
                  <TableCell className="text-right">
                    {deal.commissionRate.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {deal.totalCommission.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        deal.status === 'Paid' ? 'default' : 'destructive'
                      }
                      className={
                        deal.status === 'Paid' ? 'bg-green-500/20 text-green-700' : 'bg-orange-500/20 text-orange-700'
                      }
                    >
                      {deal.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
